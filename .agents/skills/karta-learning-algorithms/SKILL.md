---
name: karta-learning-algorithms
description: "Guidance for Karta's learning algorithms, including FSRS vocabulary scheduling, skill evidence, mastery concepts, recommendations, mixed review, and assessment signals."
---

You are responsible for Karta's learning algorithms, scheduling and evidence models.

Karta contains multiple learning domains with different memory and mastery properties. Do not force all of them into one algorithm.

Core principles:

1. Vocabulary memory scheduling and language-skill mastery are different problems.

Vocabulary:
- may use FSRS-style scheduling,
- individual card memory,
- due/overdue state,
- stability/difficulty concepts.

Grammar/reading/writing/listening/speaking:
- require skill evidence,
- multiple task types,
- recognition vs production,
- transfer,
- recency,
- repeated evidence.

Do not automatically apply vocabulary FSRS semantics to grammar skills.

2. Existing scheduler behavior is authoritative unless a specific algorithm change is approved.

3. Separate memory state from presentation scores.
A displayed mastery percentage should not silently become scheduler state.

4. Evidence quality matters.
Consider:
- number of attempts,
- exercise type,
- recognition vs recall,
- production,
- unseen assessment,
- recency,
- repeated errors,
- transfer.

5. Small samples must not generate strong conclusions.

6. Practice and assessment evidence are not equal.
Unseen assessment and independent production may be stronger evidence than repeated lesson items.

7. Avoid opaque global scores.
Keep domain signals interpretable.

8. Interleaving is important.
Once skills are individually introduced, mixed review should require learners to identify the appropriate structure rather than being told the topic in advance.

9. Recommendation logic should be deterministic and explainable unless an explicitly approved adaptive model replaces it.

10. Scheduled urgency and pedagogical weakness can compete.
Large overdue memory backlogs may dominate; tiny scheduled tasks do not automatically override severe well-evidenced weaknesses.

11. Recency should influence recommendations without erasing meaningful weakness.

12. User activity goals should be secondary modifiers, not the learning objective.

13. Historical event data should preserve historical truth.
Current mutable state may change; past review context should generally not be rewritten.

14. Concurrent progress updates must not lose evidence.

15. Algorithm changes require regression scenarios.
Before changing weights, thresholds or scheduling behavior:
- state the failing scenario,
- state intended behavior,
- add tests,
- make the smallest justified change.

16. Future mastery models should remain compatible with:
- skill graphs,
- multi-language learning tracks,
- mixed review,
- unseen assessment,
- listening/speaking evidence.

17. Do not claim empirical learning efficacy from synthetic tests.
Synthetic tests prove policy consistency, not educational effectiveness.

18. Future real learner telemetry may later inform tuning, but user privacy and data provenance must be preserved.

The goal is not algorithmic sophistication for its own sake.
The goal is reliable, explainable learning behavior.
