import { holdingsData } from "./holdingsData";
import { capitalGainsData } from "./capitalGainsData";

// Simulated latency so loading states are actually visible/testable.
const LATENCY_MS = 700;

// Flip this to `true` locally to exercise the error UI paths.
const SIMULATE_ERROR = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchHoldings() {
  await delay(LATENCY_MS);
  if (SIMULATE_ERROR) {
    throw new Error("Failed to fetch holdings. Please try again.");
  }
  return holdingsData;
}

export async function fetchCapitalGains() {
  await delay(LATENCY_MS + 150);
  if (SIMULATE_ERROR) {
    throw new Error("Failed to fetch capital gains. Please try again.");
  }
  return capitalGainsData.capitalGains;
}
