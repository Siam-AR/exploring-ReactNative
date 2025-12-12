import mongoose from "mongoose";

const consumerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    bloodGroup: String,
    address: String,
  },
  { timestamps: true }
);

// Prevent password from being accidentally cleared on updates
consumerSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.password === undefined) {
    delete update.$set.password;
  }
  if (update.password === undefined || update.password === null || update.password === '') {
    delete update.password;
  }
  next();
});

consumerSchema.pre('updateOne', function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.password === undefined) {
    delete update.$set.password;
  }
  if (update.password === undefined || update.password === null || update.password === '') {
    delete update.password;
  }
  next();
});

export default mongoose.model("Consumer", consumerSchema);
