---
name: jev-builder
description: Maps what can be built with TypeSafe Jev and where to look for it. Use when adding Jev decisions (typed Choice, Score and Noul questions) for routing, reranking, classification, tool or model selection, value extraction, moderation, citation or evidence checks; when connecting Jev through an SDK, gateway or framework; when looking for the official cookbook, client library, integration or example project that fits a need; when choosing between Jev, an LLM, a cross-encoder or an open model; or when a Jev question answers wrong or with low confidence. Complements the official typesafe-ai skill, which covers API and question design from the live docs; measuring a finished workflow has its own companion skill, jev-evidence-eval.
license: MIT
---

# Build with Jev

Jev answers typed questions about text and application state: `Choice` picks one of named
options, `Score` places the input on ordered levels, `Noul` returns the probability of yes.
Code owns the workflow and acts on the answers. This skill says what can be done and where to
look; the [live docs](https://docs.typesafe.ai/llms.txt) are the source of truth. When the
official [typesafe-ai skill](https://github.com/typesafe-ai/skills) is installed, follow it for
API and question design; this skill adds the recipe map, connection paths, pitfalls and where
measurements live.

## Where to look

| Need | Look here |
| --- | --- |
| Concepts, primitives, confidence, HTTP API, SDKs, limits, prices | [Docs index](https://docs.typesafe.ai/llms.txt); append `.md` to a page path for Markdown |
| A worked recipe for the need | [Cookbooks](#official-cookbooks) below; read the closest one in full before designing |
| Architecture patterns | [Patterns](https://docs.typesafe.ai/patterns): fan-out, confidence routing, composite scoring, intent routing |
| Where the current model is weak | [Jagged edges](https://docs.typesafe.ai/model-jaggedness) |
| Keys, gateways, frameworks, troubleshooting | [Setup](references/setup.md) |
| Client in another language, MCP server, agent hook, app, open model | [jev-skills README](https://github.com/laguagu/jev-skills#readme) |
| Offline runnable examples | [Decisions, rerank, evidence](https://github.com/laguagu/jev-skills#examples) |
| Measurements | [jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench) (Finnish reranking, classification, citation checks) and the README's [evaluation list](https://github.com/laguagu/jev-skills#evaluations) |

## Official cookbooks

Each has runnable code, cached responses that replay without a key, and measured results. The
[cookbook index](https://docs.typesafe.ai/cookbooks) may list newer ones.

| Cookbook | Shows |
| --- | --- |
| [Re-ranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe) | One Noul per query and candidate reorders a BM25 shortlist |
| [Classifying RAG passages](https://docs.typesafe.ai/cookbooks/classifying_rag_passages) | Per-passage Nouls route retrieved text to evidence, conflict or neither before the generator |
| [Line-by-line search](https://docs.typesafe.ai/cookbooks/semantic_find) | A Choice over numbered lines finds the answer; a Noul says whether the document has one |
| [Double-checking citations](https://docs.typesafe.ai/cookbooks/citation_check) | A string match catches invented quotes, then a Choice decides whether the context supports the claim |
| [Skill suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion) | Picks at most one skill from a large catalog: rank, then re-check the top candidates |
| [Function calling](https://docs.typesafe.ai/cookbooks/function_calling) | Maps a request to a typed function: a Choice per closed-set argument, a Noul on whether it was stated |
| [Entity alignment](https://docs.typesafe.ai/cookbooks/entity_alignment) | A Score matches catalog records; companion Nouls show which fields disagree |
| [Structure recovery](https://docs.typesafe.ai/cookbooks/autoformat) | Rebuilds Markdown from flattened text; every output character comes from the input |
| [Pre-parsed value extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook) · [date extraction](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook) | Code proposes candidate values, a Choice selects, code copies or assembles |
| [Hierarchical classification](https://docs.typesafe.ai/cookbooks/hierarchical_classification) | Beam search over Choice probabilities through a deep taxonomy |
| [Classification using confidence](https://docs.typesafe.ai/cookbooks/classification_using_confidence) | Reports the broader parent label when a fine-grained Choice is unsure |
| [Parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions) | Many questions about one document in one request: same answers, far cheaper and faster |
| [Guardrails for LLMs](https://docs.typesafe.ai/cookbooks/llm_guardrails) | Hazard Nouls and a severity Score screen LLM input and output; thresholds live in code |
| [SDE cascade](https://docs.typesafe.ai/cookbooks/sde_cascade) | Jev checks a small model's extraction and sends failing records to a reasoning model |
| [Self-consistency: Nouls](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook) · [Choices](https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook) | Repeated judgments vary slightly; route the unstable band to review |
| [Autoresearch feature discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery) | Proposed Score and Noul questions become features for a trained regressor |

## Build a decision

1. **Check the fit.** A decision suits Jev when a knowledgeable person would answer at once from
   the supplied context, the allowed answers are known before the call, and code consumes the
   answer. Exact rules, arithmetic and lookups stay in code; new prose or arbitrary JSON needs a
   generative model. They compose: a decision picks the slot or candidate, a generator fills it.
2. **Start from the closest cookbook**, then shape state and questions with the docs or the
   official skill.
3. **Keep policy in code.** Map answers to known IDs, validate them, and give unknown, malformed,
   uncertain and service-error outcomes a defined path. A reranker or gate in front of an existing
   feature needs a total deadline and falls back to the original behaviour.
4. **Measure before adopting.** Compare with the current rule, classifier or LLM on the same
   labelled cases in the user's language (English is Jev's strongest), and choose thresholds per
   task and corpus on development data. [jev-evidence-eval](https://github.com/laguagu/jev-skills/tree/main/skills/jev-evidence-eval)
   covers the procedure.

## Pitfalls

- Use a versioned model ID such as `jev-1.13.0` or an alias such as `jev-latest`; the display
  name `jev-1.13` returns HTTP 400. Pin a versioned ID for evaluations and log the returned `model`.
- Question IDs are never shown to the model; say in the question which item it judges.
- An option's name can outweigh its definition. Give each option a name that means what its
  definition says.
- Probabilities come back rounded to two decimals and vary slightly between identical requests;
  do not tune a threshold finer than that, and cache answers when reproducibility matters.
- Confidence summarizes the answer distribution; it is not accuracy, and a threshold learned on
  one corpus does not transfer to another.
- For evidence, number candidate spans in code, let a Choice pick one (with a none option), and
  copy the text from the source. Silence is "not stated", not a denial.
- Local open decision models and cross-encoders are not drop-in replacements: measure them on the
  same task, and never reuse Jev's thresholds for them.

When recommending a third-party project from the README, read its current source and license,
say whether it was run or only read, and for agent hooks say what data leaves the machine.
