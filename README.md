# Jev Skills

Practical skills for coding agents building with [Jev](https://typesafe.ai/).
Set up the API, choose a decision pattern, and add routing, ranking, or evidence checks to your app.

## Install

Install TypeSafe's official guidance and the general-purpose skill from this repository:

```sh
npx skills add typesafe-ai/skills --skill typesafe-ai
npx skills add laguagu/jev-skills --skill jev-builder
```

Choose your agent when prompted, or add `--agent codex`.
[Claude Code plugin and other installation options](INSTALL.md).

## Skills

| Skill | Purpose |
| --- | --- |
| [jev-builder](skills/jev-builder/SKILL.md) | API setup, decision patterns, question design, source-backed evidence, and useful Jev integrations |
| [jev-evidence-eval](skills/jev-evidence-eval/SKILL.md) | Evaluate accuracy, review rate, latency, and cost |

Omit `--skill jev-builder` from the install command to choose either skill.
The official TypeSafe skill stays maintained upstream.

## Use

Ask your coding agent:

> Use jev-builder to add support-ticket routing. Include an unknown route and test the fallback.

For live calls, create a key in the [TypeSafe console](https://console.typesafe.ai)
and set `TYPESAFE_API_KEY` in your server environment or a gitignored `.env`.
The skills include setup instructions; installing them makes no API calls.

## Examples and resources

- [Decision examples](examples/decisions/README.md): routing, ranking, tool selection, workflow control, risk scoring, and answer verification, with offline dry runs.
- [Evidence example](examples/evidence/README.md): claim checking and a saved interactive report.
- [Resource guide](skills/jev-builder/references/resources.md): official SDKs, other skills, and community projects.

Independent community project. [MIT license](LICENSE).
