import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'image', 'video', 'other'],
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploadDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lastModified: {
      type: Date,
      required: true,
      default: Date.now,
    },
    downloadCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    visibility: {
      type: String,
      required: true,
      enum: ['public', 'private', 'team_only', 'admin_only'],
      default: 'public',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    url: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      required: true,
      default: false,
    },
    version: {
      type: String,
      required: true,
      default: '1.0',
    },
    accessPermissions: [{
      type: String,
      enum: ['read', 'download', 'edit', 'delete'],
    }],
    expiryDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
DocumentSchema.index({ title: 'text', description: 'text', tags: 'text' });
DocumentSchema.index({ category: 1, type: 1 });
DocumentSchema.index({ visibility: 1 });
DocumentSchema.index({ isArchived: 1 });

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);