---
name: jev-evidence-workflow
description: Builds source-backed fact or claim decisions with TypeSafe Jev, preserving exact text receipts and handling missing or conflicting evidence. Use when implementing document fact selection, answer verification or evidence triage.
license: MIT
---

# Build decisions with source receipts

Read the current [TypeSafe API](https://docs.typesafe.ai/api),
[confidence guide](https://docs.typesafe.ai/confidence) and
[citation cookbook](https://docs.typesafe.ai/cookbooks/citation_check).
For broader API and SDK work, use the [official skill](https://github.com/typesafe-ai/skills).

Choose the shape that matches the user's application:

- **Claim checking:** give each candidate passage an independent Choice question: supports,
  contradicts or irrelevant. Preserve both supporting and contradicting passages.
- **Fact selection:** ask YES / NO / NOT_STATED or a defined taxonomy with an unknown option.
  In a second request, select source-span IDs that establish the chosen fact, with explicit
  no-evidence and conflicting-evidence options. A negative needs an explicit denial; silence
  is NOT_STATED. Do not ask a parallel question to read another question's answer.

Build span candidates in code and copy selected text from the original source. Preserve offsets,
document identity and context. Never ask Jev to generate a quote or accept an arbitrary returned
string as a source ID. Validate the answer keys, allowed choices and numerical metadata before
using them. Unresolved references, time qualifiers and contradictory passages require review.

A verbatim span check establishes provenance only. Even an exact quote may support a different
entity or time period. If multiple passages jointly establish a fact, retain the set or escalate;
do not present one convenient sentence as complete evidence. Retrieval coverage is a separate
measurement: a classifier cannot judge evidence it never receives.

Keep business rules and execution in code. Preserve existing evidence checks and authorization
boundaries. Treat confidence and chosen-option probability as different signals; neither proves
the fact. Set review rules based on the application's consequences, and calibrate thresholds on
labelled examples before treating them as reliable operating points.

Measure with [jev-evidence-eval](https://github.com/laguagu/jev-kit/tree/main/skills/jev-evidence-eval)
or an equivalent harness: include explicit denials, missing statements, wrong entities,
contradictions, future plans and numerical mismatches. Report failures and coverage.

This skill contains instructions only. The optional companion runner and offline report live
in [Jev Kit](https://github.com/laguagu/jev-kit); don't assume they exist in
a skill-only installation. Use the user's existing language and project when implementing.
