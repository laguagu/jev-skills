# Contributing

Useful contributions solve a specific developer problem: a labelled edge case, a reusable
evidence workflow, or a fair comparison with an equivalent task and inputs.

- Keep `README.md` short; put setup, methodology and details under `docs/`.
- Put each skill in `skills/<name>/SKILL.md` with a precise name and description.
  Link the official TypeSafe skill instead of maintaining a duplicate API manual.
- Use synthetic or explicitly public data. Never submit keys or private documents.
- Describe the failure a code change fixes, and include a targeted check when appropriate.
- Record model/version, dataset, errors, latency and cost for live measurements.
  Don't turn a small example set into a general model-quality claim.

Run these offline checks before a pull request:

```sh
python -m unittest discover -s tests
python lab.py --dry-run
python report.py examples/run.json --out results/sample-report.html
```

Live runs cost money and are optional for documentation and skill changes.
