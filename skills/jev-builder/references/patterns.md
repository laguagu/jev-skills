# Decisions worth trying

Choose one boundary in the application and keep its downstream policy explicit.
See TypeSafe's [patterns](https://docs.typesafe.ai/patterns) and
[API reference](https://docs.typesafe.ai/api) for current definitions.

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
| Rank retrieved passages | One Score per passage with a relevance rubric | Sort in code, preserve passage IDs, and retain context needed for exceptions |
| Select a tool | Choice from available tools plus none | Validate arguments and permissions separately; selection does not execute anything |
| Choose an action and what it acts on | Choice for the operation, plus one speculative Choice per operation over observed candidates | Number the candidates in code each turn; execute only the target belonging to the chosen operation |
| Continue, retry, or stop | Choice over a bounded workflow state | Enforce retry budgets and stop conditions in code |
| Gate a pending action | Score on a damage rubric, with time pressure as a separate Noul | Require approval from a chosen level up, and whenever confidence is low |
| Verify a generated answer | Noul per guardrail: supported by the source, within scope | Publish only clear cases; send the uncertain band to a person instead of a threshold |
| Moderate content | Separate Noul checks for concrete policy conditions | Combine policy rules in code; uncertain cases need an explicit disposition |
| Classify documents | Choice from a taxonomy plus unknown, each option defined; the nearest labelled examples in state when you have them | Check missing fields separately; avoid forced labels for unrelated documents |
| Select evidence | Choice over candidate facts or spans | Copy selected text from source, preserve contradictions, and distinguish not stated |
| Compact agent context | Noul per candidate tool result: needed for the current task? | Keep required instructions and tool-call/result pairing; compare task success after pruning |
| Trim an agent's tool or skill manifest | Noul or Score per installed capability: relevant to this task? | Load what passes and keep a default set, so one wrong judgment cannot disable the agent; the [skill suggestion cookbook](https://docs.typesafe.ai/cookbooks/skill_suggestion) measures a two-stage version of this |

When the table has no row for the task, read TypeSafe's
[cookbooks](https://docs.typesafe.ai/cookbooks) before inventing a shape. They cover ground this
table does not — guardrail batteries, deep taxonomies, entity alignment, date extraction,
structure recovery — and several carry runnable code and measured results, so prefer an official
recipe over a decomposition improvised here.

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
