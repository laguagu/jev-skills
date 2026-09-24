# Six small decisions

Node.js 22+. Each JSON file is a complete TypeSafe request with synthetic input.
The runner uses the official JavaScript SDK for live calls. It prints a policy decision;
it does not dispatch tickets, send messages, or execute tools.

| Example | Request | Code does |
| --- | --- | --- |
| `routing` | Choice for team + independent Noul for immediate urgency | Sends unknown or uncertain routes to triage |
| `ranking` | One Score per passage, on a 0–3 relevance rubric | Sorts expected scores, or keeps original order when uncertain; preserves all passages |
| `tools` | Choice among listed tools + none | Prints a proposed tool, leaving execution to the application |
| `workflow` | Choice: continue, retry, ask the user, or stop | Counts the retry budget itself; a spent budget or an uncertain answer asks the user |
| `risk` | Score for the damage of a pending action + independent Noul for time pressure | Requires approval from a rubric level up, and on uncertainty |
| `verify` | Two Nouls over a drafted answer: supported by the source, and in scope | Publishes only clear cases, blocks unsupported ones, and sends the band between them to review |

The same shapes cover ordinary classification work: `routing` is a taxonomy Choice with an
unknown outcome, `risk` a rubric that sorts cases into tiers, and `verify` a guardrail.

## Offline

From the repository root; no installation or key needed:

```sh
for example in routing ranking tools workflow risk verify; do
  node examples/decisions/run.mjs "$example" --dry-run
done
node --test examples/decisions/policy.test.mjs
```

## Live

Set up a direct TypeSafe key using [the setup guide](../../skills/jev-builder/references/setup.md).
Put `TYPESAFE_API_KEY=your-key` in a gitignored `.env` at the repository root, then:

```sh
cd examples/decisions
npm install
node --env-file=../../.env run.mjs routing --live
node --env-file=../../.env run.mjs verify --live
```

Any example name works in place of `routing`. Alternatively, set the process environment and
omit `--env-file`. Each command makes one paid request, without automatic retries.
Without `--live` or `--dry-run`, the runner exits.
You can use `bun install --frozen-lockfile` instead of `npm install` with the included lockfile.

These requests use `jev-latest` for discovery; pin a currently supported model for repeatable
comparisons. The SDK version is pinned in `package.json`. Confidence thresholds in `policy.mjs`
are illustrative, not calibrated. Low confidence, unknown choices, and service errors need
separate handling. `Noul` returns P(yes); it has no separate confidence field.

Dry runs and policy tests verify local request/policy behavior, not model accuracy. Edit the
synthetic input and criteria to try your own cases. Keep private inputs out of tracked files.

## Live smoke check

On September 20, 2026, the routing, ranking, and tool requests at commit `9abf769` were run once each
through SDK 0.6.0. All returned `jev-1.13.0`; their resulting policies matched these expectations:

| Example | Observed policy | Request and policy time |
| --- | --- | --- |
| Routing | Billing queue, not immediate | 727 ms |
| Ranking | Retention passage, logging passage, billing passage | 742 ms |
| Tool selection | Propose `search_docs`; execute nothing | 692 ms |

Total reported input: 1,507 tokens. These are three synthetic smoke checks, not an accuracy
benchmark or latency guarantee. The local policy tests cover uncertainty and malformed answers separately.

On September 24, 2026, all six requests at commit `f88ccdf` were run once each through SDK 0.6.0
on Node 24. All returned `jev-1.13.0`, and the three added after the first check behaved as intended:

| Example | Observed policy | Request and policy time |
| --- | --- | --- |
| Workflow | Retry, with the budget counted in code | 676 ms |
| Risk | Approval required, no urgent notification, nothing executed | 672 ms |
| Verify | Blocked: the draft's "support can restore them" is not in the source | 678 ms |

Routing, ranking, and tool selection repeated their earlier policies.
