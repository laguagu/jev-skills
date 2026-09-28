# Connect to Jev

## TypeSafe direct

Create a key in the [console](https://console.typesafe.ai) and follow the
[quickstart](https://docs.typesafe.ai/introduction/quickstart). Set `TYPESAFE_API_KEY` in the
server environment or secret store, never in client code or a prompt, and never ask the user to
paste it into the conversation.

Official SDKs: [JavaScript](https://github.com/typesafe-ai/typesafe-sdk-js) (`@typesafe-ai/sdk`)
and [Python](https://github.com/typesafe-ai/typesafe-sdk-python) (`typesafe-sdk`, imported as
`typesafe_sdk`; the PyPI package `typesafe` is unrelated). Read the current
[SDK docs](https://docs.typesafe.ai/sdk) and changelogs before integrating.

Both SDKs read `TYPESAFE_BASE_URL` and `TYPESAFE_DEFAULT_MODEL`. `TYPESAFE_LOG_LEVEL=debug` logs
request and response bodies unredacted; keep it off where state is sensitive.

## Gateways and frameworks

The official SDKs work through a gateway by changing the base URL, key and model:

| Gateway | Base URL | Model | Key |
| --- | --- | --- | --- |
| [OpenRouter](https://openrouter.ai/~typesafe/jev-latest) | `https://openrouter.ai/api` | `~typesafe/jev-latest` | OpenRouter |
| [Vercel AI Gateway](https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe) | `https://ai-gateway.vercel.sh/typesafe` | `typesafe-ai/jev` | AI Gateway |

Each provider has its own key. Chat-completion clients do not work with the decision endpoint.

- [Cloudflare Workers AI](https://developers.cloudflare.com/ai/models/typesafe/jev/) serves Jev as `typesafe/jev` through a Workers binding.
- The [AI SDK provider](https://ai-sdk.dev/providers/ai-sdk-providers/typesafe-ai) answers through `experimental_evaluate`; its `boolean` question is a Noul.
- [LangChain](https://docs.langchain.com/oss/python/integrations/providers/typesafe) and [Pydantic AI](https://pydantic.dev/docs/ai/models/typesafe/) have integrations; the README lists more.
- Vercel AI Gateway's [evaluation fallbacks](https://vercel.com/docs/ai-gateway/models-and-providers/evaluation-fallbacks) rerun a low-confidence request on another model. Both stages are billed, and an LLM answer returns `confidence: 0`, meaning unavailable.
- For an LLM baseline on identical Python requests, the [System One Adapter](https://github.com/typesafe-ai/system-one-adapter-python) answers with OpenAI, Anthropic or Gemini.
- For a team, a proxy such as LiteLLM or Bifrost can hold the key and enforce spend limits.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Authentication failure | The key and the endpoint belong to the same provider |
| Model or request rejected | A versioned ID or alias, not the display name; limits in [models](https://docs.typesafe.ai/models) and the [API](https://docs.typesafe.ai/api) |
| 429 or 529 | Retryable; the SDKs back off by default |
| Results changed without a code change | An alias moved; pin a versioned ID |
| Node exits after a JavaScript call timed out or was cancelled | [SDK issue #2](https://github.com/typesafe-ai/typesafe-sdk-js/issues/2): a timeout firing mid-body can crash Node. Passing a `fetch` that reads the whole body first avoids it ([example](https://github.com/laguagu/jev-skills/blob/main/examples/fetch-whole-body.mjs)) |
