// models/Blog.js

import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    summary: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    authorImage: {
      type: String,
      default: "",
    },
    published: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
      default: "",
    },
    tags: [{
      type: String,
      trim: true,
    }],
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    readTime: {
      type: Number, // in minutes
      default: 5,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [{
      user: String,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create indexes for better performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ published: -1 });
BlogSchema.index({ visibility: 1, published: -1 });

export default mongoose.models.Blog ||
  mongoose.model("Blog", BlogSchema);