import TeamMember from "@/models/TeamMember";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  console.log('🗑️ Team Members DELETE API: Request received');
  console.log('🔗 Request URL:', request.url);

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    console.log('📋 Query parameters:', { id });

    if (!id) {
      console.log('❌ No ID provided');
      return NextResponse.json(
        { error: "Team member ID is required" },
        { status: 400 }
      );
    }

    console.log('🔌 Attempting database connection...');
    await dbConnect();
    console.log('✅ Database connected successfully');

    console.log('🔍 Finding team member to delete:', id);
    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      console.log('❌ Team member not found with ID:', id);
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    console.log('✅ Team member found:', {
      id: teamMember._id,
      name: teamMember.name,
      role: teamMember.role,
      department: teamMember.department
    });

    // Delete the team member
    console.log('🗑️ Deleting team member...');
    await TeamMember.findByIdAndDelete(id);

    console.log('✅ Team member deleted successfully');

    return NextResponse.json(
      {
        message: "Team member deleted successfully",
        deletedMember: {
          id: teamMember._id,
          name: teamMember.name,
          role: teamMember.role,
          department: teamMember.department
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting team member:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    if (error.name === "CastError") {
      console.log('🔄 CastError detected, returning 400');
      return NextResponse.json(
        { error: "Invalid team member ID format" },
        { status: 400 }
      );
    }

    console.log('💥 Internal server error, returning 500');
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}