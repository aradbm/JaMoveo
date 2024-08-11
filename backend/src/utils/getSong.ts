import puppeteer from "puppeteer";
import { Song } from "../types/song";

function processRow(
  chordRow: string,
  lyricRow: string
): Array<{ lyrics: string; chords?: string }> {
  const lyrics = lyricRow.trim().split(/\s+/);
  const chordPositions = chordRow
    .split(/\s+/)
    .reduce((acc, chord, index, array) => {
      if (chord !== "") {
        acc.push({ chord, position: array.slice(0, index).join(" ").length });
      }
      return acc;
    }, [] as Array<{ chord: string; position: number }>);

  let currentChordIndex = 0;
  let currentPosition = 0;

  return lyrics.map((lyric) => {
    const result: { lyrics: string; chords?: string } = { lyrics: lyric };

    while (
      currentChordIndex < chordPositions.length &&
      chordPositions[currentChordIndex].position <= currentPosition
    ) {
      if (result.chords) {
        result.chords += " " + chordPositions[currentChordIndex].chord;
      } else {
        result.chords = chordPositions[currentChordIndex].chord;
      }
      currentChordIndex++;
    }

    currentPosition += lyric.length + 1; // +1 for the space
    return result;
  });
}

async function scrapeSong(url: string): Promise<Song> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const songContent = await page.evaluate(() => {
    const songContentElement = document.getElementById("songContentTPL");
    if (!songContentElement) return null;

    const rows: Array<[string, string]> = [];
    const tableRows = songContentElement.querySelectorAll("table tr");

    for (let i = 0; i < tableRows.length - 1; i++) {
      if (tableRows[i].querySelector(".tabs")) {
        continue;
      }
      // it can be chords_en or chords
      const chordRow =
        tableRows[i].querySelector(".chords_en") ||
        tableRows[i].querySelector(".chords");
      if (chordRow) {
        const lyricRow = tableRows[i + 1].querySelector(".song");
        if (lyricRow) {
          const chordText = chordRow.innerHTML
            .replace(/<span[^>]*>([^<]*)<\/span>/g, "$1")
            .replace(/&nbsp;/g, " ");
          const lyricText = lyricRow.textContent || "";
          rows.push([chordText, lyricText]);
          i++; // Skip the next row since we've already processed it
        }
      }
    }

    return rows;
  });

  await browser.close();

  if (!songContent) {
    throw new Error("Song content not found");
  }

  // Process each row using the processRow function
  const processedContent: Array<Array<{ lyrics: string; chords?: string }>> =
    songContent.map(([chordRow, lyricRow]) => processRow(chordRow, lyricRow));

  const song: Song = {
    title: "Song Title",
    artist: "Song Artist",
    content: processedContent,
  };

  return song;
}

export default scrapeSong;
