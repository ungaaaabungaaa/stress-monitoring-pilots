# 03. Assessment instruments

This document lists the instruments considered for the system, why each was
included or excluded, and exactly how the chosen ones are scored.

## Selection criteria

1. **Validated** in peer-reviewed research, ideally in aviation or shift-work
   populations.
2. **Short.** The daily check-in must take under two minutes or it will not be
   done.
3. **Freely usable.** No licence fees, so the tool can be open source.
4. **Transparent scoring** that can be explained to the pilot in one sentence.
5. **Non-diagnostic** for daily use. Screening for clinical conditions belongs
   with professionals, not with a pre-flight app.

## Instruments chosen

### IM SAFE personal checklist

**Source.** FAA, *Pilot's Handbook of Aeronautical Knowledge* (FAA-H-8083-25)
and *Risk Management Handbook* (FAA-H-8083-2). Also taught in EASA and other
training syllabi.

**Items.** Illness, Medication, Stress, Alcohol, Fatigue, Emotion. Each is a
yes/no self-check.

**Why.** Every pilot already knows it. It covers three items (illness,
medication, alcohol) that stress questionnaires do not, and each of those is
a regulatory no-go on its own.

**Scoring in this system.** Illness, Medication or Alcohol flagged → Red.
Stress, Emotion or Fatigue flagged → Amber. Fatigue is additionally measured
by the Samn-Perelli scale and sleep hours, which can raise it to Red.

**Limitations.** Binary, unvalidated as a psychometric instrument, and
depends entirely on honest self-report. It is a checklist, not a scale.

### Samn-Perelli fatigue scale

**Source.** Samn & Perelli (1982), developed for the United States Air Force
School of Aerospace Medicine. Widely used in airline fatigue studies and in
FRMS data collection (Powell et al., 2007; Gander et al., 2014).

**Items.** A single seven-point rating:

| Score | Descriptor |
| --- | --- |
| 1 | Fully alert, wide awake |
| 2 | Very lively, responsive, but not at peak |
| 3 | Okay, somewhat fresh |
| 4 | A little tired, less than fresh |
| 5 | Moderately tired, let down |
| 6 | Extremely tired, very difficult to concentrate |
| 7 | Completely exhausted, unable to function effectively |

**Why.** One question, aviation-specific, extensively used, and with an
informal but widely applied convention that 6 to 7 means unfit for duty.

**Scoring in this system.** 6 to 7 → Red. 4 to 5 → Amber. 1 to 3 → no flag.

### Sleep and wake questions

**Source.** Derived from fatigue research thresholds (Dawson & Reid, 1997;
Van Dongen et al., 2003; Hirshkowitz et al., 2015) and typical FRMS fatigue
report forms, which ask for sleep in the prior 24 and 48 hours and time
awake at duty start.

**Items.** Hours slept in the last 24 hours; hours awake at start of duty.

**Why.** Objective anchors that counter the well-documented tendency to
under-perceive one's own sleep-loss impairment.

**Scoring in this system.**

| Measure | Amber | Red |
| --- | --- | --- |
| Sleep in last 24 h | 5 to 6.5 h | under 5 h |
| Hours awake at duty start | 14 to 16.9 h | 17 h or more |

### Perceived Stress Scale (PSS-10 and PSS-4)

**Source.** Cohen, Kamarck & Mermelstein (1983); the 10-item and 4-item
versions are from Cohen & Williamson (1988). It is the most widely used
measure of perceived stress and is free for non-commercial research and
educational use.

**Items.** Respondents rate how often in the last month they have felt or
thought a certain way, on a 0 (never) to 4 (very often) scale. The PSS-10 has
ten items, four of them positively worded and reverse-scored. The PSS-4 is
items 2, 4, 5 and 10 of the PSS-10, with items 4 and 5 reverse-scored.

**Scoring.** PSS-10 total 0 to 40. Conventional bands are 0 to 13 low, 14 to
26 moderate, 27 to 40 high. PSS-4 total 0 to 16; no official bands exist, so
this system scales the PSS-10 bands proportionally and rounds conservatively:
0 to 7 low, 8 to 11 elevated, 12 to 16 high.

**Why.** Validated, short, measures appraisal of stress rather than symptoms
of a disorder (so it is not a clinical screen), and has population norms.

**Scoring in this system.** PSS-4 is in the daily check-in: 12+ → Red, 8 to
11 → Amber. PSS-10 is a separate weekly assessment shown on the dashboard.

**Limitations.** Asks about the last month, so it moves slowly and is not a
measure of today's state. That is why it is paired with the momentary items
above.

## Instruments considered and not used (for now)

| Instrument | Reason not used |
| --- | --- |
| **Karolinska Sleepiness Scale (KSS)** | Excellent, but measures sleepiness rather than fatigue and would duplicate Samn-Perelli in a two-minute check-in. A candidate for a longer version. |
| **PHQ-9 / GAD-7** | Clinical screens for depression and anxiety. Valuable, but a positive result needs a professional conversation, and a daily app is the wrong place to deliver it. Could be offered as an occasional optional module with clear signposting. |
| **DASS-21** | Same reasoning as PHQ-9. |
| **Maslach Burnout Inventory** | Licensed, and burnout is a longer-horizon construct than the tool addresses. |
| **NASA-TLX** | Measures task workload after a task, not readiness before one. |
| **Psychomotor Vigilance Task (PVT)** | The gold-standard objective fatigue test. A 3 to 5 minute reaction-time task is feasible in a browser and is a strong roadmap item. |
| **Heart rate variability** | Requires a wearable and a personal baseline. See the roadmap. |
| **Epworth Sleepiness Scale** | Trait measure of daytime sleepiness, useful for screening sleep disorders rather than daily readiness. |

## Combined readiness verdict

The verdict is the **worst** state produced by any item, with all reasons
listed. This is deliberately simple. A weighted score would look more
sophisticated but would hide which item drove the result, and there is no
validated weighting to justify it. The full rules are in
[05-system-design.md](05-system-design.md).
