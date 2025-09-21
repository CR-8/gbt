import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    registered: {
      type: Number,
      default: 0,
      min: 0,
    },
    poster: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['Workshop', 'Competition', 'Seminar', 'Hackathon', 'Other'],
      default: 'Other',
    },
    registrationDeadline: {
      type: Date,
    },
    registrationFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    prerequisites: {
      type: String,
    },
    agenda: [{
      time: String,
      topic: String,
      description: String,
      speaker: String,
    }],
    organizers: [{
      name: String,
      role: String,
      contact: String,
    }],
    sponsors: [{
      name: String,
      logo: String,
      website: String,
    }],
    tags: {
      type: [String],
      default: [],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
EventSchema.index({ startDate: 1, status: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ featured: 1 });

export default mongoose.models.Event ||
  mongoose.model("Event", EventSchema);