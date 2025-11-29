import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { type: String, required: true }, // "Consumer" | "Helper"  
    serviceType: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "pending", "resolved"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
