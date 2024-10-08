// import dotenv from "dotenv";
// import path from "path";
// import axios from "axios";
// import { addDays, nextSaturday, format } from "date-fns";
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get, child } from "firebase/database";

// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// const {
//   FIREBASE_API_KEY,
//   FIREBASE_AUTH_DOMAIN,
//   FIREBASE_DATABASE_URL,
//   FIREBASE_PROJECT_ID,
//   FIREBASE_STORAGE_BUCKET,
//   FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID,
// } = process.env;

// if (
//   !FIREBASE_API_KEY ||
//   !FIREBASE_AUTH_DOMAIN ||
//   !FIREBASE_DATABASE_URL ||
//   !FIREBASE_PROJECT_ID ||
//   !FIREBASE_STORAGE_BUCKET ||
//   !FIREBASE_MESSAGING_SENDER_ID ||
//   !FIREBASE_APP_ID
// ) {
//   console.error(
//     "Missing Firebase configuration. Please check your environment variables."
//   );
//   throw new Error("Missing Firebase configuration");
// }

// const firebaseConfig = {
//   apiKey: FIREBASE_API_KEY,
//   authDomain: FIREBASE_AUTH_DOMAIN,
//   databaseURL: FIREBASE_DATABASE_URL,
//   projectId: FIREBASE_PROJECT_ID,
//   storageBucket: FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
//   appId: FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// console.log("Firebase initialized successfully");

// interface BTCData {
//   date: string;
//   price: number;
//   openingVolume: number;
//   marketCap: number;
// }

// async function fetchBTCStats(): Promise<BTCData> {
//   try {
//     const response = await axios.get(
//       "https://api.coingecko.com/api/v3/coins/bitcoin"
//     );
//     const data = response.data;

//     return {
//       date: format(new Date(), "yyyy-MM-dd"),
//       price: data.market_data.current_price.usd,
//       openingVolume: data.market_data.total_volume.usd,
//       marketCap: data.market_data.market_cap.usd,
//     };
//   } catch (error) {
//     console.error("Error fetching BTC stats:", error);
//     throw error;
//   }
// }

// async function saveBTCStats(stats: BTCData) {
//   try {
//     await set(ref(db, `btcStats/${stats.date}`), stats);
//     console.log(`Saved BTC stats for ${stats.date}`);
//   } catch (error) {
//     console.error("Error saving BTC stats:", error);
//     throw error;
//   }
// }

// async function getBTCStats(date: string): Promise<BTCData | null> {
//   try {
//     const snapshot = await get(child(ref(db), `btcStats/${date}`));
//     if (snapshot.exists()) {
//       return snapshot.val() as BTCData;
//     } else {
//       console.log("No data available for the specified date");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error getting BTC stats:", error);
//     throw error;
//   }
// }

// async function fetchAndSaveBTCStats() {
//   const stats = await fetchBTCStats();
//   await saveBTCStats(stats);
//   return stats;
// }

// function scheduleNextFetch() {
//   const now = new Date();
//   const nextSat = nextSaturday(now);
//   const msUntilNextSat = nextSat.getTime() - now.getTime();

//   console.log(
//     `Next fetch scheduled for ${format(nextSat, "yyyy-MM-dd HH:mm:ss")}`
//   );

//   setTimeout(async () => {
//     await fetchAndSaveBTCStats();
//     scheduleNextFetch();
//   }, msUntilNextSat);
// }

// async function main() {
//   console.log("Fetching initial BTC stats...");
//   await fetchAndSaveBTCStats();
//   scheduleNextFetch();
// }

// export {
//   fetchBTCStats,
//   saveBTCStats,
//   getBTCStats,
//   fetchAndSaveBTCStats,
//   scheduleNextFetch,
//   main,
// };

// // If this file is run directly (not imported as a module), execute the main function
// if (require.main === module) {
//   main().catch(console.error);
// }

import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import { addDays, nextSaturday, format } from "date-fns";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} = process.env;

if (
  !FIREBASE_API_KEY ||
  !FIREBASE_AUTH_DOMAIN ||
  !FIREBASE_DATABASE_URL ||
  !FIREBASE_PROJECT_ID ||
  !FIREBASE_STORAGE_BUCKET ||
  !FIREBASE_MESSAGING_SENDER_ID ||
  !FIREBASE_APP_ID
) {
  console.error(
    "Missing Firebase configuration. Please check your environment variables."
  );
  throw new Error("Missing Firebase configuration");
}

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Firebase initialized successfully");

interface BTCData {
  date: string;
  price: string;
  openingVolume: string;
  marketCap: string;
}

function formatAsDollars(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

async function fetchBTCStats(): Promise<BTCData> {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/bitcoin"
    );
    const data = response.data;

    return {
      date: format(new Date(), "yyyy-MM-dd"),
      price: formatAsDollars(data.market_data.current_price.usd),
      openingVolume: formatAsDollars(data.market_data.total_volume.usd),
      marketCap: formatAsDollars(data.market_data.market_cap.usd),
    };
  } catch (error) {
    console.error("Error fetching BTC stats:", error);
    throw error;
  }
}

async function saveBTCStats(stats: BTCData) {
  try {
    await set(ref(db, `btcStats/${stats.date}`), stats);
    console.log(`Saved BTC stats for ${stats.date}`);
  } catch (error) {
    console.error("Error saving BTC stats:", error);
    throw error;
  }
}

async function getBTCStats(date: string): Promise<BTCData | null> {
  try {
    const snapshot = await get(child(ref(db), `btcStats/${date}`));
    if (snapshot.exists()) {
      return snapshot.val() as BTCData;
    } else {
      console.log("No data available for the specified date");
      return null;
    }
  } catch (error) {
    console.error("Error getting BTC stats:", error);
    throw error;
  }
}

async function fetchAndSaveBTCStats() {
  const stats = await fetchBTCStats();
  await saveBTCStats(stats);
  return stats;
}

function scheduleNextFetch() {
  const now = new Date();
  const nextSat = nextSaturday(now);
  const msUntilNextSat = nextSat.getTime() - now.getTime();

  console.log(
    `Next fetch scheduled for ${format(nextSat, "yyyy-MM-dd HH:mm:ss")}`
  );

  setTimeout(async () => {
    await fetchAndSaveBTCStats();
    scheduleNextFetch();
  }, msUntilNextSat);
}

async function main() {
  console.log("Fetching initial BTC stats...");
  await fetchAndSaveBTCStats();
  scheduleNextFetch();
}

export {
  fetchBTCStats,
  saveBTCStats,
  getBTCStats,
  fetchAndSaveBTCStats,
  scheduleNextFetch,
  main,
};

// If this file is run directly (not imported as a module), execute the main function
if (require.main === module) {
  main().catch(console.error);
}
