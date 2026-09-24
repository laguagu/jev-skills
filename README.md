# Jev Skills

Agent skills for building with [Jev](https://typesafe.ai/), TypeSafe's model for typed decisions.
The [official skill](https://github.com/typesafe-ai/skills) covers the API. These cover the rest:
where a decision fits, how to word the question, what code does with the answer, and how to show it works.

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
| [jev-builder](skills/jev-builder/SKILL.md) | Setup, decision patterns, question wording and diagnosis, source-backed evidence |
| [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md) | Accuracy, review rate, latency, and cost of a finished workflow |

## Use

> Use jev-builder to add support-ticket routing. Include an unknown route and test the fallback.

Live calls need a `TYPESAFE_API_KEY` from the [TypeSafe console](https://console.typesafe.ai).
Installing a skill makes no API calls.

## Examples

Clone the repository to run these. The skills work without them.

- [Decisions](examples/decisions/README.md): routing, ranking, tool selection, workflow control, risk scoring, and answer verification. Offline dry runs, plus tests for malformed answers, unknown choices, and spent retry budgets.
- [Evidence](examples/evidence/README.md): claim checking with source receipts, and a saved report whose confidence slider replays the policy without another API call.

## Ecosystem

Reviewed on September 24, 2026 through public repositories and documentation. These are leads,
not endorsements: apart from jegrep, nothing here was run for this kit, and most numbers are self-reported.
Check license, maintenance, and failure paths before adopting any of it.

### Learn

- [TypeSafe docs](https://docs.typesafe.ai/introduction) and [cookbooks](https://docs.typesafe.ai/cookbooks): primitives, patterns, limits, and measured recipes.
- [Confidence guide](https://docs.typesafe.ai/confidence): designing an accept / review / fallback policy.
- [LangChain: building a harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev): worked routing and tool-screening code.
- [Vercel launch notes](https://vercel.com/blog/ai-gateway-jev-model-launch#about-jev): proposed places for Jev in an agent workflow; vendor figures.

### SDKs, providers, and frameworks

- [JavaScript](https://github.com/typesafe-ai/typesafe-sdk-js) and [Python](https://github.com/typesafe-ai/typesafe-sdk-python) SDKs: official clients.
- [System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python): official stand-in for the Python client that answers with OpenAI, Anthropic, or Gemini. An LLM baseline on identical questions.
- Community clients for [Java and Spring AI](https://github.com/spring-ai-community/spring-ai-typesafe), [Swift](https://github.com/krzyzanowskim/TypeSafe), [Ruby](https://github.com/obie/ruby_decision_model), and [Elixir](https://github.com/dannote/jev).
- [Vercel AI Gateway](https://vercel.com/ai-gateway/models/jev), [OpenRouter](https://openrouter.ai/typesafe/jev-1.13), and [Cloudflare Workers AI](https://developers.cloudflare.com/ai/models/typesafe/jev/) also serve Jev, each with its own key and request shape.
- [LangChain `TypeSafeClassifier`](https://docs.langchain.com/oss/python/integrations/providers/typesafe): the three primitives behind a Runnable.
- [Pydantic AI `TypeSafeModel`](https://pydantic.dev/docs/ai/models/typesafe/): agents with a structured `output_type` run on `typesafe:jev-latest` unchanged.
- [LiteLLM pass-through](https://docs.litellm.ai/docs/pass_through/typesafe): proxy the endpoint with logging and spend tracking.

### Agent skills and MCP

- [typesafe-ai/skills](https://github.com/typesafe-ai/skills): the official skill; keep it installed from upstream.
- [dbreunig/building-with-jev-skill](https://github.com/dbreunig/building-with-jev-skill): question design, composition, and diagnosis for `jev-1.13`. No license file at review.
- [altryne/jevify](https://github.com/altryne/jevify): steers an agent to hand bulk semantic checks to Jev during ordinary work, with standard-library Python helpers.
- [wuyoscar/jev-skill](https://github.com/wuyoscar/jev-skill): six skills for triage, documents, eval, UI, and simulation, with recorded requests and responses.
- [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills): routing, memory, compaction, skill selection, and computer and browser use, with fail-open defaults and a shadow mode.
- [AutoJev skills](https://autojev.ai/jev-skills): task and model routing, tool checks, completion review.
- [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp): ten task-shaped MCP tools (verify, screen, rerank, gate…) that fail closed on malformed answers. [itsmostafa/typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp) exposes one general `evaluate` tool instead.
- [tamaratran/fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) and [jev-pruner](https://github.com/tamaratran/jev-pruner): Claude Code plugins that choose which tool results survive compaction and trim long Bash output. Read their hooks before enabling.

### Open and local models

Same request shape, different models. None of these is Jev, so re-measure any threshold you carry over.

- [jaredpalmer/kev](https://github.com/jaredpalmer/kev): 0.8B to 9B decision models on Qwen3.5 with training code. Serves the System One API, so the official Python SDK can point at it.
- [TheoLeeCJ/SemIf-OpenJev](https://github.com/TheoLeeCJ/SemIf-OpenJev): reads option probabilities from open models, including a WebGPU demo that runs in the browser.
- [featherless-ai/simple-jev](https://github.com/featherless-ai/simple-jev): choices, scores, and yes probabilities from Hugging Face model logits, with a keyless demo API.
- [zhengxuyu/litjev](https://github.com/zhengxuyu/litjev): the same idea on Qwen checkpoints. Useful for understanding the shape of the API.

### Browser and computer use

- [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast): picks an operation and its target element in one request over numbered page elements.
- [ndrezn/ts-browser-agent](https://github.com/ndrezn/ts-browser-agent): the same idea on `langchain-typesafe`.
- [realZachi/typesafe-adblock](https://github.com/realZachi/typesafe-adblock): a small extension that asks whether a DOM element is an ad. A minimal per-element decision loop.

### Developer tools

- [can1357/jegrep](https://github.com/can1357/jegrep): semantic grep that scores files by probability, without an embedding index. Run for this kit: it found every labelled file for its own English benchmark queries, but under half when the same questions were asked in Finnish, because its candidates come from a keyword scan ([benchmark](https://github.com/laguagu/jev-rerank-bench#2-code-search-without-an-index)).
- [andududu/jeview](https://github.com/andududu/jeview): a local gateway that records every call and draws it live. Handy when a question misbehaves.
- [sutro-sh/jev-align](https://github.com/sutro-sh/jev-align): finds uncertain rows, asks you to label them, and proposes a better question definition with GEPA.
- [valentynkit/jev-commit](https://github.com/valentynkit/jev-commit): pre-commit hook judging whether the message matches the diff.

### Applications

- [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review): staged code review. A Noul risk matrix, then evidence selection and severity scores, with thresholds in code.
- [kyotofin/tax-doc-classifier](https://github.com/kyotofin/tax-doc-classifier): a Choice over 261 IRS forms per page, scored strictly with a confidence gate and a reproducible eval.
- [fazlerocks/jevmail](https://github.com/fazlerocks/jevmail): inbox triage into reply, update, promotional, sales, and spam trays, with an urgency score.
- [devanshbatham/commit-miner](https://github.com/devanshbatham/commit-miner): classifies commit diffs into fixes, security changes, and CWEs.

### Directories

- [cobanov/awesome-jev](https://github.com/cobanov/awesome-jev): favours public source and reproducible evidence.
- [logicrw/awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects): every entry pinned to a commit and a decision point.
- [yibie/awesome-jev](https://github.com/yibie/awesome-jev) and [AbdelStark/awesome-typesafe-jev](https://github.com/AbdelStark/awesome-typesafe-jev): categorised field guides.
- [github.com/topics/jev](https://github.com/topics/jev): everything tagged, unfiltered.

Several lists index the same launch-week repositories, and one author can publish many at once.
Prefer the original artifact, and one repository that shows a real Jev call over ten that describe one.
The [resource guide](skills/jev-builder/references/resources.md) is the version your agent reads.

Independent community project. [MIT license](LICENSE).
