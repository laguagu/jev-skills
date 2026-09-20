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
| Route a support ticket ([`routing`][routing]) | Choice: billing / product / technical / unknown | Unknown or uncertain → triage; urgency is an independent Noul |
| Route to a model or subagent | Choice among a documented capability list | Resolve to configured IDs; retain a default; measure total cost including routing |
| Rank retrieved passages ([`ranking`][ranking]) | One Score per passage with a relevance rubric | Sort in code, preserve passage IDs, and retain context needed for exceptions |
| Select a tool ([`tools`][tools]) | Choice from available tools plus none | Validate arguments and permissions separately; selection does not execute anything |
| Choose an action and what it acts on | Choice for the operation, plus one speculative Choice per operation over observed candidates | Number the candidates in code each turn; execute only the target belonging to the chosen operation |
| Continue, retry, or stop ([`workflow`][workflow]) | Choice over a bounded workflow state | Enforce retry budgets and stop conditions in code |
| Gate a pending action ([`risk`][risk]) | Score on a damage rubric, with time pressure as a separate Noul | Require approval from a chosen level up, and whenever confidence is low |
| Verify a generated answer ([`verify`][verify]) | Noul per guardrail: supported by the source, within scope | Publish only clear cases; send the uncertain band to a person instead of a threshold |
| Moderate content | Separate Noul checks for concrete policy conditions | Combine policy rules in code; uncertain cases need an explicit disposition |
| Classify documents | Choice from a taxonomy plus unknown | Check missing fields separately; avoid forced labels for unrelated documents |
| Select evidence | Choice over candidate facts or spans | Copy selected text from source, preserve contradictions, and distinguish not stated |
| Compact agent context | Noul per candidate tool result: needed for the current task? | Keep required instructions and tool-call/result pairing; compare task success after pruning |
| Trim an agent's tool or skill manifest | Noul or Score per installed capability: relevant to this task? | Load what passes and keep a default set, so one wrong judgment cannot disable the agent |

Bracketed names link to a complete request and a tested policy in the decision examples.

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

When you do compare two implementations, alternate the arms over the same inputs rather than
running each in a block, pin the versions on both sides, say what the clock starts and stops on,
and report every attempt including failures. State the sample size honestly: a handful of paired
runs shows a direction, not a significant result.

## Prompts for a coding agent

- “Use jev-builder to rank our retrieved passages. Keep the originals and compare answer quality before and after filtering.”
- “Use jev-builder to choose among these three tools. Include none, and keep execution permissions in the existing tool layer.”
- “Find a maintained Jev context-compaction integration. Show which messages it sends externally and what happens if it fails.”
- “Compare Jev against our existing ticket classifier on the same held-out cases. Include unknowns, errors, and fallback cost.”

Runnable [decision examples](https://github.com/laguagu/jev-skills/tree/main/examples/decisions)
and the [evidence experiment](https://github.com/laguagu/jev-skills/tree/main/examples/evidence)
are optional companions. They are not bundled in a skill-only installation.

[routing]: https://github.com/laguagu/jev-skills/blob/main/examples/decisions/requests/routing.json
[ranking]: https://github.com/laguagu/jev-skills/blob/main/examples/decisions/requests/ranking.json
[tools]: https://github.com/laguagu/jev-skills/blob/main/examples/decisions/requests/tools.json
[workflow]: https://github.com/laguagu/jev-skills/blob/main/examples/decisions/requests/workflow.json
[risk]: https://github.com/laguagu/jev-skills/blob/main/examples/decisions/requests/risk.json
[verify]: https://github.com/laguagu/jev-skills/blob/main/examples/decisions/requests/verify.json
