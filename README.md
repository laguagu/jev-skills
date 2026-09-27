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

To have the agent itself use Jev for bulk reading and repeated checks during ordinary work, add
[altryne/jevify](https://github.com/altryne/jevify) from its upstream: `npx skills add altryne/jevify`.

## Skills

| Skill | Purpose |
| --- | --- |
| [jev-builder](skills/jev-builder/SKILL.md) | Setup, decision patterns and the official recipe for each, question wording and diagnosis, reranking, source-backed evidence |
| [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md) | Accuracy, review rate, latency, and cost of a finished workflow |

## Use

> Use jev-builder to rerank our search results. Keep the first-stage order as the fallback and compare top-1 before and after.

Live calls need a `TYPESAFE_API_KEY` from the [TypeSafe console](https://console.typesafe.ai).
Installing a skill makes no API calls.

## Measured, not assumed

<img src="docs/question-effect.svg" alt="Top-1 recall on two Finnish corpora with no reranking, with Jev asked a question written for the other corpus, and with a question written for this one" width="760">

The skill's advice comes from [jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench),
four benchmarks on Finnish text run for this kit with `jev-1.13.0`:

| Benchmark | What the skill takes from it |
| --- | --- |
| [Reranking](https://github.com/laguagu/jev-rerank-bench#1-reranking) | On MuPLeR-fi, a question written for the corpus raised top-1 from 77.0% to 96.5%, while the rerankers compared were within 4.5 points of each other. Fifteen candidates per request cost less than one each, at the same quality |
| [Code search](https://github.com/laguagu/jev-rerank-bench#2-code-search-without-an-index) | Rerank an index's top 30 rather than scan without one: with Finnish queries, the index plus Jev found 90% of labelled files in its top five, and jegrep with no index found 42% |
| [Classification](https://github.com/laguagu/jev-rerank-bench#3-classification) | One-sentence label definitions cut errors by about 40%; ten labelled examples in state tied a trained classifier |
| [Citation check](https://github.com/laguagu/jev-rerank-bench#4-citation-check) | One demanding yes/no question reached 88.1%; sending the doubtful 19% to gpt-6-sol reached 92.5% at a quarter of its cost |

Where outside evaluations agree, and where they do not: [What others measured](skills/jev-builder/references/evaluations.md).

## Examples

Clone the repository to run these. The skills work without them.

- [Decisions](examples/decisions/README.md): routing, ranking, tool selection, workflow control, risk scoring, and answer verification. Offline dry runs, plus tests for malformed answers, unknown choices, and spent retry budgets.
- [Evidence](examples/evidence/README.md): claim checking with source receipts, and a saved report whose confidence slider replays the policy without another API call.

## Ecosystem

SDKs, provider and framework integrations, other skills, MCP servers, open models, applications,
and independent evaluations, reviewed on September 27, 2026: [ECOSYSTEM.md](ECOSYSTEM.md).

Independent community project. [MIT license](LICENSE).
