import Helper from "../models/helper.js";

export const getAllHelpers = async (req, res) => {
  try {
    const { service, location } = req.query;
    
    console.log("📡 Get Helpers Request - Filters:", { service, location });
    
    let query = { available: true }; // Only show available helpers
    
    if (service) {
      query.service = { $regex: new RegExp(service, 'i') }; // Case-insensitive
    }
    
    if (location) {
      query.address = { $regex: new RegExp(location, 'i') }; // Case-insensitive
    }
    
    const helpers = await Helper.find(query).select('-password');
    
    console.log(`✅ Found ${helpers.length} helpers`);
    res.json(helpers);
  } catch (err) {
    console.error("❌ Get Helpers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getHelperById = async (req, res) => {
  try {
    const helper = await Helper.findById(req.params.id).select('-password');
    
    if (!helper) {
      return res.status(404).json({ message: "Helper not found" });
    }
    
    res.json(helper);
  } catch (err) {
    console.error("❌ Get Helper Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    console.log("📋 Get my profile request from user:", req.user._id);
    
    const helper = await Helper.findById(req.user._id).select('-password');
    
    if (!helper) {
      return res.status(404).json({ message: "Helper not found" });
    }
    
    console.log("✅ Profile fetched for:", helper.email);
    res.json(helper);
  } catch (err) {
    console.error("❌ Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    console.log("📝 Update profile request from user:", req.user._id);
    console.log("📦 Update data:", req.body);
    
    const { service, phone, whatsapp, about, address, bloodGroup, available } = req.body;
    
    const updateData = {};
    if (service !== undefined) updateData.service = service;
    if (phone !== undefined) updateData.phone = phone;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (about !== undefined) updateData.about = about;
    if (address !== undefined) updateData.address = address;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (available !== undefined) updateData.available = available;
    
    const helper = await Helper.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!helper) {
      return res.status(404).json({ message: "Helper not found" });
    }
    
    console.log("✅ Profile updated for:", helper.email);
    res.json({ message: "Profile updated successfully", helper });
  } catch (err) {
    console.error("❌ Update Profile Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
