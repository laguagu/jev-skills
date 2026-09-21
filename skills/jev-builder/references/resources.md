# Find the right Jev resource

Source review: September 21, 2026. These links are a starting map, not endorsements.
Third-party integrations were inspected through their public documentation, not installed
or benchmarked here. Recheck compatibility, maintenance, and license before adopting code.

## Official foundations

| Resource | Start here when… |
| --- | --- |
| [TypeSafe docs](https://docs.typesafe.ai/introduction) | Learning state, Choice, Score, Noul, patterns, and API limits |
| [Official TypeSafe skill](https://github.com/typesafe-ai/skills) | Giving a coding agent maintained API and SDK guidance |
| [JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js) / [Python SDK](https://github.com/typesafe-ai/typesafe-sdk-python) | Adding direct API calls to an application |
| [Confidence guide](https://docs.typesafe.ai/confidence) | Designing an accept / review / fallback policy |
| [Vercel launch and use cases](https://vercel.com/blog/ai-gateway-jev-model-launch#about-jev) | Understanding proposed places for Jev in an agent workflow; performance figures are vendor reports |

## Framework integrations

Reach for these when the application already lives in one of these frameworks; a direct SDK
call stays the simpler option otherwise. Check whether the integration is released or still
on a default branch before depending on a version.

| Integration | What it gives you |
| --- | --- |
| [LangChain `TypeSafeClassifier`](https://github.com/langchain-ai/langchain/pull/40542) | The three primitives behind a Runnable, with probabilities and usage metadata |
| [Pydantic AI `TypeSafeModel`](https://pydantic.dev/docs/ai/models/typesafe/) | An agent with a structured `output_type` runs on `typesafe:jev-latest`; unsupported requests fail before the call |
| [LiteLLM pass-through](https://docs.litellm.ai/docs/pass_through/typesafe) | Proxying the evaluate endpoint with shared keys, logging, and spend tracking |

Install the official skill with `npx skills add typesafe-ai/skills --skill typesafe-ai`,
or use its documented Claude Code plugin installation. Choose one method for that skill.
This kit links to upstream instead of shipping a competing copy of the official guide.

## Integrations and examples

| Resource | What to inspect |
| --- | --- |
| [LangChain: building a harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev) | `TypeSafeClassifier` plus experimental model-routing and tool-screening middleware |
| [AutoJev skills](https://autojev.ai/jev-skills) | Task/model routing, tool/research checks, and completion review; its MCP setup is separate from skill instructions |
| [wuyoscar/jev-skill](https://github.com/wuyoscar/jev-skill) | Skills for triage, documents, eval, UI, and simulation, with recorded requests and responses; most scenarios are unevaluated adaptations |
| [kerpopule/hermes-jev-skills](https://github.com/kerpopule/hermes-jev-skills) | Fail-open defaults, keyword rails independent of the model, and a shadow mode that logs decisions before acting on them |
| [can1357/jegrep](https://github.com/can1357/jegrep) | Scoring files by probability instead of building an embedding index |
| [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) | Library and Claude Code plugin that select tool calls/results to retain; inspect hooks and runtime requirements before enabling |
| [typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp) | Community MCP bridge when an agent needs callable Jev evaluations |
| [jev-ultrafast](https://github.com/browser-use/jev-ultrafast) | MIT browser agent that picks an operation and its target in one request over numbered page elements; its performance notes show what a paired, version-pinned comparison looks like |
| [Jev AI Hub examples](https://jevaihub.com/examples/) | Independent recipes for routing, scoring, moderation, retrieval, and tool selection |
| [awesome-jev](https://github.com/yibie/awesome-jev) | A broader, categorized directory when this short map does not cover the need |

Compaction is a tradeoff: keeping selected text verbatim avoids rewriting it, but discarding
context can still remove something needed later. `fast-jev-compaction` documents sending
conversation context and tool inputs to Jev, with result bodies represented by short notes
in the decision state. Check its current fitting and fallback rules; measure downstream task
success, not just the number of characters removed. This kit does not install its hooks.

## Discover something new

Several competing directories index the same launch-week repositories:
[cobanov/awesome-jev](https://github.com/cobanov/awesome-jev) favours reproducible evidence,
[logicrw/awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) pins each entry
to a commit and a decision point, and [github.com/topics/jev](https://github.com/topics/jev) is
unfiltered. One author can publish many repositories at once, so volume proves nothing.

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
