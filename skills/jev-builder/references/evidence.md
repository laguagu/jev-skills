# Build decisions with source receipts

Read this when an answer has to point at its source: a citation or grounding check for a
retrieval answer, document fact selection, claim triage, or verifying that generated text
is supported by the passages it came from.

Read the current [TypeSafe API](https://docs.typesafe.ai/api),
[confidence guide](https://docs.typesafe.ai/confidence) and
[citation cookbook](https://docs.typesafe.ai/cookbooks/citation_check).

Choose the shape that matches the user's application:

- **Claim checking:** give each candidate passage an independent question. A Noul can ask whether
  the passage *fully* supports the claim ([Questions](questions.md#accepting-a-citation));
  use a Choice when code must treat contradiction and silence differently. Preserve both
  supporting and contradicting passages.
- **Fact selection:** ask YES / NO / NOT_STATED or a defined taxonomy with an unknown option.
  In a second request, select source-span IDs that establish the chosen fact, with explicit
  no-evidence and conflicting-evidence options. A negative needs an explicit denial; silence
  is NOT_STATED. Do not ask a parallel question to read another question's answer.

Build span candidates in code and copy selected text from the original source. Preserve offsets,
document identity and context. Never ask Jev to generate a quote or accept an arbitrary returned
string as a source ID. Validate the answer keys, allowed choices and numerical metadata before
using them. Unresolved references, time qualifiers and contradictory passages require review.

When the answer arrives with its own quote, as in the citation cookbook, check the quote against
the source in code before any model sees it. The cookbook's match is exact after normalizing
whitespace and quotation marks, so a truncated or lightly reworded quote comes back as
fabricated; normalize, and use a tolerant match before calling a quote invented.

A verbatim span check establishes provenance only. Even an exact quote may support a different
entity or time period. If multiple passages jointly establish a fact, retain the set or escalate;
do not present one convenient sentence as complete evidence. Retrieval coverage is a separate
measurement: a classifier cannot judge evidence it never receives.

When retrieved passages feed a generator, TypeSafe's
[RAG passages cookbook](https://docs.typesafe.ai/cookbooks/classifying_rag_passages) routes each
one by fixed tests: injection first, then contradiction before evidence, because a passage that
denies the question's premise usually also states something usable. Evidence and conflicts reach
the generator in separate blocks. Its injection Noul is a filter, not a security boundary: a
passage under the threshold still reaches the prompt, so the generator must treat every passage
as untrusted text.

Keep business rules and execution in code. Preserve existing evidence checks and authorization
boundaries. Treat confidence and chosen-option probability as different signals; neither proves
the fact. Set review rules based on the application's consequences, and calibrate thresholds on
labelled examples before treating them as reliable operating points.

Measure with the [jev-evidence-eval](https://github.com/laguagu/jev-skills/tree/main/skills/jev-evidence-eval)
skill or an equivalent harness: include explicit denials, missing statements, wrong entities,
contradictions, future plans and numerical mismatches. Report failures and coverage.

Use the user's existing language and project when implementing.
