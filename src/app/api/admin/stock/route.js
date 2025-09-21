import { NextResponse } from "next/server";
import Stock from "@/models/Stock";
import dbConnect from "@/lib/db";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const condition = searchParams.get("condition");
    const search = searchParams.get("search");

    // Build query filters
    const filters = { isActive: true };

    if (category) filters.category = category;
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (condition) filters.condition = condition;

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const stockItems = await Stock.find(filters).sort({ createdAt: -1 });

    // Calculate stats
    const totalItems = stockItems.length;
    const totalValue = stockItems.reduce((sum, item) => sum + item.totalValue, 0);
    const robotsCount = stockItems.filter(item => item.type === 'robot').length;
    const componentsCount = stockItems.filter(item => item.type === 'component').length;
    const lowStockItems = stockItems.filter(item => item.status === 'low_stock').length;
    const outOfStockItems = stockItems.filter(item => item.status === 'out_of_stock').length;
    const needsRepairItems = stockItems.filter(item => item.condition === 'needs_repair').length;

    return NextResponse.json({
      message: "Stock items retrieved successfully",
      stock: stockItems,
      stats: {
        totalItems,
        totalValue,
        robotsCount,
        componentsCount,
        lowStockItems,
        outOfStockItems,
        needsRepairItems
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching stock items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Stock ID is required" },
        { status: 400 }
      );
    }

    // Validate update data
    const allowedFields = [
      'name', 'category', 'type', 'brand', 'model', 'description',
      'quantity', 'minQuantity', 'unitPrice', 'totalValue', 'location',
      'supplier', 'status', 'condition', 'image', 'serialNumbers',
      'purchaseDate', 'warrantyExpiry', 'notes', 'lastUpdatedBy', 'isActive'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    // Recalculate total value if quantity or unitPrice is updated
    if (filteredData.quantity !== undefined || filteredData.unitPrice !== undefined) {
      const item = await Stock.findById(id);
      if (item) {
        const quantity = filteredData.quantity !== undefined ? filteredData.quantity : item.quantity;
        const unitPrice = filteredData.unitPrice !== undefined ? filteredData.unitPrice : item.unitPrice;
        filteredData.totalValue = quantity * unitPrice;
      }
    }

    filteredData.lastUpdated = new Date();

    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      filteredData,
      { new: true, runValidators: true }
    ).populate('lastUpdatedBy', 'name email');

    if (!updatedStock) {
      return NextResponse.json(
        { error: "Stock item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Stock item updated successfully",
      stock: updatedStock
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Stock ID is required" },
        { status: 400 }
      );
    }

    const deletedStock = await Stock.findByIdAndDelete(id);

    if (!deletedStock) {
      return NextResponse.json(
        { error: "Stock item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Stock item deleted successfully",
      stock: deletedStock
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting stock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}