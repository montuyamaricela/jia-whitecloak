import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";
import { validateAndSanitizeCareer, filterUpdateFields } from "@/lib/utils/careerValidation";

export async function POST(request: Request) {
  try {
    let requestData = await request.json();
    const { _id, status, confirmSanitization } = requestData;

    if (!_id) {
      return NextResponse.json(
        { error: "Job Object ID is required" },
        { status: 400 }
      );
    }

    const filteredData = filterUpdateFields(requestData);

    const validationResult = validateAndSanitizeCareer(
      filteredData,
      true,
      confirmSanitization === true
    );

    if (!validationResult.isValid && validationResult.requiresConfirmation) {
      return NextResponse.json(
        {
          requiresConfirmation: true,
          warnings: validationResult.warnings,
          sanitizedPreview: validationResult.sanitizedData,
        },
        { status: 200 }
      );
    }

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.errors.reduce((acc, err) => {
            acc[err.field] = err.message;
            return acc;
          }, {} as Record<string, string>),
        },
        { status: 400 }
      );
    }

    const sanitizedData = validationResult.sanitizedData;

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

    const career = {
      ...sanitizedData,
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
    const { careerID, stepData, currentStep, completedSteps, confirmSanitization } = await request.json();

    if (!careerID) {
      return NextResponse.json(
        { error: "Career ID is required" },
        { status: 400 }
      );
    }

    const filteredStepData = filterUpdateFields(stepData || {});

    const validationResult = validateAndSanitizeCareer(
      filteredStepData,
      true,
      confirmSanitization === true
    );

    if (!validationResult.isValid && validationResult.requiresConfirmation) {
      return NextResponse.json(
        {
          requiresConfirmation: true,
          warnings: validationResult.warnings,
          sanitizedPreview: validationResult.sanitizedData,
        },
        { status: 200 }
      );
    }

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.errors.reduce((acc, err) => {
            acc[err.field] = err.message;
            return acc;
          }, {} as Record<string, string>),
        },
        { status: 400 }
      );
    }

    const sanitizedStepData = validationResult.sanitizedData;

    const { db } = await connectMongoDB();

    const updateOperations: any = {
      $set: {
        ...sanitizedStepData,
        lastModified: new Date(),
        updatedAt: new Date(),
      }
    };

    if (currentStep !== undefined && currentStep !== null) {
      updateOperations.$set.currentStep = Number(currentStep);
    }

    if (completedSteps && Array.isArray(completedSteps)) {
      const sanitizedSteps = completedSteps
        .filter(step => typeof step === 'number' || !isNaN(Number(step)))
        .map(step => Number(step));
      updateOperations.$addToSet = { completedSteps: { $each: sanitizedSteps } };
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
