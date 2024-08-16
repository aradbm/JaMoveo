import express from "express";
import fs from "fs";
import path from "path";

// Used to search local songs in data folder (sample songs given).
// Old implementation.

const router = express.Router();
const songsFilePath = path.join(__dirname, "../data");

router.get("/", (req, res) => {
  const query = ((req.query.q as string) || "").toLowerCase();
  console.log("Search query: ", query);

  try {
    const files = fs.readdirSync(songsFilePath);
    const songs = [];

    for (const file of files) {
      if (path.extname(file) === ".json") {
        const filePath = path.join(songsFilePath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const songData = JSON.parse(fileContent);

        // Extract all lyrics into a single string
        const lyrics = songData
          .flat()
          .map((item: { lyrics: string; chords?: string }) => item.lyrics)
          .join(" ")
          .toLowerCase();

        if (lyrics.includes(query)) {
          songs.push({
            title: path.parse(file).name,
            preview: lyrics.substring(0, 20) + "...",
          });
        }
      }
    }

    console.log("Matched songs:", songs);
    res.json(songs);
  } catch (error) {
    console.error("Error processing songs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
