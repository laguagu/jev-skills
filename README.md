# Jev Skills

Agent skills for building with [Jev](https://typesafe.ai/), TypeSafe's model for typed decisions.
Jev returns choices, scores and yes probabilities that code acts on; use an LLM when you need generated text.
The [official skill](https://github.com/typesafe-ai/skills) covers the API. These cover the rest:
where a decision fits, how to word the question, what code does with the answer, and how to show it works.

## Install

```sh
npx skills add typesafe-ai/skills --skill typesafe-ai
npx skills add laguagu/jev-skills --skill jev-builder
```

Choose your agent when prompted, or add `--agent codex`. [Claude Code plugin and other options](INSTALL.md).
Live calls need a `TYPESAFE_API_KEY` from the [TypeSafe console](https://console.typesafe.ai);
installing a skill makes no API calls.

## Measured, not assumed

<img src="docs/question-effect.svg" alt="Top-1 recall on two Finnish corpora with no reranking, with Jev asked a question written for the other corpus, and with a question written for this one" width="760">

The skills' advice comes from [jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench),
five benchmarks on Finnish text run for this kit in September 2026:

| Benchmark | What the skills take from it |
| --- | --- |
| [Reranking](https://github.com/laguagu/jev-rerank-bench#1-reranking) | On MuPLeR-fi, top-1 was 73.0% with no reranking, 77.0% with Jev asked the question written for the other corpus, and 96.5% with a question written for this one. Batching 15 candidates per request was cheaper than one request per candidate, at the same quality |
| [Code search](https://github.com/laguagu/jev-rerank-bench#2-code-search-without-an-index) | Rerank an index's top 30 rather than scan without one: with Finnish queries, the index plus a Jev rerank put 90% of labelled files in its top five, while jegrep with no index found 42% of them among everything it returned |
| [Classification](https://github.com/laguagu/jev-rerank-bench#3-classification) | One-sentence label definitions cut errors by about 40%; with the ten nearest labelled examples in state, Jev tied a trained classifier and answered in about 0.24 s, against 1.5 s or more for the chat models tested |
| [Citation checking](https://github.com/laguagu/jev-rerank-bench#4-citation-checking) | One demanding yes/no question reached 88.1% balanced accuracy; sending the doubtful 19% to gpt-6-sol reached 92.5% at about a quarter of its cost |
| [Lecture transcripts](https://github.com/laguagu/jev-rerank-bench#5-reranking-lecture-transcripts) | Reordering only the first 10 segments raised long-question hit@1 from 54.3% to 65.7% and kept one-to-three-word terms at 100%, where cross-encoders reordering all 30 lowered them |

Where outside evaluations agree, and where they do not: [What others measured](skills/jev-builder/references/evaluations.md).

## Skills

| Skill | Use it to |
| --- | --- |
| [jev-builder](skills/jev-builder/SKILL.md) | Design, word and debug a decision: setup, patterns, reranking, checklist screening, evidence |
| [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md) | Measure a finished workflow: accuracy, review rate, latency, cost |

> Use jev-builder to rerank our search results. Keep the first-stage order as the fallback and compare top-1 before and after.

## What you can build

| Need | Jev's part | Start here |
| --- | --- | --- |
| Route a ticket or a model call | A Choice over the routes plus `unknown`; urgency as a separate Noul | [Request](examples/decisions/requests/routing.json) |
| Rerank search results | One Noul per candidate, about 15 per request | [Guide](skills/jev-builder/references/rerank.md) · [example](examples/rerank/README.md) · [cookbook](https://docs.typesafe.ai/cookbooks/rerank_typesafe) |
| Pick an agent tool | A Choice over the tools plus `none` | [Request](examples/decisions/requests/tools.json) · [cookbook](https://docs.typesafe.ai/cookbooks/function_calling) |
| Check a citation | A Noul: does the passage fully support the claim? | [Example and report](examples/evidence/README.md) · [cookbook](https://docs.typesafe.ai/cookbooks/citation_check) |
| Screen a document against a checklist | Many independent questions in one request, with a receipt for each decisive answer | [Guide](skills/jev-builder/references/screening.md) |
| Compact agent context | A Noul per tool result: still needed? | [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) |

## Examples

Try one offline, with Node.js 22+ and no key or install:

```sh
git clone https://github.com/laguagu/jev-skills.git && cd jev-skills
node examples/decisions/run.mjs routing --dry-run
```

- [Decisions](examples/decisions/README.md): routing, ranking, tool selection, workflow control, risk scoring and answer verification, with tests for malformed answers, unknown choices and spent retry budgets.
- [Rerank](examples/rerank/README.md): a shortlist reranker with a total deadline and a first-stage fallback, tested against a fake backend.
- [Evidence](examples/evidence/README.md): claim checking with source receipts, and a saved report of a synthetic run whose confidence slider replays the policy without another API call.

## Start with

| Project | What it does |
| --- | --- |
| [altryne/jevify](https://github.com/altryne/jevify) | Makes Jev the agent's default for bulk reading and repeated checks during ordinary work |
| [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp) | Task-shaped MCP tools that validate each answer and fail closed |
| [can1357/jegrep](https://github.com/can1357/jegrep) | Semantic grep without an index; run for this kit in English and Finnish |
| [gargpratyush/jev-router](https://github.com/gargpratyush/jev-router) | Per-turn model routing for Claude Code and Codex |
| [jaredpalmer/kev](https://github.com/jaredpalmer/kev) | Open decision models that serve the same API, for offline development |
| [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review) | Staged code review with thresholds in code |

Everything else, reviewed on September 27, 2026: [ECOSYSTEM.md](ECOSYSTEM.md).

## Contribute

Corrections, examples and ecosystem leads are welcome. Include a primary source or a reproducible
check, use public or synthetic inputs, and record the model version. Run the offline checks in
`examples/` before opening a pull request.

Independent community project. [MIT license](LICENSE).
