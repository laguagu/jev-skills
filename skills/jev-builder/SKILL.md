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
official [typesafe-ai skill](https://docs.typesafe.ai/agent-skill) is installed (that page has
the install commands), follow it for API and question design; this skill adds the recipe map,
connection paths, pitfalls and where measurements live.

## Where to look

| Need | Look here |
| --- | --- |
| Concepts, primitives, confidence, HTTP API, SDKs, limits, prices | [Docs index](https://docs.typesafe.ai/llms.txt); append `.md` to a page path for Markdown |
| A worked recipe for the need | [Cookbooks](#official-cookbooks) below; read the closest one in full before designing |
| Architecture patterns | [Intent routing](https://docs.typesafe.ai/patterns/intent-routing) (a ticket or request router), [confidence-gated routing](https://docs.typesafe.ai/patterns/confidence-routing), [fan-out](https://docs.typesafe.ai/patterns/fan-out), [composite scoring](https://docs.typesafe.ai/patterns/composite-scoring) |
| Where the current model is weak | [Jagged edges](https://docs.typesafe.ai/model-jaggedness) |
| Keys, gateways, frameworks, troubleshooting | [Setup](references/setup.md) |
| Client in another language, MCP server, agent hook, app, open model | [jev-skills README](https://github.com/laguagu/jev-skills#readme) |
| Offline runnable examples | [Decisions](https://github.com/laguagu/jev-skills/tree/main/examples/decisions) (routing, ranking, tools, workflow, risk, verify), [rerank](https://github.com/laguagu/jev-skills/tree/main/examples/rerank), [evidence](https://github.com/laguagu/jev-skills/tree/main/examples/evidence) |
| Measurements | The README's [evaluation list](https://github.com/laguagu/jev-skills#evaluations) |

## Official cookbooks

Each has runnable code, cached responses that replay without a key, and measured results; change
the model ID before running one live (see [Pitfalls](#pitfalls)). The
[cookbook index](https://docs.typesafe.ai/cookbooks) may list newer ones.

| For | Cookbook | Shows |
| --- | --- | --- |
| Retrieval | [Re-ranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe) | One Noul per query and candidate reorders a BM25 shortlist, one request per candidate |
| | [Classifying RAG passages](https://docs.typesafe.ai/cookbooks/classifying_rag_passages) | Four Nouls per passage (relevant, evidence, contradicts the query, injection) decide whether it reaches the generator as evidence, as a conflict or not at all |
| | [Line-by-line search](https://docs.typesafe.ai/cookbooks/semantic_find) | A Choice over numbered lines finds the answer; a Noul says whether the document has one |
| Checks | [Double-checking citations](https://docs.typesafe.ai/cookbooks/citation_check) | A string match catches invented quotes, then a Choice decides whether the context supports the claim |
| | [Guardrails for LLMs](https://docs.typesafe.ai/cookbooks/llm_guardrails) | Hazard Nouls and a severity Score screen LLM input and output; thresholds live in code |
| | [SDE cascade](https://docs.typesafe.ai/cookbooks/sde_cascade) | Jev checks a small model's extraction and sends failing records to a reasoning model |
| Selection and extraction | [Function calling](https://docs.typesafe.ai/cookbooks/function_calling) | Maps a request to a typed function: a Choice per closed-set argument, a Noul on whether it was stated |
| | [Skill suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion) | Picks at most one skill from a large catalog: rank, then re-check the top candidates |
| | [Entity alignment](https://docs.typesafe.ai/cookbooks/entity_alignment) | A Score matches catalog records; companion Nouls show which fields disagree |
| | [Pre-parsed value extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook) · [date extraction](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook) | Code proposes candidate values, a Choice selects, code copies or assembles |
| | [Structure recovery](https://docs.typesafe.ai/cookbooks/autoformat) | Rebuilds Markdown from flattened text; every output character comes from the input |
| Classification | [Classification using confidence](https://docs.typesafe.ai/cookbooks/classification_using_confidence) | Reports the broader parent label when a fine-grained Choice is unsure |
| | [Hierarchical classification](https://docs.typesafe.ai/cookbooks/hierarchical_classification) | Beam search over Choice probabilities through a deep taxonomy |
| | [Autoresearch feature discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery) | Proposed Score and Noul questions become features for a trained regressor |
| Cost and stability | [Parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions) | Many questions about one document in one request: same answers, far cheaper and faster |
| | [Self-consistency: Nouls](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook) · [Choices](https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook) | Repeated judgments vary slightly; route the unstable band to review |

## Build a decision

1. **Check the fit.** A decision suits Jev when a knowledgeable person would answer at once from
   the supplied context, the allowed answers are known before the call, and code consumes the
   answer. Exact rules, arithmetic and lookups stay in code; new prose or arbitrary JSON needs a
   generative model. They compose: a decision picks the slot or candidate, a generator fills it.
2. **Start from the closest cookbook** with a current model ID, then shape state and questions
   with the docs or the official skill.
3. **Keep policy in code.** Map answers to known IDs, validate them, and give unknown, malformed,
   uncertain and service-error outcomes a defined path. A reranker or gate in front of an existing
   feature needs a total deadline, falls back to the original behaviour, and pauses after a 429
   or 5xx.
4. **Measure before adopting.** Compare with the current rule, classifier or LLM on the same
   labelled cases in the user's language (English is Jev's strongest), and choose thresholds per
   task and corpus on development data. [jev-evidence-eval](https://github.com/laguagu/jev-skills/tree/main/skills/jev-evidence-eval)
   covers the procedure.

## Pitfalls

- Use a versioned model ID such as `jev-1.13.0` or the alias `jev-latest`; check the
  [current models](https://docs.typesafe.ai/models) before reusing a cookbook's older ID.
  Pin a versioned ID for evaluations, log the returned `model`, and re-tune thresholds
  when changing models.
- Question IDs are never shown to the model; say in the question which item it judges, such as
  `passages[3]`.
- Batch independent candidate judgments over shared state; the rerank example starts with 15
  per request. Check the [current context and rate limits](https://docs.typesafe.ai/models)
  when choosing batch size and concurrency; the provider can adjust them without notice.
  Measure the tradeoff on your own data.
- A Noul per candidate is enough to sort. Use a graded Score when code acts on the levels themselves.
- An option's name can outweigh its definition. Give each option a name that means what its
  definition says.
- Probabilities come back rounded to two decimals and vary slightly between identical requests;
  do not tune a threshold finer than that, and cache answers when reproducibility matters.
- Confidence summarizes the answer distribution; it is not accuracy, and a threshold learned on
  one corpus does not transfer to another.
- For evidence, number candidate spans in code, let a Choice pick one (with a none option), and
  copy the text from the source. Silence is "not stated", not a denial.
- State leaves your system. Jev is not trained on customer requests, and zero data retention is
  offered to enterprise customers ([data handling](https://docs.typesafe.ai/models#data-handling),
  [legal](https://docs.typesafe.ai/legal)). Send only the fields a decision needs.
- Local open decision models and cross-encoders are not drop-in replacements: measure them on the
  same task, and never reuse Jev's thresholds for them.

When recommending a third-party project from the README, read its current source and license,
say whether it was run or only read, and for agent hooks say what data leaves the machine.
