# Measured results

Our own runs on Finnish text first, then independent evaluations. Read every figure as a prior
for your own measurement: each ran on its own data and question wording, and most are single
runs. Numbers were checked against each repository's README or report.

Contents: [our runs on Finnish](#our-runs-on-finnish) ([search in production](#search-in-production) ·
[citation check](#citation-check) · [open models](#open-models)) · independent: [reranking](#reranking) ·
[gates and calibration](#gates-and-calibration) · [wording and context](#wording-and-context) ·
[classification](#classification) · [sources](#sources)

## Our runs on Finnish

`jev-1.13.0`, September 2026, single runs on small sets: treat a gap of one query as noise. The
public details are in [jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench). The
production search figures are GAIK-internal, from gaik-evals' QAdental reports `RERANKING.md`
and `CSC-RERANKER.md`.

### Search in production

QAdental, a Finnish dental-lecture video search (54 videos, 39 h, hybrid retrieval), measured end
to end on September 27 with 70 long questions and 15 short terms of one to three words, k = 10:

| Reranker | Long hit@1 | Short hit@1 | Added mean latency, question / term |
| --- | --- | --- | --- |
| None | 0.529 | 0.933 | — |
| Jev, top 10 as whole segments with the video title | 0.671 | 1.000 | 0.33 s / 0.30 s |
| `mmarco-mMiniLMv2-L12` on a 2-core CPU pod, top 5 cut to 1,200 characters | 0.600 | 1.000 | 0.70 s / 0.60 s |

Every search was reranked; none failed open. Jev gained 13 long questions and lost 3, the
cross-encoder gained 12 and lost 7. Three runs without reranking scored 0.543, 0.529 and 0.529.
The Jev question was written for this corpus and scored on the same queries, so its figure is an
upper estimate. At 10 segments a search, Jev costs an estimated $0.27 per thousand searches.

- **Size the reranked head per reranker.** The first production build sent Jev a question's
  whole pool of 20 and the cross-encoder the top 10. Jev scored 0.643 and lifted hit@10 from
  0.886 to 0.971, but pushed a hand-annotated customer query's only relevant video out of the top
  10; the cross-encoder added 1.5 s and dropped the same case to second. Narrowed to 10 and 5,
  both kept all three customer cases first, Jev's hit@1 rose and the cross-encoder's added time
  halved. Over 10, Jev can no longer lift a segment from below rank 10; what it gains is the
  first result, which is where users judge the search.
- **Cross-encoders promote passing mentions of a short term.** Offline, reordering all 30,
  `bge-reranker-v2-m3` took short terms from 0.933 to 0.600 and Voyage `rerank-2.5` to 0.800.
  With a head of 5, every model measured reached 1.000. Jev's question says a short term must be
  a substantial topic of the segment; it never fell below the fused order at either depth.
- **Give Jev the whole segment and its title; cut text for a small cross-encoder.** Without the
  video title, Jev's offline long hit@1 at 10 was 0.614 instead of 0.657. A 1,200-character
  Finnish segment is about 320 tokens, inside the cross-encoder's 512-token window.

### Citation check

gpt-6-sol wrote Finnish claims about 120 MuPLeR-fi passages and labelled them. It is also judged,
so its lead may carry home advantage
([method and results](https://github.com/laguagu/jev-rerank-bench/tree/main/verify)).

- **Clear-cut claims.** On 360 claims that the passage supports, contradicts or says nothing
  about, a three-way Choice scored 99.2% against gpt-6-sol's 99.4%, at $0.03 against $0.88 per
  thousand claims (about a thirtieth) and a p50 of 1.1 s against 1.7 s. Every hosted model
  scored 96–99%, so this set separates nothing. Gated at 0.8, Jev answered 96% at 99.7%.
- **Subtle claims.** On 600 claims, 120 supported only by inference and 480 subtly unsupported,
  one demanding binary Noul ([wording](questions.md#accepting-a-citation)) reached 88.1% balanced
  accuracy against gpt-6-sol's 93.2%, at $0.03 against $0.97. The three-way Choice fell to
  81.8%. The Noul caught 72% of dropped conditions and 50% of *may* → *must* shifts, against 93%
  and 97% for gpt-6-sol. Sending the doubtful 19% to gpt-6-sol reached 92.5% at $0.25; that is
  exploratory, because the escalation rules were chosen on the same claims.

### Open models

- **Laya did worse than no reranking and checked citations poorly.** On collective agreements it
  cut top-1 from 31.9% to 8.3%. Reordering QAdental's top 10 it reached 0.186 long and 0.867
  short, at 20–26 s per query on a workstation CPU. It scored 50.0% on the three-way citation set and 56.5% balanced accuracy on the subtle
  one, where chance is 50%. Its GPU latency was not measured.
- **Small cross-encoders run on CPU; better ones need a GPU.** On a 2-core CSC Rahti pod,
  `mmarco-mMiniLMv2-L12` (118M parameters) scored 10 segments of 1,200 characters in 1.56 s, 30
  in 4.7 s and 100 in 15.2 s, in under 1 GiB. `bge-reranker-v2-m3` (568M) took 9.6 s for 10,
  too slow for a search timeout of a few seconds, and int8 ONNX made it only 1.4 times faster on
  that CPU. On one LUMI MI250X GPU die, reordering the top 10 offline, `Qwen3-Reranker-4B`
  matched Jev (0.657 long, 1.000 short) at 0.73 s p50, and the 8B model reached 0.714 and 0.933,
  not a significant gain on 70 questions. `Qwen3-Reranker-0.6B` on the Rahti pod's CPU took
  21–25 s for 5 documents, so even the smallest Qwen3 reranker needs a GPU. Where each can be hosted:
  [GAIK](gaik-decide.md#open-models-at-csc).

## Independent evaluations

Evaluations of `jev-1.13.0` by others, published in September 2026, set against this kit's advice.

### Reranking

- **Batching holds well beyond 15 candidates.** S1Rank put all 100 BM25 candidates in one
  request with a Noul per document: about one nDCG@10 point above one request per document, at
  about a third of the cost. anessbelbati's 30-in-one-call rubric scored 0.692 nDCG@10 in 422 ms
  for $0.45 per thousand queries; the same judgment one pair per request scored 0.670 in 8.2 s
  for $0.81. LanceDB's subset test (40 per request) matched or beat one per request, at a p50 of
  351 ms instead of 877 ms. This kit's 15 is a tested size, not a limit.
- **Choice picks one; Noul or Score orders many.** A single Choice over the candidates, with a
  none option, had the best top pick in anessbelbati's runs (76%) but a lower nDCG than the rubric.
  In S1Rank a "which is best?" Choice ranked well below the per-document Noul (65.6 against 73.7
  nDCG@10 on TREC DL19). Use a Choice when code needs the answer, and one judgment per candidate
  when it needs an order.
- **Level with commercial rerankers on some English sets, not everywhere.** Jev's rubric tied Cohere Rerank 4
  Pro on eight English datasets (0.692 against 0.691) at a fifth of the price, and S1Rank's
  per-document Noul beat bge-reranker-v2-m3 and monoT5-3B on TREC-COVID, NFCorpus and SciFact. On
  French, Qwen3-Reranker-4B beat every Jev setup. Parallel found Jev comparable to its internal
  reranker (nDCG@10 about 0.7). Measure on your language before choosing.
- **A cross-encoder can still win, even in English.** memsearch reranked ten frozen candidates for
  2,172 memory queries in Chinese and again in English translation: Jev raised Recall@5 from 0.7471 to 0.7941 and Voyage
  rerank-3 to 0.8187, and Voyage led on MRR@10 (0.7754 against 0.6884) in both languages, at $0.120
  against Jev's $0.171 per thousand queries. Its authors kept Jev as "an optional provider, rather
  than a new default". They also used a third batch layout: every candidate's text inside its own
  Noul, with the query alone in the shared state.

### Gates and calibration

- **A gate learned on one collection does not transfer.** In S1Rank, Jev was well calibrated on
  TREC-COVID (ECE 0.023) and overconfident where relevant documents were rare; recalibration
  held within a collection but not across collections. ASSAY-001's pre-registered intent test of
  `jev-latest` on September 18 saw the same split: chosen-option probabilities were calibrated on
  CLINC150 (ECE 0.0204) and overconfident on Banking77 (ECE 0.0936). Choose thresholds per task and per corpus.
- **Confident is not the same as right.** On 18 social-science annotation tasks, items Jev answered
  with confidence above 0.9 had a median accuracy of 0.815, yet on one task, empathy in
  peer-support dialogue, it was confident while performing poorly (arXiv 2609.24574). Check a
  gate's accepted cases against labels on every task you route.
- **Uncertainty says how hard a query is, not who would do better.** S1Rank's routing of
  uncertain queries to another reranker did no better than random.
- **Answers vary slightly between identical requests.** 52% of S1Rank's probabilities changed
  across byte-identical requests, by small amounts. TypeSafe's own self-consistency recipes agree:
  over 15 repeats a Noul's mean per-question standard deviation was 0.0102, yet one question ranged
  from 0.43 to 0.53, across a 0.5 threshold; a Choice flipped its pick on 2 of 8 questions, and
  acting only when the top probability was at least 0.60 gave 99.2% agreement while deciding 74.2%
  of answers automatically ([Noul](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook),
  [Choice](https://docs.typesafe.ai/cookbooks/consistency_choice_cookbook)). Cache answers when
  reproducibility matters, and do not tune a threshold finer than that noise.
- **A tool can run the sweep.** [abhixhek/jevcal](https://github.com/abhixhek/jevcal)
  picks a threshold per question on half of your labelled data, checks it on the other half, and
  fails CI when a model update breaks it.

### Wording and context

- **The option's name outweighs its definition.** Swapping which name labels which rubric, with
  everything else unchanged, moved the hosted model's AUC from 0.81 to 0.58; neutral names barely
  moved it (arXiv 2609.26758). Give an option a name that means what its definition says, never one
  that contradicts it.
- **Missing evidence cost more than wording.** On 9,886 emails, adding link destinations, Reply-To
  and attachment metadata to state raised zero-shot accuracy from 93.62% to 97.98% with the
  question unchanged; rewording then added 0.66 points (bitnovus/jev-spam-eval). Before revising a
  question, check that state holds what a person would need to answer it.
- **Say what the system is for.** On 662 labelled prompt-injection messages, telling Jev what the
  protected assistant does raised recall from 74.9% to 95.1%, and accuracy to 96.5% at a plain 0.5
  cut (Gaurav-Gosain/jev-sec-bench). A message that subverts one assistant can be an ordinary
  request to another.

### Classification

- **Near a trained classifier, and complementary to it.** Zero-shot Jev reached 98.64% on
  ham / spam / phishing against 98.87% for a TF-IDF logistic regression trained on the same fields;
  averaging the two reached 99.30%, and Jev's phishing recall was far higher (about 95% against 75%).
- **Frontier LLMs still lead on hard annotation.** Across 15 social-science tasks, Jev trailed the
  best LLM per task on 14, by a median 11.6 macro-F1 points, at a median 44 times lower cost
  (arXiv 2609.24574). Choose it for cost, latency and a usable probability, and route what matters.
- **Large label sets are a weak spot.** Parallel's in-house models beat Jev on topic
  classification over many labels. On Banking77, a Choice over 77 intents scored 80.1% against
  73.6% for Claude Haiku (jev_playground). Definitions per option ([Questions](questions.md#write-it))
  and nearest labelled examples in state are the measured remedies.
- **Ahead of open reimplementations.** On 1,240 typed questions, Jev scored 0.906 against 0.686
  for Laya and 0.605 for a Qwen2.5-1.5B decoder (sysone-bench; labels drafted by a model and
  corrected by one reviewer).

### Sources

TypeSafe publishes its own dated snapshots rather than a leaderboard, and argues why in
[Antibenchmaxxing](https://typesafe.ai/blog/antibenchmaxxing). On its
[workflow evals](https://evals.typesafe.ai), averaged over four workflows, Jev scored 67.8% against
73.1% for Claude Opus 5, at about $0.0004 against $0.1761 per case; the reference labels are the
averaged answers of GPT-6 Astra and Claude Fable 5.1, so the figure measures agreement with those
models, not with people.

| Evaluation | What it measured |
| --- | --- |
| [zaesho/S1Rank](https://github.com/zaesho/S1Rank) | Reranking BM25 top-100 on TREC DL and BEIR, calibration, nondeterminism; paper and every raw response |
| [anessbelbati/jev-rerank-bench](https://github.com/anessbelbati/jev-rerank-bench) | Jev setups against Cohere Rerank 4, zerank-2 and open rerankers on eight English datasets, plus BRIGHT, negation and French sets |
| [LanceDB `TypeSafeReranker` batching](https://github.com/lancedb/lancedb/blob/main/python/benchmarks/typesafe_batching.md) | Batch size 40 against 1 on a 100-query GooAQ subset; a subset test, not a full benchmark |
| [arXiv 2609.24574](https://arxiv.org/abs/2609.24574) | Decision models for text annotation in computational social science, with LLM escalation |
| [arXiv 2609.26758](https://arxiv.org/abs/2609.26758) | Option names against rubric text in a constrained decision head |
| [bitnovus/jev-spam-eval](https://github.com/bitnovus/jev-spam-eval) | Zero-shot email classification, context enrichment, and a trained baseline |
| [Parallel: testing Jev](https://parallel.ai/blog/testing-jev) | Reranking, topic and freshness classification against Parallel's in-house systems; a company blog without raw data |
| [JYeswak/jev_playground](https://github.com/JYeswak/jev_playground) | Pre-registered measurements behind small agent tools, including where Jev lost |
| [jourdanlabs/assay-001](https://github.com/jourdanlabs/assay-001) | Pre-registered calibration and type-safety check: one Choice per item on Banking77 and CLINC150, every request and response sealed, independently re-scored |
| [instax-dutta/sysone-bench](https://github.com/instax-dutta/sysone-bench) | Jev, Laya and Qwen PCD on identical bytes, with paired tests |
| [zilliztech/memsearch reranking evaluation](https://github.com/zilliztech/memsearch/blob/main/evaluation/reranking-evaluation.md) | `jev-1.13.0` against Voyage rerank-3 over frozen candidates for Chinese and English memory queries; aggregates and input hashes only |
| [Gaurav-Gosain/jev-sec-bench](https://github.com/Gaurav-Gosain/jev-sec-bench) | Prompt injection on deepset/prompt-injections and matched vulnerable-code pairs, with raw per-sample output |
| [laguagu/jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench) | This kit's own runs on Finnish text: reranking, code search, classification, citation checks, lecture transcripts |
