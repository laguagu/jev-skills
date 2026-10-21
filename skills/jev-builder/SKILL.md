---
name: jev-builder
description: Maps what can be built with TypeSafe Jev and the other decision models that take the same typed request (OpenAI Decisions, Cloudflare Clef, Microsoft-Decision-1, Liquid d1), and where to look for it. Use when adding typed decisions (Choice, Score, Noul or yes/no questions) for routing, reranking, classification, tool or model selection, value extraction, moderation, citation or evidence checks; when a decision should read an image; when connecting through an SDK, gateway or framework, or keeping the provider swappable; when looking for the official cookbook, client library, integration or example that fits a need; when choosing between Jev, another decision model, an LLM, a cross-encoder, an open model you host or a small trained model, including when a decision must be fast; or when a question answers wrong or with low confidence. Complements the official typesafe-ai skill, which covers API and question design from the live docs; measuring a finished workflow has its own companion skill, jev-evidence-eval.
license: MIT
---

# Build with Jev

Jev answers typed questions about text and application state: `Choice` picks one of named
options, `Score` returns a probability-weighted position across ordered levels (including
between levels), and `Noul` returns the probability of yes.
Code owns the workflow and acts on the answers. This skill says what can be done and where to
look; the [live docs](https://docs.typesafe.ai/llms.txt) are the source of truth. When the
official [typesafe-ai skill](https://docs.typesafe.ai/agent-skill) is installed (that page has
the install commands), follow it for API and question design; this skill adds the recipe map,
connection paths, pitfalls and where measurements live.

OpenAI, Cloudflare, Microsoft and Liquid now serve the same kind of request, some of them with
images. The recipes and pitfalls below apply to them too; model IDs, limits and thresholds do
not carry over. [Providers](references/providers.md) has each request form.

## Where to look

| Need | Look here |
| --- | --- |
| Concepts, primitives, confidence, HTTP API, SDKs, limits, prices | [Docs index](https://docs.typesafe.ai/llms.txt); append `.md` to a page path for Markdown |
| A worked recipe for the need | [Cookbooks](#official-cookbooks) below; read the closest one in full before designing |
| Architecture patterns | [Intent routing](https://docs.typesafe.ai/patterns/intent-routing) (a ticket or request router), [confidence-gated routing](https://docs.typesafe.ai/patterns/confidence-routing), [fan-out](https://docs.typesafe.ai/patterns/fan-out), [composite scoring](https://docs.typesafe.ai/patterns/composite-scoring) |
| Ideas by industry or product | TypeSafe's [example use cases](https://docs.typesafe.ai/concepts/use-case-map); Vercel's [nine Jev use cases](https://vercel.com/i/jev-use-cases) (question type, evidence and action for each) and [five builds on five decision models](https://vercel.com/i/ai-gateway-decision-api-use-cases) |
| Where the current model is weak | [Jagged edges](https://docs.typesafe.ai/model-jaggedness) |
| Keys, gateways, frameworks, troubleshooting | [Setup](references/setup.md) |
| Another provider's request form, image input, one gateway for several decision models, an open decision model you host | [Providers](references/providers.md) |
| Client in another language, MCP server, agent hook, app, open model | [jev-skills README](https://github.com/laguagu/jev-skills#readme) |
| Which open decision model ranks best now | [Jev Decision Index](https://huggingface.co/spaces/multimodalart/jev-decision-index), a community leaderboard (unofficial; English benchmarks and private tests): use it to find candidates, then measure them on your own task; it changes within days, and [finding a newer one](references/providers.md#finding-a-newer-one) says what to check first |
| Offline runnable examples | [Decisions](https://github.com/laguagu/jev-skills/tree/main/examples/decisions) (routing, ranking, tools, workflow, risk, verify), [rerank](https://github.com/laguagu/jev-skills/tree/main/examples/rerank), [evidence](https://github.com/laguagu/jev-skills/tree/main/examples/evidence) |
| Measurements | The README's [evaluation list](https://github.com/laguagu/jev-skills#-evaluations) |

## Official cookbooks

The cookbooks include worked code, published caches and reported results. Follow each recipe's
setup: cached replay can still require keys and matching cache files; changing the model or
questions can trigger billed calls. Use a current model ID for live runs (see [Pitfalls](#pitfalls)). The
[cookbook index](https://docs.typesafe.ai/cookbooks) may list newer ones.

| For | Cookbook | Shows |
| --- | --- | --- |
| Retrieval | [Re-ranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe) | One Noul per query and candidate reorders a BM25 shortlist, one request per candidate |
| | [Classifying RAG passages](https://docs.typesafe.ai/cookbooks/classifying_rag_passages) | Four Nouls per passage (relevant, evidence, contradicts the query, injection) decide whether it reaches the generator as evidence, as a conflict or not at all |
| | [Line-by-line search](https://docs.typesafe.ai/cookbooks/semantic_find) | A Choice over numbered lines finds the answer; a Noul says whether the document has one |
| Checks | [Double-checking citations](https://docs.typesafe.ai/cookbooks/citation_check) | A string match catches invented quotes, then a Choice decides whether the context supports the claim |
| | [Guardrails for LLMs](https://docs.typesafe.ai/cookbooks/llm_guardrails) | Hazard Nouls and a severity Score screen LLM input and output; thresholds live in code |
| | [SDE cascade](https://docs.typesafe.ai/cookbooks/sde_cascade) | Jev checks a small model's extraction and sends failing records to a reasoning model |
| Selection and extraction | [Function calling](https://docs.typesafe.ai/cookbooks/function_calling) | Maps a request to a typed function: a Choice per enum argument, a Noul per member of a set-valued argument, and Nouls for whether arguments were stated |
| | [Skill suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion) | Picks at most one skill from a large catalog: rank, then re-check the top candidates |
| | [Simple memory system](https://docs.typesafe.ai/cookbooks/basic_memory) | A Noul decides which requests are worth remembering; a wrapper adds the saved ones to later state |
| | [Entity alignment](https://docs.typesafe.ai/cookbooks/entity_alignment) | A Score matches catalog records; companion Nouls show which fields disagree |
| | [Pre-parsed value extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook) · [date extraction](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook) | Code proposes candidate values, a Choice selects, code copies or assembles |
| | [Structure recovery](https://docs.typesafe.ai/cookbooks/autoformat) | Rebuilds Markdown from flattened text: the words come from the input, code adds the boundaries and markup |
| Classification | [Classification using confidence](https://docs.typesafe.ai/cookbooks/classification_using_confidence) | Reports the broader parent label when a fine-grained Choice is unsure |
| | [Hierarchical classification](https://docs.typesafe.ai/cookbooks/hierarchical_classification) | Beam search over Choice probabilities through a deep taxonomy |
| | [Autoresearch feature discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery) | Proposed Score and Noul questions become features for a trained regressor |
| Cost and stability | [Parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions) | Batches questions about one document; reports matching answers with lower cost and latency in its example |
| | [Self-consistency: Nouls](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook) · [Choices](https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook) | Samples with a fresh, irrelevant `uid` expose variation; route the unstable band to review |

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
   or 5xx. Until labelled cases from the user's own data support a threshold, a probability only
   orders the review queue and approves nothing: wrong answers also arrive with a high
   probability ([an example](https://docs.typesafe.ai/cookbooks/classification_using_confidence)),
   and a second model agreeing is no check until it has been measured on the same cases.
4. **Measure before adopting.** Compare with the current rule, classifier or LLM on the same
   labelled cases in the user's language (English is Jev's strongest), and choose thresholds per
   task and corpus on development data. Keep test cases separate from development and retrieved
   demonstrations; distinguish model-authored labels and judge checks from independent human
   review. [jev-evidence-eval](https://github.com/laguagu/jev-skills/tree/main/skills/jev-evidence-eval)
   covers the procedure.
   To compare models or providers, freeze the cases, wording, options and visible input and send
   every arm that same request in its provider's own form. Write the pass rule, the sample and
   the spend cap before the first call. Ask each request once and count failures as failures.
   Then recount the reported numbers from the saved answers with code that shares nothing with
   the runner.

## When speed decides

A decision model reads the whole state for every request, so its answer takes the time of a
large-model forward pass, plus the network for a hosted one. Measure latency and throughput on
your own requests before designing around them, and plan for this:

- **Many questions about one input go in one request.** That is the cheap and fast path
  ([parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions)); one request per
  question pays the read of the state again each time.
- **A self-hosted 26-27B model is not a real-time component.** On one data-centre GPU expect
  answers in the order of a second, not milliseconds, and throughput that falls with longer
  state. Size the hardware from your own load test, not from a leaderboard: which of two models
  serves faster can flip between GPU types and serving set-ups.
- **Real-time control needs a small task model.** Where a decision must come in milliseconds,
  run on a device, or repeat at every control step, train a small model for that one task from
  your own labelled data or a simulator's teacher (never from a hosted model's answers where its
  terms forbid it). A decision model can still label, audit or explain offline, but measure
  before letting it override the small model: where the small model is unsure, a large general
  model is not necessarily better.

## Keep the provider behind a thin adapter

The application's contract is its own typed request (state, questions by ID, allowed options)
and typed answer (chosen option, probability per option, the model ID the provider returned,
usage, or a named failure). An adapter only translates that contract to one provider's request
form and back. Retrieval, masking, thresholds, review and fallback stay outside it, so a second
provider is one more adapter and one more measurement.

- A refusal, a malformed answer, a timeout and a quota error are each their own outcome. Never
  turn one into a "no" or into one of the options.
- Store the requested model ID, the model the response names, the provider and any routing
  metadata beside each answer. An alias can move, a gateway can echo the requested ID, and a
  fallback names its own model; only a pinned versioned ID says which model was evaluated.

## Pitfalls

- Use a versioned model ID such as `jev-1.13.0` (the stable release, alias `jev-latest`) or the
  newer `jev-1.14.0` (alias `jev-preview`); check the
  [current models](https://docs.typesafe.ai/models) before reusing a cookbook's older ID.
  Pin a versioned ID for evaluations, log the returned `model`, and re-tune thresholds
  when changing models. Hosted Jev uses shared weights and offers no customer fine-tuning or LoRA.
- Question IDs are never shown to the model; say in the question which item it judges, such as
  `passages[3]`.
- Batch independent questions over the same state into one request
  ([parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions)); the re-ranking
  recipe sends one candidate per request for clarity. Check the
  [current context and rate limits](https://docs.typesafe.ai/models)
  when choosing batch size and concurrency; the provider can adjust them without notice.
  Measure the tradeoff on your own data.
- A Noul per candidate is enough to sort. Use a graded Score when code acts on the levels themselves.
- The model reads both an option's name and its description
  ([Choice](https://docs.typesafe.ai/primitives/choice)), and instructions that disagree with the
  criteria confuse it. Give each option a name that means what its description says. Test
  reordered options and untrusted state with injected instructions.
- Choice/Score confidence summarizes the answer distribution; it is not accuracy, and a threshold learned on
  one corpus does not transfer to another. Decision models are often overconfident outside the
  tasks they were trained on: fit a temperature per model on development labels before choosing a
  threshold. Measure stability near thresholds on your requests; cache answers when
  reproducibility matters.
- For evidence, number candidate spans in code, let a Choice pick one (with a none option), and
  copy the text from the source, preserving its version and offsets. Multi-part support needs an
  explicit, validated set of spans. A missing answer in a retrieved window says nothing about
  unsearched text; partial or failed extraction needs its own outcome. Silence is "not stated",
  not a denial. Questions in one request are independent; validate consistency across related fields.
- To point at the answer inside a long document, take two steps: a Choice picks the passage,
  then a second Choice picks the line or sentence among that passage's own numbered units. The
  line is a pointer for the reader, not a check of the passage: a model names a line also where
  the passage does not answer.
- When a generative model copies a value out of a passage, accept it only if code finds it
  verbatim in the source, and record where. The match shows the value is in the text, not that
  the passage answers the question, and a generative model can return a plausible value from a
  passage that holds no answer. Show such a value as a pointer for review, not as a confirmed field.
- Jev reads text only. Where a decision should read a page image or a photo, use a provider whose
  endpoint takes images ([providers](references/providers.md)). Where layout carries the answer,
  measure the picture against its OCR text on your own pages before choosing. Check the size
  limits before the call. An image bypasses every text screen you run: that a provider takes
  images is no reason to send customer pages. Keep that route off for personal documents until
  its own handling has been reviewed; a default-off switch or a warning screens nothing. An open
  model that reads images on your own hardware keeps the page in-house
  ([open models](references/providers.md#open-decision-models-you-host-yourself)).
- State leaves your system. Jev is not trained on customer requests, and zero data retention is
  offered to enterprise customers ([data handling](https://docs.typesafe.ai/models#data-handling),
  [legal](https://docs.typesafe.ai/legal)). Send only the fields a decision needs; check
  [processing location and output-training rights](references/setup.md#deployment-and-training).
  Mask identifiers (personal identity, card and account numbers, e-mail addresses, phone numbers)
  in code before the text leaves, map the cited spans back to the unmasked source locally, and
  say what the screen misses: masking is not anonymisation.
- No other model is a drop-in replacement, whether another hosted decision model, a local open
  one or a cross-encoder. Equal response shapes do not mean equal judgments, and probabilities
  are not comparable between models: measure each on the same task and never reuse Jev's
  thresholds.

When recommending a third-party project from the README, read its current source and license,
say whether it was run or only read, and for agent hooks say what data leaves the machine.
