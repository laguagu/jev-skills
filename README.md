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
| [jev-builder](skills/jev-builder/SKILL.md) | Setup, decision patterns and the official recipe for each, question wording and diagnosis, reranking, source-backed evidence |
| [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md) | Accuracy, review rate, latency, and cost of a finished workflow |

## Use

> Use jev-builder to rerank our search results. Keep the first-stage order as the fallback and compare top-1 before and after.

Live calls need a `TYPESAFE_API_KEY` from the [TypeSafe console](https://console.typesafe.ai).
Installing a skill makes no API calls.

## Measured, not assumed

<img src="docs/question-effect.svg" alt="Top-1 recall on two Finnish corpora with no reranking, with Jev asked a question written for the other corpus, and with a question written for this one" width="760">

The guidance comes from runs like this one. On MuPLeR-fi, rewriting the question for the corpus
raised top-1 recall from 77.0% to 96.5%, while Jev, a cross-encoder, and two chat models
reranking the same shortlists were within 4.5 points of each other.
Method, costs, and the runs behind it: [jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench).

## Examples

Clone the repository to run these. The skills work without them.

- [Decisions](examples/decisions/README.md): routing, ranking, tool selection, workflow control, risk scoring, and answer verification. Offline dry runs, plus tests for malformed answers, unknown choices, and spent retry budgets.
- [Evidence](examples/evidence/README.md): claim checking with source receipts, and a saved report whose confidence slider replays the policy without another API call.

## Ecosystem

SDKs, provider and framework integrations, other skills, MCP servers, open models, and applications,
reviewed on September 27, 2026: [ECOSYSTEM.md](ECOSYSTEM.md).

Independent community project. [MIT license](LICENSE).
