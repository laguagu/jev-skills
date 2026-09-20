# Three small decisions

Node.js 22+. Each JSON file is a complete TypeSafe request with synthetic input.
The runner uses the official JavaScript SDK for live calls. It prints a policy decision;
it does not dispatch tickets or execute tools.

| Example | Request | Code does |
| --- | --- | --- |
| `routing` | Choice for team + independent Noul for immediate urgency | Sends unknown or uncertain routes to triage |
| `ranking` | One Score per passage, on a 0–3 relevance rubric | Sorts expected scores, or keeps original order when uncertain; preserves all passages |
| `tools` | Choice among listed tools + none | Prints a proposed tool, leaving execution to the application |

## Offline

From the repository root; no installation or key needed:

```sh
node examples/decisions/run.mjs routing --dry-run
node examples/decisions/run.mjs ranking --dry-run
node examples/decisions/run.mjs tools --dry-run
node --test examples/decisions/policy.test.mjs
```

## Live

Set up a direct TypeSafe key using [the setup guide](../../skills/jev-builder/references/setup.md).
Put `TYPESAFE_API_KEY=your-key` in a gitignored `.env` at the repository root, then:

```sh
cd examples/decisions
npm install
node --env-file=../../.env run.mjs routing --live
node --env-file=../../.env run.mjs ranking --live
node --env-file=../../.env run.mjs tools --live
```

Alternatively, set the process environment and omit `--env-file`. Each command makes one
paid request, without automatic retries. Without `--live` or `--dry-run`, the runner exits.
You can use `bun install --frozen-lockfile` instead of `npm install` with the included lockfile.

These requests use `jev-latest` for discovery; pin a currently supported model for repeatable
comparisons. The SDK version is pinned in `package.json`. Confidence thresholds in `policy.mjs`
are illustrative, not calibrated. Low confidence, unknown choices, and service errors need
separate handling. `Noul` returns P(yes); it has no separate confidence field.

Dry runs and policy tests verify local request/policy behavior, not model accuracy. Edit the
synthetic input and criteria to try your own cases. Keep private inputs out of tracked files.
