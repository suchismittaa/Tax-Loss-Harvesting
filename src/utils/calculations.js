// Core capital-gains math, shared by the Pre and Post harvesting cards.

/**
 * Given a capitalGains shape { stcg: {profits, losses}, ltcg: {profits, losses} },
 * returns net short-term, net long-term, and total realised gains.
 */
export function deriveGainSummary(capitalGains) {
  const netShortTerm = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const netLongTerm = capitalGains.ltcg.profits - capitalGains.ltcg.losses;
  const realised = netShortTerm + netLongTerm;
  return { netShortTerm, netLongTerm, realised };
}

/**
 * Folds a holding's stcg.gain / ltcg.gain into a running profits/losses bucket.
 * Positive gain -> profits, negative gain -> losses (stored as a positive magnitude).
 */
function foldGainIntoBucket(bucket, gain) {
  if (gain > 0) {
    return { profits: bucket.profits + gain, losses: bucket.losses };
  }
  if (gain < 0) {
    return { profits: bucket.profits, losses: bucket.losses + Math.abs(gain) };
  }
  return bucket;
}

/**
 * Applies the set of selected holdings on top of the base (pre-harvesting)
 * capital gains figures to produce the "after harvesting" capital gains.
 */
export function computeHarvestedGains(baseCapitalGains, holdings, selectedCoinKeys) {
  let stcg = { ...baseCapitalGains.stcg };
  let ltcg = { ...baseCapitalGains.ltcg };

  holdings.forEach((holding) => {
    if (!selectedCoinKeys.has(holding.key)) return;
    stcg = foldGainIntoBucket(stcg, holding.stcg.gain);
    ltcg = foldGainIntoBucket(ltcg, holding.ltcg.gain);
  });

  return { stcg, ltcg };
}

export function formatINR(value, { showSign = false } = {}) {
  const rounded = Math.round(value * 100) / 100;
  const sign = showSign && rounded > 0 ? "+" : "";
  const formatted = Math.abs(rounded).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const negative = rounded < 0 ? "-" : "";
  return `${sign}${negative}₹${formatted}`;
}

export function formatNumber(value, maxDecimals = 4) {
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs < 0.0001) return value.toExponential(2);
  return value.toLocaleString("en-IN", { maximumFractionDigits: maxDecimals });
}
