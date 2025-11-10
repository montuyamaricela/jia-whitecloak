import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { guid } from "@/lib/Utils";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const {
      jobTitle,
      description,
      questions,
      lastEditedBy,
      createdBy,
      screeningSetting,
      orgID,
      requireVideo,
      location,
      workSetup,
      workSetupRemarks,
      status,
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
      country,
      province,
      employmentType,
      secretPrompt,
      preScreeningQuestions,
      interviewScreeningSetting,
      interviewSecretPrompt,
      teamMembers,

      // for unpublished careers
      currentStep,
      completedSteps,
    } = await request.json();

    // Conditional validation based on status
    if (status === "inactive") {
      // For unpublished, only require job title (minimum data to save as unpublished)
      if (!jobTitle?.trim()) {
        return NextResponse.json(
          { error: "Job title is required to save as unpublished" },
          { status: 400 }
        );
      }
    } else {
      // Full validation for active (published)
      if (!jobTitle || !description || !questions || !location || !workSetup) {
        return NextResponse.json(
          {
            error:
              "Job title, description, questions, location and work setup are required",
          },
          { status: 400 }
        );
      }
    }

    const { db } = await connectMongoDB();

    // Only check job limits if publishing (not for unpublished)
    if (status === "active") {
      const orgDetails = await db.collection("organizations").aggregate([
        {
          $match: {
            _id: new ObjectId(orgID)
          }
        },
        {
          $lookup: {
              from: "organization-plans",
              let: { planId: "$planId" },
              pipeline: [
                  {
                      $addFields: {
                          _id: { $toString: "$_id" }
                      }
                  },
                  {
                      $match: {
                          $expr: { $eq: ["$_id", "$$planId"] }
                      }
                  }
              ],
              as: "plan"
          }
        },
        {
          $unwind: "$plan"
        },
      ]).toArray();

      if (!orgDetails || orgDetails.length === 0) {
        return NextResponse.json({ error: "Organization not found" }, { status: 404 });
      }

      const totalActiveCareers = await db.collection("careers").countDocuments({ orgID, status: "active" });

      if (totalActiveCareers >= (orgDetails[0].plan.jobLimit + (orgDetails[0].extraJobSlots || 0))) {
        return NextResponse.json({ error: "You have reached the maximum number of jobs for your plan" }, { status: 400 });
      }
    }

    const career = {
      id: guid(),
      jobTitle,
      description,
      questions,
      location,
      workSetup,
      workSetupRemarks,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedBy,
      createdBy,
      status: status || "active",
      screeningSetting,
      secretPrompt,
      preScreeningQuestions,
      interviewScreeningSetting,
      interviewSecretPrompt,
      teamMembers,
      orgID,
      requireVideo,
      lastActivityAt: new Date(),
      salaryNegotiable,
      minimumSalary,
      maximumSalary,
      country,
      province,
      employmentType,
      // Unpublished-specific fields
      currentStep: currentStep || 0,
      completedSteps: completedSteps || [],
      lastModified: new Date(),
    };

    await db.collection("careers").insertOne(career);

    return NextResponse.json({
      message: "Career added successfully",
      career,
    });
  } catch (error) {
    console.error("Error adding career:", error);
    return NextResponse.json(
      { error: "Failed to add career" },
      { status: 500 }
    );
  }
}
