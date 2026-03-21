const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const semesterRoutes = require("./routes/semester.Routes");
// Import CORS middleware for Cross-Origin Resource Sharing (allows frontend to call API)
const cors = require("cors");

// Initialize Express application
const app = express();

/**
 * Server Configuration
 */
const PORT = process.env.PORT || 3000;

/**
 * Middleware Setup
 * Middleware runs on every incoming request
 */

// Enable CORS - allows requests from different domains/ports (e.g., frontend port 5173 → backend port 3000)
app.use(cors({
  origin: "https://unipilot-project-mvp.vercel.app"
}));

// Parse incoming JSON request bodies and make them available as req.body
// Without this, JSON data in requests wouldn't be accessible
app.use(express.json());

app.use("/api", semesterRoutes);

app.get("/", (req, res) => {
  res.send("Hello from node API, Server Updated");
});

/**
 * MongoDB Connection and Server Startup
 * Connects to MongoDB using connection string from environment variable
 * Only starts server after successful database connection
 */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // Connection successful
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection failed!");
    console.log(err);
  });
