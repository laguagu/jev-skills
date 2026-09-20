# From a prompt to a bounded decision

Suppose an answer claims **"Logs are retained for 90 days."** Your retrieved source says
**"Logs are permanently deleted after 7 days."** This lab sends the claim and passage to Jev,
asks whether the passage supports, contradicts or is irrelevant to the claim, then copies the
original passage into the report. The expected test label never reaches the model.

```text
claim + candidate passages
           ↓
Jev: one independent Choice per passage
           ↓
code: combine answers + apply review threshold
           ↓
supported / contradicted / conflicting / not_stated / review
           + original source receipts
```

Supporting and contradicting passages together produce `conflicting`. A low-confidence
judgment on any passage produces `review`. `not_stated` describes missing support in the
supplied passages; it does not establish that the claim is false. The policy is in `check.py`.

## How this differs from other classification approaches

| Approach | Useful when | What you still need to decide |
| --- | --- | --- |
| Rules / exact lookup | The condition is already explicit and deterministic | Keep rules current and define unknown inputs |
| Trained task classifier | You have representative labels and a stable taxonomy | Training, held-out evaluation, drift and unknown classes |
| LLM with structured output | You also need generation, broader reasoning or extraction | Schema validity doesn't establish factual correctness |
| Jev | You can express a semantic judgment as choices, ordered levels or a yes probability | Candidate coverage, ambiguous cases, thresholds and downstream rules |

Jev's [API](https://docs.typesafe.ai/api) returns distributions for Choice and Score, plus a
separate confidence value; Noul returns a yes probability. Independent questions can share
state and run together. They cannot use one another's answers. Use a second request when
selecting evidence depends on a fact chosen in the first request.

The potential gain is replacing some repeated prompt-and-parse decisions with focused typed
judgments. This repo has not measured a speed, cost or accuracy advantage against an equivalent
LLM or trained classifier. Use the same inputs and target decisions when making that comparison.

## Adapt it to your app

1. Define one decision users can act on. Start with a small labelled development set.
2. Retrieve the relevant passages and preserve their IDs, full text and surrounding context.
3. Ask narrow questions with explicit missing / conflicting outcomes where appropriate.
4. Copy selected evidence from source in code. Check exact span membership separately from meaning.
5. Preserve your application's deterministic rules. Log errors separately from model decisions.
6. Pick thresholds on development data and measure the chosen policy on unseen examples.

For a fixed set of facts, follow the [evidence reference](../../skills/jev-builder/references/evidence.md).
For this lab's claim/passages format, follow [the setup guide](README.md).
The report is an evaluation viewer, not a production service: it contains the supplied text,
does not retrieve documents, and has no authentication or persistence layer.

For routing inside an agent, [LangChain's integration guide](https://www.langchain.com/blog/building-a-harness-with-jev)
shows `TypeSafeClassifier` and model-routing middleware. [AutoJev](https://autojev.ai/jev-skills)
provides focused skills backed by its MCP tools. These are external integrations; installing
this repo's skills does not install or configure them.
