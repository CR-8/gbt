import { NextResponse } from "next/server";
import Stock from "@/models/Stock";
import dbConnect from "@/lib/db";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const stockItem = await Stock.findById(id);

    if (!stockItem) {
      return NextResponse.json(
        { error: "Stock item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Stock item retrieved successfully",
      stock: stockItem
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching stock item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const updateData = await request.json();

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
    console.error("Error updating stock item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

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
    console.error("Error deleting stock item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}