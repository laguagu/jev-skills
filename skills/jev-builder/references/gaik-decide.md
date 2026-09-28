# GAIK projects: gaik-decide

GAIK-internal. GAIK apps call Jev, and the team's own open reranker at CSC, through the team
service gaik-decide rather than a TypeSafe key of their own. The README of
GAIK-project/gaik-decide (a private repository) is the source of truth; check it before relying
on a limit below.

- **Base URL:** `https://gaik-decide.2.rahtiapp.fi`, or `http://gaik-decide:8080` from a pod in
  the Rahti namespace `gaik`. The Finnish guide is at `/guide.pdf`, the OpenAPI page at `/docs`.
- **Key:** send `x-api-key: <key>` or `Authorization: Bearer <key>` on every `/v1` call; a
  missing or wrong key is `401`. Each person or app gets its own key from the service's
  maintainer. Keep it on the server like any other secret.

## Endpoints

| Call | Request → response | Backend |
| --- | --- | --- |
| `POST /v1/rerank` | `{query, documents, model?, instructions?, criteria?, top_k?}` → `{model, results: [{index, id, score}], usage}`, best first | `"local"` (default) or `"jev"` |
| `POST /v1/classify` | `{text, labels, instructions?}`, labels as `{name: description}` or a list of names → `{label, confidence, probabilities, model, usage}` | Jev Choice |
| `POST /v1/verify` | `{claim, source}` → `{supported, probability, model, usage}`; `supported` means `probability >= 0.5` | Jev binary Noul, the measured [citation wording](questions.md#accepting-a-citation) |
| `POST /v1/systemone` | A TypeSafe request body, forwarded unchanged; `model` defaults to `jev-1.13.0` | TypeSafe |
| `GET /v1/models` | TypeSafe's model list | TypeSafe |
| `GET /health` | `{status, local_model, jev}`, no key needed | — |

A document is a string or `{id, text, title?}`. In the results, `index` is its position in the
request and `id` is yours or that index. For Jev, `instructions` and `criteria` replace the
default question. The official TypeSafe SDKs work unchanged with this service as the base URL and
the gaik-decide key as the API key. Pin `jev-1.13.0` there too: the SDKs otherwise send
`jev-latest`, which moves when TypeSafe ships.

## Limits and failures

- A rerank takes at most 100 documents, each cut at 4,000 characters; a body at most 2 MB. The
  route times out at 60 s.
- Jev has a daily cap of 5,000,000 input tokens per key, about $0.21, reset at midnight UTC.
  Past it, calls return `429`; the `x-jev-tokens-remaining` header shows what is left. At 10
  segments a search that is roughly 750 searches a day, by QAdental's estimate.
- Jev retries fit in 50 s, then `504`; a non-JSON answer from TypeSafe is `502`. Without a
  TypeSafe key configured, the Jev calls return `503` and local rerank still works.
- The local model scores one request at a time; a request that waits more than 30 s is `503`.
- The service logs key names and numbers only, never query, document or key text.

## Choose a rerank backend

- **`"jev"`** when the text may go to TypeSafe: the best measured quality in QAdental
  ([Evaluations](evaluations.md#search-in-production)) at 0.3–0.7 s for 10 documents. The text
  goes from the pod straight to TypeSafe's API, not through GAIK's Azure resources. Send the top
  10 as whole segments, each with its `title`.
- **`"local"`**, the default, when text must stay at CSC: `cross-encoder/mmarco-mMiniLMv2-L12-H384-v1`
  on the pod's CPU. Send the top 5, each cut to about 1,200 characters; 10 documents take about
  1.6 s and 30 about 4.7 s.
- Pass your own `instructions` and `criteria` to Jev when you know the corpus. The default is a
  generic relevance question that has not been measured on its own; the guide has the measured
  QAdental wording.
- Keep search independent of the service: a client deadline well inside the route's (QAdental
  uses 4 s for Jev and 3 s for local), a cooldown after a timeout or an error, and the first-stage
  order as the fallback ([Rerank](rerank.md#keep-search-independent-of-the-reranker)).

## Open models at CSC

- **Rahti, where gaik-decide runs, has CPUs only.** A small cross-encoder fits a 2-core pod.
  `bge-reranker-v2-m3` is six times slower than the default, and int8 does not rescue it on
  Rahti's CPUs, which lack VNNI instructions. Laya needed 20–26 s a query on a workstation CPU
  and scored far below the fused order ([Evaluations](evaluations.md#open-models)).
- **LUMI and Roihu are batch systems.** Use their GPUs for offline scoring and evaluation, as the
  `Qwen3-Reranker` comparison did on LUMI, not for a per-search endpoint.
- **An always-on GPU means a cPouta VM** requested through CSC's service desk. A P100 16 GB at
  60 BU/h costs about 21 times the gaik-decide pod, is too small for `Qwen3-Reranker-8B` and too
  old for vLLM. At QAdental's volume, the 4B model it could serve buys roughly what Jev already gives.
