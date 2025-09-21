import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/db";

// GET /api/blogs/tags - Get all unique tags
export async function GET() {
  try {
    console.log('📝 Blogs API: GET tags request received');

    await dbConnect();

    const tags = await Blog.distinct("tags", { visibility: true });

    // Flatten the array of arrays and remove duplicates
    const uniqueTags = [...new Set(tags.flat())];

    console.log('✅ Tags fetched successfully:', uniqueTags.length);
    return NextResponse.json({ tags: uniqueTags });
  } catch (error) {
    console.error("❌ Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}