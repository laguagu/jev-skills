# Rerank a search shortlist

A first stage (BM25, vectors, or both) narrows the corpus to 10–30 candidates; Jev judges each
against the query, and code sorts by the probability. A reranker cannot add what the first stage
missed, so measure how often the right answer is on the shortlist at all before tuning the question.

Contents: [the cookbook and this kit](#the-cookbook-and-this-kit) · [a measured question](#a-question-you-can-copy) ·
[batch size](#size-the-batch-against-the-budget) · [what mattered](#what-mattered) ·
[against an LLM](#against-an-llm-asked-the-identical-question) · [keep search independent](#keep-search-independent-of-the-reranker)

Measured figures come from [jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench), run for
this kit on Finnish legal text (MuPLeR-fi, and 160 collective agreements called "the agreements"
below) and on 30–60 s transcript segments of Finnish lecture videos (70 full questions and 15 terms
of one to three words), September 2026. The reranking runs on the legal text requested `jev-latest`
and did not record which model answered; the transcript study used `jev-1.13.0`.

## The cookbook and this kit

TypeSafe's [re-ranking cookbook](https://docs.typesafe.ai/cookbooks/rerank_typesafe) sends one
request per query and candidate. On 40 CLERC legal queries with 30 BM25 candidates each, `jev-1.12`
raised top-1 from 5% to 18%. Batching candidates per request is this kit's measured extension:
about 15 candidates per request, each Noul told which index it judges, bill the shared framing once.
On MuPLeR-fi that took 400 requests instead of 6,000, a p50 of 331 ms instead of 892 ms, and $0.60
instead of $0.93 per thousand queries, at a top-1 recall of 96.5% against 95.5%
([benchmark](https://github.com/laguagu/jev-rerank-bench#batching-is-free-quality)). Independent runs
batched 30, 40 and 100 candidates per request with the same outcome ([Evaluations](evaluations.md#reranking)).
The [parallel-questions cookbook](https://docs.typesafe.ai/cookbooks/parallel_questions)'s 12.2× is a
different claim: many questions over one shared document. Here the passages dominate the tokens, so
the saving lands mostly on latency.

The other passages in a batch did not act as distractors: a Noul told which index it judges scored
as well as one that saw a single passage.

## A question you can copy

The wording below scored 96.5% top-1 on MuPLeR-fi, batched. It is a starting point, not a portable
answer: rewrite `corpus` and the criteria for what separates a right answer in your data.
Instructions can be an object ([structured instructions](https://docs.typesafe.ai/primitives/advanced#structured-instructions)),
so `corpus` describes the data's noise apart from the task.

```ts
import { noul, type Questions } from "@typesafe-ai/sdk";

const instructions = {
  task: "A user asked a question. Decide whether this passage is a source that answers it.",
  corpus:
    "The passages come from legal and policy documents. The question was written from one particular " +
    "passage and may paraphrase it, generalise it, or ask about its subject in different words, so the " +
    "wording will often not match.",
};
const criteria = {
  true:
    "The passage contains the specific statement, rule, finding or reasoning the question asks about, so " +
    "that someone reading this passage alone could answer the question.",
  false:
    "The passage is on a related subject, or shares vocabulary with the question, but does not contain the " +
    "specific statement the question asks about.",
};

// One request per batch of about 15; run the batches in parallel.
const questions: Questions = {};
batch.forEach((_, i) => {
  questions[`p${i}`] = noul(
    {
      ...instructions,
      judge:
        `Judge only the passage at passages[${i}]. The other passages are competing candidates ` +
        "for the same question; do not judge them and do not let them change this answer.",
    },
    criteria,
  );
});
const { answers, model } = await client.systemOne({
  model: "jev-1.13.0", // pin while measuring, and log the model the response reports
  state: { question: query, passages: batch.map(({ text }) => ({ text })) },
  questions,
});
// Map answers[`p${i}`].noul back to candidate IDs, then sort stably so an unscored
// candidate keeps its first-stage place behind every scored one.
```

The counter-example is a provenance clause written for the agreements, where the same provision
recurs in many documents: the passage must come from "the sector, agreement, statute or guideline
the question names or clearly implies". MuPLeR's passages carry only a numeric id, so that condition
could never be met. One passage per request, it scored 66.5%, below the 73.0% of no reranking.
[examples/rerank](https://github.com/laguagu/jev-skills/tree/main/examples/rerank) runs this wording
with synthetic passages (optional, needs the repository).

## Size the batch against the budget

A request takes 64k tokens, of which 32k for the state plus the longest question
([models](https://docs.typesafe.ai/models)). Rate limits change without notice; read them there
rather than hard-coding them.

Measure characters per token on your own language before choosing a batch size. Fitting the
bench's reported input tokens against MuPLeR's passage lengths across three first stages gives
about 2.4 characters per token for Finnish legal text. A MuPLeR batch of 15 passages, about 700
characters each, averaged 7,200 input tokens per request. Longer candidates fill the budget sooner:
the transcript search that scored 30 segments cost $0.82 per thousand queries, which at $0.042 per
million input tokens implies about 19,500 tokens per query, and took a p50 of 2.2 s against 331 ms
for 30 MuPLeR passages.

## What mattered

- **Write the criteria for what separates a right answer in this corpus.** A question written for
  the agreements required the passage to come from the agreement the user named. MuPLeR's passages
  carry only a numeric id, so a Noul that cannot verify its condition answers no: 77.0% batched
  against 96.5% for a question about the passage alone, and 73.0% with no reranking
  ([benchmark](https://github.com/laguagu/jev-rerank-bench#the-largest-effect-is-the-question-not-the-model)).
  Put only the fields the judgment uses in state; an unused id is a distractor.
- **Measure the lexical arm before fusing it.** On the agreements, Postgres full-text search put the
  right section first for 4.2% of queries and vectors for 41.7%; their RRF fell to 31.9%. On MuPLeR,
  where full-text search reached 33.5%, RRF helped: 73.0% against 65.5% for vectors.
- **Put the source title in state** when the passage does not name its own topic. A transcript
  segment rarely does, and the title raised hit@1 on both transcript query sets, if only by one
  query each.
- **Name the short-query case in the criteria.** For a term of one to three words, require its
  subject to be a substantial topic of the segment rather than a passing mention, and say that
  shared vocabulary, such as a word inside a longer compound, does not count. Cross-encoders take
  no criteria and cannot make that distinction: reordering 30 candidates, bge-reranker-v2-m3 cut
  hit@1 on short queries from 93.3% to 60.0%, where Jev with the criterion reached 100%.
- **Rerank only the top 10 when the first stage is already good.** Jev's gain on full questions
  held (hit@1 54.3% unreranked, 62.9% reordering 30, 65.7% reordering the top 10), and the
  cross-encoder's harm on short queries mostly disappeared (back to 93.3%). A deeper shortlist
  rarely pays: 100 candidates instead of 30 raised top-1 on the agreements by 1.4 to 2.8 points
  at 3.3 times the cost.
- **Gate on the top score, with a threshold per corpus.** Accepting the first result only when its
  Noul was at least 0.9 answered 55% of MuPLeR queries with no top-1 error
  ([benchmark](https://github.com/laguagu/jev-rerank-bench#it-knows-when-it-is-right)). On the harder
  agreements the same gate answered 21% at 93% precision, and 0.8 answered 68% at 65%. It still
  separated right from wrong where others did not: Voyage stayed flat (62% answered at 62% at 0.9)
  and gpt-4.1-mini answered 99% at 41%. Calibration did not transfer between collections in an
  independent test either ([Evaluations](evaluations.md#gates-and-calibration)).
- **For ordering, a Noul is enough.** A graded Score per candidate was no better: 52.8% and 52.8%
  one call per candidate on the agreements, 95.5% and 95.5% on MuPLeR. It was more fragile: with
  the question written for the other corpus, the Score fell to 43.1% and the Noul to 48.6%. Keep a
  Score for when code needs the grade itself.
- **Do not re-judge the top 10 one call at a time.** A cascade that re-asked the batched top 10
  singly scored 50.0% against 56.9% for the batched pass alone, at $1.29 against $0.90 per
  thousand queries and 684 against 332 ms.
- **Rerankers fail on the same queries.** On the agreements, batched Jev and Voyage shared 27 of
  their 31 and 30 failures, and for most queries every reranker missed, the answer had never
  reached the shortlist. Combining rerankers has little to gain there; a better first stage has more.
- **Batched Jev rarely demoted a correct first result.** Of the 23 agreement queries that hybrid
  retrieval already had right, batched Jev pushed none off first place, against 2 for Voyage, 8 for
  gpt-4.1-mini and 18 for Laya. On MuPLeR it demoted 1 of 146, as did Voyage. The counts are small:
  they support "safe to add" without proving it.

## Against an LLM asked the identical question

On the agreements, gpt-4.1-mini given the same instructions and criteria, with P(yes) read from its
logprobs, scored 40.3% top-1 against 56.9% for batched Jev, at $7.30 against $0.90 per thousand
queries and 1,756 against 332 ms. On MuPLeR it scored 92.0% against 96.5%. Its logprobs saturate
near 0 and 1, so it cannot gate, and GPT-5.x models rejected `logprobs` at the time of the run.
The comparison that decides an architecture is usually this one, against the LLM call you would
otherwise write, rather than against a dedicated reranker.

## Keep search independent of the reranker

A reranker improves an order that already works; search must not depend on it. The general rules,
fail open, a short timeout, a cooldown, a score cache, an admin switch that defaults to off and an
allowlist for per-request overrides, are written up in a
[public reranking reference](https://github.com/laguagu/claude-code-nextjs-skills/blob/4827ea8/skills/postgres-semantic-search/references/reranking.md#production-rules-apply-to-any-reranker).
With Jev, three details matter beyond them:

- **Set a total deadline, not only a per-attempt timeout.** The JavaScript SDK's defaults are 10 s
  per attempt with no total budget, 2 retries, and `Retry-After` honoured up to 60 s
  ([RetryPolicy](https://docs.typesafe.ai/sdk/javascript/api/interfaces/RetryPolicy)), so one call can
  hold a search for more than 30 s. On the search path, lower `maxRetries` and stop waiting at a
  deadline shorter than the request's own timeout. With SDK 0.6.0, a timeout that fires
  mid-response can end the process on Node 22 and some later releases; [setup](setup.md#troubleshooting)
  has the workaround.
- **Cool down only on service trouble.** A timeout, 5xx, 429 or 401 says the next request will
  probably fail too; skip reranking for a while. A 400, 413 or 422 belongs to one request, such as
  one that was too large; serve the first-stage order for it and keep reranking the rest.
- **Fail the whole rerank when any batch fails.** A ranking in which half the candidates were
  judged and half kept their first-stage place misleads; serve the first-stage order instead.

Cache scores per query and candidate for a few minutes, so paging and repeated searches do not pay
again. [examples/rerank](https://github.com/laguagu/jev-skills/tree/main/examples/rerank) implements
these rules with tests against a fake backend (optional, needs the repository).
