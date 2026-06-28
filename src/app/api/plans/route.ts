import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DatePlan from "@/models/DatePlan";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const plan = await DatePlan.create({
      senderName: body.senderName || "",
      receiverName: body.receiverName || "",
      senderGender: body.senderGender || "",
      receiverGender: body.receiverGender || "",
      date: body.date || "",
      time: body.time || "",
      food: body.food || "",
      vibe: body.vibe || "",
      accepted: body.accepted || false,
    });

    return NextResponse.json({ id: plan._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Failed to create plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
