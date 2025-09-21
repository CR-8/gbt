import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/achievements/[id] - Get specific achievement
export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    // Convert string ID to ObjectId
    let objectId;
    try {
      const { ObjectId } = await import('mongodb');
      objectId = new ObjectId(params.id);
    }catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch achievement", details: error.message },
      { status: 400 }
    );
    }
    const achievement = await db.collection("achievements").findOne({ _id: objectId });

    if (!achievement) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ achievement });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch achievement", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/achievements/[id] - Update achievement
export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const achievementData = await request.json();
    // Convert string ID to ObjectId
    let objectId;
    try {
      const { ObjectId } = await import('mongodb');
      objectId = new ObjectId(params.id);
    } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch achievement", details: error.message },
      { status: 400 }
    );
    }
    const result = await db
      .collection("achievements")
      .updateOne(
        { _id: objectId },
        {
          $set: {
            ...achievementData,
            updatedAt: new Date()
          }
        }
      );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }
    const updatedAchievement = await db
      .collection("achievements")
      .findOne({ _id: objectId });
    return NextResponse.json({ achievement: updatedAchievement });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update achievement", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/achievements/[id] - Delete achievement
export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    // Convert string ID to ObjectId
    let objectId;
    try {
      const { ObjectId } = await import('mongodb');
      objectId = new ObjectId(params.id);
    }catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch achievement", details: error.message },
      { status: 400 }
    );
    }
    const result = await db.collection("achievements").deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Achievement not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Achievement deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete achievement", details: error.message },
      { status: 500 }
    );
  }
}
