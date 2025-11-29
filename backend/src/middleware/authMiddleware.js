import jwt from "jsonwebtoken";
import Helper from "../models/helper.js";
import Consumer from "../models/consumer.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const helper = await Helper.findById(decoded.id);
    const consumer = await Consumer.findById(decoded.id);

    if (!helper && !consumer)
      return res.status(401).json({ message: "User not found" });

    req.user = helper || consumer;
    req.user.role = helper ? "Helper" : "Consumer";

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
