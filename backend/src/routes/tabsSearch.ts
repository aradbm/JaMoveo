import express, { Request, Response } from "express";
import { searchTab4U } from "../utils/searchTab4U";

const router = express.Router();

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
