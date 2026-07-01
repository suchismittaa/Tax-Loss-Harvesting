import { deriveGainSummary, formatINR } from "../utils/calculations";

export default function CapitalGainsCard({
  variant, // "pre" | "post"
  eyebrow,
  title,
  capitalGains,
  savings,
}) {
  const { netShortTerm, netLongTerm, realised } = deriveGainSummary(capitalGains);
  const cardClass = variant === "post" ? "gains-card gains-card--post" : "gains-card gains-card--pre";

  return (
    <section className={cardClass}>
      <header className="gains-card__header">
        <span className="gains-card__eyebrow">{eyebrow}</span>
        <h2 className="gains-card__title">{title}</h2>
      </header>

      <div className="gains-card__row gains-card__row--head">
        <span />
        <span>Profits</span>
        <span>Losses</span>
        <span>Net</span>
      </div>

      <div className="gains-card__row">
        <span className="gains-card__label">Short-term</span>
        <span className="mono gains-card__value--profit">{formatINR(capitalGains.stcg.profits)}</span>
        <span className="mono gains-card__value--loss">{formatINR(capitalGains.stcg.losses)}</span>
        <span className={`mono ${netShortTerm >= 0 ? "gains-card__value--profit" : "gains-card__value--loss"}`}>
          {formatINR(netShortTerm)}
        </span>
      </div>

      <div className="gains-card__row">
        <span className="gains-card__label">Long-term</span>
        <span className="mono gains-card__value--profit">{formatINR(capitalGains.ltcg.profits)}</span>
        <span className="mono gains-card__value--loss">{formatINR(capitalGains.ltcg.losses)}</span>
        <span className={`mono ${netLongTerm >= 0 ? "gains-card__value--profit" : "gains-card__value--loss"}`}>
          {formatINR(netLongTerm)}
        </span>
      </div>

      <div className="gains-card__realised">
        <span>Realised Capital Gains</span>
        <span className={`mono gains-card__realised-value ${realised >= 0 ? "gains-card__value--profit" : "gains-card__value--loss"}`}>
          {formatINR(realised)}
        </span>
      </div>

      {variant === "post" && savings > 0 && (
        <div className="gains-card__savings" role="status">
          <span className="gains-card__savings-dot" />
          You're going to save {formatINR(savings)}
        </div>
      )}
    </section>
  );
}
