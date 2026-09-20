# Jev ecosystem and launch direction

Research snapshot: September 20, 2026. Repository descriptions were checked against their
primary GitHub pages. Projects were not installed or audited unless explicitly noted.

## Existing projects

| Project | What exists | Implication |
| --- | --- | --- |
| [TypeSafe skills](https://github.com/typesafe-ai/skills) | Official MIT integration skill, skills.sh installation and Claude plugin | Link to the original; a generic competing skill adds little |
| [TypeSafe JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js) | Official JS client, also linked from TypeSafe docs | Use the SDK for production; avoid building a redundant client library |
| [jev-router](https://github.com/gargpratyush/jev-router) | Per-turn model routing for Claude Code and Codex | A general cheap-model router is already a populated category |
| [typesafe-mcp](https://github.com/itsmostafa/typesafe-mcp) | MCP bridge to typed evaluations | A basic API-to-MCP wrapper alone is weak differentiation |
| [mobile-jev](https://github.com/droidrun/mobile-jev) | Android action selection and inspection studio | Immediate, visible behavior makes a stronger demo than a skill list |
| [awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects) | Project discovery and ecosystem directory | Contribute an actual working project rather than another directory |

Official [cookbooks](https://docs.typesafe.ai/introduction) already cover routing, reranking,
function selection, extraction and citation checking. In particular, the
[citation-checking cookbook](https://docs.typesafe.ai/cookbooks/citation_check) checks exact
quotes and then their meaning. This lab does **not** claim to invent evidence verification.
Its proposed contribution is an easy-to-run, inspectable receipt and an honest abstention demo.

## Recommended first release

Use one focused repository: **Jev Evidence Lab**. The hook is “typed decisions with the source
text attached, including a visible I-don't-know path.” Show a positive, a contradiction, a missing
fact and a conflict in a short screen recording. Publish commands, costs and failures alongside it.

Before a larger launch, add an independently labelled held-out set and an equivalent LLM baseline.
Do not sell the current 32/32 smoke-test result as a benchmark victory. A confidence slider is
useful because it lets readers inspect the coverage trade-off rather than trust a headline.

Suggested launch copy:

> I built a tiny Jev evidence lab. It checks claims against source passages, keeps the original
> text attached, and lets you replay confidence thresholds without more API calls. Includes
> synthetic fixtures, raw results and a reusable evaluation skill. Looking for hard cases where
> typed answers still get the meaning wrong.

Publish under a personal account, with an explicit independent-project description. Share the
working demo in relevant TypeSafe/community channels and propose it to an existing directory.
No social posts or directory submissions have been made as part of this prototype.
Virality is uncertain; a reusable result and a clear demo are stronger reasons to star a repo
than a promise that a new model is revolutionary.

## Skills versus plugins

[Agent Skills](https://agentskills.io) describes SKILL.md-based instructions.
[Agent Plugins](https://agent-plugins.org/) specifies a portable package for skills and MCP
servers. Its [root manifest](https://agent-plugins.org/plugin-authors/manifest) is `plugin.json`;
native client packaging and distribution may require adapters. A manifest does not itself
list a project in a marketplace or make its code popular.

Ship the runnable lab and focused skill first. Add a plugin when several reusable skills or
a real MCP capability justify installation as one package. Keep the official TypeSafe skill
upstream and preserve attribution if any MIT material is later copied.

## Model facts relevant to the experiment

- TypeSafe's [announcement](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
  is dated September 15, 2026. This establishes the public launch date.
- [Current docs](https://docs.typesafe.ai/models) list `jev-1.13.0`, text input, $0.042/M input
  tokens, free outputs, 64k total request budget and 32k state-plus-longest-question budget.
- [The API](https://docs.typesafe.ai/api) exposes Choice, Score and Noul. Questions within a
  request run independently. Noul is a probability of yes, not just a Boolean.
- [Confidence](https://docs.typesafe.ai/confidence) summarizes the distribution. It is not
  the selected label's probability or a guarantee of correctness on a target domain.
- The requested Vercel launch URL was unavailable to the research fetcher; the launch date and
  technical statements above use TypeSafe's own announcement and documentation instead.

Avoid unverified claims such as “no competitor has this”, “cannot make mistakes”, or universal
speed/cost multipliers. Specialized classifiers, rerankers and structured-output models are
alternative approaches; fair comparisons require equivalent tasks and outputs.
