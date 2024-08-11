import express, { Request, Response } from "express";
import puppeteer from "puppeteer";

const router = express.Router();

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

router.get("/", async (req: Request, res: Response) => {
  const query = req.query.q as string | undefined; // q is the search field query

  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const results = await searchTab4U(query);
    res.json(results);
  } catch (error) {
    console.error("Error searching Tab4U:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

export default router;
