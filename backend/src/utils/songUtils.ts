import fs from "fs";
import path from "path";
import { Song } from "../types/song";

const songsFilePath = path.join(__dirname, "../../data");

export const fetchSongFromFile = (songId: string): Promise<Song> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(songsFilePath, `${songId}.json`);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const songData = JSON.parse(data);
        resolve(songData);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
};
