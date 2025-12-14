import Consumer from "../models/consumer.js";

export const getMyProfile = async (req, res) => {
  try {
    console.log("📋 Get my consumer profile request from user:", req.user._id);

    const consumer = await Consumer.findById(req.user._id).select('-password');

    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    console.log("✅ Profile fetched for:", consumer.email);
    res.json(consumer);
  } catch (err) {
    console.error("❌ Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    console.log("📝 Update consumer profile request from user:", req.user._id);
    console.log("📦 Update data:", req.body);

    const { phone, whatsapp, address, bloodGroup } = req.body;

    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (address !== undefined) updateData.address = address;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;

    const consumer = await Consumer.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    console.log("✅ Profile updated for:", consumer.email);
    res.json({ message: "Profile updated successfully", consumer });
  } catch (err) {
    console.error("❌ Update Profile Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};