# Research index

These documents record the research and reasoning behind the Stress Monitoring
for Pilots system. They are written to be read in order, but each stands alone.

| # | Document | What it answers |
| --- | --- | --- |
| 01 | [Problem statement](01-problem-statement.md) | Why pilot stress and mental well-being matter for flight safety, and what the system is for. |
| 02 | [Literature review](02-literature-review.md) | What research says about stress, fatigue, and their effect on pilot performance. |
| 03 | [Assessment instruments](03-assessment-instruments.md) | The questionnaires and scales considered, and which were chosen. |
| 04 | [Regulatory landscape](04-regulatory-landscape.md) | What ICAO, FAA and EASA require or recommend about pilot fitness, fatigue and mental health. |
| 05 | [System design](05-system-design.md) | Architecture, data model, and the readiness scoring rules. |
| 06 | [Ethics and privacy](06-ethics-and-privacy.md) | Confidentiality, just culture, and the boundaries of a self-assessment tool. |
| 07 | [Roadmap](07-roadmap.md) | What could come next: wearables, HRV, operator integration. |
| – | [References](references.md) | Full list of sources cited across the documents. |

## Summary of design decisions

1. **Self-report first.** Validated questionnaires are cheap, transparent and
   have decades of evidence. Physiological sensing is a later addition, not a
   starting point.
2. **Transparent rules, not a black box.** Every readiness verdict lists the
   exact reasons that produced it, using thresholds drawn from published
   research and regulatory guidance.
3. **Local-only data.** Pilots will not use a tool they think can be used
   against them. Data never leaves the device unless the pilot exports it.
4. **Advisory, not authoritative.** The tool prompts reflection and
   conversation. The go/no-go decision stays with the pilot, the crew and the
   operator's existing processes.
