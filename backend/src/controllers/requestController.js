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

    res.json({ message: "Request created successfully", request });
  } catch (err) {
    console.error("Create Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
