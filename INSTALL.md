# Install the skills

## Any supported coding agent

```sh
npx skills add typesafe-ai/skills --skill typesafe-ai
npx skills add laguagu/jev-skills --skill jev-builder
```

Choose your agent when prompted, or add `--agent codex`. Omit `--skill` from the
second command to choose either kit skill. Installation is project-local by default;
add `-g` for a personal installation.

The official TypeSafe skill is maintained upstream and is not bundled here.
Pick one installation method per skill to avoid duplicate copies.

## Claude Code plugin alternative

Install both Jev Skills skills together:

```sh
claude plugin marketplace add laguagu/jev-skills
claude plugin install jev-skills@jev-skills
```

For the official TypeSafe skill, use its plugin alternative **instead of** its skills CLI command:

```sh
claude plugin marketplace add typesafe-ai/skills
claude plugin install typesafe@typesafe-ai
```

Reload plugins or start a new session if your client does not pick them up immediately.
For example, ask: “Use the jev-skills:jev-builder skill to design a request router.”

## What's in the package?

- `skills/`: two skills, with setup, patterns, question, evidence, and resource references bundled inside `jev-builder`.
- `plugin.json`: the [Agent Plugins](https://agent-plugins.org/plugin-authors/manifest) portable manifest.
- `.claude-plugin/`: Claude Code manifest and marketplace.
- `.codex-plugin/plugin.json`: Codex-native metadata for plugin loaders. The skills CLI above is the documented Codex installation path here.

These manifests describe the same skills. They do not imply listing in a public marketplace.
The package contains no hooks, MCP server, API key, or automatic installation script.
Examples remain optional; installing a skill does not execute them.
`CLAUDE.md` is a checkout-only contributor adapter; installed plugins load guidance from
the skills instead. Claude's validator may note that distinction.

For the runnable examples, clone the repository and follow
[the decision examples](examples/decisions/README.md) or
[the evidence example](examples/evidence/README.md).
