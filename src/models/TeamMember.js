import mongoose from "mongoose";

const TeamMember = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    activity: {
      type: Boolean,
      default: false,
    },
    Role: {
      type: String,
      required: true,
      enum: ["HOD", "Coordinator", "Assistant Coordinator"],
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfLeaving: {
      type: Number,
      min: 2000,
      max: 2030,
    },
    isMember: {
      type: Boolean,
      required: true,
      default: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    // Legacy fields for backward compatibility
    role: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    skills: [{
      type: String,
      trim: true,
    }],
    achievements: [{
      type: String,
      trim: true,
    }],
    social: {
      email: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "#",
      },
      github: {
        type: String,
        default: "#",
      },
      instagram: {
        type: String,
        default: "#",
      },
    },
    isAlumni: {
      type: Boolean,
      default: false,
    },
    batch: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
TeamMember.index({ Role: 1 });
TeamMember.index({ department: 1 });
TeamMember.index({ year: 1 });
TeamMember.index({ isMember: 1 });

export default mongoose.models.TeamMember ||
  mongoose.model("TeamMember", TeamMember);
