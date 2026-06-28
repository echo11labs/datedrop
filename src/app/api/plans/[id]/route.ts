import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DatePlan from "@/models/DatePlan";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const plan = await DatePlan.findById(id).lean();

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: plan._id.toString(),
      senderName: plan.senderName,
      receiverName: plan.receiverName,
      senderGender: plan.senderGender,
      receiverGender: plan.receiverGender,
      date: plan.date,
      time: plan.time,
      food: plan.food,
      vibe: plan.vibe,
      accepted: plan.accepted,
    });
  } catch (error) {
    console.error("Failed to fetch plan:", error);
    return NextResponse.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const update: Record<string, unknown> = {};
    const allowedFields = ["senderName", "receiverName", "senderGender", "receiverGender", "date", "time", "food", "vibe", "accepted"];
    
    for (const field of allowedFields) {
      if (field in body) {
        update[field] = body[field];
      }
    }

    const plan = await DatePlan.findByIdAndUpdate(id, update, { new: true }).lean();

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: plan._id.toString(),
      senderName: plan.senderName,
      receiverName: plan.receiverName,
      senderGender: plan.senderGender,
      receiverGender: plan.receiverGender,
      date: plan.date,
      time: plan.time,
      food: plan.food,
      vibe: plan.vibe,
      accepted: plan.accepted,
    });
  } catch (error) {
    console.error("Failed to update plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}
