---
name: jev-evidence-eval
description: Measures a TypeSafe Jev evidence or classification workflow for accuracy on accepted cases, review rate and coverage, abstention, latency, usage and cost, with source receipts, missing evidence and contradictions in the test set. Use when checking whether a Jev decision or a cited claim is supported by supplied text, choosing or sweeping a confidence threshold, or comparing a Jev workflow against an existing classifier or LLM.
license: MIT
---

# Evaluate decisions against evidence

Read the live [TypeSafe API](https://docs.typesafe.ai/api) and
[confidence guide](https://docs.typesafe.ai/confidence) before implementing requests.
The official [typesafe-ai skill](https://github.com/typesafe-ai/skills) covers broader integrations.

Define the claim and the complete candidate passages. Keep expected labels outside model state.
Ask an independent question per passage. To accept or flag a citation, a binary Noul on whether
the passage fully supports the claim beat a supports / contradicts / irrelevant Choice in a
measured Finnish test; keep the Choice when contradiction and silence need different handling.
Preserve entity, time, qualifiers and scope. Missing evidence does not establish a negative.

Copy receipt text from source spans in code. A verbatim receipt proves where text came from,
not that the model's interpretation is correct. Retain contradictory passages and an explicit
review outcome. For long documents, measure retrieval coverage separately; omitted evidence
cannot be recovered by a classifier. Adjacent context may be necessary for pronouns and exceptions.

Measure end-to-end latency, returned model version, usage, and errors separately from accuracy.
Report coverage alongside accuracy on accepted cases, and recall per failure type. Spend cases on
the types that separate systems: in a [Finnish citation test](https://github.com/laguagu/jev-rerank-bench/blob/main/verify/results/hard/report.md)
every hosted model scored 96–99% on plain supports / contradicts / silent claims, while dropped
conditions and *may* turned into *must* separated them, and an 88% overall hid a 50% catch rate on
the latter. Use balanced accuracy when supported and unsupported cases are uneven. Sweep the
threshold (a Noul's probability, or confidence) on a development set, for example with
[jevcal](https://github.com/abhixhek/jevcal), and set one per outcome by the cost of its error:
stricter for an answer that acts than for one that only reorders a list. Then test the frozen
policy on unseen cases written after the questions, rules and thresholds, naming entities that
none of them mentions; rules written beside the first cases fit those cases. Generated test sets
can flatter: batched Jev scored 96.5% on LLM-written queries and 56.9% on human questions over a
different corpus, an observed gap rather than a measured bias. Repeated calls on the same
examples measure stability, not independent sample size. Confidence is not chosen-label
probability and neither is a domain accuracy guarantee.

For an LLM comparison, the official [System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python)
answers the same Python request with OpenAI, Anthropic, or Gemini. Pin both models, alternate
the arms over the same cases, and count retries and malformed outputs as part of the baseline's cost.
Measure a cascade as a third arm: Jev decides, and only its uncertain or flagged cases go to the LLM.

Include missing facts, explicit denials, conflicting passages, different entities, negation,
future plans, numerical mismatches, dropped conditions, changes between allowed and required,
sound inferences that should pass, and instructions embedded in documents. Record failures.
Use synthetic fixtures for public examples; do not publish customer material or secrets.

Apply this procedure to the user's existing harness. Build a dry run that prints requests without
network access, keep the raw answers with the model version and usage, and replay the policy from
saved results so a threshold change costs nothing.
