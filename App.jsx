import { useEffect, useMemo, useState } from "react";
import CapitalGainsCard from "./components/CapitalGainsCard";
import HoldingsTable from "./components/HoldingsTable";
import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import { fetchHoldings, fetchCapitalGains } from "./api/mockApi";
import { deriveGainSummary, computeHarvestedGains } from "./utils/calculations";
import "./App.css";

export default function App() {
  const [holdings, setHoldings] = useState([]);
  const [baseCapitalGains, setBaseCapitalGains] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    setStatus("loading");
    setErrorMessage("");
    try {
      const [holdingsRes, gainsRes] = await Promise.all([fetchHoldings(), fetchCapitalGains()]);
      setHoldings(holdingsRes);
      setBaseCapitalGains(gainsRes);
      setSelectedKeys(new Set());
      setStatus("ready");
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong while loading your data.");
      setStatus("error");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const postHarvestingGains = useMemo(() => {
    if (!baseCapitalGains) return null;
    return computeHarvestedGains(baseCapitalGains, holdings, selectedKeys);
  }, [baseCapitalGains, holdings, selectedKeys]);

  const savings = useMemo(() => {
    if (!baseCapitalGains || !postHarvestingGains) return 0;
    const pre = deriveGainSummary(baseCapitalGains).realised;
    const post = deriveGainSummary(postHarvestingGains).realised;
    return pre - post;
  }, [baseCapitalGains, postHarvestingGains]);

  function toggleRow(key) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleAll(checked) {
    setSelectedKeys(checked ? new Set(holdings.map((h) => h.key)) : new Set());
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark">TLH</span>
          <div>
            <h1 className="app__brand-title">Tax Loss Harvesting</h1>
            <p className="app__brand-subtitle">Offset gains before the financial year closes</p>
          </div>
        </div>
      </header>

      <main className="app__main">
        {status === "loading" && <Loader label="Fetching your portfolio..." />}
        {status === "error" && <ErrorState message={errorMessage} onRetry={loadData} />}

        {status === "ready" && baseCapitalGains && (
          <>
            <div className="cards-row">
              <CapitalGainsCard
                variant="pre"
                eyebrow="Before harvesting"
                title="Pre-Harvesting"
                capitalGains={baseCapitalGains}
              />
              <CapitalGainsCard
                variant="post"
                eyebrow="After harvesting"
                title="After Harvesting"
                capitalGains={postHarvestingGains}
                savings={savings}
              />
            </div>

            <HoldingsTable
              holdings={holdings}
              selectedKeys={selectedKeys}
              onToggleRow={toggleRow}
              onToggleAll={toggleAll}
            />
          </>
        )}
      </main>
    </div>
  );
}
