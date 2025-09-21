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

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const document = await Document.findById(id)
      .populate('uploadedBy', 'name email')
      .populate('lastUpdatedBy', 'name email');

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Increment download count
    await Document.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

    return NextResponse.json({
      message: "Document retrieved successfully",
      document
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const updateData = await request.json();

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

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

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