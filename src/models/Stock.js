import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
  {
    name: {
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
      enum: ['robot', 'component', 'tool', 'accessory'],
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    minQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalValue: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    supplier: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
      default: 'in_stock',
    },
    condition: {
      type: String,
      required: true,
      enum: ['new', 'good', 'fair', 'needs_repair', 'damaged'],
      default: 'new',
    },
    image: {
      type: String,
      default: '',
    },
    serialNumbers: [{
      type: String,
      trim: true,
    }],
    purchaseDate: {
      type: Date,
      required: true,
    },
    warrantyExpiry: {
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

// Calculate total value before saving
StockSchema.pre('save', function(next) {
  this.totalValue = this.quantity * this.unitPrice;
  next();
});

// Update total value when quantity or unit price changes
StockSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.quantity || update.unitPrice) {
    // This will be handled in the API route
  }
  next();
});

export default mongoose.models.Stock || mongoose.model("Stock", StockSchema);