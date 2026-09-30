# 07. Roadmap

The current system is deliberately minimal. This document lists candidate
additions in rough priority order, with the evidence or reasoning behind
each and the conditions under which it should be added.

## Near term (no new infrastructure)

### Psychomotor Vigilance Task (PVT)

A 3 to 5 minute reaction-time task is the gold-standard objective measure of
fatigue-related vigilance impairment (Dinges & Powell, 1985; Basner & Dinges,
2011). A browser implementation is straightforward. It would provide an
objective cross-check on Samn-Perelli and sleep hours, addressing the
"people don't know how impaired they are" problem directly. Caveats: browser
timing jitter, and practice effects, so a personal baseline is needed.

### Personal baselines

Show each metric against the pilot's own 30-day median rather than fixed
thresholds alone. A pilot who normally rates Samn-Perelli 2 and reports 4
today is drifting even though 4 is only amber.

### Karolinska Sleepiness Scale and 48-hour sleep

Add KSS and "sleep in the last 48 hours" as optional fields to match typical
FRMS fatigue report forms, making it easier for a pilot to file a fatigue
report from their own records.

### Optional PIN lock

For shared devices. Client-side only.

### Reminders

A local notification at a chosen time, using the browser Notifications API.
No server involved.

## Medium term (optional integrations, always opt-in)

### Heart rate variability from wearables

HRV is a well-supported correlate of stress load (Thayer et al., 2012; Kim
et al., 2018), and overnight HRV from consumer wearables is a reasonable
trend signal once a personal baseline exists. Integration would be via
import of exported data (for example a CSV from a watch app) rather than a
live API, to keep the local-only model intact. HRV should feed the dashboard
as a trend, not the readiness verdict, until there is evidence for a
threshold.

### Sleep data from wearables

Same approach: import exported sleep records to pre-fill hours slept and
show sleep regularity. Consumer sleep staging is unreliable, but total sleep
time is reasonably accurate (de Zambotti et al., 2019).

### Circadian awareness

Ask for planned duty start and end (local and home-base time) and show the
overlap with the window of circadian low. A full biomathematical model
(SAFTE, FAID, BAM) is out of scope, but the simple overlap is useful and
cheap.

### Occasional clinical screens with signposting

Offer PHQ-9 and GAD-7 as optional monthly modules, with results shown
alongside clear, jurisdiction-appropriate pointers to peer support and
clinical help. This must be reviewed against the ethics document before
release, and must never affect the daily verdict.

## Longer term (would change the trust model; needs careful design)

### Peer support hand-off

A one-tap "share my last 30 days with my peer support volunteer" that
generates a PDF or JSON for the pilot to send themselves. The tool would
still not transmit anything; the pilot would.

### Aggregated, anonymous operator insight

Operators run FRMS on exactly this kind of data. An anonymised, aggregated,
opt-in export (for example, weekly counts of red days across a fleet, with
k-anonymity guarantees) could support rostering decisions without exposing
any individual. This is the point at which the local-only guarantee would be
relaxed, so it would require a separate design and consultation with pilot
representatives.

### Formal evaluation

A field study with real crews, comparing self-reported usefulness,
honesty of reporting, and help-seeking behaviour against a control group,
with ethics approval. Until such a study exists, the tool's claims should
stay modest.

## Explicitly out of scope

- Any form of automatic reporting to employers or regulators.
- Diagnosis of any medical or psychiatric condition.
- Replacing an operator's FRMS or a regulator's medical certification.
- Real-time in-flight monitoring. That is a different problem with different
  constraints, and the evidence base for it in civil aviation is still
  immature.
