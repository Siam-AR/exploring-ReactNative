import Helper from "../models/helper.js";
import Consumer from "../models/consumer.js";

export const getStats = async (req, res) => {
  try {
    const totalHelpers = await Helper.countDocuments();
    const totalConsumers = await Consumer.countDocuments();

    res.json({
      helpers: totalHelpers,
      consumers: totalConsumers,
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
