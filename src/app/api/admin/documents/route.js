import { NextResponse } from "next/server";
import Document from "@/models/Document";
import dbConnect from "@/lib/db";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const visibility = searchParams.get("visibility");
    const search = searchParams.get("search");
    const isArchived = searchParams.get("isArchived");

    // Build query filters
    const filters = { isActive: true };

    if (category) filters.category = category;
    if (type) filters.type = type;
    if (visibility) filters.visibility = visibility;
    if (isArchived !== null) filters.isArchived = isArchived === 'true';

    if (search) {
      filters.$text = { $search: search };
    }

    const documents = await Document.find(filters)
      .populate('uploadedBy', 'name email')
      .sort({ uploadDate: -1 });

    // Calculate stats
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
    const publicDocuments = documents.filter(doc => doc.visibility === 'public').length;
    const privateDocuments = documents.filter(doc => doc.visibility === 'private').length;
    const archivedDocuments = documents.filter(doc => doc.isArchived).length;
    const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloadCount, 0);

    // Documents from this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const documentsThisMonth = documents.filter(doc =>
      new Date(doc.uploadDate) >= thisMonth
    ).length;

    return NextResponse.json({
      message: "Documents retrieved successfully",
      documents,
      stats: {
        totalDocuments,
        totalSize,
        publicDocuments,
        privateDocuments,
        archivedDocuments,
        totalDownloads,
        documentsThisMonth
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Validate update data
    const allowedFields = [
      'title', 'description', 'category', 'visibility', 'tags',
      'accessPermissions', 'notes', 'isArchived', 'lastUpdatedBy'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    filteredData.lastUpdated = new Date();

    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      filteredData,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email')
      .populate('lastUpdatedBy', 'name email');

    if (!updatedDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Document updated successfully",
      document: updatedDocument
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get document to delete Cloudinary file
    const document = await Document.findById(id);
    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete from Cloudinary if exists
    if (document.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(document.cloudinaryId);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await Document.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Document deleted successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}