// scripts/seedBlogs.js

import Blog from "../models/Blog.js";
import dbConnect from "../lib/db.js";

const sampleBlogs = [
  {
    title: "Getting Started with Next.js 14",
    slug: "getting-started-nextjs-14",
    summary: "Learn how to build modern web applications with Next.js 14 and its latest features.",
    content: `
      <h2>Introduction</h2>
      <p>Next.js 14 brings exciting new features that make building React applications even better.</p>

      <h2>Key Features</h2>
      <ul>
        <li>App Router</li>
        <li>Server Components</li>
        <li>Turbopack</li>
        <li>Improved Performance</li>
      </ul>

      <h2>Getting Started</h2>
      <p>Install Next.js with the following command:</p>
      <pre><code>npx create-next-app@latest my-app</code></pre>

      <h2>Conclusion</h2>
      <p>Next.js 14 is a powerful framework for building modern web applications.</p>
    `,
    author: "John Doe",
    authorImage: "https://example.com/avatar1.jpg",
    published: new Date("2024-01-15"),
    image: "https://example.com/blog1.jpg",
    tags: ["Next.js", "React", "JavaScript", "Web Development"],
    category: "Technology",
    visibility: true,
    featured: true,
    readTime: 8,
    views: 1250,
    likes: 45,
  },
  {
    title: "Mastering TypeScript in 2024",
    slug: "mastering-typescript-2024",
    summary: "A comprehensive guide to TypeScript features and best practices for modern development.",
    content: `
      <h2>Why TypeScript?</h2>
      <p>TypeScript adds static typing to JavaScript, making your code more reliable and maintainable.</p>

      <h2>Advanced Features</h2>
      <ul>
        <li>Generics</li>
        <li>Decorators</li>
        <li>Conditional Types</li>
        <li>Mapped Types</li>
      </ul>

      <h2>Best Practices</h2>
      <p>Follow these best practices to write better TypeScript code.</p>
    `,
    author: "Jane Smith",
    authorImage: "https://example.com/avatar2.jpg",
    published: new Date("2024-02-01"),
    image: "https://example.com/blog2.jpg",
    tags: ["TypeScript", "JavaScript", "Programming", "Development"],
    category: "Programming",
    visibility: true,
    featured: false,
    readTime: 12,
    views: 890,
    likes: 32,
  },
  {
    title: "Building Scalable APIs with Node.js",
    slug: "building-scalable-apis-nodejs",
    summary: "Learn how to design and implement scalable REST APIs using Node.js and Express.",
    content: `
      <h2>API Design Principles</h2>
      <p>Good API design is crucial for scalability and maintainability.</p>

      <h2>Tools and Technologies</h2>
      <ul>
        <li>Express.js</li>
        <li>MongoDB</li>
        <li>JWT Authentication</li>
        <li>Rate Limiting</li>
      </ul>

      <h2>Performance Optimization</h2>
      <p>Implement caching, database optimization, and monitoring for better performance.</p>
    `,
    author: "Mike Johnson",
    authorImage: "https://example.com/avatar3.jpg",
    published: new Date("2024-02-15"),
    image: "https://example.com/blog3.jpg",
    tags: ["Node.js", "API", "Backend", "Express"],
    category: "Backend",
    visibility: true,
    featured: true,
    readTime: 15,
    views: 2100,
    likes: 78,
  },
  {
    title: "CSS Grid vs Flexbox: When to Use What",
    slug: "css-grid-vs-flexbox",
    summary: "Understanding the differences between CSS Grid and Flexbox and when to use each.",
    content: `
      <h2>CSS Grid</h2>
      <p>CSS Grid is a two-dimensional layout system for the web.</p>

      <h2>Flexbox</h2>
      <p>Flexbox is a one-dimensional layout system designed for arranging items in a container.</p>

      <h2>When to Use Grid</h2>
      <p>Use Grid for complex two-dimensional layouts.</p>

      <h2>When to Use Flexbox</h2>
      <p>Use Flexbox for simpler one-dimensional layouts.</p>
    `,
    author: "Sarah Wilson",
    authorImage: "https://example.com/avatar4.jpg",
    published: new Date("2024-03-01"),
    image: "https://example.com/blog4.jpg",
    tags: ["CSS", "Web Design", "Frontend", "Layout"],
    category: "Design",
    visibility: true,
    featured: false,
    readTime: 6,
    views: 650,
    likes: 23,
  },
  {
    title: "Introduction to Machine Learning with Python",
    slug: "introduction-machine-learning-python",
    summary: "A beginner's guide to machine learning concepts and implementation in Python.",
    content: `
      <h2>What is Machine Learning?</h2>
      <p>Machine Learning is a subset of AI that enables computers to learn without being explicitly programmed.</p>

      <h2>Popular Libraries</h2>
      <ul>
        <li>Scikit-learn</li>
        <li>TensorFlow</li>
        <li>PyTorch</li>
        <li>Pandas</li>
      </ul>

      <h2>Getting Started</h2>
      <p>Start with simple algorithms like linear regression and decision trees.</p>
    `,
    author: "David Brown",
    authorImage: "https://example.com/avatar5.jpg",
    published: new Date("2024-03-15"),
    image: "https://example.com/blog5.jpg",
    tags: ["Machine Learning", "Python", "AI", "Data Science"],
    category: "AI/ML",
    visibility: true,
    featured: true,
    readTime: 20,
    views: 3200,
    likes: 156,
  }
];

async function seedBlogs() {
  try {
    console.log("🌱 Seeding blogs...");

    await dbConnect();
    console.log("✅ Database connected");

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log("🗑️ Cleared existing blogs");

    // Insert sample blogs
    const blogs = await Blog.insertMany(sampleBlogs);
    console.log(`✅ Successfully seeded ${blogs.length} blogs`);

    // Log the created blogs
    blogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title} (${blog.slug})`);
    });

    console.log("🎉 Blog seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding blogs:", error);
    process.exit(1);
  }
}

// Run the seed function
seedBlogs();