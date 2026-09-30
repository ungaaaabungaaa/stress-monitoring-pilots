# 02. Literature review: stress, fatigue and pilot performance

This review summarises what is known about how stress and fatigue affect the
capacities that flying depends on, and what that implies for a monitoring
system. It is a working summary, not an exhaustive survey. Full citations are
in [references.md](references.md).

## 1. What "stress" means here

Stress is the response of the body and mind to demands that are perceived to
exceed the resources available to meet them (Lazarus & Folkman, 1984). Three
distinctions matter for pilots:

| Type | Time scale | Example | Main effect on flying |
| --- | --- | --- | --- |
| **Acute** | Seconds to hours | Engine failure, severe turbulence, ATC conflict | Attentional narrowing, faster but shallower decisions |
| **Chronic** | Weeks to months | Rostering, job insecurity, family or financial pressure | Poor sleep, irritability, reduced coping reserve, depression risk |
| **Cumulative fatigue** | Days to weeks | Consecutive early starts, time-zone crossings | Slowed reactions, lapses, microsleeps |

Acute stress is largely handled by training, procedures and crew resource
management. The monitoring problem is mostly about the second and third rows:
the slow, hidden accumulation that a pilot may not notice until it shows up
as an error.

## 2. The performance relationship

The Yerkes-Dodson law (1908) describes an inverted-U relationship between
arousal and performance: a moderate level of activation helps, while too
little (boredom, fatigue) and too much (panic, overload) both hurt. Later
work refined this: high arousal impairs complex, novel tasks sooner than
simple, well-practised ones (Easterbrook, 1959). Flying under normal
conditions is well-practised; handling an abnormal situation is not. A
stressed pilot therefore looks fine right up until something unusual happens.

Specific, replicated effects of acute stress and high workload include:

- **Attentional tunnelling.** Fewer cues are sampled, and attention locks on
  the most salient one (Easterbrook, 1959; Wickens, 2002). The classic
  aviation example is a crew fixating on a landing-gear indicator light while
  the aircraft descends into terrain (Eastern Air Lines 401, 1972).
- **Working memory loss.** Stress hormones interfere with prefrontal
  function; capacity for holding and manipulating information drops (Arnsten,
  2009).
- **Decision-making shifts.** People under stress rely more on habit and
  heuristics, consider fewer options and commit earlier (Starcke & Brand,
  2012).
- **Communication reduction.** Stressed crews issue fewer and shorter
  utterances and are less likely to challenge each other (Sexton & Helmreich,
  2000).

## 3. Fatigue and sleep loss

Fatigue research is better quantified than stress research and provides most
of the hard thresholds used in this system.

- **Time awake.** After 17 hours awake, performance on psychomotor tasks is
  equivalent to a blood alcohol concentration of 0.05%; after about 24 hours,
  to 0.10% (Dawson & Reid, 1997; Williamson & Feyer, 2000). Most jurisdictions
  set the drink-driving limit at or below 0.05%.
- **Chronic restriction.** Sleeping 6 hours per night for two weeks produces
  cognitive deficits equivalent to two full nights of total sleep deprivation,
  and participants do not perceive how impaired they are (Van Dongen et al.,
  2003). This is why self-rated fatigue must be paired with an objective
  question about hours slept.
- **Circadian timing.** Alertness is lowest in the window of circadian low
  (roughly 02:00 to 06:00 body-clock time) and there is a secondary dip in
  the early afternoon (ICAO Doc 9966). Duty that crosses this window is
  higher-risk regardless of hours slept.
- **Sleep need.** Most adults need 7 to 9 hours per night for full alertness
  (Hirshkowitz et al., 2015; Watson et al., 2015).
- **Subjective scales.** The Samn-Perelli seven-point fatigue scale (Samn &
  Perelli, 1982) and the Karolinska Sleepiness Scale (Åkerstedt & Gillberg,
  1990) are the two instruments most used in airline fatigue studies and in
  fatigue risk management systems. In field studies, Samn-Perelli ratings of
  6 or 7 are generally treated as indicating that the pilot should not be on
  duty (Powell et al., 2007; Gander et al., 2014).

## 4. Chronic stress and mental health in pilots

- Wu et al. (2016) surveyed 1,848 airline pilots anonymously: 12.6% screened
  positive for depression (PHQ-9 ≥ 10), 4.1% reported suicidal thoughts
  within the past two weeks, and higher scores were associated with sleep
  medication use and harassment at work.
- Pasha & Stokes (2018) reviewed the literature after Germanwings 9525 and
  concluded that the prevalence of depression among pilots is likely similar
  to the general population, that pilots strongly under-report because of
  medical certification consequences, and that non-punitive support pathways
  are the key intervention.
- Cahill et al. (2021) studied pilot work-related stress in Europe and found
  that the majority reported stress affecting their well-being, with common
  coping mechanisms including exercise, social support and, less helpfully,
  alcohol.
- Occupational stressors specific to pilots include irregular rostering,
  time-zone disruption, commuting, being away from family, contract
  insecurity, and the medical-certification "double bind" in which seeking
  help can cost you your licence (Bor et al., 2016).

## 5. Physiological markers

Heart rate variability (HRV) is the most studied physiological correlate of
stress. Reduced vagally-mediated HRV is associated with acute stress, chronic
stress, anxiety and depression (Thayer et al., 2012; Kim et al., 2018). HRV is
now available from consumer wearables. However:

- HRV varies substantially between individuals, so it is only meaningful
  against a personal baseline.
- It is confounded by fitness, illness, alcohol, caffeine, posture and time
  of day.
- Consumer devices differ in accuracy, and their algorithms are proprietary.

The evidence supports HRV as a **supplementary trend signal** once a baseline
exists, not as a stand-alone readiness measure. See the [roadmap](07-roadmap.md).

## 6. What works to reduce stress and fatigue

Interventions with reasonable evidence in aviation or comparable shift-work
populations:

- **Sleep protection.** Prioritising sleep opportunity, controlled rest
  where permitted, and strategic napping (Rosekind et al., 1994).
- **Fatigue risk management systems.** Data-driven, non-punitive systems that
  treat fatigue reports as safety data (ICAO Doc 9966; FAA AC 120-103A).
- **Peer support programmes.** Confidential pilot-to-pilot support has
  strong face validity and is now mandated in Europe; early evaluations show
  high uptake when confidentiality is credible (EASA, 2016; EPPSI).
- **Exercise and social support.** Both are consistently associated with
  lower perceived stress and better sleep (Cahill et al., 2021).
- **Self-monitoring.** In broader health research, regular self-monitoring
  increases awareness and is a prerequisite for behaviour change; the effect
  is strongest when feedback is immediate and specific (Michie et al., 2009).

## 7. Implications for the system

1. Ask about **hours slept and hours awake** objectively, because people
   underestimate their own impairment.
2. Use **Samn-Perelli** for momentary fatigue, with 6 to 7 as a hard stop.
3. Use the **Perceived Stress Scale** for chronic stress, because it is
   validated, short, and measures appraisal rather than diagnosis.
4. Keep the **IM SAFE** structure, because pilots already know it and it
   covers illness, medication and alcohol, which questionnaires do not.
5. Show **trends**, because cumulative fatigue and chronic stress are
   invisible day to day.
6. Make the tool **private and non-punitive**, because otherwise pilots will
   not answer honestly.
7. Treat physiological data as a **future enhancement**, not a foundation.
