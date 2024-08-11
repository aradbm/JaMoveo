import express, { Request, Response, NextFunction } from "express";
import puppeteer from "puppeteer";
import asyncHandler from "express-async-handler";
const router = express.Router();

/* we get here from /tabsearch
html div class of main page: resultsPage
html div class of all songs: recUpUnit ruSongUnit

so if we get all recUpUnit ruSongUnit we get all songs. inside each we want:
the <a> tag and the href inside

overall we return to the client tuple of <songName, artistName, url>
*/

async function searchTab4U(query: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    `https://www.tab4u.com/resultsSimple?tab=songs&q=${encodeURIComponent(
      query
    )}`
  );

  const results = await page.evaluate(() => {
    const songElements = document.querySelectorAll(".recUpUnit.ruSongUnit");
    return Array.from(songElements)
      .map((songElement) => {
        const linkElement = songElement.querySelector(
          "a.ruSongLink"
        ) as HTMLAnchorElement;
        const songNameElement = songElement.querySelector(
          ".sNameI19"
        ) as HTMLElement;
        const artistNameElement = songElement.querySelector(
          ".aNameI19"
        ) as HTMLElement;

        if (linkElement && songNameElement && artistNameElement) {
          return {
            songName:
              songNameElement.textContent?.trim().replace(" /", "") || "",
            artistName: artistNameElement.textContent?.trim() || "",
            url: linkElement.href,
          };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  });

  await browser.close();
  return results;
}

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query.q as string | undefined;
    if (!query) {
      res.status(400).json({ error: "Query parameter 'q' is required" });
      return;
    }

    const results = await searchTab4U(query);
    console.log("--------------------------------------------");
    // console.log(results);

    res.json(results);
  })
);
export default router;
