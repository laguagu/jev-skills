# Decisions worth trying

Choose one boundary in the application and keep its downstream policy explicit.
See TypeSafe's [patterns](https://docs.typesafe.ai/patterns) and
[API reference](https://docs.typesafe.ai/api) for current definitions.

Contents: [screen the task](#screen-the-task-first) · [shapes that fit](#shapes-that-fit) ·
[official recipes](#official-recipes) · [routing example](#worked-example-routing-and-urgency) · [rerank a shortlist](rerank.md) ·
[verify, then escalate](#verify-then-escalate) · [other approaches](#compared-with-other-approaches) ·
[prompts](#prompts-for-a-coding-agent)

## Screen the task first

A decision fits this shape when all four hold:

- A knowledgeable person would answer it immediately from the supplied context, without research.
- The allowed answers are known before the call: named alternatives, ordered levels, or yes.
- Everything needed is already in state; nothing has to be fetched mid-question.
- Code consumes the answer; no one reads it as prose.

When one of these fails, split the task rather than rewriting the question. A step that needs
new prose, arbitrary JSON, arithmetic the code can do exactly, or several dependent lookups
belongs elsewhere; see [Compared with other approaches](#compared-with-other-approaches).

## Shapes that fit

| Need | Typed question | Application behavior to design |
| --- | --- | --- |
| Route a support ticket | Choice: billing / product / technical / unknown | Unknown or uncertain → triage; urgency is an independent Noul |
| Route to a model or subagent | Choice among a documented capability list | Resolve to configured IDs; retain a default; measure total cost including routing. Or use a ready router: see [Resources](resources.md#choose-a-starting-point) |
| Rank retrieved passages | One Noul per passage; a Score only when code needs the grade itself; a single Choice picks a top result well but orders the rest poorly | Sort in code, preserve passage IDs, and retain context needed for exceptions; see [Rerank](rerank.md) |
| Select a tool | Choice from available tools plus none | Validate arguments and permissions separately; selection does not execute anything |
| Choose an action and what it acts on | Choice for the operation, plus one speculative Choice per operation over observed candidates | Number the candidates in code each turn; execute only the target belonging to the chosen operation |
| Continue, retry, or stop | Choice over a bounded workflow state | Enforce retry budgets and stop conditions in code |
| Gate a pending action | Score on a damage rubric, with time pressure as a separate Noul | Require approval from a chosen level up, and whenever confidence is low; [kenhuangus/jev-usecases](https://github.com/kenhuangus/jev-usecases) maps each decision to an auto, confirm, human or block band |
| Verify a generated answer | Noul per guardrail: supported by the source, within scope | Publish only clear cases; send the uncertain band to a person or a [stronger model](#verify-then-escalate) instead of a threshold |
| Moderate content | Separate Noul checks for concrete policy conditions | Combine policy rules in code; uncertain cases need an explicit disposition |
| Classify documents | Choice from a taxonomy plus unknown, each option defined; the nearest labelled examples in state when you have them | Check missing fields separately; avoid forced labels for unrelated documents |
| Screen a document against a long checklist | Dozens of independent Nouls and Choices in one request, including paired cross-checks and a presence question | Combine in code; a disagreement, a missing receipt or an unstable answer becomes a review item; see [Screening](screening.md) |
| Select evidence | Choice over candidate facts or spans | Copy selected text from source, preserve contradictions, and distinguish not stated |
| Compact agent context | Noul per candidate tool result: needed for the current task? | Keep required instructions and tool-call/result pairing; compare task success after pruning |
| Trim an agent's tool or skill manifest | Noul or Score per installed capability: relevant to this task? | Load what passes and keep a default set, so one wrong judgment cannot disable the agent. Or keep the roster whole and add one suggestion line after it, worded so the agent may ignore it; an unchanged roster keeps prefix caching. In the [skill suggestion cookbook](https://docs.typesafe.ai/cookbooks/skill_suggestion) that line cut wrong loads from 16.8% to 7.3% and needless ones from 9.8% to 4.0% (`jev-1.12`, claude-haiku-4-5, 488 requests) |

Runnable versions of several shapes are in the repository (optional, needs the repo):
[decision requests](https://github.com/laguagu/jev-skills/tree/main/examples/decisions/requests),
[evidence checking](https://github.com/laguagu/jev-skills/tree/main/examples/evidence) and
[reranking](https://github.com/laguagu/jev-skills/tree/main/examples/rerank).

## Official recipes

TypeSafe's [cookbooks](https://docs.typesafe.ai/cookbooks) carry runnable code, cached responses
that replay without a key, and measured results. Find the need here, then read the recipe in full
before improvising a decomposition. Their model versions and figures are the docs' own; recheck
them there.

| Need | Cookbook | Shape |
| --- | --- | --- |
| Rerank a search shortlist | [Re-ranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe) | One Noul per query and candidate over a BM25 shortlist of 30; see [Rerank](rerank.md) for batching |
| Filter retrieved passages before an answer | [Classifying RAG passages](https://docs.typesafe.ai/cookbooks/classifying_rag_passages) | Four Nouls per passage route it to evidence, conflict, or neither, and keep a planted injection out |
| Find the line that answers | [Line-by-line search](https://docs.typesafe.ai/cookbooks/semantic_find) | A Choice over numbered lines, plus a Noul on whether the document answers at all |
| Pick one skill or tool from a large roster | [Skill suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion) | Rank the whole roster with a need-any gate, then re-judge the top three on their full text |
| Map a request to a function call | [Function calling](https://docs.typesafe.ai/cookbooks/function_calling) | A Choice per closed-set argument, plus a Noul on whether the user stated it, so defaults stand |
| Classify into a deep taxonomy | [Hierarchical classification](https://docs.typesafe.ai/cookbooks/hierarchical_classification) | A Choice per level with a beam of plausible paths, pruned by geometric-mean probability |
| Fall back to a broader label when unsure | [Classification using confidence](https://docs.typesafe.ai/cookbooks/classification_using_confidence) | One Choice over fine labels; below a confidence bar, code reports the parent label with no second call |
| Keep repeated judgments stable | [Self-consistency: nouls](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook) and [choices](https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook) | Repeat a rubric and measure variance; send the uncertain band to a person |
| Screen LLM input and output | [Guardrails for LLMs](https://docs.typesafe.ai/cookbooks/llm_guardrails) | A battery of hazard Nouls plus a severity Score in one request; review and block thresholds live in policy code |
| Ask many questions of one document | [Parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions) | Every question in one request: the same answers at a fraction of the cost and time |
| Extract a value without generating it | [Pre-parsed value extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook) and [date extraction](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook) | Regex or components propose candidates, a Choice picks one, code copies or assembles it |
| Check a small model's extraction | [SDE cascade](https://docs.typesafe.ai/cookbooks/sde_cascade) | Per-field checks decide which records go to a reasoning model; see [Verify, then escalate](#verify-then-escalate) |
| Match records across catalogs | [Entity alignment](https://docs.typesafe.ai/cookbooks/entity_alignment) | A three-level Score sends the middle to a curator, with per-field Nouls showing what disagrees |
| Check a quotation against its source | [Double-checking citations](https://docs.typesafe.ai/cookbooks/citation_check) | A string match catches fabricated quotes, then a Choice over the section decides support |
| Rebuild structure from flattened text | [Structure recovery](https://docs.typesafe.ai/cookbooks/autoformat) | Two requests of classifications; every output character comes from the input |
| Turn text into model features | [Autoresearch feature discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery) | An LLM proposes Score and Noul questions, their answers become columns for a trained regressor |

Limits the recipes work around ([API reference](https://docs.typesafe.ai/api)):

- A Choice takes at most 255 options, and the confidence-classification recipe calls it reliable up
  to about 240. Past that, narrow in two stages, a window and then a line or a section and then a
  span, as line-by-line search and pre-parsed value extraction do.
- A Score takes 2 to 10 levels; the autoresearch recipe notes that eleven come back as a server error.
- A decision assembled from several answers is only as certain as its least certain part: function
  calling and date extraction report the minimum confidence of the answers behind a result.

## Worked example: routing and urgency

Input: “My renewal invoice includes an extra charge. Please explain it this week.”

Ask independently which team owns the issue and whether it requires immediate intervention.
Code maps the selected team to a queue, sends `unknown` or a low-confidence route to triage,
and applies a separately tested urgency threshold. The urgency question must judge the
message directly; it cannot read the route question's answer in the same request.

For multi-label routing, use one question per applicable category rather than a single
Choice that forces categories to be mutually exclusive. For dependent steps, feed the first
answer into a second request. Do not ask Jev to generate tool arguments, rewritten summaries,
free-text explanations, or source quotations.

## Rerank a shortlist

Reranking a search shortlist has its own reference: [Rerank](rerank.md). It covers batching,
a question to adapt, sizing a batch, comparing ranking quality and keeping search independent
of the reranker.

## Verify, then escalate

Let Jev judge first and send uncertain or flagged cases to a stronger model or a person.
The [citation example](questions.md#accepting-a-citation) gives one possible first-stage check.
Choose the escalation band on development cases and evaluate the complete cascade on held-out
cases, including fallback latency and cost. Keep generated labels separate from independent review.
TypeSafe's [SDE cascade cookbook](https://docs.typesafe.ai/cookbooks/sde_cascade) applies the
same shape to extraction: Jev checks a small model's fields before a reasoning model is called.
Its rules for the verifier carry over: frame the case to escalate as the yes side, ask one narrow
Noul per field against the source, and escalate when any of them fires (the maximum, not the mean,
so one confident flag is not averaged away).

Vercel AI Gateway offers the same cascade inside the gateway as
[evaluation fallbacks](https://vercel.com/docs/ai-gateway/models-and-providers/evaluation-fallbacks):
when a Choice or Score's confidence falls below a bar, or a Noul's probability lands in a band, it
reruns the whole request with another model. Both stages are billed and run one after the other; if
the fallback fails, the request fails without returning the first answer; and an answer from a
language model comes back with `confidence: 0` and empty probabilities, which mean unavailable, not
zero. It saves writing the escalation, not measuring it.

## Compared with other approaches

| Approach | A useful fit |
| --- | --- |
| Rules or lookup | Exact conditions already known to the application |
| Trained task classifier | Stable taxonomy and enough representative labelled examples |
| LLM with structured output | Open-ended reasoning, generated text, or flexible extraction alongside decisions |
| Jev | Bounded semantic decisions expressed as choices, rubric scores, or yes probabilities |

Schema validity is not semantic accuracy. Any speed or cost advantage needs an equivalent
task, the same inputs, a measured baseline, and the cost of fallbacks. Do not repeat “up to”
launch figures as a promise for the user's application.

When labelled data exists, include a trained classifier in the comparison. Define each label
and try representative examples in state. A shortlist can reduce decision cost, but measure
candidate coverage and out-of-scope recall separately. [Published evaluations](evaluations.md)
provide examples of these comparisons.

For an LLM baseline on identical questions, TypeSafe's
[System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python) keeps the Python
client interface and answers with OpenAI, Anthropic, or Gemini, so only the client changes.

When you do compare two implementations, alternate the arms over the same inputs rather than
running each in a block, pin the versions on both sides, say what the clock starts and stops on,
and report every attempt including failures. State the sample size honestly: a handful of paired
runs shows a direction, not a significant result.

## Prompts for a coding agent

- “Use jev-builder to rank our retrieved passages. Keep the originals and compare answer quality before and after filtering.”
- “Use jev-builder to choose among these three tools. Include none, and keep execution permissions in the existing tool layer.”
- “Find a maintained Jev context-compaction integration. Show which messages it sends externally and what happens if it fails.”
- “Compare Jev against our existing ticket classifier on the same held-out cases. Include unknowns, errors, and fallback cost.”

Before adopting a shape, write the failure paths down with it: a malformed answer, an unknown
choice, a spent retry budget, a service error. Each one needs a defined outcome in code.
