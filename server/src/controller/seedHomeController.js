import HomeSeeder from "../models/homeSeederModel.js";

export const getHomeSeeder = async (req, res) => {
  try {
    const homeSeederData = await HomeSeeder.find();
    res.status(200).json(homeSeederData);
  } catch (error) {
    console.error("Error fetching HomeSeeder data:", error);
    res.status(500).json({ message: "Failed to fetch HomeSeeder data" });
  }
};