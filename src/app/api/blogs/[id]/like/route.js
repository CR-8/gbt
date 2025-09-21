import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/db";

// POST /api/blogs/[id]/like - Like a blog
export async function POST(request, { params }) {
  try {
    console.log('📝 Blogs API: POST like request received');

    await dbConnect();

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Increment likes
    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    console.log('✅ Blog liked successfully:', updatedBlog.title);
    return NextResponse.json({
      message: "Blog liked successfully",
      likes: updatedBlog.likes
    });
  } catch (error) {
    console.error("❌ Error liking blog:", error);
    return NextResponse.json(
      { error: "Failed to like blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id]/like - Unlike a blog
export async function DELETE(request, { params }) {
  try {
    console.log('📝 Blogs API: DELETE like request received');

    await dbConnect();

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    // Decrement likes (ensure it doesn't go below 0)
    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      { $inc: { likes: -1 }, $min: { likes: 0 } },
      { new: true }
    );

    console.log('✅ Blog unliked successfully:', updatedBlog.title);
    return NextResponse.json({
      message: "Blog unliked successfully",
      likes: updatedBlog.likes
    });
  } catch (error) {
    console.error("❌ Error unliking blog:", error);
    return NextResponse.json(
      { error: "Failed to unlike blog" },
      { status: 500 }
    );
  }
}