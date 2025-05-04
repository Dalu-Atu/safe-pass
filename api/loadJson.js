import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_FILE_PATH = path.join(__dirname, "..", "src", "data", "user.json");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      return res
        .status(404)
        .json({ success: false, message: "JSON file not found" });
    }

    const data = JSON.parse(fs.readFileSync(JSON_FILE_PATH, "utf8"));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load JSON file",
      error: error.message,
    });
  }
}
