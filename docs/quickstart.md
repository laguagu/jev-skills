# Run the lab

Inspect the requests and run policy tests for free:

```sh
git clone https://github.com/laguagu/jev-evidence-lab.git
cd jev-evidence-lab
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

The committed [sample report](../examples/report.html) and [raw results](../examples/run.json)
let you inspect the experiment without an API key. Download the HTML or serve locally:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8080/examples/report.html`.

## Bring your own evaluation set

Pass a UTF-8 JSON file with labelled claims and their source passages:

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
python lab.py --cases my-cases.json --dry-run
python lab.py --cases my-cases.json --env-file /path/to/your/.env --out results/my-run.json
python report.py results/my-run.json --out results/my-report.html
```

IDs must be unique. Expected labels are `supported`, `contradicted`, `conflicting`, or
`not_stated`. An empty passages array is valid; it produces `not_stated` without an API call.
Invalid datasets fail before any API calls. Review requests locally before a paid run.
The request builder sends only the claim and passages, never the expected labels.
Keep private input files under the ignored `results/` directory or outside this repository.
