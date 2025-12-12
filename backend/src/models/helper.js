import mongoose from "mongoose";

const helperSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    // NEW FIELDS (match your React Native Helper type)
    service: { type: String, default: "" },
    phone: { type: String, default: "" },
    about: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    // Existing fields
    bloodGroup: String,
    address: String,
  },
  { timestamps: true }
);

// Prevent password from being accidentally cleared on updates
helperSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.password === undefined) {
    delete update.$set.password;
  }
  if (update.password === undefined || update.password === null || update.password === '') {
    delete update.password;
  }
  next();
});

helperSchema.pre('updateOne', function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.password === undefined) {
    delete update.$set.password;
  }
  if (update.password === undefined || update.password === null || update.password === '') {
    delete update.password;
  }
  next();
});

export default mongoose.model("Helper", helperSchema);
