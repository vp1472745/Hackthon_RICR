// src/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // make sure .env is loaded

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("MONGO_URL environment variable not set. Check your .env and dotenv.config() position.");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
