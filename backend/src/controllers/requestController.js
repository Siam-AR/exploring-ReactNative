import Request from "../models/request.js";
import Consumer from "../models/consumer.js";
import Helper from "../models/helper.js";

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
      .lean();

    // Populate consumer details for each request
    const requestsWithConsumer = await Promise.all(
      requests.map(async (request) => {
        const consumer = await Consumer.findById(request.userId).select('name email phone whatsapp address bloodGroup');
        return {
          ...request,
          consumer: consumer || null,
        };
      })
    );

    console.log(`✅ Found ${requestsWithConsumer.length} requests with consumer details`);
    
    res.json({
      success: true,
      count: requestsWithConsumer.length,
      data: requestsWithConsumer
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

// Get single request by ID with consumer details
export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).lean();
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    const consumer = await Consumer.findById(request.userId).select('name email phone whatsapp address bloodGroup');
    
    res.json({
      ...request,
      consumer: consumer || null,
    });
  } catch (err) {
    console.error("❌ Get Request Error:", err);
    res.status(500).json({ message: "Server error" });
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