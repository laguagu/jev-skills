---
name: jev-evidence-eval
description: Measures a TypeSafe Jev evidence or classification workflow for accuracy on accepted cases, review rate and coverage, abstention, latency, usage and cost, with source receipts, missing evidence and contradictions in the test set. Use when checking whether a Jev decision is supported by supplied text, choosing or sweeping a confidence threshold, or comparing a Jev workflow against an existing classifier or LLM.
license: MIT
---

# Evaluate decisions against evidence

Read the live [TypeSafe API](https://docs.typesafe.ai/api) and
[confidence guide](https://docs.typesafe.ai/confidence) before implementing requests.
The official [typesafe-ai skill](https://github.com/typesafe-ai/skills) covers broader integrations.

Define the claim and the complete candidate passages. Keep expected labels outside model state.
Ask independent Choice questions for each passage: supports, contradicts or irrelevant.
Preserve entity, time, qualifiers and scope. Missing evidence does not establish a negative.

Copy receipt text from source spans in code. A verbatim receipt proves where text came from,
not that the model's interpretation is correct. Retain contradictory passages and an explicit
review outcome. For long documents, measure retrieval coverage separately; omitted evidence
cannot be recovered by a classifier. Adjacent context may be necessary for pronouns and exceptions.

Measure end-to-end latency, returned model version, usage, and errors separately from accuracy.
Report coverage alongside accuracy on accepted cases. Sweep confidence thresholds on a
development set, then evaluate the chosen policy on unseen labelled data. Repeated calls on the
same examples measure stability, not independent sample size. Confidence is not chosen-label
probability and neither is a domain accuracy guarantee.

For an LLM comparison, the official [System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python)
answers the same Python request with OpenAI, Anthropic, or Gemini. Pin both models, alternate
the arms over the same cases, and count retries and malformed outputs as part of the baseline's cost.

Include missing facts, explicit denials, conflicting passages, different entities, negation,
future plans, numerical mismatches and instructions embedded in documents. Record failures.
Use synthetic fixtures for public examples; do not publish customer material or secrets.

Apply this procedure to the user's existing harness. Build a dry run that prints requests without
network access, keep the raw answers with the model version and usage, and replay the policy from
saved results so a threshold change costs nothing.
