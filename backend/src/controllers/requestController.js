import Request from "../models/request.js";

export const createRequest = async (req, res) => {
  try {
    if (req.user.role !== "Consumer")
      return res.status(403).json({ message: "Only consumers can post requests" });

    const { serviceType, description, location } = req.body;

    if (!serviceType || !description || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const request = await Request.create({
      userId: req.user._id,
      role: req.user.role,
      serviceType,
      description,
      location,
    });

    console.log("✅ Request created:", request);
    res.json({ message: "Request created successfully", request });
  } catch (err) {
    console.error("❌ Create Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    console.log("📡 Fetching all requests...");
    console.log("👤 User:", req.user._id, "Role:", req.user.role);
    
    const requests = await Request.find()
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JavaScript objects for better performance

    console.log(`✅ Found ${requests.length} requests`);
    
    // Return consistent response format
    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    console.error("❌ Get Requests Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

// Optional: Get user's own requests
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    console.error("❌ Get My Requests Error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};