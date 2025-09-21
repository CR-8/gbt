import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/db";

// GET /api/blogs/[id] - Get specific blog
export async function GET(request, { params }) {
  try {
    console.log('📝 Blogs API: GET specific blog request received');

    await dbConnect();

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await Blog.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    console.log('✅ Blog found and view incremented:', blog.title);
    return NextResponse.json({ blog });
  } catch (error) {
    console.error("❌ Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update specific blog
export async function PUT(request, { params }) {
  try {
    console.log('📝 Blogs API: PUT specific blog request received');

    await dbConnect();
    const blogData = await request.json();

    // If slug is being updated, check for uniqueness
    if (blogData.slug) {
      const existingBlog = await Blog.findOne({
        slug: blogData.slug,
        _id: { $ne: params.id }
      });
      if (existingBlog) {
        return NextResponse.json(
          { error: "Blog with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      {
        ...blogData,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    console.log('✅ Blog updated successfully:', updatedBlog.title);
    return NextResponse.json({ blog: updatedBlog });
  } catch (error) {
    console.error("❌ Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete specific blog
export async function DELETE(request, { params }) {
  try {
    console.log('📝 Blogs API: DELETE specific blog request received');

    await dbConnect();

    const deletedBlog = await Blog.findByIdAndDelete(params.id);

    if (!deletedBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    console.log('✅ Blog deleted successfully:', deletedBlog.title);
    return NextResponse.json({
      message: "Blog deleted successfully",
      deletedBlog
    });
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}