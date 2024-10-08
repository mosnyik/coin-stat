import {
  fetchBTCStats,
  saveBTCStats,
  fetchAndSaveBTCStats,
  scheduleNextFetch,
  main,
} from "./btcStats";

async function runTests() {
  console.log("Testing fetchBTCStats:");
  const stats = await fetchBTCStats();
  console.log(stats);

  console.log("\nTesting saveBTCStats:");
  await saveBTCStats(stats);

  console.log("\nTesting fetchAndSaveBTCStats:");
  const savedStats = await fetchAndSaveBTCStats();
  console.log(savedStats);

  console.log("\nTesting scheduleNextFetch:");
  scheduleNextFetch();

  console.log("\nTesting main function:");
  await main();
}

runTests().catch(console.error);
