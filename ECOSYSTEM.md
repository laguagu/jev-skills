# Jev ecosystem

Reviewed on September 27, 2026 through public repositories and documentation. These are leads,
not endorsements: apart from jegrep and Laya, nothing here was run for this kit, and numbers outside
[Independent evaluations](#independent-evaluations) are mostly self-reported.
Check license, maintenance, and failure paths before adopting any of it.

## Learn

- [TypeSafe docs](https://docs.typesafe.ai/introduction) and [cookbooks](https://docs.typesafe.ai/cookbooks): primitives, patterns, limits, and measured recipes.
- [Confidence guide](https://docs.typesafe.ai/confidence): designing an accept / review / fallback policy.
- [Coding agents](https://docs.typesafe.ai/introduction/coding-agents) and [use-case map](https://docs.typesafe.ai/concepts/use-case-map): TypeSafe's own pages on agent setup and where a decision fits.
- [LangChain: building a harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev): worked routing and tool-screening code.
- [Vercel launch notes](https://vercel.com/blog/ai-gateway-jev-model-launch#about-jev): proposed places for Jev in an agent workflow; vendor figures.
- [Introducing System One models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev): TypeSafe's launch post; its figures are the vendor's.
- [Workflow evals](https://evals.typesafe.ai) and [Antibenchmaxxing](https://typesafe.ai/blog/antibenchmaxxing): TypeSafe's own dated snapshots instead of a leaderboard, and its reasons; the reference labels come from two frontier models.
- [Jev AI Hub examples](https://jevaihub.com/examples/): independent recipes for routing, scoring, moderation, retrieval, and tool selection.

## SDKs, providers, and frameworks

| | Resource | What it is |
| --- | --- | --- |
| <img src="docs/logos/javascript.svg" width="16" height="16" alt=""> | [JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js) | Official client, `@typesafe-ai/sdk` |
| <img src="docs/logos/python.svg" width="16" height="16" alt=""> | [Python SDK](https://github.com/typesafe-ai/typesafe-sdk-python) | Official client, `typesafe-sdk` on PyPI, imported as `typesafe_sdk` |
| <img src="docs/logos/python.svg" width="16" height="16" alt=""> | [System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python) | Official stand-in for the Python client that answers with OpenAI, Anthropic, or Gemini: an LLM baseline on identical questions |
| <img src="docs/logos/spring.svg" width="16" height="16" alt=""> | [Spring AI TypeSafe](https://github.com/spring-ai-community/spring-ai-typesafe) | Java client plus judge, guardrail, RAG post-processor, and tool-index integrations |
| <img src="docs/logos/swift.svg" width="16" height="16" alt=""> | [Swift](https://github.com/krzyzanowskim/TypeSafe) · <img src="docs/logos/ruby.svg" width="16" height="16" alt=""> [Ruby](https://github.com/obie/ruby_decision_model) · <img src="docs/logos/elixir.svg" width="16" height="16" alt=""> [Elixir](https://github.com/dannote/jev) · [Go and Rust](https://github.com/haileyok/typesafe-client) | Community clients; the Go and Rust pair follows the official SDKs' environment variables and retry policy |
| <img src="docs/logos/vercel.svg" width="16" height="16" alt=""> | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe) | Serves Jev with its own key: a TypeSafe-compatible API the official SDKs reach by base URL, `/v1/evaluate` with [evaluation fallbacks](https://vercel.com/docs/ai-gateway/models-and-providers/evaluation-fallbacks) to another model, and tool-call approval in eve ([guide](https://vercel.com/kb/guide/auto-approve-tool-calls-eve-jev)) |
|  | [AI SDK provider `@ai-sdk/typesafe-ai`](https://ai-sdk.dev/providers/ai-sdk-providers/typesafe-ai) | Choice, Score, and a `boolean` Noul through `experimental_evaluate` |
| <img src="docs/logos/openrouter.svg" width="16" height="16" alt=""> | [OpenRouter](https://openrouter.ai/~typesafe/jev-latest) | A separate decisions endpoint the official SDKs reach by base URL; chat-completion clients do not work with it |
| <img src="docs/logos/cloudflare.svg" width="16" height="16" alt=""> | [Cloudflare Workers AI](https://developers.cloudflare.com/ai/models/typesafe/jev/) | `typesafe/jev` through a Workers binding |
|  | [Bifrost gateway](https://github.com/maximhq/bifrost/blob/main/docs/providers/supported-providers/typesafe.mdx) | One decisions endpoint that normalizes answers and usage and rejects malformed questions before the call |
|  | [LiteLLM pass-through](https://docs.litellm.ai/docs/pass_through/typesafe) | Proxies the endpoint with logging and spend tracking |
| <img src="docs/logos/langchain.svg" width="16" height="16" alt=""> | [LangChain `TypeSafeClassifier`](https://docs.langchain.com/oss/python/integrations/providers/typesafe) | The three primitives behind a Runnable |
| <img src="docs/logos/pydantic.svg" width="16" height="16" alt=""> | [Pydantic AI `TypeSafeModel`](https://pydantic.dev/docs/ai/models/typesafe/) | Agents with a structured `output_type` run on `typesafe:jev-latest` unchanged |
|  | [DSPy decision types](https://github.com/stanfordnlp/dspy/tree/main/docs/docs/tutorials/jev_decisions) | Experimental Noul, Score and Choice output fields with tunable thresholds and an optional TypeSafe backend |
|  | [LanceDB `TypeSafeReranker`](https://github.com/lancedb/lancedb/blob/main/python/python/lancedb/rerankers/typesafe.py) | Reranking inside LanceDB search; `batch_size` puts several candidates in one request (0.40.0 pre-releases) |
|  | [Milvus `JevRerankFunction`](https://github.com/milvus-io/milvus-model/blob/main/src/pymilvus/model/reranker/jev.py) | Reranker in `pymilvus.model` 0.3.4; rewrite its claim-oriented question for your corpus |

## Agent skills and MCP

- [typesafe-ai/skills](https://github.com/typesafe-ai/skills): the official skill; keep it installed from upstream.
- [dbreunig/building-with-jev-skill](https://github.com/dbreunig/building-with-jev-skill): question design, composition, and diagnosis for `jev-1.13`. No license file at review.
- [altryne/jevify](https://github.com/altryne/jevify): steers an agent to hand bulk semantic checks to Jev during ordinary work, with standard-library Python helpers.
- [wuyoscar/jev-skill](https://github.com/wuyoscar/jev-skill): six skills for triage, documents, eval, UI, and simulation, with recorded requests and responses.
- [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills): routing, memory, compaction, skill selection, and computer and browser use, with fail-open defaults and a shadow mode.
- [AutoJev skills](https://autojev.ai/jev-skills): task and model routing, tool checks, completion review.
- [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp): ten task-shaped MCP tools (verify, screen, rerank, gate…) that fail closed on malformed answers. [itsmostafa/system-one-connector](https://github.com/itsmostafa/system-one-connector) (formerly `typesafe-mcp`) exposes one general `evaluate` tool instead.
- [tamaratran/fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) and [jev-pruner](https://github.com/tamaratran/jev-pruner): Claude Code plugins that choose which tool results survive compaction and trim long Bash output. Read their hooks before enabling.
- [aaddrick/building-with-typesafe-jev](https://github.com/aaddrick/building-with-typesafe-jev): a question-design skill much like jev-builder, with a map of community projects sorted by shape.
- [UditAkhourii/quicksilver](https://github.com/UditAkhourii/quicksilver): a Claude Code skill that hands bulk yes/no, label and score calls to Jev; its token saving is self-reported.
- [gargpratyush/jev-router](https://github.com/gargpratyush/jev-router): per-turn model routing for Claude Code and Codex, sending simple turns to the fast tier. Not the same thing as OpenRouter's [`typesafe/jev-router`](https://openrouter.ai/typesafe/jev-router), an official router model released on September 25, 2026 that picks a model and reasoning effort per chat request.

## Open and local models

Same request shape, different models. None of these is Jev, so re-measure any threshold you carry over.

- [jaredpalmer/kev](https://github.com/jaredpalmer/kev): 0.8B to 9B decision models on Qwen3.5 with training code. Serves the System One API, so the official Python SDK can point at it.
- [TheoLeeCJ/SemIf-OpenJev](https://github.com/TheoLeeCJ/SemIf-OpenJev): reads option probabilities from open models, including a WebGPU demo that runs in the browser.
- [featherless-ai/simple-jev](https://github.com/featherless-ai/simple-jev): choices, scores, and yes probabilities from Hugging Face model logits, with a keyless demo API.
- [zhengxuyu/litjev](https://github.com/zhengxuyu/litjev): the same idea on Qwen checkpoints. Useful for understanding the shape of the API.
- [nokia-applied-research/AnyJev](https://github.com/nokia-applied-research/AnyJev): typed decisions from any open model with calibration heads fitted on 100–500 labels, served through vLLM. Gains are self-reported.
- [fstandhartinger/jevbench](https://github.com/fstandhartinger/jevbench): a composite benchmark of Jev-class decision models, 94 systems in its current release, where Jev 1.13.0 ranks third. A comparison, not a model.
- [NandhaKishorM/laya](https://github.com/NandhaKishorM/laya): the three primitives from local weights in one forward pass. Run for this kit on Finnish text, reranking with it scored below no reranking at all ([benchmark](https://github.com/laguagu/jev-rerank-bench#three-things-that-did-not-work)).

## Browser and computer use

- [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast): picks an operation and its target element in one request over numbered page elements.
- [ndrezn/ts-browser-agent](https://github.com/ndrezn/ts-browser-agent): the same idea on `langchain-typesafe`.
- [realZachi/typesafe-adblock](https://github.com/realZachi/typesafe-adblock): a small extension that asks whether a DOM element is an ad. A minimal per-element decision loop.
- [droidrun/mobile-jev](https://github.com/droidrun/mobile-jev): Android action selection over indexed screen controls, through Mobilerun. Needs Mobilerun and TypeSafe keys and a Mobilerun device.

## Developer tools

- [can1357/jegrep](https://github.com/can1357/jegrep): semantic grep that scores files by probability, without an embedding index. Run for this kit: it found every labelled file for its own English benchmark queries, but under half when the same questions were asked in Finnish, because its candidates come from a keyword scan ([benchmark](https://github.com/laguagu/jev-rerank-bench#2-code-search-without-an-index)).
- [dzhng/jevgrep](https://github.com/dzhng/jevgrep): a CLI for coding agents that returns relevant files and verbatim source excerpts for a repository question, with an agent skill; works through TypeSafe or a gateway key.
- [hotchpotch/jev-reranker](https://github.com/hotchpotch/jev-reranker): a Python library for reranking and relevance filtering in RAG, with replaceable prompts and automatic splitting of long candidate lists.
- [andududu/jeview](https://github.com/andududu/jeview): a local gateway that records every call and draws it live. Handy when a question misbehaves.
- [sutro-sh/jev-align](https://github.com/sutro-sh/jev-align): finds uncertain rows, asks you to label them, and proposes a better question definition with GEPA.
- [DeepEval `JevEval`](https://github.com/confident-ai/deepeval/tree/main/deepeval/metrics/jev_eval): an evaluation metric built from bounded questions and combined in fixed code.
- [valentynkit/jev-commit](https://github.com/valentynkit/jev-commit): pre-commit hook judging whether the message matches the diff.
- [valentynkit/jev.nvim](https://github.com/valentynkit/jev.nvim): Neovim command that asks a question of every function in the buffer and ranks the answers into quickfix.
- [abhixhek/jevcal](https://github.com/abhixhek/jevcal): threshold calibration per question, checked on a held-out half, with a CI drift check for model updates.
- [zachlandes/decision-gate](https://github.com/zachlandes/decision-gate): one place for Jev calls in a loop, with a shared rate limiter, a daily spend ceiling, and an answer cache.
- [openlayer-ai/jevals](https://github.com/openlayer-ai/jevals): agent-trace evals and guardrails as one Jev request per trace, with TypeSafe, gateway, or local backends.

## Independent evaluations

Outside measurements of `jev-1.13.0`, each with raw data or a paper. What they mean for this kit's
advice is in [evaluations.md](skills/jev-builder/references/evaluations.md).

- [zaesho/S1Rank](https://github.com/zaesho/S1Rank): reranking on TREC DL and BEIR, calibration, and nondeterminism, with a paper and every raw response.
- [anessbelbati/jev-rerank-bench](https://github.com/anessbelbati/jev-rerank-bench): Jev setups against Cohere Rerank 4, zerank-2, and open rerankers, including negation and French.
- [instax-dutta/sysone-bench](https://github.com/instax-dutta/sysone-bench): Jev, Laya, and a Qwen decoder on byte-identical inputs with paired tests.
- [bitnovus/jev-spam-eval](https://github.com/bitnovus/jev-spam-eval): zero-shot email classification against a trained baseline; context mattered more than wording.
- [JYeswak/jev_playground](https://github.com/JYeswak/jev_playground): pre-registered measurements behind small agent tools, including the losses.
- [zilliztech/memsearch reranking evaluation](https://github.com/zilliztech/memsearch/blob/main/evaluation/reranking-evaluation.md): Jev against Voyage rerank-3 on Chinese and English memory queries; Voyage led.
- [Gaurav-Gosain/jev-sec-bench](https://github.com/Gaurav-Gosain/jev-sec-bench): prompt injection and vulnerable-code pairs; telling Jev what the assistant is for mattered most.
- arXiv [2609.24574](https://arxiv.org/abs/2609.24574) (social-science annotation) and [2609.26758](https://arxiv.org/abs/2609.26758) (option names against rubrics).
- [Parallel: testing Jev](https://parallel.ai/blog/testing-jev): reranking and classification against in-house systems; no raw data.
- [laguagu/jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench): this kit's own runs on Finnish text.

## Applications

- [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review): staged code review. A Noul risk matrix, then evidence selection and severity scores, with thresholds in code.
- [kyotofin/tax-doc-classifier](https://github.com/kyotofin/tax-doc-classifier): 261 IRS forms per page in two stages, a Choice over 230 forms and a small second question for five forms' schedules, scored strictly with a confidence gate and a reproducible eval.
- [kenhuangus/jev-usecases](https://github.com/kenhuangus/jev-usecases): use-case harnesses in which code maps each decision to an auto, confirm, human, or block band.
- [jerryjliu/docjev](https://github.com/jerryjliu/docjev): document classification and packet splitting from locally parsed page text.
- [kieranklaassen/truffler](https://github.com/kieranklaassen/truffler): intent search for Rails, with Jev labels stored at index time and a streamed rerank on request.
- [fazlerocks/jevmail](https://github.com/fazlerocks/jevmail): inbox triage into reply, update, promotional, sales, and spam trays, with an urgency score.
- [devanshbatham/commit-miner](https://github.com/devanshbatham/commit-miner): classifies commit diffs into fixes, security changes, and CWEs.

## Directories

- [cobanov/awesome-jev](https://github.com/cobanov/awesome-jev): favours public source and reproducible evidence.
- [logicrw/awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects): every entry pinned to a commit and a decision point.
- [yibie/awesome-jev](https://github.com/yibie/awesome-jev) and [AbdelStark/awesome-typesafe-jev](https://github.com/AbdelStark/awesome-typesafe-jev): categorised field guides.
- [OmniJev/awesome-jev-gallery](https://github.com/OmniJev/awesome-jev-gallery): papers, open reproductions and evaluations around System One models.
- [github.com/topics/jev](https://github.com/topics/jev): everything tagged, unfiltered.

Several lists index the same launch-week repositories, and one author can publish many at once.
Prefer the original artifact, and one repository that shows a real Jev call over ten that describe one.
The [resource guide](skills/jev-builder/references/resources.md) is the version your agent reads.
