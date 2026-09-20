# Related projects and design notes

Research snapshot: September 20, 2026. Repository descriptions were checked against their
primary GitHub pages. Projects were not installed or audited unless explicitly noted.

## Existing projects

| Project | What exists | Implication |
| --- | --- | --- |
| [LangChain + Jev](https://www.langchain.com/blog/building-a-harness-with-jev) | TypeSafeClassifier and experimental model-routing middleware | Use existing framework integration when building agent loops |
| [AutoJev skills](https://autojev.ai/jev-skills) | Six focused agent skills backed by AutoJev MCP tools | Skill instructions and callable MCP tools are separate installations |
| [TypeSafe skills](https://github.com/typesafe-ai/skills) | Official MIT integration skill, skills.sh installation and Claude plugin | Link to the original; a generic competing skill adds little |
| [TypeSafe JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js) | Official JS client, also linked from TypeSafe docs | Use the SDK for production; avoid building a redundant client library |
| [jev-router](https://github.com/gargpratyush/jev-router) | Per-turn model routing for Claude Code and Codex | A general cheap-model router is already a populated category |
| [typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp) | MCP bridge to typed evaluations | A basic API-to-MCP wrapper alone is weak differentiation |
| [mobile-jev](https://github.com/droidrun/mobile-jev) | Android action selection and inspection studio | Immediate, visible behavior makes a stronger demo than a skill list |
| [awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) | Project discovery and ecosystem directory | Contribute an actual working project rather than another directory |
| [jevcal](https://github.com/abhixhek/jevcal) | Threshold calibration, held-out evaluation and drift checks | Use a dedicated calibration workflow when selecting production thresholds |
| [jev-mcp](https://github.com/jkudish/jev-mcp) | MCP tools including claim verification against supplied evidence | Useful when the caller is an agent rather than a local evaluation script |
| [jev-usecases](https://github.com/kenhuangus/jev-usecases) | Multiple Jev use-case harnesses and decision policies | Broader workflow examples beyond this lab's passage-level evaluation |

Official [cookbooks](https://docs.typesafe.ai/introduction) already cover routing, reranking,
function selection, extraction and citation checking. In particular, the
[citation-checking cookbook](https://docs.typesafe.ai/cookbooks/citation_check) checks exact
quotes and then their meaning. This lab does **not** claim to invent evidence verification.
Its contribution is a dependency-free evaluation runner, inspectable source receipts and an
offline abstention demo. Bring labelled examples from any domain using `--cases`; the runner
does not contain a domain-specific taxonomy or private product integration.

## Design choices

- One question per passage keeps individual evidence judgments available for inspection.
- Original text is copied by code; no quote generation or normalization is needed.
- Conflicts are preserved rather than resolved by confidence alone.
- The report reuses the Python policy at every threshold. Its browser code only displays results.
- Labels are required for evaluation and never sent to the model.
- The default threshold is an example. Coverage and accuracy are shown together.

Useful next experiments include independently labelled held-out cases, an equivalent LLM
baseline and retrieval coverage for longer documents. The current small synthetic run is a
smoke test, not evidence of general superiority over other models or projects.

## Skills versus plugins

[Agent Skills](https://agentskills.io) describes SKILL.md-based instructions.
[Agent Plugins](https://agent-plugins.org/) specifies a portable package for skills and MCP
servers. Its [root manifest](https://agent-plugins.org/plugin-authors/manifest) is `plugin.json`;
native client packaging and distribution may require adapters. A manifest does not itself
list a project in a marketplace or make its code popular.

This repository ships the runnable lab and two focused skills. A plugin may follow if several
reusable skills or a real MCP capability justify installation as one package. The official
TypeSafe skill stays upstream; this repository links to it instead of redistributing a copy.

## Model facts relevant to the experiment

- TypeSafe's [announcement](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
  is dated September 15, 2026. This establishes the public launch date.
- [Current docs](https://docs.typesafe.ai/models) list `jev-1.13.0`, text input, $0.042/M input
  tokens, free outputs, 64k total request budget and 32k state-plus-longest-question budget.
- [The API](https://docs.typesafe.ai/api) exposes Choice, Score and Noul. Questions within a
  request run independently. Noul is a probability of yes, not just a Boolean.
- [Confidence](https://docs.typesafe.ai/confidence) summarizes the distribution. It is not
  the selected label's probability or a guarantee of correctness on a target domain.

Avoid unverified claims such as “no competitor has this”, “cannot make mistakes”, or universal
speed/cost multipliers. Specialized classifiers, rerankers and structured-output models are
alternative approaches; fair comparisons require equivalent tasks and outputs.
