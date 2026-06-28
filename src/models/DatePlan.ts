import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDatePlan extends Document {
  senderName: string;
  receiverName: string;
  senderGender: string;
  receiverGender: string;
  date: string;
  time: string;
  food: string;
  vibe: string;
  accepted: boolean;
  createdAt: Date;
}

const DatePlanSchema = new Schema<IDatePlan>({
  senderName: { type: String, required: true },
  receiverName: { type: String, required: true },
  senderGender: { type: String, default: "" },
  receiverGender: { type: String, default: "" },
  date: { type: String, default: "" },
  time: { type: String, default: "" },
  food: { type: String, default: "" },
  vibe: { type: String, default: "" },
  accepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const DatePlan: Model<IDatePlan> =
  mongoose.models.DatePlan || mongoose.model<IDatePlan>("DatePlan", DatePlanSchema);

export default DatePlan;
