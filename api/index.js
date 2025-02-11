import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();

// Middleware (e.g., JSON parsing)
app.use(express.json());

// Define a basic route
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Set the port (use environment variable if available)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});