# 🧩 Jev Kit

**Skills, small examples, and useful projects for building with [Jev](https://typesafe.ai/).**

Give your coding agent a practical starting point: choose a use case, connect the API,
build a typed decision, and test when it should fall back.

Independent community project · [MIT](LICENSE) · Works with skill-compatible coding agents

## ⚡ Give your agent the skills

Install TypeSafe's official API guidance and this kit's practical companion:

```sh
npx skills add typesafe-ai/skills --skill typesafe-ai
npx skills add laguagu/jev-kit --skill jev-builder
```

Choose your agent when prompted; use `--agent codex` to target Codex. Then ask:

> Use jev-builder and typesafe-ai to add support-ticket routing to this app.
> Help me configure the key, keep an unknown route, and test the fallback.

| Skill | Use it for |
| --- | --- |
| [jev-builder](skills/jev-builder/SKILL.md) | API setup, choosing a pattern, coding examples, and finding useful integrations |
| [jev-evidence-workflow](skills/jev-evidence-workflow/SKILL.md) | Selecting facts and source passages; handling missing or contradictory evidence |
| [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md) | Measuring errors, review rate, latency, and cost on labelled examples |

Install the evidence skills when needed with `npx skills add laguagu/jev-kit`.
Prefer a plugin? [Claude Code installation and package details →](INSTALL.md)

## 🔑 Connect Jev

Create a key in the [TypeSafe console](https://console.typesafe.ai) and set
`TYPESAFE_API_KEY` in your server environment or a gitignored `.env`.
The skills explain setup; they do not supply credentials or make calls on installation.

Use the official [JavaScript](https://github.com/typesafe-ai/typesafe-sdk-js) or
[Python](https://github.com/typesafe-ai/typesafe-sdk-python) SDK.
[Setup, Vercel AI Gateway, and troubleshooting →](skills/jev-builder/references/setup.md)

## 🛠️ Pick a small decision

| Build | Jev's part | Start here |
| --- | --- | --- |
| Support or model routing | Choose a path; estimate urgency separately | [Routing example](examples/decisions/requests/routing.json) |
| RAG filtering or ranking | Score each supplied passage against a rubric | [Ranking example](examples/decisions/requests/ranking.json) |
| Agent tool selection | Select from a closed tool list, including `none` | [Tool selection example](examples/decisions/requests/tools.json) |
| Claim verification | Judge passages; code preserves the original text | [Evidence example & offline report](examples/evidence/) |
| Context compaction | Select old tool results to retain | [fast-jev-compaction ↗](https://github.com/tamaratran/fast-jev-compaction) |

Try a request **offline**, with Node.js 22+ and no key or dependency install:

```sh
git clone https://github.com/laguagu/jev-kit.git
cd jev-kit
node examples/decisions/run.mjs routing --dry-run
```

[Run the examples with your key →](examples/decisions/README.md)

## 🧭 Find the right tool

The [resource guide](skills/jev-builder/references/resources.md) maps needs to official SDKs,
skills, LangChain, AutoJev, compaction, MCP, and community examples. Start with
[awesome-jev](https://github.com/yibie/awesome-jev) for a broader directory or
[Jev AI Hub](https://jevaihub.com/examples/) for more recipes.

Jev returns **choices, scores, and yes probabilities**. It fits bounded judgments inside
software; use an LLM when you need generated text or open-ended reasoning. For exact
conditions, ordinary rules may be enough. Confidence does not establish correctness.
[Patterns, tradeoffs, and example prompts →](skills/jev-builder/references/patterns.md)

## 🤝 Improve the kit

Small examples, useful links, and corrections welcome. Include a primary source or a
reproducible check; use public or synthetic inputs. Keep comparisons measured and the
starting path short. Formerly **Jev Evidence Lab**; its experiment lives under `examples/evidence/`.
