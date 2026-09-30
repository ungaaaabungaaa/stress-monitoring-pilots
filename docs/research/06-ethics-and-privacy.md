# 06. Ethics, privacy and just culture

## The central tension

Any tool that asks a pilot about stress, sleep, alcohol or mood creates data
that could, in principle, be used to ground them. The research is unambiguous
that this fear suppresses honest reporting and help-seeking (Pasha & Stokes,
2018; Bor et al., 2016; Wu et al., 2016). A stress monitoring system that
pilots do not trust will either be ignored or gamed, and either way it makes
nobody safer.

The design therefore starts from the pilot's interests and works outward.

## Principles

### 1. The pilot owns the data

- All data is stored only in the pilot's browser. There is no server, no
  account and no telemetry.
- The pilot can export, import and delete everything at any time.
- Nothing in the code base transmits data. This is verifiable by reading
  the three source files.

### 2. Advisory, never authoritative

- The tool gives a readiness state and reasons. It does not certify fitness,
  and a Green result must never be treated as proof that a pilot was fit.
- Conversely a Red result is a prompt to stop and think and to talk to
  someone. It is not evidence of unfitness in any formal sense.
- The About view and every verdict say this explicitly.

### 3. Non-punitive by construction

- Because data never leaves the device, an operator cannot require it, audit
  it or act on it. Should an operator wish to deploy the tool, the intended
  model is that of a **support programme**: the pilot uses it privately and
  chooses whether to share anything, with whom, and when.
- If a future version adds any sharing, it must be opt-in per event, with the
  pilot seeing exactly what is shared, and it should go to a peer support
  programme or the pilot's own clinician, not to line management.

### 4. Signpost, do not diagnose

- The daily check-in avoids clinical screening instruments (PHQ-9, GAD-7)
  precisely because a positive screen needs a human conversation.
- High PSS-10 results and Red verdicts point the pilot toward peer support,
  the aviation medical examiner and, where relevant, crisis services.
- The tool never claims to detect depression, anxiety or any disorder.

### 5. Just culture

The system is designed to be compatible with a just-culture safety
environment (Dekker, 2016; ICAO Annex 19), in which:

- reporting fatigue or stress is treated as safety information, not
  misconduct;
- calling in unfit is a professional decision that is supported, not
  penalised; and
- the organisation looks for systemic causes (rostering, workload) rather
  than blaming individuals.

The wording of every verdict is chosen to reinforce this. Red says "calling
in unfit is a professional decision, not a failure".

## Specific risks and mitigations

| Risk | Mitigation |
| --- | --- |
| A pilot relies on a Green result instead of their own judgement | Every result carries a disclaimer; the About view explains the limits; thresholds are conservative so Green is not easy to get with real problems present. |
| A pilot with a genuine mental-health problem is not helped | Red and high-PSS results include clear pointers to help; crisis wording is in the About view. The tool is a door, not a treatment. |
| Data is seen by someone else on a shared device | Documented in About; delete-all is one click; a future version can add an optional PIN. |
| Operator misuses the tool as a surveillance mechanism | No sharing exists to misuse. This is a deliberate architectural choice, not a policy. |
| Thresholds are wrong for an individual | Reasons are shown so the pilot can disagree with a specific rule; personal baselines are on the roadmap. |
| The tool is mistaken for a regulated medical device | It is clearly labelled as not one, makes no diagnostic claims, and is not marketed for clinical use. |

## Regulatory note on medical devices

Software intended for diagnosis, prevention, monitoring or treatment of
disease can fall under medical device regulation (for example the EU MDR
2017/745 or the FDA's software-as-a-medical-device framework). This tool is
positioned as a general wellness and self-awareness aid, which both regimes
treat differently from clinical software. Any future feature that claims to
detect a condition would change that position and must be reviewed before
release.

## Research ethics for future evaluation

If the tool is evaluated with real pilots, the study should have ethics
approval, informed consent, anonymised data collection separate from the
tool itself, and a clear statement that participation has no effect on
employment or medical certification.
