# 🔎 Jev Evidence Lab

**Build small AI decisions that show their sources.**

Practical [Jev](https://typesafe.ai/) skills, a runnable evidence checker, and an offline
report for exploring when to accept a decision or ask for review. Python 3.11+, no runtime dependencies.

🌱 Independent community project · [MIT](LICENSE) · Synthetic examples · No TypeSafe affiliation

## ⚡ Start here

```sh
git clone https://github.com/laguagu/jev-evidence-lab.git
cd jev-evidence-lab
python lab.py --dry-run                 # inspect requests, no key or API calls
```

For a live run, get a key through [TypeSafe's quickstart](https://docs.typesafe.ai/introduction),
put `TYPESAFE_API_KEY=your-key` in a local `.env`, then:

```sh
python lab.py --env-file .env
python report.py results/latest.json
```

Open `results/report.html`. Move the confidence slider to explore coverage and accuracy
without another API call. Calls are billed; `.env` and `results/` are gitignored.
**No key?** Download the [sample report](examples/report.html) and open it locally.

→ [Full setup & your own dataset](docs/quickstart.md) · [How the decisions work](docs/guide.md)

## 🧩 Skills for your agent

| Skill | What it helps you do |
| --- | --- |
| [TypeSafe official ↗](https://github.com/typesafe-ai/skills/tree/main/skills/typesafe-ai) | Learn Jev's API, primitives, SDKs and integration patterns |
| [jev-evidence-workflow](skills/jev-evidence-workflow/SKILL.md) | Build source-backed decisions with missing and conflicting evidence handled explicitly |
| [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md) | Measure mistakes, review rate, latency and cost on your own labelled examples |

Install the official skill from its maintained upstream and this repo's focused skills:

```sh
npx skills add typesafe-ai/skills --skill typesafe-ai
npx skills add laguagu/jev-evidence-lab --skill jev-evidence-workflow jev-evidence-eval
```

Choose your agent when prompted; add `--agent codex` to target Codex. For Claude Code's
plugin alternative, see the [official instructions](https://github.com/typesafe-ai/skills).
Use one installation method for the official skill.

Then ask your agent:

> Use jev-evidence-workflow to check product claims against our documentation.
> Keep source passages, handle contradictions, and use jev-evidence-eval to measure the result.

Skills provide instructions. They don't include an API key or install the Python lab;
clone this repo if you want the runner and report. [More skill and integration options](RESEARCH.md).

## 🛠️ What can I build?

| You need… | Start with… |
| --- | --- |
| Check whether retrieved passages support an answer | This lab: one claim + passages → decisions + source receipts |
| Select facts from a document without inventing quotes | [Evidence workflow skill](skills/jev-evidence-workflow/SKILL.md) |
| Find a useful confidence threshold | [Evaluation skill](skills/jev-evidence-eval/SKILL.md) and offline report |
| Route requests, rank results, choose tools | [Official cookbooks](https://docs.typesafe.ai/introduction), [LangChain](https://www.langchain.com/blog/building-a-harness-with-jev), [AutoJev](https://autojev.ai/jev-skills) |

Jev returns **typed choices, scores or probabilities**, rather than generated answers.
Several independent questions can share one request. An LLM can still generate the response;
Jev can judge bounded decisions around it. Rules and ordinary classifiers remain useful too.
[Comparison and worked example →](docs/guide.md)

## 📊 What we actually tested

16 short synthetic cases, each repeated twice: **32/32 matched their authored labels**.
Median API round trip **0.68 s**; estimated total API cost **$0.00061**.
At the illustrative 0.8 confidence threshold, 30 were accepted and 2 sent to review.

This is a small smoke test, not a production accuracy claim or an LLM comparison.
A copied quote proves provenance, not correct interpretation; confidence is not proof either.
[Model, date, method, raw results & limits →](docs/measurement.md)

## 🤝 Contribute

Add a useful labelled edge case, a focused skill, or a reproducible comparison.
Include failures and source provenance. Public contributions must use synthetic or explicitly
public material. See [CONTRIBUTING.md](CONTRIBUTING.md) and [related projects](RESEARCH.md).
