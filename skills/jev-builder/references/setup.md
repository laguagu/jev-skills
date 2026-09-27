# API setup

## TypeSafe direct

1. Create a TypeSafe account and API key through the [console](https://console.typesafe.ai).
   Follow the [official quickstart](https://docs.typesafe.ai/introduction/quickstart)
   for current account, billing, and access requirements.
2. Set `TYPESAFE_API_KEY` in the server process environment, deployment secret store,
   or a gitignored `.env` using the project's existing loader. A `.env` file is not
   automatically read by every runtime. Never put the key in client-side code or a prompt.
3. Install the official [JavaScript SDK](https://github.com/typesafe-ai/typesafe-sdk-js)
   (`@typesafe-ai/sdk`) or [Python SDK](https://github.com/typesafe-ai/typesafe-sdk-python)
   (`pip install typesafe-sdk`, imported as `typesafe_sdk`; the PyPI package `typesafe` is an
   unrelated library). Read their current usage before integrating. On September 27, 2026 the
   JavaScript SDK was at 0.6.0 and the Python SDK at 0.7.2. Python 0.7.0 was a breaking release
   (pydantic replaced msgspec) and added `response_model`; 0.7.2 added the `typesafe-sdk[http2]`
   extra for many concurrent requests. The cookbooks' helper `cooksafe` 0.2.0 requires
   `typesafe-sdk>=0.7,<0.8` ([changelog](https://docs.typesafe.ai/sdk/python/changelog)).

Minimal server-side JavaScript, after `npm install @typesafe-ai/sdk`:

```js
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const client = new TypeSafeClient(); // reads TYPESAFE_API_KEY
const result = await client.systemOne({
  state: { message: "Please explain the storage limit on my plan." },
  questions: {
    route: choice("Which team handles this message?", {
      product: "Product capabilities, limits, or how-to questions.",
      billing: "Invoices, charges, or payment problems.",
      unknown: "No matching team or insufficient information.",
    }),
  },
});
console.log(result.answers.route);
```

Keep the whole answer while evaluating: confidence and the probability distribution help
inspect failures. Do not log sensitive state or provider error bodies. After selecting a
route, apply the application's own fallback policy before dispatching.

Both SDKs also read `TYPESAFE_BASE_URL` and `TYPESAFE_DEFAULT_MODEL`, so a deployment can pin a
versioned model without a code change. `TYPESAFE_LOG_LEVEL=debug` logs request and response
bodies unredacted; only credential headers are hidden. Keep it off wherever state is sensitive
([Python usage](https://docs.typesafe.ai/sdk/python/usage),
[JavaScript client options](https://docs.typesafe.ai/sdk/javascript/api/interfaces/TypeSafeClientConfig)).

## Another provider or an existing framework

The official SDKs work through a gateway by changing the base URL, the key and the model
([configuring the base URL](https://docs.typesafe.ai/sdk/python/usage#configuring-the-base-url)):

| Gateway | Base URL | Model | Key |
| --- | --- | --- | --- |
| [OpenRouter](https://openrouter.ai/~typesafe/jev-latest) | `https://openrouter.ai/api` | `~typesafe/jev-latest` | OpenRouter |
| [Vercel AI Gateway](https://vercel.com/docs/ai-gateway/sdks-and-apis/typesafe) | `https://ai-gateway.vercel.sh/typesafe` | `typesafe-ai/jev` | AI Gateway |

Each provider has its own key: a TypeSafe direct key is not a gateway, OpenRouter, or Cloudflare
credential. Chat-completion clients do not work with these decision endpoints. Do not convert
a request into a generic chat request without checking the adapter's documented schema.
[Cloudflare Workers AI](https://developers.cloudflare.com/ai/models/typesafe/jev/) serves Jev as
`typesafe/jev` through its own binding.

In a TypeScript app on the AI SDK, the [`@ai-sdk/typesafe-ai`](https://ai-sdk.dev/providers/ai-sdk-providers/typesafe-ai)
provider answers through `experimental_evaluate`; its `boolean` question is a Noul and returns
`probability`. TypeSafe returns probabilities and scores rounded to two decimals, so do not tune a
threshold finer than 0.01.

For a team, put a gateway in front of the key, such as LiteLLM, Bifrost, or your own proxy that
forwards `/v1/systemone` unchanged, and count the estimated tokens of requests still in flight
against any spending or rate cap.

For LangChain, start with its [TypeSafe integration](https://docs.langchain.com/oss/python/integrations/providers/typesafe).
For an agent that needs callable tools, consider an MCP integration in [Resources](resources.md).
A skill supplies guidance; it does not create an API account, grant credits, or expose an MCP tool.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Key missing | The process that makes the call actually loads `TYPESAFE_API_KEY` |
| Authentication failure | Credential and endpoint belong to the same provider |
| Model or request rejected | TypeSafe direct takes a versioned ID such as `jev-1.13.0` or an alias such as `jev-latest`; the display name `jev-1.13` returns 400. Current [models](https://docs.typesafe.ai/models) and [API schema](https://docs.typesafe.ai/api) |
| Request too large | 64k tokens per request, of which 32k for the state plus the longest question ([models](https://docs.typesafe.ai/models)). Size batches from your text's characters per token ([Rerank](rerank.md#size-the-batch-against-the-budget)) |
| Choice or Score rejected | A Choice takes at most 255 options, a Score 2 to 10 levels ([API](https://docs.typesafe.ai/api)) |
| 429 or 529 | Rate limits change without notice; 529 Overloaded is retryable. The SDKs retry both with backoff by default ([models](https://docs.typesafe.ai/models)) |
| Results changed with no code change | An alias moved. `jev-latest` follows official releases; `jev-preview` may point to a build that is not official. Pin a versioned ID for evaluations |
| Confident but wrong results | Question scope, candidate coverage, labels, and missing/ambiguous inputs |
| Unexpected cost or latency | Input size, batching, retries, network time, and recorded usage |
| Node exits after a cancelled JavaScript call | SDK 0.6.0, still the latest release on September 27, 2026, can crash on a handled abort on Node 20 or 22 ([open issue](https://github.com/typesafe-ai/typesafe-sdk-js/issues/2)); Node 24 is unaffected |

Check [confidence semantics](https://docs.typesafe.ai/confidence) before implementing a gate.
For paid calls, start with a small sample. Dry runs in this kit print requests without network access.
