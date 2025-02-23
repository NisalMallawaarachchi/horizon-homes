import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const connectDB = async () => {
  try {
    const mongoDBUrl = process.env.MONGODB_URL;

    // Debugging - Check if .env is loaded
    console.log("🎯 Checking environment variables...");
    console.log("🎯 MONGODB_URL:", mongoDBUrl ? "Loaded ✅" : "Not Found ❌");

    if (!mongoDBUrl) {
      throw new Error(
        "MONGODB_URL is not defined in the environment variables"
      );
    }

    await mongoose.connect(mongoDBUrl);
    console.log("✅ MongoDB Atlas Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
