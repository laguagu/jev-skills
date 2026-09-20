# Jev Evidence Lab

**Small decisions. Show the evidence.**

A runnable experiment in checking claims against text with TypeSafe's Jev.
Every decision retains the original source passages. Uncertain cases go to review.
Change the confidence threshold in an offline report and see coverage change without another API call.

Independent community prototype. Not affiliated with TypeSafe. Python 3.11+, no runtime dependencies.
All included examples are newly written synthetic text. No customer documents or private project code.

## Try it

Inspect the requests and run policy tests for free:

```sh
python lab.py --dry-run
python -m unittest discover -s tests
```

Run the 16 examples with your own `TYPESAFE_API_KEY` environment variable, or an existing env file:

```sh
python lab.py --env-file /path/to/your/.env --repeat 2
python report.py results/latest.json
```

Open `results/report.html` in a browser. Only `TYPESAFE_API_KEY` is read from the selected env
file, in memory. This program does not load `.env` automatically. API calls are billed by TypeSafe.
With uv, prefix the commands with `uv run --no-project`.

The committed [sample report](examples/report.html) and [raw results](examples/run.json)
let you inspect the experiment without an API key. Download the HTML or serve locally:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8080/examples/report.html`.

## What happens

1. Supply one claim and its candidate passages. Expected answers stay outside model context.
2. Jev answers one independent `Choice` per passage: supports, contradicts, or irrelevant.
3. Code combines the answers into supported, contradicted, conflicting, not stated, or review.
4. The receipt copies the exact supplied text. Jev does not generate quotations.

The demo conservatively requests review if **any** passage judgment falls below the threshold.
Supporting and contradicting passages together produce `conflicting`. `not_stated` means only
that the supplied passages do not establish the claim; it never means the claim is false.

This demonstrates a general pattern for document QA and evidence triage. It is not a legal
assessment, proof system, retrieval engine, or replacement for human source review.

## Measured on September 20, 2026

Pinned `jev-1.13.0`, 16 unique fixtures × 2 repetitions, sequential calls from this machine:

| Measurement | Result |
| --- | --- |
| API calls | 30 successful; 2 empty inputs handled locally |
| Median successful API round trip | 0.682 s |
| Maximum successful API round trip | 1.142 s |
| Batch wall time | 21.138 s |
| Reported input tokens | 14,518 |
| Estimated API cost | $0.000610 |
| Raw outcome agreement with authored labels | 32/32 |
| At confidence threshold 0.8 | 30 accepted, 2 review, 0 errors |
| Correct among accepted | 30/30 at 93.75% coverage |

Cost is usage multiplied by the documented $0.042 per million input tokens; outputs are free.
It is an estimate, not a bill. The run records model, timestamp, code/data hashes and raw answers.
The [pricing source](https://docs.typesafe.ai/models) was checked on the measurement date.

These fixtures are deliberately short and mostly unambiguous. The same author designed the
questions and labels. **This is a smoke test, not a general accuracy claim.** Repeated calls
measure stability; there are still only 16 unique cases. No LLM comparison was run here.
0.8 is an illustrative threshold, not a calibrated operating point.

## Limitations that matter

- A verbatim quotation can still be misinterpreted. The model can choose the wrong typed answer.
- Candidate coverage is assumed. Long documents need retrieval and context-aware chunking;
  measure missed evidence and qualifiers before applying this approach there.
- English and Finnish have only a few examples here; this does not validate multilingual quality.
- The injection example is one simple negative control, not a prompt-injection security evaluation.
- Time-sensitive or conflicting sources need explicit source/date rules beyond this demo.
- Network/service errors are distinct from model decisions and reduce coverage. This measurement
  runner intentionally makes no automatic retries, so API trouble remains visible.
- Every live report includes its input text. Review and sanitize before publishing your own runs.

## Agent skill

Install TypeSafe's official integration skill with one method:

```sh
npx skills add typesafe-ai/skills --skill typesafe-ai
```

This repository adds [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md), a focused evaluation
procedure rather than a copy of that official skill. From this local checkout:

```sh
npx skills add . --skill jev-evidence-eval --agent codex
```

After publication, the GitHub owner/repo can replace `.`. The local skill directory is portable
Agent Skills content; it does not claim marketplace installation or native plugin registration.
See [research and launch direction](RESEARCH.md) for the ecosystem and packaging recommendation.

## Contribute

Useful additions: ambiguous cases with reviewed labels, a held-out corpus, retrieval coverage
checks, longer-context tests, or an equivalent LLM baseline with the same evidence and decisions.
Include failures and actual latency/usage. Do not submit secrets, customer materials or private code.

## License

MIT. Original fixtures and implementation; TypeSafe and Jev are their respective owner's names.
