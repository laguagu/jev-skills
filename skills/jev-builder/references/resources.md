# Find the right Jev resource

Source review: September 27, 2026. These links are a starting map, not endorsements.
Third-party integrations were inspected through their public documentation; only jegrep, Laya,
and the cross-encoders under self-hosted rerankers were also run here. Recheck compatibility, maintenance, and license before adopting code.

Contents: [official foundations](#official-foundations) · [framework and language integrations](#framework-and-language-integrations) ·
[integrations and examples](#integrations-and-examples) · [open and local models](#open-and-local-models) ·
[self-hosted rerankers](#self-hosted-rerankers) · [discover something new](#discover-something-new) ·
[independent evaluations](evaluations.md) ·
[packaging references](#packaging-references)

## Official foundations

| Resource | Start here when… |
| --- | --- |
| [TypeSafe docs](https://docs.typesafe.ai/introduction) | Learning state, Choice, Score, Noul, patterns, and API limits |
| [Official TypeSafe skill](https://github.com/typesafe-ai/skills) | Giving a coding agent maintained API and SDK guidance |
| [JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js) / [Python SDK](https://github.com/typesafe-ai/typesafe-sdk-python) | Adding direct API calls to an application |
| [System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python) | Running the same Python request through OpenAI, Anthropic, or Gemini as an LLM baseline; it records retries, usage, and latency per call |
| [Confidence guide](https://docs.typesafe.ai/confidence) | Designing an accept / review / fallback policy |
| [Cookbooks](https://docs.typesafe.ai/cookbooks) | Worked recipes with cached responses, so they replay without a key; [Patterns](patterns.md#official-recipes) maps each to the need it serves |
| [Vercel launch and use cases](https://vercel.com/blog/ai-gateway-jev-model-launch#about-jev) | Understanding proposed places for Jev in an agent workflow; performance figures are vendor reports |
| [Coding agents](https://docs.typesafe.ai/introduction/coding-agents) and [use-case map](https://docs.typesafe.ai/concepts/use-case-map) | TypeSafe's own pages on setting up a coding agent and on where a decision fits |
| [Launch post](https://typesafe.ai/blog/introducing-system-one-models-and-jev) and [workflow evals](https://evals.typesafe.ai) | TypeSafe's framing and its dated snapshots; the evals' labels come from two frontier models, not people ([Evaluations](evaluations.md#sources)) |

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
| [LanceDB `TypeSafeReranker`](https://github.com/lancedb/lancedb/blob/main/python/python/lancedb/rerankers/typesafe.py) | A reranker inside LanceDB's vector, full-text and hybrid search; `batch_size` puts several candidates in one request (in the 0.40.0 pre-releases at review) |
| [DSPy decision types](https://github.com/stanfordnlp/dspy/tree/main/docs/docs/tutorials/jev_decisions) | Experimental Noul, Score and Choice output fields with tunable thresholds, an optional TypeSafe backend, and an optimizer for them (dspy 3.4.0) |
| [Bifrost gateway](https://github.com/maximhq/bifrost/blob/main/docs/providers/supported-providers/typesafe.mdx) | A TypeSafe provider behind one decisions endpoint that normalizes answers and usage and rejects malformed questions before the call |
| [Spring AI TypeSafe](https://github.com/spring-ai-community/spring-ai-typesafe) | A Java client plus judge, guardrail, RAG post-processor, and tool-index integrations |
| [AI SDK provider `@ai-sdk/typesafe-ai`](https://ai-sdk.dev/providers/ai-sdk-providers/typesafe-ai) | Choice, Score and a `boolean` Noul through `experimental_evaluate` in a TypeScript app on the AI SDK; see [Setup](setup.md#another-provider-or-an-existing-framework) |
| [Vercel AI Gateway TypeSafe API](https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe) | The official SDKs through the gateway by base URL, plus [evaluation fallbacks](https://vercel.com/docs/ai-gateway/models-and-providers/evaluation-fallbacks) that rerun an uncertain answer with another model |
| [Swift](https://github.com/krzyzanowskim/TypeSafe), [Ruby](https://github.com/obie/ruby_decision_model), [Elixir](https://github.com/dannote/jev), [Go and Rust](https://github.com/haileyok/typesafe-client) | Community clients; the Ruby gem uses TypeSafe or OpenRouter depending on which key is set, the Elixir one answers into a GenServer, and the Go and Rust pair follows the official SDKs' environment variables and retry policy |

## Integrations and examples

| Resource | What to inspect |
| --- | --- |
| [LangChain: building a harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev) | `TypeSafeClassifier` plus experimental model-routing and tool-screening middleware |
| [dbreunig/building-with-jev-skill](https://github.com/dbreunig/building-with-jev-skill) | Another question-design skill targeting `jev-1.13`; it had no license file at review |
| [altryne/jevify](https://github.com/altryne/jevify) | A skill that makes Jev the agent's default for bulk semantic checks, with standard-library Python helpers |
| [aaddrick/building-with-typesafe-jev](https://github.com/aaddrick/building-with-typesafe-jev) | A question-design skill much like this one, with a map of community projects sorted by shape |
| [UditAkhourii/quicksilver](https://github.com/UditAkhourii/quicksilver) | A Claude Code skill that hands bulk yes/no, label and score calls to Jev; its token saving is self-reported |
| [gargpratyush/jev-router](https://github.com/gargpratyush/jev-router) | Per-turn model routing for Claude Code and Codex: Jev sends simple turns to the fast tier. Unrelated to OpenRouter's official [`typesafe/jev-router`](https://openrouter.ai/typesafe/jev-router) (September 25, 2026), a router model that picks a model and reasoning effort per chat request |
| [wuyoscar/jev-skill](https://github.com/wuyoscar/jev-skill) | Skills for triage, documents, eval, UI, and simulation, with recorded requests and responses; most scenarios are unevaluated adaptations |
| [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) | Routing, memory, compaction, skill selection, and computer and browser use, with fail-open defaults, keyword rails independent of the model, and a shadow mode that logs decisions before acting on them |
| [AutoJev skills](https://autojev.ai/jev-skills) | Task/model routing, tool/research checks, and completion review; its MCP setup is separate from skill instructions |
| [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp) | Ten task-shaped MCP tools that validate each answer and fail closed; documents its retry and timeout rules per provider |
| [itsmostafa/system-one-connector](https://github.com/itsmostafa/system-one-connector) | One general `evaluate` MCP tool in a Go binary, routed through TypeSafe or OpenRouter (formerly `typesafe-mcp`) |
| [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) / [jev-pruner](https://github.com/tamaratran/jev-pruner) | Claude Code plugins that select tool results to retain and trim long Bash output; inspect hooks and runtime requirements before enabling |
| [can1357/jegrep](https://github.com/can1357/jegrep) | Scoring files by probability instead of building an embedding index. Run here (v0.1.2) on 20 of its own labelled Postgres and CPython queries, it found every labelled file in English for about $0.005 a query. The same questions in Finnish found 42% and five returned nothing, because candidates come from a keyword scan of the query. An embedding index with a Jev rerank of its top 30 windows found 90% in its top five on those Finnish queries ([benchmark](https://github.com/laguagu/jev-rerank-bench#2-code-search-without-an-index)) |
| [dzhng/jevgrep](https://github.com/dzhng/jevgrep) | A CLI for coding agents that returns relevant files and verbatim source excerpts for a repository question; works through TypeSafe or a gateway key |
| [valentynkit/jev.nvim](https://github.com/valentynkit/jev.nvim) | Neovim: one question per function in the buffer, ranked into quickfix; judges each function alone |
| [Milvus `JevRerankFunction`](https://github.com/milvus-io/milvus-model/blob/main/src/pymilvus/model/reranker/jev.py) | A vector-database reranker (PyPI `pymilvus.model` 0.3.4; the unrelated `milvus-model` package stops at 0.2.12) that asks one Noul per document in a single request. Its wording frames every query as a scientific claim and puts document text in the question rather than in state; rewrite the question for your corpus before trusting its ranking |
| [hotchpotch/jev-reranker](https://github.com/hotchpotch/jev-reranker) | A Python library (MIT, on PyPI) with `rerank()` for ordering and `relevance_rerank()` for dropping passages that add no evidence (default threshold 0.2). Replaceable listwise or pointwise prompts, automatic splitting of long candidate lists, retries, and an optional record of every score, prompt, and usage |
| [DeepEval `JevEval`](https://github.com/confident-ai/deepeval/tree/main/deepeval/metrics/jev_eval) | An evaluation metric built from bounded questions, combined as a weighted mean in fixed code; no published benchmark at review |
| [openlayer-ai/jevals](https://github.com/openlayer-ai/jevals) | Agent-trace evals and guardrails as one Jev request per trace, with TypeSafe, gateway, or local backends |
| [andududu/jeview](https://github.com/andududu/jeview) | A local gateway that stores every request and answer in SQLite; useful for diagnosing a question |
| [sutro-sh/jev-align](https://github.com/sutro-sh/jev-align) | Labelling uncertain rows and letting GEPA propose a revised question, with an optional held-out set |
| [jev-ultrafast](https://github.com/browser-use/jev-ultrafast) | MIT browser agent that picks an operation and its target in one request over numbered page elements; its performance notes show what a paired, version-pinned comparison looks like |
| [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review) | A staged pipeline: Noul risk matrix, Choice and Score profiles, evidence selection, severity, and routing, with thresholds in code |
| [kyotofin/tax-doc-classifier](https://github.com/kyotofin/tax-doc-classifier) | A deep taxonomy (261 IRS forms) in two stages, a Choice over 230 forms and a second question for five forms' schedules, described in generated JSON criteria, with a 0.95 confidence gate and a reproducible strict eval |
| [kenhuangus/jev-usecases](https://github.com/kenhuangus/jev-usecases) | Use-case harnesses whose code maps each decision to an auto, confirm, human, or block band |
| [jerryjliu/docjev](https://github.com/jerryjliu/docjev) | Document classification and packet splitting from locally parsed page text |
| [kieranklaassen/truffler](https://github.com/kieranklaassen/truffler) | Rails intent search: Jev labels stored at index time, a query encoded into them, and a streamed rerank on request |
| [droidrun/mobile-jev](https://github.com/droidrun/mobile-jev) | Android action selection over indexed controls through Mobilerun; needs Mobilerun and TypeSafe keys and a device |
| [abhixhek/jevcal](https://github.com/abhixhek/jevcal) | Threshold calibration per question on your labelled data, a held-out check, and a CI drift check |
| [zachlandes/decision-gate](https://github.com/zachlandes/decision-gate) | A shared rate limiter, daily spend ceiling, and answer cache for Jev calls in a loop |
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
[AnyJev](https://github.com/nokia-applied-research/AnyJev) (Apache-2.0, on PyPI, served with vLLM)
adds calibration heads fitted on 100–500 labels to any open model; its calibration gains are
self-reported. On identical questions, [sysone-bench](https://github.com/instax-dutta/sysone-bench)
measured Jev at 0.906 against 0.686 for Laya and 0.605 for a small Qwen decoder.
[JevBench](https://github.com/fstandhartinger/jevbench) scores decision-model systems (94 in its
current release, 90 ranked) on a composite of intelligence, calibration, speed and cost; Jev 1.13.0
is third, behind two 4B models. Only aggregates of its sealed items are published, so read it as a
comparison, not a verdict on your task.

[Laya](https://github.com/NandhaKishorM/laya) (Apache-2.0, weights on
[Hugging Face](https://huggingface.co/convaiinnovations/laya)) answers the same three primitives
from local weights in one forward pass. Run here on Finnish text with Jev's exact questions, it
did worse than doing nothing: as a reranker it cut top-1 on collective agreements from 31.9% to
8.3% ([benchmark](https://github.com/laguagu/jev-rerank-bench#three-things-that-did-not-work))
and on lecture transcripts from 54.3% to 11.4%, at 19–26 s per 30-candidate query on CPU. On the
binary citation check it scored 56.5% balanced accuracy, where 50% is chance. Its scores bunched
near the top of the range. Measure it on your own data before relying on it.

## Self-hosted rerankers

When text may not leave your servers, an open-weight cross-encoder is the self-hosted alternative
to a Jev rerank. It takes no criteria, so it cannot be told what relevance means for your queries.
On the Finnish lecture transcripts ([Rerank](rerank.md#what-mattered),
[benchmark](https://github.com/laguagu/jev-rerank-bench#5-reranking-lecture-transcripts)), reordering
30 candidates, [bge-reranker-v2-m3](https://huggingface.co/BAAI/bge-reranker-v2-m3) (568M
parameters) came close to Jev on full questions (hit@1 61.4% against 62.9%) but cut short terms
from 93.3% to 60.0%. The smaller [mmarco-mMiniLMv2-L12](https://huggingface.co/cross-encoder/mmarco-mMiniLMv2-L12-H384-v1)
(118M) gained less (60.0%) and hurt short terms offline too: 73.3% reordering 30 and 86.7%
reordering the top 10. End to end it scored 100% on them, probably because the search regroups a
short query's results by video after reranking, a step the offline replay leaves out. Say both
when you report such a model.

On a four-thread CPU, scoring 30 segments took 34 s with bge-reranker-v2-m3 and 3.2 s with mmarco;
end to end, mmarco reranking the top 10 added 1.48 s per question search against 0.44 s for Jev.
A GPU changes the picture more than the latency. On one MI250X GCD, Qwen3-Reranker-8B reordering
30 reached 78.6% hit@1 on the questions, the best result there (Jev 62.9%), but cut short terms
to 66.7%; reordering the top 10, the 4B model reached 65.7% and 100%, level with Jev. Reranking
only the top 10 limits the harm. For choosing and wiring a cross-encoder, see this
[reranking reference](https://github.com/laguagu/claude-code-nextjs-skills/blob/4827ea8/skills/postgres-semantic-search/references/reranking.md).

## Discover something new

Several competing directories index the same launch-week repositories:
[cobanov/awesome-jev](https://github.com/cobanov/awesome-jev) favours reproducible evidence,
[logicrw/awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) pins each entry
to a commit, [yibie/awesome-jev](https://github.com/yibie/awesome-jev) is a categorised guide,
[OmniJev/awesome-jev-gallery](https://github.com/OmniJev/awesome-jev-gallery) collects papers,
open reproductions and evaluations, and [github.com/topics/jev](https://github.com/topics/jev) is
unfiltered. Their sizes change daily,
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
