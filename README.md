# Jev Skills

Skills for coding agents building with [Jev](https://typesafe.ai/), TypeSafe's model for typed decisions.

## Install

```sh
npx skills add typesafe-ai/skills --skill typesafe-ai
npx skills add laguagu/jev-skills --skill jev-builder
```

Choose your agent when prompted, or add `--agent codex`.
[Claude Code plugin and other options](INSTALL.md).

## Skills

| Skill | Purpose |
| --- | --- |
| [jev-builder](skills/jev-builder/SKILL.md) | API setup, decision patterns, question design, source-backed evidence |
| [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md) | Accuracy, review rate, latency, and cost of a finished workflow |

## Use

> Use jev-builder to add support-ticket routing. Include an unknown route and test the fallback.

Live calls need a key from the [TypeSafe console](https://console.typesafe.ai) in `TYPESAFE_API_KEY`.
Installing a skill makes no API calls.

## Examples

Clone the repository to run these. The skills work without them.

- [Decision examples](examples/decisions/README.md): routing, ranking, tool selection, workflow control, risk scoring, and answer verification. Offline dry runs, plus tests for malformed answers, unknown choices, and spent retry budgets.
- [Evidence example](examples/evidence/README.md): claim checking and a saved report whose confidence slider replays the policy without another API call.

## Ecosystem

Reviewed on September 21, 2026 through public repositories and documentation.
These are leads, not endorsements, and nothing here was benchmarked in this kit.
Jev shipped days ago, so most numbers are self-reported: check license, maintenance,
and failure paths before adopting any of it.

### Learn

- [TypeSafe docs](https://docs.typesafe.ai/introduction) and [cookbooks](https://docs.typesafe.ai/cookbooks): Choice, Score, Noul, patterns, API limits.
- [Confidence guide](https://docs.typesafe.ai/confidence): designing an accept / review / fallback policy.
- [LangChain: building a harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev): worked routing and tool-screening code.
- [Vercel launch notes](https://vercel.com/blog/ai-gateway-jev-model-launch#about-jev): proposed places for Jev in an agent workflow; vendor figures.

### SDKs and framework integrations

- [JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js) and [Python SDK](https://github.com/typesafe-ai/typesafe-sdk-python): official clients.
- [LangChain `TypeSafeClassifier`](https://github.com/langchain-ai/langchain/pull/40542): partner package for the three primitives behind a Runnable.
- [Pydantic AI `TypeSafeModel`](https://pydantic.dev/docs/ai/models/typesafe/): agents with a structured `output_type` run on `typesafe:jev-latest` unchanged.
- [LiteLLM pass-through](https://docs.litellm.ai/docs/pass_through/typesafe): proxy the evaluate endpoint with logging and spend tracking.

### Agent skills and plugins

- [typesafe-ai/skills](https://github.com/typesafe-ai/skills): the official skill; keep it installed from upstream.
- [wuyoscar/jev-skill](https://github.com/wuyoscar/jev-skill): six skills for triage, documents, eval, UI, and simulation, with recorded request and response examples.
- [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills): routing, memory, compaction, and skill selection with fail-open defaults and a shadow mode.
- [tamaratran/fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction): Claude Code plugin that scores which tool calls survive compaction. Read its hooks before enabling.
- [AutoJev skills](https://autojev.ai/jev-skills): task and model routing, tool checks, completion review.

### Browser and computer use

- [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast): picks an operation and its target element in one request over numbered page elements.
- [ndrezn/ts-browser-agent](https://github.com/ndrezn/ts-browser-agent): the same idea on `langchain-typesafe`.
- [realZachi/typesafe-adblock](https://github.com/realZachi/typesafe-adblock): a small extension that asks whether a DOM element is an ad. Useful as a minimal per-element decision loop.

### Developer tools

- [can1357/jegrep](https://github.com/can1357/jegrep): semantic grep that scores files by probability, without an embedding index.
- [itsmostafa/typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp): MCP bridge when an agent needs callable evaluations.
- [valentynkit/jev-commit](https://github.com/valentynkit/jev-commit): pre-commit hook judging whether the message matches the diff.
- [valentynkit/jev.nvim](https://github.com/valentynkit/jev.nvim): ask the buffer a question, get a quickfix list. Small, single-purpose editor integration.

### Applications

- [fazlerocks/jevmail](https://github.com/fazlerocks/jevmail): inbox triage into reply, update, promotional, and spam lanes.
- [devanshbatham/commit-miner](https://github.com/devanshbatham/commit-miner): classifies commit diffs into fixes, security changes, and CWEs.
- [zhengxuyu/litjev](https://github.com/zhengxuyu/litjev): reproduces the decision layer on an open model by reading option logits. Useful for understanding the shape of the API.

### Directories

- [cobanov/awesome-jev](https://github.com/cobanov/awesome-jev): favours public source and reproducible evidence.
- [logicrw/awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects): every entry pinned to a commit and a decision point.
- [yibie/awesome-jev](https://github.com/yibie/awesome-jev) and [AbdelStark/awesome-typesafe-jev](https://github.com/AbdelStark/awesome-typesafe-jev): categorised field guides.
- [jqueryscript/awesome-agent-skills](https://github.com/jqueryscript/awesome-agent-skills): agent skills in general, sorted by stars. Stars measure attention, not safety.
- [github.com/topics/jev](https://github.com/topics/jev): everything tagged, unfiltered.

Several lists index the same launch-week repositories, and one author can publish many at once.
Prefer the original artifact, and read one that shows a real Jev call over ten that describe one.
The [resource guide](skills/jev-builder/references/resources.md) is the version your agent reads.

Independent community project. [MIT license](LICENSE).
