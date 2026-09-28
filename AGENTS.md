# Jev Skills

- Read `README.md` and the relevant `skills/*/SKILL.md`. Use the official `typesafe-ai` skill for current API details.
- The README is a browsable collection of Jev skills, repos, SDKs and examples: one link and one sentence per entry, under visible categories. For collection updates, follow `skills/jev-curator/SKILL.md`; a bare `skills/` folder is not discovered by every agent.
- Keep measured results in `skills/jev-builder/references/evaluations.md`. The reranker benchmark lives in laguagu/jev-rerank-bench: link it, cite individual figures from it, and never copy its code, tables or result files here.
- Bundle reusable guidance under `skills/jev-builder/references/`; runnable examples belong under `examples/`, with synthetic or explicitly public fixtures.
- Use original wording and respect upstream licenses. Keep TypeSafe's official skill installed from upstream instead of maintaining a copy.
- Never commit credentials, private inputs, or raw provider errors. Live calls are billed; dry runs are offline. `results/` is ignored run output.
- After code changes, run the offline checks in `examples/decisions/README.md`, `examples/rerank/README.md` or `examples/evidence/README.md`. Validate changed skills and plugin manifests before publishing.
- Version and description are repeated in `plugin.json`, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, and `.codex-plugin/plugin.json`. Change them together; validation does not compare them.
