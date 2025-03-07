import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { baseId, data } = req.body;

    if (!baseId || !data) {
      return res.status(400).json({ error: "Missing baseId or data" });
    }

    // Define the directory and file path
    const dirPath = path.join(process.cwd(), "public", "data", "ai-json");
    const filePath = path.join(dirPath, `${baseId}.json`);

    // Ensure the directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write JSON data to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return res.status(200).json({ message: "File saved successfully", filePath });
  } catch (error) {
    console.error("Error saving file:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
