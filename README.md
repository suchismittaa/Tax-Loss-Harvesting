# 📊 Tax Loss Harvesting — KoinX Frontend Intern Assignment

A React app that helps a crypto investor see, in real time, how selling specific
holdings before the financial year ends ("harvesting" losses) reduces their
taxable capital gains.

**Live demo:** https://tax-loss-harvesting-ashy.vercel.app/
**Figma reference:** [KoinX Frontend Intern Assignment](https://www.figma.com/design/3YqHlvx1X59Nb3iP97BGkG/KoinX-Frontend-Intern-Assigment)

---

## ✨ Features

- **Pre-Harvesting card** — renders current short-term / long-term profits,
  losses, net gains, and total realised capital gains from the Capital Gains API.
- **After-Harvesting card** — recalculates live as holdings are selected/deselected,
  and surfaces a "You're going to save ₹X" banner only when harvesting actually
  reduces the tax bill.
- **Holdings table** — sortable by portfolio value, per-row + select-all checkboxes,
  "Amount to Sell" auto-fills with the full balance on selection, and a
  "View all holdings" toggle for long portfolios.
- **Loading & error states** for both mock API calls, with retry.
- **Fully responsive** — cards stack and the table scrolls horizontally on mobile.

## 🛠 Tech stack

- React 18 + Vite
- Plain CSS with a small design-token system (`src/App.css`) — no UI framework
- Mock APIs built with native Promises + `setTimeout` to simulate real network latency

## 🚀 Getting started

```bash
git clone https://github.com/<your-username>/tax-loss-harvesting.git
cd tax-loss-harvesting
npm install
npm run dev       # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

## 📁 Project structure

```
src/
  api/
    holdingsData.js       # dummy Holdings API payload (as given in the brief)
    capitalGainsData.js   # dummy Capital Gains API payload (as given in the brief)
    mockApi.js            # fetchHoldings() / fetchCapitalGains() — promise-based, artificial delay
  components/
    CapitalGainsCard.jsx  # renders both the Pre- and Post-harvesting cards
    HoldingsTable.jsx     # sortable table, row + select-all checkboxes, "View all"
    Loader.jsx
    ErrorState.jsx
  utils/
    calculations.js       # all capital-gains math, isolated from the UI and unit-testable
  App.jsx                 # data fetching + state, wires cards <-> table together
  App.css                 # design tokens + all component styling
  main.jsx / index.css
```

## 🧮 How the numbers work

- **Pre-Harvesting card** renders the Capital Gains API response as-is:
  `Net = profits - losses` per bucket, `Realised = Net ST + Net LT`.
- **After Harvesting card** starts from the same base numbers. For every **selected**
  holding, its `stcg.gain` and `ltcg.gain` are folded in independently:
  - `gain > 0` → added to that bucket's `profits`
  - `gain < 0` → its magnitude is added to that bucket's `losses`
  - `gain === 0` → ignored
- The savings banner (`You're going to save ₹X`) only appears when
  `Pre-harvesting Realised Gains > Post-harvesting Realised Gains`.
- This logic lives entirely in `src/utils/calculations.js`, independent of React state,
  so it's easy to verify against the worked example in the assignment brief.

## 📝 Assumptions

- Since two holdings in the dummy data share the symbol `USDC` (native vs. bridged), each
  row is keyed by `${coin}-${index}` rather than by coin symbol, so both remain independently
  selectable.
- "Amount to Sell" is populated with the holding's full `totalHolding` balance the moment a
  row is checked (the brief doesn't call for partial-sell input, so full balance is assumed).
- Holdings with a `0` gain (both `stcg` and `ltcg` balance = 0) show as `—` since there's
  nothing to harvest for that leg.
- Holdings are sorted by current ₹ value (`totalHolding × currentPrice`) descending, so the
  investor sees their biggest positions first. The table defaults to the top 8 rows with a
  "View all" toggle to expand the full list (bonus requirement).
- No real backend — both APIs are mocked with `Promise` + `setTimeout` (~700–850ms) to make
  the loading state visible and testable. Flip `SIMULATE_ERROR` in `src/api/mockApi.js` to
  `true` to exercise the error/retry state.

## 📸 Screenshots

_Add screenshots here after deploying (desktop + mobile views of both cards and the table)._

## ☁️ Deployment

Static build via Vite (`npm run build` → `dist/`), suitable for Netlify or Vercel:

- **Netlify**: drag-and-drop the `dist/` folder, or connect the repo with build command
  `npm run build` and publish directory `dist`.
- **Vercel**: import the repo — the "Vite" framework preset is auto-detected.

## 📄 License

Licensed under the [MIT License](./LICENSE).

## 👩‍💻 Author

**Suchismita Sarkar**
- Portfolio: [suchismitasportfolio.netlify.app](https://suchismitasportfolio.netlify.app/)
- LinkedIn: [linkedin.com/in/suchismitasarkar222](https://www.linkedin.com/in/suchismitasarkar222/)
