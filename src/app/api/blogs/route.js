import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/db";
import { uploads } from "@/lib/cloudinary";

// Helper function to convert File to base64 for Cloudinary
async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  return `data:${file.type};base64,${base64}`;
}

// GET /api/blogs - Fetch all blogs
export async function GET(request) {
  try {
    console.log('📝 Blogs API: GET request received');

    await dbConnect();
    console.log('✅ Database connected successfully');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    // If ID is provided, fetch specific blog
    if (id) {
      console.log('🔍 Fetching blog by ID:', id);
      const blog = await Blog.findById(id);

      if (!blog) {
        console.log('❌ Blog not found with ID:', id);
        return NextResponse.json(
          { error: "Blog not found" },
          { status: 404 }
        );
      }

      console.log('✅ Blog found:', blog.title);
      return NextResponse.json({ blog });
    }

    // If slug is provided, fetch specific blog
    if (slug) {
      console.log('🔍 Fetching blog by slug:', slug);
      const blog = await Blog.findOne({ slug, visibility: true });

      if (!blog) {
        console.log('❌ Blog not found with slug:', slug);
        return NextResponse.json(
          { error: "Blog not found" },
          { status: 404 }
        );
      }

      console.log('✅ Blog found:', blog.title);
      return NextResponse.json({ blog });
    }

    // Build query
    let query = { visibility: true };

    if (category) {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Fetch blogs with pagination
    console.log('📊 Fetching blogs with filters:', query);
    const skip = (page - 1) * limit;

    let blogsQuery = Blog.find(query).sort({ published: -1 });

    // Only apply pagination if limit is explicitly set
    if (limit && limit > 0) {
      const total = await Blog.countDocuments(query);
      if (limit < total) {
        blogsQuery = blogsQuery.skip(skip).limit(limit);
      }
    }

    const blogs = await blogsQuery;
    const total = await Blog.countDocuments(query);

    console.log('✅ Blogs fetched successfully:', {
      count: blogs.length,
      total,
      page,
      limit
    });

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request) {
  try {
    console.log('📝 Blogs API: POST request received');

    await dbConnect();

    let blogData;
    let imageUrl = '';

    // Check if the request is FormData (from admin panel) or JSON
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData from admin panel
      const formData = await request.formData();

      blogData = {
        title: formData.get('title')?.toString(),
        slug: formData.get('slug')?.toString(),
        summary: formData.get('summary')?.toString(),
        content: formData.get('content')?.toString(),
        author: formData.get('author')?.toString(),
        authorImage: formData.get('authorImage')?.toString() || '',
        category: formData.get('category')?.toString(),
        tags: JSON.parse(formData.get('tags')?.toString() || '[]'),
        visibility: formData.get('visibility') === 'true',
        featured: formData.get('featured') === 'true',
      };

      // Handle image upload if provided
      const imageFile = formData.get('image');
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(imageFile.type)) {
          return NextResponse.json(
            {
              error: `Unsupported file format: ${imageFile.type}. Upload only JPEG/JPG or PNG`,
            },
            { status: 400 }
          );
        }

        // Validate file size (5MB)
        if (imageFile.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: `Image file is too large. Maximum 5MB allowed` },
            { status: 400 }
          );
        }

        try {
          // Convert file to base64
          const base64Image = await fileToBase64(imageFile);

          // Upload to Cloudinary
          const cloudinaryResult = await uploads(base64Image, "/blogs");
          imageUrl = cloudinaryResult.url;
        } catch (uploadError) {
          console.error("Error uploading image to Cloudinary:", uploadError);
          return NextResponse.json(
            { error: `Error uploading image: ${uploadError.message}` },
            { status: 500 }
          );
        }
      }
    } else {
      // Handle JSON from other sources
      blogData = await request.json();
    }

    // Validate required fields
    const { title, slug, summary, content, author } = blogData;
    if (!title || !slug || !summary || !content || !author) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, summary, content, author" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: blogData.slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: "Blog with this slug already exists" },
        { status: 409 }
      );
    }

    const newBlog = new Blog({
      ...blogData,
      image: imageUrl,
      published: blogData.visibility ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedBlog = await newBlog.save();
    console.log('✅ Blog created successfully:', savedBlog.title);

    return NextResponse.json({ blog: savedBlog }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs - Update a blog (requires ID in query params)
export async function PUT(request) {
  try {
    console.log('📝 Blogs API: PUT request received');

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const blogData = await request.json();

    // If slug is being updated, check for uniqueness
    if (blogData.slug) {
      const existingBlog = await Blog.findOne({
        slug: blogData.slug,
        _id: { $ne: id }
      });
      if (existingBlog) {
        return NextResponse.json(
          { error: "Blog with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
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

// DELETE /api/blogs - Delete all blogs (use with caution)
export async function DELETE(request) {
  try {
    console.log('📝 Blogs API: DELETE request received');

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Delete specific blog
      const deletedBlog = await Blog.findByIdAndDelete(id);
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
    } else {
      // Delete all blogs (dangerous operation)
      const result = await Blog.deleteMany({});
      console.log('✅ All blogs deleted successfully:', result.deletedCount);
      return NextResponse.json({
        message: `Deleted ${result.deletedCount} blogs`,
        deletedCount: result.deletedCount,
      });
    }
  } catch (error) {
    console.error("❌ Error deleting blogs:", error);
    return NextResponse.json(
      { error: "Failed to delete blogs" },
      { status: 500 }
    );
  }
}