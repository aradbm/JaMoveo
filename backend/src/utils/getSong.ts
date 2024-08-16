import puppeteer from "puppeteer";
import { Song } from "../types/song";

/*
The scrapeSong function uses Puppeteer to scrape the content of a song from a website.

We know that the scructure of the song content is as follows:
- Each song inside element with id "songContentTPL" is divided into rows.
- The chord row contains the chords for the lyrics in the lyric row. Indentified with: ".chords_en" or ".chords".
- The lyric row contains the lyrics for the song. Identified with: ".song".

To combine 2 rows of chords and lyrics into an array of objects, we use the processRow function.
to get structure like needed for the Song type.
*/

function processRow(
  chordRow: string,
  lyricRow: string
): Array<{ lyrics: string; chords?: string }> {
  /*
  Chords + lyrics look like this for example:
  "G            D          Em  D       "
  "I'm a Barbie Girl, in a Barbie World"
  
  We want here to change this to an array of objects like this:
  [
    { lyrics: "I'm" , chords: "G" }
    { lyrics: "a" }
    { lyrics: "Barbie" }
    { lyrics: "Girl", chords: "D" }
    { lyrics: "in" }
    { lyrics: "a" }
    { lyrics: "Barbie", chords: "Em  D" }
    { lyrics: "World"}
  ]
  
  We can do this by calculating the length of the entire sentence and for each word check 
  th corresponding sub array of chords and add them to the object. if there are no chords for the word
  we will not add the chords property
  
  */
  const lyrics = lyricRow.trim().split(/\s+/);
  const chordMatches = [...chordRow.matchAll(/(\s*)([^\s]+)/g)];

  let result: Array<{ lyrics: string; chords?: string }> = [];
  let chordIndex = 0;
  let lyricsPosition = 0;

  lyrics.forEach((word, wordIndex) => {
    let obj: { lyrics: string; chords?: string } = { lyrics: word };
    let chordForThisWord = "";

    while (chordIndex < chordMatches.length) {
      const [, spaces, chord] = chordMatches[chordIndex];
      const chordPosition = chordRow.indexOf(spaces + chord, lyricsPosition);

      if (chordPosition <= lyricsPosition + word.length) {
        chordForThisWord += spaces + chord;
        chordIndex++;
      } else {
        break;
      }
    }

    if (chordForThisWord) {
      obj.chords = chordForThisWord.trimStart();
    } else if (
      wordIndex === lyrics.length - 1 &&
      chordIndex < chordMatches.length
    ) {
      // If it's the last word and there are remaining chords, associate them with this word
      obj.chords = chordMatches
        .slice(chordIndex)
        .map(([, spaces, chord]) => spaces + chord)
        .join("");
    }

    result.push(obj);
    lyricsPosition += word.length + 1;
  });

  return result;
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
  const processedContent = songContent.map(([chordRow, lyricRow]) =>
    processRow(chordRow, lyricRow)
  );

  const song: Song = {
    title: "Song Title",
    artist: "Song Artist",
    content: processedContent,
  };

  return song;
}

export default scrapeSong;
