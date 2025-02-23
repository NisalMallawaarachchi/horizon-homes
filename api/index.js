import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js"; // Import MongoDB connection

dotenv.config(); // Load environment variables

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Define a basic route
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// Set the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// End of snippet
