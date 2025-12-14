import Helper from "../models/helper.js";
import Consumer from "../models/consumer.js";
import Request from "../models/request.js";

export const getStats = async (req, res) => {
  try {
    console.log("📊 Fetching statistics...");

    // Count totals
    const totalHelpers = await Helper.countDocuments();
    const totalConsumers = await Consumer.countDocuments();
    const totalRequests = await Request.countDocuments();

    // Count available helpers
    const availableHelpers = await Helper.countDocuments({ available: true });

    // Count active requests (pending status)
    const activeRequests = await Request.countDocuments({
      status: { $in: ["pending", "active"] },
    });

    // Get service type breakdown
    const serviceBreakdown = await Helper.aggregate([
      { $match: { service: { $ne: "" } } },
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Recent activity - last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentHelpers = await Helper.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const recentRequests = await Request.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const stats = {
      helpers: totalHelpers,
      consumers: totalConsumers,
      requests: totalRequests,
      availableHelpers: availableHelpers,
      activeRequests: activeRequests,
      recentHelpers: recentHelpers,
      recentRequests: recentRequests,
      serviceBreakdown: serviceBreakdown.map((s) => ({
        service: s._id,
        count: s.count,
      })),
      lastUpdated: new Date().toISOString(),
    };

    console.log("✅ Stats calculated:", stats);
    res.json(stats);
  } catch (err) {
    console.error("❌ Stats Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
