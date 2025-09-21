import { NextResponse } from "next/server";
import Event from "@/models/Event";
import dbConnect from "@/lib/db";

export async function PUT(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    // Validate update data
    const allowedFields = [
      'title', 'description', 'shortDescription', 'startDate', 'endDate',
      'location', 'status', 'capacity', 'category', 'registrationDeadline',
      'registrationFee', 'prerequisites', 'agenda', 'organizers', 'sponsors',
      'tags', 'isVisible', 'featured'
    ];

    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    // Convert date strings to Date objects if provided
    if (filteredData.startDate) {
      filteredData.startDate = new Date(filteredData.startDate);
    }
    if (filteredData.endDate) {
      filteredData.endDate = new Date(filteredData.endDate);
    }
    if (filteredData.registrationDeadline) {
      filteredData.registrationDeadline = new Date(filteredData.registrationDeadline);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      filteredData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Event updated successfully",
      event: updatedEvent
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating event:", error);
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
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Event deleted successfully",
      event: deletedEvent
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}