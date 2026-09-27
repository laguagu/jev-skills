# Find the right Jev resource

Source review: September 27, 2026. These links are a starting map, not endorsements.
Third-party integrations were inspected through their public documentation; only jegrep, Laya,
and the two cross-encoders under self-hosted rerankers were also run here. Recheck compatibility, maintenance, and license before adopting code.

Contents: [official foundations](#official-foundations) · [framework and language integrations](#framework-and-language-integrations) ·
[integrations and examples](#integrations-and-examples) · [open and local models](#open-and-local-models) ·
[self-hosted rerankers](#self-hosted-rerankers) · [discover something new](#discover-something-new) ·
[packaging references](#packaging-references)

## Official foundations

| Resource | Start here when… |
| --- | --- |
| [TypeSafe docs](https://docs.typesafe.ai/introduction) | Learning state, Choice, Score, Noul, patterns, and API limits |
| [Official TypeSafe skill](https://github.com/typesafe-ai/skills) | Giving a coding agent maintained API and SDK guidance |
| [JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js) / [Python SDK](https://github.com/typesafe-ai/typesafe-sdk-python) | Adding direct API calls to an application |
| [System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python) | Running the same Python request through OpenAI, Anthropic, or Gemini as an LLM baseline; it records retries, usage, and latency per call |
| [Confidence guide](https://docs.typesafe.ai/confidence) | Designing an accept / review / fallback policy |
| [Cookbooks](https://docs.typesafe.ai/cookbooks) | Worked recipes with cached responses, so they replay without a key; the ones below map to this kit's patterns |
| [Vercel launch and use cases](https://vercel.com/blog/ai-gateway-jev-model-launch#about-jev) | Understanding proposed places for Jev in an agent workflow; performance figures are vendor reports |

Cookbooks worth reading before inventing a shape:

- [Re-ranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe): one Noul per query and candidate over a 30-passage BM25 shortlist.
- [Line-by-line search](https://docs.typesafe.ai/cookbooks/semantic_find): a Choice over numbered lines points at the answer, and a Noul in the same request says whether the document answers at all.
- [Structure recovery](https://docs.typesafe.ai/cookbooks/autoformat): Markdown rebuilt from flattened text in two requests; the model only classifies, so every output character comes from the input.
- [Function calling](https://docs.typesafe.ai/cookbooks/function_calling): a Choice per closed-set argument, plus a Noul on whether the user stated it, so the function's default can stand.
- [Entity alignment](https://docs.typesafe.ai/cookbooks/entity_alignment): a three-level Score (different, related, same) sends the middle to a curator, with per-field Nouls showing what disagrees.
- [Classifying RAG passages](https://docs.typesafe.ai/cookbooks/classifying_rag_passages): four Nouls per retrieved passage route it to evidence, conflict, or neither, and keep a planted prompt injection out of the answer.
- [Double-checking citations](https://docs.typesafe.ai/cookbooks/citation_check): a string match catches fabricated quotes first, then a Choice over the quoted section decides support.

Install the official skill with `npx skills add typesafe-ai/skills --skill typesafe-ai`,
or use its documented Claude Code plugin installation. Choose one method for that skill.
This kit links to upstream instead of shipping a competing copy of the official guide.

## Framework and language integrations

Reach for these when the application already lives in one of these frameworks or languages;
a direct SDK call stays the simpler option otherwise. Check whether the integration is released
or still on a default branch before depending on a version.

| Integration | What it gives you |
| --- | --- |
| [LangChain `TypeSafeClassifier`](https://docs.langchain.com/oss/python/integrations/providers/typesafe) | The three primitives behind a Runnable, with probabilities and usage metadata |
| [Pydantic AI `TypeSafeModel`](https://pydantic.dev/docs/ai/models/typesafe/) | An agent with a structured `output_type` runs on `typesafe:jev-latest`; unsupported requests fail before the call |
| [LiteLLM pass-through](https://docs.litellm.ai/docs/pass_through/typesafe) | Proxying the evaluate endpoint with shared keys, logging, and spend tracking |
| [Spring AI TypeSafe](https://github.com/spring-ai-community/spring-ai-typesafe) | A Java client plus judge, guardrail, RAG post-processor, and tool-index integrations |
| [Swift](https://github.com/krzyzanowskim/TypeSafe), [Ruby](https://github.com/obie/ruby_decision_model), [Elixir](https://github.com/dannote/jev) | Community clients; the Ruby gem uses TypeSafe or OpenRouter depending on which key is set, and the Elixir one answers into a GenServer |

## Integrations and examples

| Resource | What to inspect |
| --- | --- |
| [LangChain: building a harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev) | `TypeSafeClassifier` plus experimental model-routing and tool-screening middleware |
| [dbreunig/building-with-jev-skill](https://github.com/dbreunig/building-with-jev-skill) | Another question-design skill targeting `jev-1.13`; it had no license file at review |
| [altryne/jevify](https://github.com/altryne/jevify) | A skill that makes Jev the agent's default for bulk semantic checks, with standard-library Python helpers |
| [wuyoscar/jev-skill](https://github.com/wuyoscar/jev-skill) | Skills for triage, documents, eval, UI, and simulation, with recorded requests and responses; most scenarios are unevaluated adaptations |
| [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) | Routing, memory, compaction, skill selection, and computer and browser use, with fail-open defaults, keyword rails independent of the model, and a shadow mode that logs decisions before acting on them |
| [AutoJev skills](https://autojev.ai/jev-skills) | Task/model routing, tool/research checks, and completion review; its MCP setup is separate from skill instructions |
| [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp) | Ten task-shaped MCP tools that validate each answer and fail closed; documents its retry and timeout rules per provider |
| [itsmostafa/typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp) | One general `evaluate` MCP tool in a Go binary, routed through TypeSafe or OpenRouter |
| [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) / [jev-pruner](https://github.com/tamaratran/jev-pruner) | Claude Code plugins that select tool results to retain and trim long Bash output; inspect hooks and runtime requirements before enabling |
| [can1357/jegrep](https://github.com/can1357/jegrep) | Scoring files by probability instead of building an embedding index. Run here (v0.1.2) on 20 of its own labelled Postgres and CPython queries, it found every labelled file in English for about $0.005 a query. The same questions in Finnish found 42% and five returned nothing, because candidates come from a keyword scan of the query. An embedding index with a Jev rerank of its top 30 windows found 90% in its top five on those Finnish queries ([benchmark](https://github.com/laguagu/jev-rerank-bench#2-code-search-without-an-index)) |
| [Milvus `JevRerankFunction`](https://github.com/milvus-io/milvus-model/blob/main/src/pymilvus/model/reranker/jev.py) | A vector-database reranker (milvus-model 0.3.4) that asks one Noul per document in a single request. Its wording frames every query as a scientific claim and puts document text in the question rather than in state; rewrite the question for your corpus before trusting its ranking |
| [hotchpotch/jev-reranker](https://github.com/hotchpotch/jev-reranker) | A Python library (MIT, on PyPI) with `rerank()` for ordering and `relevance_rerank()` for dropping passages that add no evidence (default threshold 0.2). Replaceable listwise or pointwise prompts, automatic splitting of long candidate lists, retries, and an optional record of every score, prompt, and usage |
| [openlayer-ai/jevals](https://github.com/openlayer-ai/jevals) | Agent-trace evals and guardrails as one Jev request per trace, with TypeSafe, gateway, or local backends |
| [andududu/jeview](https://github.com/andududu/jeview) | A local gateway that stores every request and answer in SQLite; useful for diagnosing a question |
| [sutro-sh/jev-align](https://github.com/sutro-sh/jev-align) | Labelling uncertain rows and letting GEPA propose a revised question, with an optional held-out set |
| [jev-ultrafast](https://github.com/browser-use/jev-ultrafast) | MIT browser agent that picks an operation and its target in one request over numbered page elements; its performance notes show what a paired, version-pinned comparison looks like |
| [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review) | A staged pipeline: Noul risk matrix, Choice and Score profiles, evidence selection, severity, and routing, with thresholds in code |
| [kyotofin/tax-doc-classifier](https://github.com/kyotofin/tax-doc-classifier) | A deep taxonomy (261 IRS forms) described in generated JSON criteria, a 0.95 confidence gate, and a reproducible strict eval |
| [Jev AI Hub examples](https://jevaihub.com/examples/) | Independent recipes for routing, scoring, moderation, retrieval, and tool selection |

Compaction is a tradeoff: keeping selected text verbatim avoids rewriting it, but discarding
context can still remove something needed later. `fast-jev-compaction` documents sending
conversation context and tool inputs to Jev, with result bodies represented by short notes
in the decision state. Check its current fitting and fallback rules; measure downstream task
success, not just the number of characters removed. This kit does not install its hooks.

## Open and local models

[kev](https://github.com/jaredpalmer/kev) (trained 0.8B to 9B models serving the System One API),
[SemIf-OpenJev](https://github.com/TheoLeeCJ/SemIf-OpenJev), [simple-jev](https://github.com/featherless-ai/simple-jev),
and [litjev](https://github.com/zhengxuyu/litjev) read typed answers from open models. They help with
offline development, private data, or learning the interface. None is Jev: probabilities follow
each model's own calibration, so thresholds and accuracy measured on Jev do not transfer.

[Laya](https://github.com/NandhaKishorM/laya) (Apache-2.0, weights on
[Hugging Face](https://huggingface.co/convaiinnovations/laya)) answers the same three primitives
from local weights in one forward pass. Run here on Finnish text with Jev's exact questions, it
did worse than doing nothing: as a reranker it cut top-1 on collective agreements from 31.9% to
8.3% ([benchmark](https://github.com/laguagu/jev-rerank-bench#three-things-that-did-not-work))
and on lecture transcripts from 0.543 to 0.114, at 20–26 s per 30-candidate query on CPU. On the
binary citation check it scored 56.5% balanced accuracy, where 50% is chance. Its scores bunched
near the top of the range. Measure it on your own data before relying on it.

## Self-hosted rerankers

When text may not leave your servers, an open-weight cross-encoder is the self-hosted alternative
to a Jev rerank. It takes no criteria, so it cannot be told what relevance means for your queries.
On the Finnish lecture transcripts, [bge-reranker-v2-m3](https://huggingface.co/BAAI/bge-reranker-v2-m3) (568M parameters) came close to Jev on
full questions (hit@1 0.614 against 0.629, reordering 30) but hurt short terms
([Patterns](patterns.md#rerank-a-shortlist)), and on a small CPU container it needed about 10 s
for 10 candidates of 1,200 characters, where Jev answered in 0.3–0.7 s. The smaller
[mmarco-mMiniLMv2-L12](https://huggingface.co/cross-encoder/mmarco-mMiniLMv2-L12-H384-v1) (118M) took 1.6 s, gained less (0.600), and also hurt short terms. A GPU
fixes the latency; reranking only the top 10 limits the harm.

## Discover something new

Several competing directories index the same launch-week repositories:
[cobanov/awesome-jev](https://github.com/cobanov/awesome-jev) favours reproducible evidence,
[logicrw/awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) pins each entry
to a commit, [yibie/awesome-jev](https://github.com/yibie/awesome-jev) is a categorised guide,
and [github.com/topics/jev](https://github.com/topics/jev) is unfiltered. Their sizes change daily,
and one author can publish many repositories at once, so volume proves nothing.

Search the official docs and the relevant awesome-jev category first. Follow a promising
entry to its original repository. Check whether it contains an actual Jev call, a usable
example, required configuration, a license, and a meaningful failure path. A prompt-only
resource can still help; describe it as instructions rather than a tested application.

Return a small shortlist tied to the user's language, agent, and task. For each, explain
what decision it makes, what must be installed, and whether you inspected or ran it.
Prefer the original artifact over a repost, and separate theoretical gains from measurements.
If updating this kit, keep one primary entry per project and remove stale or redundant links.

## Packaging references

- [Agent Skills](https://agentskills.io): the portable `SKILL.md` format.
- [Skill authoring practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices): focused entry points and references loaded when needed.
- [Agent Plugins](https://agent-plugins.org/): a portable root manifest; native agent adapters and installation still vary.

These resources informed the kit's organization. Its guides and examples are original;
linked third-party projects retain their own licenses.
