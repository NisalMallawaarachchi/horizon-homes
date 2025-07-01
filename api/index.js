import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; //for cookie parsing
import rateLimit from "express-rate-limit";
import cors from "cors";
import connectDB from "./db.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

// Load environment variables early
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express application
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts. Please try again later.",
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Handle unknown routes
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (middleware)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500; // If the error has a status code, use it; otherwise, default to 500
  const message = err.message || "Internal Server Error"; // If the error has a specific message, use it; otherwise, default to a generic message
  return res.status(statusCode).json({
    success: false,
    statusCode,
    error: message,
  });
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});