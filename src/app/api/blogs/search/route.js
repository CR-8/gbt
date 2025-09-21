import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/db";

// GET /api/blogs/search - Advanced search for blogs
export async function GET(request) {
  try {
    console.log('📝 Blogs API: GET search request received');

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const author = searchParams.get("author");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query && !category && !tag && !author) {
      return NextResponse.json(
        { error: "At least one search parameter is required (q, category, tag, or author)" },
        { status: 400 }
      );
    }

    // Build search query
    let searchQuery = { visibility: true };

    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { summary: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    if (category) {
      searchQuery.category = { $regex: category, $options: 'i' };
    }

    if (tag) {
      searchQuery.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (author) {
      searchQuery.author = { $regex: author, $options: 'i' };
    }

    console.log('🔍 Search query:', searchQuery);

    // Execute search with pagination
    const skip = (page - 1) * limit;
    const blogs = await Blog.find(searchQuery)
      .sort({ published: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(searchQuery);

    console.log('✅ Search completed successfully:', {
      query,
      results: blogs.length,
      total
    });

    return NextResponse.json({
      blogs,
      search: {
        query,
        category,
        tag,
        author
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error searching blogs:", error);
    return NextResponse.json(
      { error: "Failed to search blogs" },
      { status: 500 }
    );
  }
}