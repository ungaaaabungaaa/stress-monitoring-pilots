# Stress Monitoring for Pilots

A simple, privacy-first stress monitoring system that helps pilots assess and
manage their mental well-being before and between flights, supporting safer
flight operations.

> **Not a medical device.** This tool supports self-awareness and personal
> decision-making. It does not replace an aviation medical examiner, a
> company fatigue risk management system, or professional mental-health care.
> If you feel unsafe to fly, do not fly. If you are in crisis, contact local
> emergency services or a crisis line immediately.

## What it does

| Feature | Description |
| --- | --- |
| **Pre-flight check-in** | A two-minute daily check built on the FAA **IM SAFE** checklist, the **Samn-Perelli** fatigue scale, hours slept, and the 4-item Perceived Stress Scale (**PSS-4**). |
| **Readiness verdict** | Combines the answers into a **Green / Amber / Red** readiness state with a plain-language explanation of what drove the result. |
| **Weekly stress score** | The full 10-item Perceived Stress Scale (**PSS-10**) for a validated view of stress over the past month. |
| **Trend dashboard** | Charts of readiness, sleep, fatigue, and stress over time so patterns are visible before they become problems. |
| **Local-only data** | Everything stays in the browser's local storage. Nothing is uploaded. Data can be exported as JSON or deleted at any time. |

## Run it

There is no build step and no server. Open `app/index.html` in any modern
browser, or serve the folder locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/app/
```

## Project layout

```
app/
  index.html      Single-page application
  style.css       Styling (light and dark mode)
  app.js          Check-in logic, scoring, storage, charts
docs/
  research/       Research documents behind the design (see index below)
```

## Research documents

The system's design is grounded in published research and regulatory
guidance. Start with the index at [`docs/research/README.md`](docs/research/README.md).

1. [Problem statement](docs/research/01-problem-statement.md)
2. [Literature review: stress, fatigue and pilot performance](docs/research/02-literature-review.md)
3. [Assessment instruments](docs/research/03-assessment-instruments.md)
4. [Regulatory landscape](docs/research/04-regulatory-landscape.md)
5. [System design and scoring model](docs/research/05-system-design.md)
6. [Ethics, privacy and just culture](docs/research/06-ethics-and-privacy.md)
7. [Roadmap](docs/research/07-roadmap.md)
8. [References](docs/research/references.md)

## Scoring at a glance

The check-in produces a readiness state using simple, transparent rules
(full details in the [system design doc](docs/research/05-system-design.md)):

- **Red**: any of Illness, Medication, or Alcohol flagged on IM SAFE; less
  than 5 hours of sleep; Samn-Perelli fatigue of 6 or 7; or PSS-4 of 12+.
- **Amber**: Stress or Emotion flagged on IM SAFE; 5 to 6.5 hours of sleep;
  Samn-Perelli of 4 or 5; or PSS-4 of 8 to 11.
- **Green**: none of the above.

Thresholds are intentionally conservative and are meant to prompt a
conversation, not to make the go/no-go decision for you.

## License

MIT
