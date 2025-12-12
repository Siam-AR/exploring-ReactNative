import Helper from "../models/helper.js";

export const getAllHelpers = async (req, res) => {
  try {
    const helpers = await Helper.find();   // fetch all helpers
    res.json(helpers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
