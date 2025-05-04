// server.js BU NOW BE REPLACED TO SERVERLESS STYLE
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your JSON file (adjust this to your project structure)
const JSON_FILE_PATH = path.join(__dirname, "src", "data", "user.json");

// Enable CORS for your React app
app.use(cors());
app.use(express.json());

// Endpoint to save JSON data
app.post("/api/saveJson", (req, res) => {
  try {
    // Validate that req.body contains valid data
    if (!req.body || !Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. Expected an array of users.",
      });
    }

    // Write to file with pretty formatting (2 spaces)
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(req.body, null, 2));

    console.log("JSON file updated successfully");
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving JSON file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save JSON file",
      error: error.message,
    });
  }
});

// Endpoint to load JSON data
app.get("/api/loadJson", (req, res) => {
  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      return res.status(404).json({
        success: false,
        message: "JSON file not found",
      });
    }

    const data = JSON.parse(fs.readFileSync(JSON_FILE_PATH, "utf8"));
    res.json(data);
  } catch (error) {
    console.error("Error loading JSON file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load JSON file",
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`JSON file server running at http://localhost:${PORT}`);
  console.log(`JSON file path: ${JSON_FILE_PATH}`);
});
