# Rerank a search shortlist

Retrieve candidates with BM25, vectors or both; ask Jev about their relevance and sort in code.
Measure shortlist recall first: a reranker cannot recover a passage retrieval never found.
Start with the [official cookbook](https://docs.typesafe.ai/cookbooks/rerank_typesafe) or this
kit's [runnable example](https://github.com/laguagu/jev-skills/tree/main/examples/rerank).

## A question you can copy

Give each candidate a Noul asking whether it answers the query. Include its exact position in
the instructions: question IDs are not visible to the model. Use a Score instead when the
application needs graded relevance, or a Choice when it needs only one winner.

For example, with `query` and `passages` in state:

> Judge only `passages[0]`. Does this passage contain the information needed to answer `query`?
> Yes: it supplies the requested fact, rule or explanation. No: it merely shares the topic or
> vocabulary, omits a required condition, or answers a different question.

Adapt the wording to the task. Add source titles and jurisdiction when they matter and are
available; do not demand provenance the input cannot provide. For short terms, distinguish a
substantial topic from a passing mention. Measure these query types separately.

## Size the batch against the budget

Put several independent candidate questions in one request. The local example starts at 15
candidates; choose a size from actual passage lengths, current [model limits](https://docs.typesafe.ai/models)
and latency measurements. Each question must refer only to its own candidate, even though
state is shared. Compare batching with single-candidate requests before scaling it up.

Keep candidate IDs outside the model's judgment and map returned scores to them in code.
Validate every answer, including finite probabilities in range, and use a stable sort for ties.

## What to measure

Compare the original order with reranking on the same held-out queries. Report shortlist
recall, ranking quality, demotions of previously correct results, end-to-end latency and cost.
Try a shallower rerank when retrieval already works well, and measure long questions and
short keyword queries separately. Choose acceptance thresholds on development data and
report coverage alongside accepted accuracy. A threshold from another corpus is not a default.

For an LLM baseline on identical questions, use the official
[System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python).
Keep sample sizes, model versions, retries and fallbacks in the comparison.
[Published evaluations](evaluations.md#reranking) offer hypotheses to test, not guaranteed gains.

## Keep search independent of the reranker

- Set a total deadline for the entire rerank, including retries and response-body reads.
- If any batch fails or an answer is missing or malformed, return the original order.
- Use a cooldown for repeated service failures; reject an oversized request without disabling unrelated searches.
- Cache scores only while the query, candidate content, question and model remain compatible.

The [example](https://github.com/laguagu/jev-skills/tree/main/examples/rerank) implements
ordering, deadlines and fallback with a fake backend. Its CLI also covers the SDK's
mid-response timeout behavior; see [setup](setup.md#troubleshooting) before changing that transport.
