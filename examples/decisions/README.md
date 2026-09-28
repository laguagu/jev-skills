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
node --test examples/decisions/*.test.mjs
```

With the SDK installed, the tests also run the runner in a child process against a loopback
server, using a synthetic key. A response that stalls after headers or partway through its
body must produce only the controlled failure message and exit 1, after one attempt. These
tests take about 30 seconds and skip when the SDK is absent; they make no paid calls.

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

The SDK uses `TYPESAFE_BASE_URL` when set, otherwise its default TypeSafe endpoint.
Both JavaScript runners use a [shared fetch](../fetch-whole-body.mjs) that reads the whole
response body before returning it to the SDK, so a timeout during the body read is caught
by the runner's existing error handler ([SDK issue](https://github.com/typesafe-ai/typesafe-sdk-js/issues/2)).

These requests use `jev-latest` for discovery; pin a currently supported model for repeatable
comparisons. The SDK version is pinned in `package.json`. Confidence thresholds in `policy.mjs`
are illustrative, not calibrated. Low confidence, unknown choices, and service errors need
separate handling. `Noul` returns P(yes); it has no separate confidence field.

Dry runs and policy tests verify local request/policy behavior, not model accuracy. Edit the
synthetic input and criteria to try your own cases. Keep private inputs out of tracked files.

## Live smoke check

The requests were run live through SDK 0.6.0, once per example per run: routing, ranking and
tools on September 20, 2026 (commit `9abf769`), then all six on September 24 (commit `f88ccdf`,
Node 24). Every response reported `jev-1.13.0`, every policy matched its expectation, and the
recorded request-and-policy times ranged from 672 to 742 ms. For example, `verify` blocked a draft whose claim that
"support can restore them" is not in the source. These are synthetic smoke checks, not an
accuracy benchmark or a latency guarantee; the policy tests cover uncertain and malformed answers.
