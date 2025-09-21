import { NextResponse } from "next/server";
import Event from "@/models/Event";
import dbConnect from "@/lib/db";

export async function GET(request) {
  console.log('📅 Events API: GET request received');
  console.log('🔗 Request URL:', request.url);
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    console.log('📋 Query parameters:', { id, limit, page, status, category, featured, search });

    console.log('🔌 Attempting database connection...');
    await dbConnect();
    console.log('✅ Database connected successfully');

    // If ID is provided, fetch specific event
    if (id) {
      console.log('🔍 Fetching event by ID:', id);
      
      const event = await Event.findById(id);

      if (!event) {
        console.log('❌ Event not found with ID:', id);
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 }
        );
      }

      console.log('✅ Event found by ID:', {
        id: event._id,
        title: event.title,
        status: event.status
      });

      return NextResponse.json(
        {
          message: "Event retrieved successfully",
          event,
        },
        { status: 200 }
      );
    }

    // Build query filters
    const filters = {};
    console.log('🔍 Building database filters...');
    
    if (status && status !== 'All') {
      filters.status = status;
      console.log('📊 Added status filter:', status);
    }
    if (category && category !== 'All') {
      filters.category = category;
      console.log('🏷️ Added category filter:', category);
    }
    if (featured !== null) {
      filters.featured = featured === 'true';
      console.log('⭐ Added featured filter:', featured === 'true');
    }
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
      console.log('🔍 Added search filter:', search);
    }

    console.log('📊 Final filters object:', filters);

    // Get total count for pagination
    const total = await Event.countDocuments(filters);
    console.log('� Total events count:', total);

    // Build query with sorting
    let query = Event.find(filters).sort({ startDate: 1, createdAt: -1 });

    // Apply pagination
    if (limit) {
      const limitNum = parseInt(limit);
      const pageNum = parseInt(page) || 1;
      const skip = (pageNum - 1) * limitNum;

      query = query.skip(skip).limit(limitNum);
      console.log('📄 Pagination applied:', { page: pageNum, limit: limitNum, skip });
    }

    // Execute query
    console.log('🚀 Executing database query...');
    const events = await query;

    console.log('✅ Events fetched successfully:', {
      count: events.length,
      filters: filters,
      total: total
    });

    // Calculate stats
    const stats = {
      totalEvents: total,
      upcomingEvents: await Event.countDocuments({ status: 'Upcoming' }),
      activeEvents: await Event.countDocuments({ status: 'Active' }),
      completedEvents: await Event.countDocuments({ status: 'Completed' }),
      totalRegistrations: await Event.aggregate([
        { $group: { _id: null, total: { $sum: '$registered' } } }
      ]).then(result => result[0]?.total || 0),
      featuredEvents: await Event.countDocuments({ featured: true })
    };

    return NextResponse.json(
      {
        message: "Events retrieved successfully",
        events,
        stats,
        total,
        ...(limit && {
          pagination: {
            page: parseInt(page) || 1,
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit)),
          },
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching events:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    if (error.name === "CastError") {
      console.log('🔄 CastError detected, returning 400');
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }

    console.log('💥 Internal server error, returning 500');
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
