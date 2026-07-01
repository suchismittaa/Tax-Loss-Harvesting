import { useMemo, useState } from "react";
import { formatINR, formatNumber } from "../utils/calculations";

const VISIBLE_ROWS = 8;

function GainCell({ gain, balance }) {
  if (balance === 0) {
    return <span className="mono holdings-table__muted">—</span>;
  }
  const isProfit = gain >= 0;
  return (
    <div className="holdings-table__gain">
      <span className={`mono holdings-table__gain-value ${isProfit ? "is-profit" : "is-loss"}`}>
        {formatINR(gain, { showSign: true })}
      </span>
      <span className="holdings-table__gain-balance mono">{formatNumber(balance)} qty</span>
    </div>
  );
}

export default function HoldingsTable({ holdings, selectedKeys, onToggleRow, onToggleAll }) {
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(
    () => [...holdings].sort((a, b) => b.totalHolding * b.currentPrice - a.totalHolding * a.currentPrice),
    [holdings]
  );

  const visibleRows = expanded ? sorted : sorted.slice(0, VISIBLE_ROWS);
  const allSelected = holdings.length > 0 && selectedKeys.size === holdings.length;
  const someSelected = selectedKeys.size > 0 && !allSelected;

  return (
    <section className="holdings">
      <div className="holdings__header">
        <h2 className="holdings__title">Holdings</h2>
        <span className="holdings__count">{selectedKeys.size} of {holdings.length} selected</span>
      </div>

      <div className="holdings__scroll">
        <table className="holdings-table">
          <thead>
            <tr>
              <th className="holdings-table__checkbox-cell">
                <input
                  type="checkbox"
                  aria-label="Select all holdings"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={(e) => onToggleAll(e.target.checked)}
                />
              </th>
              <th>Asset</th>
              <th>Holdings / Avg Buy Price</th>
              <th>Current Price</th>
              <th>Short-Term Gain</th>
              <th>Long-Term Gain</th>
              <th>Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((holding) => {
              const isSelected = selectedKeys.has(holding.key);
              return (
                <tr key={holding.key} className={isSelected ? "is-selected" : ""}>
                  <td className="holdings-table__checkbox-cell">
                    <input
                      type="checkbox"
                      aria-label={`Select ${holding.coin}`}
                      checked={isSelected}
                      onChange={() => onToggleRow(holding.key)}
                    />
                  </td>
                  <td>
                    <div className="holdings-table__asset">
                      <img
                        src={holding.logo}
                        alt=""
                        className="holdings-table__logo"
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />
                      <div className="holdings-table__asset-text">
                        <span className="holdings-table__symbol">{holding.coin}</span>
                        <span className="holdings-table__name">{holding.coinName}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="holdings-table__stacked mono">
                      <span>{formatNumber(holding.totalHolding)}</span>
                      <span className="holdings-table__muted">@ {formatINR(holding.averageBuyPrice)}</span>
                    </div>
                  </td>
                  <td className="mono">{formatINR(holding.currentPrice)}</td>
                  <td>
                    <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} />
                  </td>
                  <td>
                    <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} />
                  </td>
                  <td className="mono">
                    {isSelected ? formatNumber(holding.totalHolding) : <span className="holdings-table__muted">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sorted.length > VISIBLE_ROWS && (
        <button type="button" className="holdings__view-all" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Show less" : `View all ${sorted.length} holdings`}
        </button>
      )}
    </section>
  );
}
