import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/db";

// GET /api/blogs/categories - Get all unique categories
export async function GET() {
  try {
    console.log('📝 Blogs API: GET categories request received');

    await dbConnect();

    const categories = await Blog.distinct("category", { visibility: true });

    console.log('✅ Categories fetched successfully:', categories.length);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}