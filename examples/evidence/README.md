# Evidence checking

A Python 3.11+ example with no runtime dependencies. Jev judges whether supplied passages
support or contradict a claim. Code combines the answers and preserves the source text.

Run from this directory:

```sh
cd examples/evidence
python check.py --dry-run
python -m unittest discover -s tests
```

For a paid run, use `TYPESAFE_API_KEY` in the process environment or an existing env file:

```sh
python check.py --env-file /path/to/your/.env
python report.py results/latest.json
```

Open `results/report.html`. Move its confidence slider to replay the policy without another
API call. Only `TYPESAFE_API_KEY` is read from the selected env file, in memory.
This program does not load `.env` automatically. See [API setup](../../skills/jev-builder/references/setup.md).

**No key?** Download the [saved report](report.html) and open it locally.
[Raw results](run.json) · [Measurement and limits](measurement.md) · [Design](design.md)

## Your own cases

Pass a UTF-8 JSON array of labelled claims and source passages:

```json
[
  {
    "id": "retention-policy",
    "claim": "Logs are retained for 90 days.",
    "passages": ["Logs are permanently deleted after 7 days."],
    "expected": "contradicted"
  }
]
```

```sh
python check.py --cases my-cases.json --dry-run
python check.py --cases my-cases.json --env-file /path/to/your/.env --out results/my-run.json
python report.py results/my-run.json --out results/my-report.html
```

IDs must be unique. Expected labels are `supported`, `contradicted`, `conflicting`, or
`not_stated`. An empty passages array produces `not_stated` without an API call.
The request contains only the claim and passages, never the expected labels.
Keep private inputs under ignored `results/` or outside the repository.

This example pins the model and pricing basis used by the saved experiment.
Check [current models and pricing](https://docs.typesafe.ai/models) before interpreting
new cost estimates. The saved run is a small smoke test, not a production accuracy claim.
