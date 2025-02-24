import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js"; // Import MongoDB connection
import userRouter from "./routes/user.route.js"; // Import user routes

dotenv.config(); // Load environment variables

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Define routes
app.use("/", userRouter);

// Set the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`); // This is Template Strings
});
// End of snippet
