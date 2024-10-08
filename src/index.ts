import { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchBTCStats, saveBTCStats, scheduleNextFetch } from "./btcStats";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method === "GET") {
    try {
      const stats = await fetchBTCStats();
      await saveBTCStats(stats);
      response.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching and saving BTC stats:", error);
      response.status(500).json({
        error: "An error occurred while fetching and saving BTC stats",
      });
    }
  } else if (request.method === "POST") {
    try {
      scheduleNextFetch();
      response.status(200).json({ message: "Next BTC stats fetch scheduled" });
    } catch (error) {
      console.error("Error scheduling next BTC stats fetch:", error);
      response.status(500).json({
        error: "An error occurred while scheduling next BTC stats fetch",
      });
    }
  } else {
    response.status(405).json({ error: "Method not allowed" });
  }
}

// If this file is run directly (not as a serverless function), execute the main function
if (require.main === module) {
  import("./btcStats").then(({ main }) => {
    main().catch(console.error);
  });
}
