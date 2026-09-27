# Decisions worth trying

Choose one boundary in the application and keep its downstream policy explicit.
See TypeSafe's [patterns](https://docs.typesafe.ai/patterns) and
[API reference](https://docs.typesafe.ai/api) for current definitions.

Contents: [screen the task](#screen-the-task-first) · [shapes that fit](#shapes-that-fit) ·
[official recipes](#official-recipes) · [routing example](#worked-example-routing-and-urgency) · [rerank a shortlist](#rerank-a-shortlist) ·
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
| Route to a model or subagent | Choice among a documented capability list | Resolve to configured IDs; retain a default; measure total cost including routing |
| Rank retrieved passages | One Noul per passage, or a Score when grades matter; a single Choice picks a top result well but orders the rest poorly | Sort in code, preserve passage IDs, and retain context needed for exceptions; see [Rerank a shortlist](#rerank-a-shortlist) |
| Select a tool | Choice from available tools plus none | Validate arguments and permissions separately; selection does not execute anything |
| Choose an action and what it acts on | Choice for the operation, plus one speculative Choice per operation over observed candidates | Number the candidates in code each turn; execute only the target belonging to the chosen operation |
| Continue, retry, or stop | Choice over a bounded workflow state | Enforce retry budgets and stop conditions in code |
| Gate a pending action | Score on a damage rubric, with time pressure as a separate Noul | Require approval from a chosen level up, and whenever confidence is low |
| Verify a generated answer | Noul per guardrail: supported by the source, within scope | Publish only clear cases; send the uncertain band to a person or a [stronger model](#verify-then-escalate) instead of a threshold |
| Moderate content | Separate Noul checks for concrete policy conditions | Combine policy rules in code; uncertain cases need an explicit disposition |
| Classify documents | Choice from a taxonomy plus unknown, each option defined; the nearest labelled examples in state when you have them | Check missing fields separately; avoid forced labels for unrelated documents |
| Select evidence | Choice over candidate facts or spans | Copy selected text from source, preserve contradictions, and distinguish not stated |
| Compact agent context | Noul per candidate tool result: needed for the current task? | Keep required instructions and tool-call/result pairing; compare task success after pruning |
| Trim an agent's tool or skill manifest | Noul or Score per installed capability: relevant to this task? | Load what passes and keep a default set, so one wrong judgment cannot disable the agent; the [skill suggestion cookbook](https://docs.typesafe.ai/cookbooks/skill_suggestion) measures a two-stage version of this |

## Official recipes

TypeSafe's [cookbooks](https://docs.typesafe.ai/cookbooks) carry runnable code, cached responses
that replay without a key, and measured results. Find the need here, then read the recipe in full
before improvising a decomposition. Their model versions and figures are the docs' own; recheck
them there.

| Need | Cookbook | Shape |
| --- | --- | --- |
| Rerank a search shortlist | [Re-ranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe) | One Noul per query and candidate over a BM25 shortlist of 30; see [below](#rerank-a-shortlist) for batching |
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

A first stage (BM25, vectors, or both) narrows the corpus to 10–30 candidates; Jev judges each
against the query, and code sorts by the probability. A reranker cannot add what the first stage
missed, so measure how often the right answer is on the shortlist at all before tuning the question.

The [re-ranking cookbook](https://docs.typesafe.ai/cookbooks/rerank_typesafe) sends one request per
query and candidate. Batching about 15 candidates per request, each Noul told which index it judges,
bills the shared framing once. On MuPLeR-fi it took 400 requests instead of 6,000, a p50 of 331 ms
instead of 892 ms, and $0.60 instead of $0.93 per thousand queries, at a top-1 recall of 96.5%
against 95.5% ([benchmark](https://github.com/laguagu/jev-rerank-bench#batching-is-free-quality)).
Independent runs batched 30, 40 and 100 candidates per request with the same outcome
([Evaluations](evaluations.md#reranking)).
A sketch with the JavaScript SDK:

```ts
import { noul, type Questions } from "@typesafe-ai/sdk";

const task = "A user asked a question. Decide whether this passage is a source that answers it.";

// One request per batch of about 15; run the batches in parallel.
const questions: Questions = {};
batch.forEach((_, i) => {
  questions[`p${i}`] = noul(
    { task, judge: `Judge only passages[${i}]; the others are competing candidates.` },
    criteria, // your corpus's yes and no, written as the bullets below describe
  );
});
const { answers } = await client.systemOne({
  state: { query, passages: batch.map(({ title, text }) => ({ title, text })) },
  questions,
});
// Map answers[`p${i}`].noul back to candidate IDs, then sort stably so an unscored
// candidate keeps its first-stage place behind every scored one.
```

On a failed call, serve the first-stage order. The other passages in a batch did not act as
distractors here: a Noul told which index it judges scored as well as one that saw a single passage.

What mattered, measured on Finnish legal text (MuPLeR-fi and 160 collective agreements) and on
one-minute ASR segments of Finnish lecture videos (70 full questions and 15 terms of one to three
words), `jev-1.13.0`, September 2026:

- **Write the criteria for what separates a right answer in this corpus.** A question written for
  collective agreements required the passage to come from the agreement the user named. MuPLeR's
  passages carry only a numeric id, so that condition could never be met, and a Noul that cannot
  verify its condition answers no: 77.0% against 96.5% for a question about the passage alone, and
  73.0% with no reranking ([benchmark](https://github.com/laguagu/jev-rerank-bench#the-largest-effect-is-the-question-not-the-model)).
  Put only the fields the judgment uses in state; an unused id is a distractor.
- **Put the source title in state** when the passage does not name its own topic. A transcript
  segment rarely does, and the title raised hit@1 on both transcript query sets, if only by one
  query each.
- **Name the short-query case in the criteria.** For a term of one to three words, require its
  subject to be a substantial topic of the segment rather than a passing mention, and say that
  shared vocabulary, such as a word inside a longer compound, does not count. Cross-encoders take
  no criteria and cannot make that distinction: reordering 30 candidates, bge-reranker-v2-m3 cut
  hit@1 on short queries from 0.933 to 0.600, where Jev with the criterion reached 1.000.
- **Rerank only the top 10 when the first stage is already good.** Jev's gain on full questions
  held (hit@1 0.543 unreranked, 0.629 reordering 30, 0.657 reordering the top 10), and the
  cross-encoder's harm on short queries mostly disappeared (back to 0.933). A deeper shortlist
  rarely pays: 100 candidates instead of 30 raised top-1 on the agreements by 1.4 to 2.8 points
  at 3.3 times the cost.
- **Gate on the top score.** Accepting the first result only when its Noul was at least 0.9
  answered 55% of MuPLeR queries with no top-1 error; show the list or ask for the rest
  ([benchmark](https://github.com/laguagu/jev-rerank-bench#it-knows-when-it-is-right)).
  Calibration did not transfer between collections in an independent test, so choose the
  threshold on each corpus's own development queries ([Evaluations](evaluations.md#gates-and-calibration)).
- **Keep search independent of the reranker.** Cache scores per query and candidate for a few
  minutes, time the call out, and after a failure skip reranking for a cooldown and serve the
  first-stage order.

## Verify, then escalate

Jev answers every case, and code sends only the doubtful ones to a stronger LLM. On the citation
check in [Questions](questions.md#a-measured-case-accepting-a-citation), escalating when the
support probability fell between 0.3 and 0.7, or when a claim was accepted but the targeted
modality check fired, sent 19% of the 600 claims to gpt-6-sol. The cascade scored 92.5% balanced
accuracy against 93.2% for gpt-6-sol on every claim, at about a quarter of its cost
($0.25 against $0.97 per thousand claims). Treat that as exploratory: both rules were chosen on
the same data, and gpt-6-sol also wrote the claims and their labels, so its own score may carry
home advantage. Fix the band on development cases and measure it on held-out ones
([method and data](https://github.com/laguagu/jev-rerank-bench/tree/main/verify#citation-check)).
TypeSafe's [SDE cascade cookbook](https://docs.typesafe.ai/cookbooks/sde_cascade) applies the
same shape to extraction: Jev checks a small model's fields before a reasoning model is called.

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

What [one comparison](https://github.com/laguagu/jev-rerank-bench#3-classification) found,
as a prior rather than a promise. On three public intent sets (BANKING77, CLINC150 with
out-of-scope, and Finnish MASSIVE; 600 messages each, `jev-1.13.0`, September 2026), Jev with
label names only was 2 to 9 points behind gpt-5.6-sol and gpt-6-sol, and ahead of the small
gpt-6-luna. One-sentence label definitions closed most of that gap. Given the ten nearest
labelled messages in state, it tied a logistic regression on embeddings trained on the full
training split, and so did the chat models. No arm beat that trained classifier, which costs
almost nothing to run. What set Jev apart was speed (about 0.25 s against 1.5–2 s), cost (a
few cents per thousand messages), and a probability that gated well: with the examples in
state, it answered 88–100% of messages automatically at 95% accuracy. GPT-5.x returned no
probability, and gpt-6-luna only its chosen token's. When labelled data exists, compare against
a trained classifier before choosing Jev for accuracy alone. Choose it when the gate, the
latency, or a missing training set is what matters.

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
