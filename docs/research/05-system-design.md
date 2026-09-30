# 05. System design and scoring model

## Design goals

1. **Simple.** No accounts, no server, no build tools. One HTML page, one
   stylesheet, one script.
2. **Transparent.** Every verdict lists its reasons. Every threshold is
   documented here and traceable to the literature.
3. **Private.** Data lives in the browser's local storage only.
4. **Advisory.** The tool informs the pilot's decision; it does not make it.

## Architecture

```
app/
  index.html   Four views: Check-in, Stress scale (PSS-10), Dashboard, About
  style.css    Light and dark theme, responsive down to phone width
  app.js       Scoring, storage, chart rendering (inline SVG), import/export
```

- **No dependencies.** Plain HTML, CSS and JavaScript. Charts are generated as
  inline SVG by the script, which keeps the page offline-capable and
  auditable.
- **Storage.** A single JSON document under the key `smp.v1` in
  `localStorage`, with the shape below. Reads and writes are wrapped in
  try/catch so the page still works if storage is unavailable.
- **Portability.** Export writes the whole store as a JSON file. Import
  merges a file by timestamp, so a pilot can move data between devices
  without duplicates.

## Data model

```json
{
  "checkins": [
    {
      "at": "2026-09-30T06:10:00.000Z",
      "imsafe": ["fatigue"],
      "sleep": 6,
      "awake": 3,
      "sp": 4,
      "pss4": 7,
      "notes": "",
      "state": "amber",
      "reasons": ["Fatigue is flagged on IM SAFE.", "6 h of sleep is below…"]
    }
  ],
  "pss": [
    { "at": "2026-09-28T19:00:00.000Z", "score": 15, "answers": [2,1,2,3,2,1,2,2,0,0] }
  ]
}
```

Storing the computed `state` and `reasons` alongside the raw inputs means
the history is stable even if the scoring rules change in a later version;
old entries keep the verdict they were shown at the time.

## Daily check-in

Four short sections, in this order, so that the hard no-go items come first:

1. **IM SAFE** (six checkboxes).
2. **Sleep and fatigue**: hours slept in last 24 h, hours awake at duty
   start, Samn-Perelli 1 to 7.
3. **PSS-4** (four Likert items).
4. **Notes** (free text, optional).

## Readiness rules

The verdict is the worst state triggered by any rule. All triggered reasons
are shown, red ones first.

| Input | Red | Amber | Basis |
| --- | --- | --- | --- |
| IM SAFE: Illness | flagged | | FAA IM SAFE; Part 67 medical standards |
| IM SAFE: Medication | flagged | | FAA IM SAFE; medication must be AME-cleared |
| IM SAFE: Alcohol | flagged | | 14 CFR 91.17 (8 h bottle-to-throttle, 0.04% BAC) and equivalents |
| IM SAFE: Stress | | flagged | FAA IM SAFE |
| IM SAFE: Emotion | | flagged | FAA IM SAFE |
| IM SAFE: Fatigue | | flagged | FAA IM SAFE; quantified by the rows below |
| Sleep in last 24 h | < 5 h | 5 to 6.5 h | Van Dongen et al. 2003; Hirshkowitz et al. 2015 |
| Hours awake at duty start | ≥ 17 h | 14 to 16.9 h | Dawson & Reid 1997 |
| Samn-Perelli | 6 to 7 | 4 to 5 | Samn & Perelli 1982; FRMS field-study convention |
| PSS-4 (0 to 16) | ≥ 12 | 8 to 11 | Proportional to PSS-10 bands (Cohen & Williamson 1988) |

Notes on the thresholds:

- **Sleep under 5 h.** Below about 5 h of sleep, next-day lapses on
  vigilance tasks rise sharply and the deficit accumulates across days.
  6.5 h was chosen as the amber ceiling because 7 h is the lower bound of
  the recommended range and half-hour input steps are used.
- **17 h awake.** The Dawson & Reid equivalence to 0.05% BAC. A pilot who
  begins duty at 17 h awake will be well past this before landing.
- **Samn-Perelli 6 to 7.** The convention in published FRMS studies is that
  crew at 6 or 7 should not be operating. 4 to 5 is where fatigue starts to
  be noticed and is worth monitoring.
- **PSS-4.** PSS-10's "high" band starts at 27 of 40 (67.5%); 67.5% of 16 is
  10.8, rounded up to 12 for a conservative red. "Moderate" starts at 14 of
  40 (35%); 35% of 16 is 5.6, but 8 (50%) was chosen for amber so that a
  single "sometimes" on every item does not trigger a warning on a check
  that is meant to be done daily.

## PSS-10 weekly assessment

Scored 0 to 40 with items 4, 5, 7 and 8 reverse-scored. Bands: 0 to 13 low,
14 to 26 moderate, 27 to 40 high. The result is shown with plain-language
guidance and, for moderate or high, a pointer to peer support and the AME.

## Dashboard

- **Summary tiles.** Count of check-ins, average sleep over 7 days, red days
  over 7 days, latest PSS-10.
- **Readiness bars.** One bar per check-in, colour and height by state, so
  that clusters of amber and red are visible at a glance.
- **Sleep and fatigue lines.** With shaded amber and red bands so the
  thresholds are visible without reading this document.
- **Stress line.** PSS-4 (daily) and PSS-10 (weekly) normalised onto a
  shared low/moderate/high axis.
- **History table** with per-entry delete, plus export, import and
  delete-all.

## Accessibility and usability

- Works at phone width with no horizontal scroll.
- Respects `prefers-color-scheme` for dark mode.
- Radio groups and tabs carry ARIA roles; results are announced with
  `aria-live`.
- All interactive elements have visible focus styles.

## Testing the scoring

The scoring functions are exposed on `window.SMP` so they can be exercised
from the browser console or a test harness, for example:

```js
SMP.assessReadiness({ imsafe: [], sleep: 4, awake: 2, sp: 3, pss4: 3 }).state  // "red"
SMP.assessReadiness({ imsafe: ['stress'], sleep: 7, awake: 2, sp: 3, pss4: 3 }).state  // "amber"
SMP.scorePss(SMP.PSS10, [0,0,0,4,4,0,4,4,0,0])  // 0
```

## Known limitations

- Self-report only. A pilot who is not honest with the tool gets nothing
  from it; the privacy design is the mitigation.
- Thresholds are drawn from group-level research and do not adapt to the
  individual. Personal baselines are a roadmap item.
- No circadian modelling: a 05:00 sign-on and a 14:00 sign-on with the same
  inputs get the same verdict. A biomathematical fatigue model is out of
  scope for a simple tool but is noted in the roadmap.
- Browser local storage can be cleared by the user or the browser. Export
  regularly.
