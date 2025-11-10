import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    let requestData = await request.json();
    const { _id, status } = requestData;

    if (!_id) {
      return NextResponse.json(
        { error: "Job Object ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    if (status && status !== "inactive") {
      const { jobTitle, description, questions, location, workSetup } = requestData;
      if (!jobTitle || !description || !questions || !location || !workSetup) {
        return NextResponse.json(
          {
            error:
              "Job title, description, questions, location and work setup are required to publish",
          },
          { status: 400 }
        );
      }
    }

    let dataUpdates = { ...requestData };
    delete dataUpdates._id;

    const career = {
      ...dataUpdates,
      updatedAt: new Date(),
      lastModified: new Date(),
    };

    await db
      .collection("careers")
      .updateOne({ _id: new ObjectId(_id) }, { $set: career });

    return NextResponse.json({
      message: "Career updated successfully",
      career,
    });
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json(
      { error: "Failed to update career" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { careerID, stepData, currentStep, completedSteps } = await request.json();

    if (!careerID) {
      return NextResponse.json(
        { error: "Career ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();

    const updateOperations: any = {
      $set: {
        ...stepData,
        lastModified: new Date(),
        updatedAt: new Date(),
      }
    };

    if (currentStep) {
      updateOperations.$set.currentStep = currentStep;
    }

    if (completedSteps && Array.isArray(completedSteps)) {
      updateOperations.$addToSet = { completedSteps: { $each: completedSteps } };
    }

    const result = await db
      .collection("careers")
      .updateOne({ _id: new ObjectId(careerID) }, updateOperations);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Career updated successfully",
      updated: true,
    });
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json(
      { error: "Failed to update career" },
      { status: 500 }
    );
  }
}
