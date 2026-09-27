# Rerank a shortlist

Node.js 22+. A small, illustrative reranker: Jev judges each candidate of a first-stage shortlist,
and code sorts by the probability. When Jev does not answer in time or answers incompletely, search
keeps the first-stage order. The ten passages in `shortlist.json` are synthetic help-centre text for
a fictional product; only one of them answers the query.

| File | What it does |
| --- | --- |
| `rerank.mjs` | Builds one request per 15 candidates, validates every answer, applies a total deadline, falls back to the first-stage order, records the model each response reports |
| `rerank.test.mjs` | Offline tests against a fake backend: ordering and ties, incomplete answers, a failed batch, the deadline, 429 and 422 handling |
| `run.mjs` | `--dry-run` prints the requests; `--live` makes one paid request |

The question follows the wording measured in [Rerank](../../skills/jev-builder/references/rerank.md#a-question-you-can-copy);
rewrite its `corpus` field and criteria for your own data.

## Offline

From the repository root; no installation or key needed:

```sh
node examples/rerank/run.mjs --dry-run
node --test examples/rerank/rerank.test.mjs
```

## Live

Put `TYPESAFE_API_KEY` in a gitignored `.env` at the repository root
([setup](../../skills/jev-builder/references/setup.md)), then:

```sh
cd examples/rerank
npm install
node --env-file=../../.env run.mjs --live
```

It makes one request for the ten passages, pinned to `jev-1.13.0`, without retries.

## What the policy does

- **All or nothing.** Every question must come back as a Noul with a probability from 0 to 1, and
  every batch must succeed; otherwise the whole shortlist keeps its first-stage order. A ranking in
  which only some candidates were judged misleads.
- **A total deadline.** The reranker stops waiting after `deadlineMs` and serves the first-stage
  order. It passes no abort signal to the SDK: cancelling a call in SDK 0.6.0 can end the process on
  Node 20 and 22 ([open issue](https://github.com/typesafe-ai/typesafe-sdk-js/issues/2)). The live
  client instead has its own per-attempt timeout and no retries. The tests use a fake backend, so
  they check the policy, not the SDK's timing.
- **A cooldown only on service trouble.** A missed deadline, a connection failure, 401, 403, 408,
  429 or 5xx pauses reranking for `cooldownMs`. A 400, 413 or 422 belongs to that one request, so
  the next search tries again.
- **The model is recorded** as each response reports it, so a result can be traced to a version.

Left out on purpose: a score cache, an admin switch and per-request overrides. Add a short cache
keyed by query and candidate IDs if users page through results; the
[production rules](https://github.com/laguagu/claude-code-nextjs-skills/blob/4827ea8/skills/postgres-semantic-search/references/reranking.md#production-rules-apply-to-any-reranker)
cover the rest. The fixed deadline, cooldown and batch size are illustrations, not tuned values.
