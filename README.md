# Jev Skills

A curated collection of **skills, example projects and tools for [Jev](https://typesafe.ai/)**.
Jev turns text and application state into choices, scores and yes probabilities that code can use.

[Skills](#skills) · [Projects](#projects) · [SDKs & integrations](#sdks--integrations) · [Examples](#examples) · [Learn](#learn) · [Open models](#open-models) · [Evaluations](#evaluations) · [Install](#install)

New to Jev? Start with the [official guide](https://docs.typesafe.ai/introduction),
[cookbooks](https://docs.typesafe.ai/cookbooks) or an [offline example](#examples).

## Skills

### In this repo

| Skill | What it helps with |
| --- | --- |
| [jev-builder](skills/jev-builder/SKILL.md) | Design typed decisions: routing, ranking, tool selection, document screening and evidence checks. |
| [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md) | Evaluate a workflow's accuracy, review rate, latency and cost. |
| [jev-curator](skills/jev-curator/SKILL.md) | Find useful Jev repos and skills, check their sources and keep this collection current. |

### Community skills

| Skill collection | What it helps with |
| --- | --- |
| [typesafe-ai/skills](https://github.com/typesafe-ai/skills) | **Official** API, SDK and decision-design guidance. Install from upstream. |
| [altryne/jevify](https://github.com/altryne/jevify) | Delegate bulk reading and repeated semantic checks to Jev. |
| [wuyoscar/jev-skill](https://github.com/wuyoscar/jev-skill) | Triage, documents, evaluation, UI and simulation, with recorded examples. |
| [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) | Hermes agent routing, memory, compaction and browser workflows. |
| [aaddrick/building-with-typesafe-jev](https://github.com/aaddrick/building-with-typesafe-jev) | Question design and a map of community decision patterns. |
| [UditAkhourii/quicksilver](https://github.com/UditAkhourii/quicksilver) | Batch yes/no, label and score tasks from Claude Code. |
| [dbreunig/building-with-jev-skill](https://github.com/dbreunig/building-with-jev-skill) | Question wording, composition and diagnosis. No repository license at review. |

## Projects

[Agents & MCP](#agents--mcp) · [Search & data](#search--data) · [Developer tools](#developer-tools) · [Applications](#applications) · [Games](#games)

Descriptions summarize public docs and source; listing a project does not mean it was run here.
New entries checked September 27, 2026.

### Agents & MCP

- [jev-mcp](https://github.com/jkudish/jev-mcp) — MCP tools for verification, screening, reranking and decision gates.
- [system-one-connector](https://github.com/itsmostafa/system-one-connector) — A general `evaluate` MCP tool; formerly `typesafe-mcp`.
- [jev-router](https://github.com/gargpratyush/jev-router) — Model routing for Claude Code and Codex.
- [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) — Select which tool results survive Claude Code compaction.
- [jev-pruner](https://github.com/tamaratran/jev-pruner) — Trim long Bash output before it reaches the agent.
- [jev-skill-router](https://github.com/shimo4228/jev-skill-router) — Claude Code hook for skill suggestions; logs decisions in shadow mode by default.
- [jev-ultrafast](https://github.com/browser-use/jev-ultrafast) — Browser agent that selects an action and a page element together.
- [ts-browser-agent](https://github.com/ndrezn/ts-browser-agent) — Browser action selection through LangChain.
- [mobile-jev](https://github.com/droidrun/mobile-jev) — Android action selection over Mobilerun screen controls.

### Search & data

- [jegrep](https://github.com/can1357/jegrep) — Semantic code search without an embedding index.
- [jevgrep](https://github.com/dzhng/jevgrep) — Repository questions answered with relevant files and verbatim excerpts; includes an agent skill.
- [blink](https://github.com/ellipsis-dev/blink) — Codebase search using parallel walkers guided by Jev. No repository license at review.
- [jev-reranker](https://github.com/hotchpotch/jev-reranker) — Python library for reranking and relevance filtering.
- [JevPDF](https://github.com/kylemclaren/jevpdf) — Search a PDF by meaning and highlight matching lines.
- [neo4jev](https://github.com/jexp/neo4jev) — Navigate a Neo4j graph by choosing relationships at each hop.
- [sqlite3-jev](https://github.com/mattn/sqlite3-jev) — Ask Choice, Score and Noul questions from SQL.
- [truffler](https://github.com/kieranklaassen/truffler) — Intent search for Rails with stored labels and query-time reranking.

### Developer tools

- [jev-review](https://github.com/devagrawal09/jev-review) — Code review in stages: risk, supporting evidence and severity.
- [jeview](https://github.com/andududu/jeview) — Local gateway for inspecting requests and answers as they happen.
- [jev-align](https://github.com/sutro-sh/jev-align) — Label uncertain examples and refine question definitions with GEPA.
- [jevcal](https://github.com/abhixhek/jevcal) — Calibrate thresholds and check for drift after model changes.
- [jevals](https://github.com/openlayer-ai/jevals) — Agent-trace evaluations and guardrails.
- [jev-commit](https://github.com/valentynkit/jev-commit) — Pre-commit checks against the staged diff and commit message.
- [jev.nvim](https://github.com/valentynkit/jev.nvim) — Rank functions in a Neovim buffer against a natural-language question.
- [commit-miner](https://github.com/devanshbatham/commit-miner) — Classify commit diffs into fixes, security changes and CWEs.
- [decision-gate](https://github.com/zachlandes/decision-gate) — Shared rate limits, spend limits and answer caching for decision loops.

### Applications

- [jev-cookbook](https://github.com/nexibeo/jev-cookbook) — Runnable Node recipes for support triage, tagging, deduplication, search and more.
- [docjev](https://github.com/jerryjliu/docjev) — Classify documents and split document packets using parsed page text.
- [tax-doc-classifier](https://github.com/kyotofin/tax-doc-classifier) — Classify IRS forms page by page, with an evaluation harness.
- [jevmail](https://github.com/fazlerocks/jevmail) — Inbox triage with categories and urgency scores.
- [jev-usecases](https://github.com/kenhuangus/jev-usecases) — Workflow examples that map decisions to automatic action, confirmation or review.
- [typesafe-adblock](https://github.com/realZachi/typesafe-adblock) — Browser extension demonstrating per-element ad detection.

### Games

- [typesafe-mario](https://github.com/fhshaik/typesafe-mario) — Choose Mario actions from structured emulator state. No repository license at review.
- [OneVOneJev](https://github.com/emrickgarrett/OneVOneJev) — Browser arena with a Jev-controlled opponent. No repository license at review.

## SDKs & integrations

### Clients

| Language | Client |
| --- | --- |
| <img src="docs/logos/javascript.svg" width="16" height="16" alt=""> JavaScript / TypeScript | [Official SDK](https://github.com/typesafe-ai/typesafe-sdk-js) |
| <img src="docs/logos/python.svg" width="16" height="16" alt=""> Python | [Official SDK](https://github.com/typesafe-ai/typesafe-sdk-python) · [LLM baseline adapter](https://github.com/typesafe-ai/system-one-adapter-python) |
| <img src="docs/logos/spring.svg" width="16" height="16" alt=""> Java | [Spring AI TypeSafe](https://github.com/spring-ai-community/spring-ai-typesafe) |
| <img src="docs/logos/swift.svg" width="16" height="16" alt=""> Swift | [TypeSafe](https://github.com/krzyzanowskim/TypeSafe) |
| <img src="docs/logos/ruby.svg" width="16" height="16" alt=""> Ruby | [ruby_decision_model](https://github.com/obie/ruby_decision_model) |
| <img src="docs/logos/elixir.svg" width="16" height="16" alt=""> Elixir | [jev](https://github.com/dannote/jev) |
| Go / Rust | [typesafe-client](https://github.com/haileyok/typesafe-client) |

### Providers & frameworks

- <img src="docs/logos/vercel.svg" width="16" height="16" alt=""> [Vercel AI Gateway](https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe) · [AI SDK provider](https://ai-sdk.dev/providers/ai-sdk-providers/typesafe-ai)
- <img src="docs/logos/openrouter.svg" width="16" height="16" alt=""> [OpenRouter](https://openrouter.ai/~typesafe/jev-latest) — Hosted decisions endpoint.
- <img src="docs/logos/cloudflare.svg" width="16" height="16" alt=""> [Cloudflare Workers AI](https://developers.cloudflare.com/ai/models/typesafe/jev/) — Jev through a Workers binding.
- <img src="docs/logos/langchain.svg" width="16" height="16" alt=""> [LangChain](https://docs.langchain.com/oss/python/integrations/providers/typesafe) — Typed classification in a Runnable.
- <img src="docs/logos/pydantic.svg" width="16" height="16" alt=""> [Pydantic AI](https://pydantic.dev/docs/ai/models/typesafe/) — Structured agent outputs through TypeSafe.
- [DSPy](https://github.com/stanfordnlp/dspy/tree/main/docs/docs/tutorials/jev_decisions) — Decision types and optimization examples.
- [LanceDB](https://github.com/lancedb/lancedb/blob/main/python/python/lancedb/rerankers/typesafe.py) · [Milvus](https://github.com/milvus-io/milvus-model/blob/main/src/pymilvus/model/reranker/jev.py) — Reranker integrations.
- [Bifrost](https://github.com/maximhq/bifrost/blob/main/docs/providers/supported-providers/typesafe.mdx) · [LiteLLM](https://docs.litellm.ai/docs/pass_through/typesafe) — Gateway integrations.
- [DeepEval](https://github.com/confident-ai/deepeval/tree/main/deepeval/metrics/jev_eval) — Evaluation metrics from typed questions.

## Examples

Small examples included in this repo, with synthetic inputs and offline checks.

| Example | What to try |
| --- | --- |
| [Decisions](examples/decisions/README.md) | Routing, ranking, tool selection, workflow control, risk and answer verification. |
| [Rerank](examples/rerank/README.md) | Rerank a shortlist with a total deadline and the original order as fallback. |
| [Evidence](examples/evidence/README.md) | Check claims against source passages and replay confidence thresholds from saved answers. |

Try a dry run with Node.js 22+; no API key or dependency install needed:

```sh
git clone https://github.com/laguagu/jev-skills.git
cd jev-skills
node examples/decisions/run.mjs routing --dry-run
```

## Learn

- [TypeSafe documentation](https://docs.typesafe.ai/introduction) — Concepts, primitives and API reference.
- [Official cookbooks](https://docs.typesafe.ai/cookbooks) — Worked recipes for routing, retrieval, verification and interactive apps.
- [Use-case map](https://docs.typesafe.ai/concepts/use-case-map) — Find where a typed decision fits.
- [Confidence guide](https://docs.typesafe.ai/confidence) — Decide when to accept, review or fall back.
- [Building a harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev) — Routing and tool screening with LangChain.
- [The Top 20 Jev Skills](https://charliehills.substack.com/p/the-top-20-jev-skills) — Charlie Hills' tour of agents, tools and demos.

### More collections

- [yibie/awesome-jev](https://github.com/yibie/awesome-jev) — Projects grouped by use case.
- [kraayenjon/awesome-jev](https://github.com/kraayenjon/awesome-jev) — Builds, SDKs, guides and community resources.
- [cobanov/awesome-jev](https://github.com/cobanov/awesome-jev) — Projects with public source and reproducible evidence.
- [logicrw/awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) — Entries tied to source commits and decision points.
- [OmniJev/awesome-jev-gallery](https://github.com/OmniJev/awesome-jev-gallery) — Papers, open models and evaluations.

Thanks to these collections and Charlie Hills for discovery leads. Descriptions here are written from the linked primary sources.

## Open models

Alternatives for exploring the decision-model interface locally; these are separate models with their own behavior.

- [kev](https://github.com/jaredpalmer/kev) — Open decision models, training code and a System One API server.
- [SemIf-OpenJev](https://github.com/TheoLeeCJ/SemIf-OpenJev) — Typed decisions from open models, including a browser demo.
- [simple-jev](https://github.com/featherless-ai/simple-jev) — Choices, scores and yes probabilities from model logits.
- [litjev](https://github.com/zhengxuyu/litjev) — Decision API experiments on Qwen checkpoints.
- [AnyJev](https://github.com/nokia-applied-research/AnyJev) — Calibration heads for open models, served through vLLM.
- [Laya](https://github.com/NandhaKishorM/laya) — Local decision models for the three primitives.

## Evaluations

- [TypeSafe workflow evals](https://evals.typesafe.ai) — The provider's workflow measurements.
- [S1Rank](https://github.com/zaesho/S1Rank) — Retrieval benchmarks, calibration and raw responses.
- [sysone-bench](https://github.com/instax-dutta/sysone-bench) — Decision models compared on matching inputs.
- [jev-spam-eval](https://github.com/bitnovus/jev-spam-eval) — Email classification against a trained baseline.
- [JevBench](https://github.com/fstandhartinger/jevbench) — Decision-model comparisons.
- [jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench) — Our separate Finnish retrieval, classification and citation experiments.

More sources and context: [evaluation reference](skills/jev-builder/references/evaluations.md).

## Install

Install the official API skill and this repo's builder skill:

```sh
bunx --bun skills add typesafe-ai/skills --skill typesafe-ai
bunx --bun skills add laguagu/jev-skills --skill jev-builder
```

Replace `jev-builder` with `jev-evidence-eval` or `jev-curator` to install either companion.
Choose your agent when prompted, or add `--agent codex`. [Plugin and other installation options](INSTALL.md).

## Keep the collection current

Ask your agent:

> Use jev-curator to find useful new Jev repos and skills, check the original sources, and update this README.

In a checkout, the agent can read [the skill](skills/jev-curator/SKILL.md) directly.
Contributions welcome: link the original project and explain its use in one sentence.

Independent community collection. [MIT license](LICENSE); linked projects have their own licenses.
