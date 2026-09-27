# Find a Jev resource

The [repository README](https://github.com/laguagu/jev-skills#skills) is the curated catalog.
Use it for community skills, MCP servers, apps, demos, SDKs and open models. Follow the
original project's docs and source before recommending an integration; a listing is not a runtime test.

## Choose a starting point

| Need | Start here |
| --- | --- |
| Current API and question design | [Official TypeSafe skill](https://github.com/typesafe-ai/skills) and [docs](https://docs.typesafe.ai/llms.txt) |
| A worked decision pattern | [Official cookbooks](https://docs.typesafe.ai/cookbooks) and [patterns](patterns.md) |
| Direct API calls | Official [JavaScript](https://github.com/typesafe-ai/typesafe-sdk-js) or [Python](https://github.com/typesafe-ai/typesafe-sdk-python) SDK |
| Existing framework or provider | [Setup](setup.md#another-provider-or-an-existing-framework) and the [integration catalog](https://github.com/laguagu/jev-skills#sdks--integrations) |
| Runnable examples | This kit's [examples](https://github.com/laguagu/jev-skills#examples) and [nexibeo/jev-cookbook](https://github.com/nexibeo/jev-cookbook) |
| Evidence for a technical choice | [Evaluations](evaluations.md), then a comparison on the user's own task |
| Maintain this collection | [jev-curator](https://github.com/laguagu/jev-skills/tree/main/skills/jev-curator) |

## Recommend for the actual task

Check the runtime, maintenance, license and real decision point in the source. Prefer an
existing framework adapter when it fits the application. Describe a prompt-only resource
as instructions, a plugin as a plugin, and a demo as a demo.

For agent hooks and compaction, inspect what data leaves the machine, what behavior changes,
and what survives a failed call. For local models, check hardware and serving requirements;
a compatible API does not make their probabilities or thresholds interchangeable with Jev's.

Return a short selection tied to the user's language, agent and task. State whether each
was read or run, and what adopting it requires. Discovery alone does not install tools or
change agent settings. Keep upstream skills upstream unless there is a specific reason to fork.
