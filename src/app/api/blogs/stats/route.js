import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/db";

// GET /api/blogs/stats - Get blog statistics
export async function GET() {
  try {
    console.log('📝 Blogs API: GET stats request received');

    await dbConnect();

    // Get total counts
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ visibility: true });
    const draftBlogs = await Blog.countDocuments({ visibility: false });
    const featuredBlogs = await Blog.countDocuments({ featured: true, visibility: true });

    // Get category distribution
    const categoryStats = await Blog.aggregate([
      { $match: { visibility: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get author statistics
    const authorStats = await Blog.aggregate([
      { $match: { visibility: true } },
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get total views and likes
    const engagementStats = await Blog.aggregate([
      { $match: { visibility: true } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
          averageReadTime: { $avg: "$readTime" }
        }
      }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentBlogs = await Blog.countDocuments({
      visibility: true,
      published: { $gte: thirtyDaysAgo }
    });

    const stats = {
      overview: {
        total: totalBlogs,
        published: publishedBlogs,
        drafts: draftBlogs,
        featured: featuredBlogs,
        recent: recentBlogs
      },
      categories: categoryStats,
      topAuthors: authorStats,
      engagement: engagementStats[0] || {
        totalViews: 0,
        totalLikes: 0,
        averageReadTime: 0
      }
    };

    console.log('✅ Blog stats fetched successfully');
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("❌ Error fetching blog stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog statistics" },
      { status: 500 }
    );
  }
}