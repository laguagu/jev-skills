---
name: jev-builder
description: Designs TypeSafe Jev decisions (typed Choice, Score and Noul questions), their SDK or framework integration, fallbacks and evaluations. Use when adding Jev routing, reranking, classification, tool selection, citation or evidence checks, when a Jev question answers wrong or with low confidence, when choosing between Jev, an LLM and a local cross-encoder or open model, or when looking for a Jev SDK, integration or example project. Complements the official typesafe-ai skill, which carries current API detail; measuring a finished workflow and curating the jev-skills collection have their own companion skills.
license: MIT
---

# Build with Jev

Turn a concrete application need into a small typed decision. This skill complements the
[official TypeSafe skill](https://github.com/typesafe-ai/skills); use that for detailed API
implementation and the current [docs](https://docs.typesafe.ai/introduction) as source of truth.
If the official skill is absent, the docs and references below are sufficient to begin.

## Choose the right starting point

| Need | Read |
| --- | --- |
| First call, API key, provider choice, or authentication trouble | [Setup](references/setup.md) |
| Routing, scoring, tool choice, escalation to an LLM, workflow design, or the official cookbook for a need | [Patterns](references/patterns.md) |
| Reranking a search shortlist: batching, the question, gating, keeping search independent | [Rerank](references/rerank.md) |
| Screening one document against a long checklist | [Screening](references/screening.md) |
| Wording a question, or one that answers wrong or with low confidence | [Questions](references/questions.md) |
| An answer that must cite its source, or missing and conflicting evidence | [Evidence](references/evidence.md) |
| An existing skill, SDK, provider, MCP server, open model, or example project | [Resources](references/resources.md) |
| Whether measurements back a choice: Jev against an LLM, a cross-encoder or an open model; batching, rerank depth, gates, wording | [Evaluations](references/evaluations.md) |

These reference files are bundled with this skill.

## Implement a decision

1. **Define the contract.** Identify the available input, allowed outcomes, cost of a
   wrong decision, and what happens when information is missing. If an exact rule solves
   the problem, use code. If the output is a new paragraph or arbitrary JSON content,
   use a generative model or deterministic extraction instead. The two compose well: a typed
   decision picks the slot or candidate, and a generative model fills only that one slot.
2. **Connect the provider.** Follow the setup reference and the project's existing secret
   handling. TypeSafe direct credentials and AI Gateway credentials are different.
   Keep keys on the server; never ask the user to paste a key into the conversation.
3. **Choose a primitive.** `Choice` selects from named alternatives; include unknown or
   none when appropriate. `Score` uses ordered rubric levels. `Noul` returns the probability
   of yes, not a separate confidence field or a Boolean decision made for the application.
4. **Provide explicit context.** Put task data and candidate definitions in state. Write
   self-contained instructions: question IDs are bookkeeping, not model-visible meaning.
   Independent questions can share a request, including ones only some branches consume;
   they are judged in parallel. If B requires A's answer, make a second request.
   [Questions](references/questions.md) covers wording and diagnosis in detail.
5. **Use the existing SDK or framework.** Prefer official clients and follow current API
   examples. Check model names, request limits and pricing in live docs; pin a supported
   version for a reproducible evaluation and record the returned model.
6. **Compose in code.** Validate returned keys and allowed values. Map an answer to a
   known route or candidate ID. Keep authorization and execution in application code;
   a selected tool is a proposal, not permission. Handle missing, malformed, uncertain,
   and service-error outcomes explicitly.
7. **Test the policy.** Start with labelled ordinary, ambiguous, and out-of-scope inputs.
   Compare with the existing rule/classifier/LLM on equivalent tasks. Report errors,
   latency, usage, accepted accuracy, and review coverage. Choose thresholds on development
   data and check them on held-out cases; do not present a tiny example as a benchmark.

`Choice` and `Score` confidence summarizes the answer distribution. It is different from
the chosen outcome's probability and does not prove correctness. Select operating thresholds
for the actual task; constants in examples are illustrations.

## Choose Jev or an alternative

Defaults from the Finnish runs in [Evaluations](references/evaluations.md#our-runs-on-finnish);
re-check them on the user's own task.

- **Reranking:** use Jev on a shortlist that already works, reorder only its head, and put the
  source title in state. When text must stay on your own servers, a small cross-encoder on CPU
  over an even shorter head is the fallback; stronger open rerankers need a GPU. Score long
  questions and one-to-three-word terms separately: cross-encoders promote passing mentions.
- **Citation and support checks:** Jev matches a frontier LLM on clear-cut claims at a small
  fraction of its cost, but trails it on subtle ones such as a dropped condition or *may* read
  as *must*. Send the doubtful band onward ([Patterns](references/patterns.md#verify-then-escalate)).
- **Open decision models** are not drop-in replacements: on Finnish, Laya made reranking worse
  than none and fell far behind on citation checks. Measure any local model on your language,
  and never reuse Jev's thresholds for it.

For evidence work, preserve source IDs and copy exact text in code. Use a missing-evidence
outcome instead of treating silence as a negative; [Evidence](references/evidence.md) covers
the shapes and their failure modes. To measure a finished workflow, use the companion
[evaluation skill](https://github.com/laguagu/jev-skills/tree/main/skills/jev-evidence-eval);
install it separately if only this skill is present.

When recommending a third-party project, verify its current primary docs, supported runtime,
license, and actual integration. State whether it was run or only inspected. For compaction
or agent hooks, explain what data they send and what behavior changes before recommending
installation. Resource discovery alone does not install tools or change agent settings.
