import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/db";

// GET /api/blogs/[id]/comments - Get comments for a blog
export async function GET(request, { params }) {
  try {
    console.log('📝 Blogs API: GET comments request received');

    await dbConnect();

    const blog = await Blog.findById(params.id).select('comments title');

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    console.log('✅ Comments fetched successfully for:', blog.title);
    return NextResponse.json({
      blogTitle: blog.title,
      comments: blog.comments || []
    });
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/blogs/[id]/comments - Add a comment to a blog
export async function POST(request, { params }) {
  try {
    console.log('📝 Blogs API: POST comment request received');

    await dbConnect();

    const { user, comment } = await request.json();

    if (!user || !comment) {
      return NextResponse.json(
        { error: "User and comment are required" },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    const newComment = {
      user: user.trim(),
      comment: comment.trim(),
      createdAt: new Date()
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      { $push: { comments: newComment } },
      { new: true }
    );

    console.log('✅ Comment added successfully to:', blog.title);
    return NextResponse.json({
      message: "Comment added successfully",
      comment: newComment
    }, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id]/comments/[commentId] - Delete a specific comment
// Note: This would need to be implemented in a separate route file for [commentId]
// For now, we'll implement a basic delete by index
export async function DELETE(request, { params }) {
  try {
    console.log('📝 Blogs API: DELETE comment request received');

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const commentIndex = parseInt(searchParams.get("index"));

    if (isNaN(commentIndex) || commentIndex < 0) {
      return NextResponse.json(
        { error: "Valid comment index is required" },
        { status: 400 }
      );
    }

    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    if (!blog.comments || blog.comments.length <= commentIndex) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Remove comment at specific index
    blog.comments.splice(commentIndex, 1);
    await blog.save();

    console.log('✅ Comment deleted successfully from:', blog.title);
    return NextResponse.json({
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}