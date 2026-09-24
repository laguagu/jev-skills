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
   unrelated library). Read their current usage before integrating.

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

## Another provider or an existing framework

Already using AI Gateway? Check the current [Jev gateway entry](https://vercel.com/ai-gateway/models/jev)
and [Gateway docs](https://vercel.com/docs/ai-gateway) for the supported API and authentication.
[OpenRouter](https://openrouter.ai/typesafe/jev-1.13) serves Jev on a separate decisions endpoint;
chat-completion clients do not work with it. [Cloudflare Workers AI](https://developers.cloudflare.com/ai/models/typesafe/jev/)
serves it as `typesafe/jev` through its own binding. Each provider has its own key: a TypeSafe
direct key is not a gateway, OpenRouter, or Cloudflare credential. The direct SDK example above targets TypeSafe directly.
Do not convert it into a generic chat request without checking the adapter's documented schema.

For LangChain, start with its [TypeSafe integration](https://docs.langchain.com/oss/python/integrations/providers/typesafe).
For an agent that needs callable tools, consider an MCP integration in [Resources](resources.md).
A skill supplies guidance; it does not create an API account, grant credits, or expose an MCP tool.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Key missing | The process that makes the call actually loads `TYPESAFE_API_KEY` |
| Authentication failure | Credential and endpoint belong to the same provider |
| Model or request rejected | Current [models](https://docs.typesafe.ai/models) and [API schema](https://docs.typesafe.ai/api) |
| Confident but wrong results | Question scope, candidate coverage, labels, and missing/ambiguous inputs |
| Unexpected cost or latency | Input size, batching, retries, network time, and recorded usage |
| Node exits after a cancelled JavaScript call | SDK 0.6.0, still the latest release on September 24, 2026, can crash on a handled abort on Node 20 or 22 ([open issue](https://github.com/typesafe-ai/typesafe-sdk-js/issues/2)); Node 24 is unaffected |

Check [confidence semantics](https://docs.typesafe.ai/confidence) before implementing a gate.
For paid calls, start with a small sample. Dry runs in this kit print requests without network access.
