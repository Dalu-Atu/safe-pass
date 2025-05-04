import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_FILE_PATH = path.join(__dirname, "..", "src", "data", "user.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    if (!req.body || !Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. Expected an array of users.",
      });
    }

    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(req.body, null, 2));
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save JSON file",
      error: error.message,
    });
  }
}
