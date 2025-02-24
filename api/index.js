import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js"; // Import MongoDB connection
import userRouter from "./routes/user.route.js"; // Import user routes
import authRouter from "./routes/auth.route.js"; // Import auth routes

dotenv.config(); // Load environment variables

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Define routes
app.use("/api/auth", authRouter); // Auth routes
app.use("/", userRouter); // User routes

// Handle unknown routes (404)
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err); // Logs the error for debugging
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    error: message,
  });
});

// Set the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
