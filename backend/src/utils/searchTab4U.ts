import puppeteer from "puppeteer";

export async function searchTab4U(query: string) {
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
      .filter((item) => item !== null);
  });

  await browser.close();
  return results;
}
