import { NextRequest, NextResponse } from "next/server"
import connectMongoDB from "@/lib/mongoDB/mongoDB"

/**
 * Setup endpoint to bootstrap test accounts
 * Creates super admin account from POST body
 * Creates a test organization with unlimited plan
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name, image } = await request.json()

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      )
    }

    const { db } = await connectMongoDB()

    // 1. Create super admin account
    const existingAdmin = await db.collection("admins").findOne({ email })
    if (!existingAdmin) {
      await db.collection("admins").insertOne({
        email,
        name,
        image: image || `https://api.dicebear.com/9.x/shapes/svg?seed=${email}`,
        createdAt: new Date(),
        lastSeen: new Date(),
      })
    }

    // 2. Get or create a test organization plan with unlimited jobs
    let testPlan = await db.collection("organization-plans").findOne({ name: "Unlimited" })
    if (!testPlan) {
      const planResult = await db.collection("organization-plans").insertOne({
        name: "Unlimited",
        jobLimit: 9999,
        createdAt: new Date(),
      })
      testPlan = { _id: planResult.insertedId, name: "Unlimited", jobLimit: 9999 }
    }

    // 3. Create a test organization for the user
    const testOrg = await db.collection("organizations").findOne({ 
      creator: email,
      name: "Test Organization" 
    })
    
    if (!testOrg) {
      const orgResult = await db.collection("organizations").insertOne({
        name: "Test Organization",
        description: "Test organization for evaluation",
        status: "active",
        tier: "enterprise",
        planId: testPlan._id.toString(),
        extraJobSlots: 0,
        country: "Philippines",
        province: "Metro Manila",
        city: "Manila",
        address: "Test Address",
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "",
        coverImage: "",
        documents: [],
        creator: email,
        createdBy: {
          email,
          name,
          image: image || `https://api.dicebear.com/9.x/shapes/svg?seed=${email}`,
        },
      })

      // 4. Add user as member of test org
      const existingMember = await db.collection("members").findOne({ 
        email, 
        orgID: orgResult.insertedId.toString() 
      })
      
      if (!existingMember) {
        await db.collection("members").insertOne({
          image: image || `https://api.dicebear.com/9.x/shapes/svg?seed=${email}`,
          name,
          email,
          orgID: orgResult.insertedId.toString(),
          role: "admin",
          careers: [],
          addedAt: new Date(),
          lastLogin: null,
          status: "joined",
        })
      }

      return NextResponse.json({
        message: "Test accounts setup complete",
        orgID: orgResult.insertedId.toString(),
        planId: testPlan._id.toString(),
        adminCreated: !existingAdmin,
        organizationCreated: true,
      })
    }

    return NextResponse.json({
      message: "Test organization already exists",
      orgID: testOrg._id.toString(),
      planId: testPlan._id.toString(),
      adminCreated: !existingAdmin,
      organizationCreated: false,
    })
  } catch (error) {
    console.error("Error setting up test accounts:", error)
    return NextResponse.json(
      { error: "Failed to setup test accounts" },
      { status: 500 }
    )
  }
}