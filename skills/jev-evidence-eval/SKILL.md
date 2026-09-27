---
name: jev-evidence-eval
description: Evaluates TypeSafe Jev evidence and classification workflows for accuracy, review coverage, latency and cost. Use when testing citation support, choosing confidence thresholds or comparing a Jev workflow with a classifier or LLM.
license: MIT
---

# Evaluate decisions against evidence

Use the current [TypeSafe API](https://docs.typesafe.ai/api) and
[confidence guide](https://docs.typesafe.ai/confidence) when implementing requests.

Define the claim and candidate passages; keep expected labels outside model state. Use a Noul
for whether a passage fully supports a claim, or a Choice when code must distinguish support,
contradiction and silence. Include entity, time, qualifiers and scope. Missing evidence is not a denial.
Copy receipts from source spans in code; a verbatim receipt establishes provenance, not correctness.
Measure retrieval coverage separately from the judgments on retrieved passages.

Include ordinary cases, missing facts, contradictions, negation, different entities, numerical
mismatches, dropped conditions, changes from allowed to required, valid inferences and instructions
embedded in documents. Keep synthetic fixtures public and customer inputs private.

Sweep thresholds on development cases and freeze the policy before testing unseen cases.
Report accuracy on accepted cases together with review rate, coverage and errors per category.
Use balanced accuracy for uneven classes. Neither confidence nor a chosen-label probability
is an accuracy guarantee, and repeated calls do not increase the number of independent cases.

Compare against the existing workflow on matching inputs. For an LLM baseline, the
[System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python) accepts the same
Python requests. Evaluate escalation to an LLM as a separate arm and count its cost and latency.
Pin model versions, alternate the arms, and include retries, malformed outputs and service errors.

Use the user's existing harness. Provide an offline dry run and save answers, returned model
versions and usage so policy changes can be replayed without new calls. Deliver a report with
case counts, accuracy, coverage, end-to-end latency, cost and representative failures.
