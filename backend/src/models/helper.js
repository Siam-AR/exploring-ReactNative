import mongoose from "mongoose";

const helperSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    bloodGroup: String,
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model("Helper", helperSchema);
