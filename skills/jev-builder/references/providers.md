# Providers of the typed decision request

Read this when the decision should run on another model than Jev, read an image, or stay
swappable between providers. Checked on 2026-10-21 against the linked pages. Model IDs, limits
and preview status move: read the page before pinning one, and take prices, rate limits,
retention and processing location from the provider's own page, never from memory.

| Provider | Models | Endpoint and request | Images |
| --- | --- | --- | --- |
| [TypeSafe](https://docs.typesafe.ai/api) | `jev-1.13.0`, the stable release behind the alias `jev-latest`; `jev-1.14.0`, the newest release (from 2026-10-14) behind `jev-preview` ([models](https://docs.typesafe.ai/models)) | `POST https://api.typesafe.ai/v1/systemone` with `model`, `state` and a `questions` map from your ID to `{type, instructions, criteria}`; `type` is `noul`, `choice` or `score`; answers return under the same IDs | No, text only |
| [OpenAI Decisions](https://developers.openai.com/api/docs/guides/decisions) (public beta) | `gpt-6-luna` | `POST /v1/decisions` with `model`, `input` (a string or user messages) and a `questions` array of `{type, name, instructions}`; `type` is `predicate`, `choice` (with `choices: [{value, description}]`) or `score` (with `levels: [{label, description}]`); answers are an array matched by `name` | Yes: `input_image` parts as inline base64 data URLs or public HTTP(S) URLs; file IDs are refused |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/models/clef-flash/) | `@cf/cloudflare/clef-flash`, [`clef`](https://developers.cloudflare.com/workers-ai/models/clef/) and [`clef-omni`](https://developers.cloudflare.com/workers-ai/models/clef-omni/); the weights are also on Hugging Face under Apache-2.0 | A Workers binding, or `POST https://api.cloudflare.com/client/v4/accounts/{account}/ai/run/@cf/cloudflare/clef-flash`, with TypeSafe's `model`, `state` and `questions` map | Yes: an `images` array of embedded PNG, JPEG or WebP, at most four, no remote URLs; `clef-omni` also takes audio and video |
| [Microsoft Foundry](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-microsoft-decision-1-in-microsoft-foundry-for-decision-and-classific/4562742) (public preview in the announcement of 2026-10-09) | `Microsoft-Decision-1`; `model` is your deployment name | `POST {endpoint}/providers/microsoft/v1/systemone` with `model`, `state` and the `questions` map | No, text only ([capabilities](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure)) |
| [Liquid](https://docs.liquid.ai/lfm/models/d1) | `d1`; the [family](https://docs.liquid.ai/lfm/models/decision-models) also lists the hosted `d1-ultra` and the open-weight `d1-3B` and `d1-omni-600M` | `POST https://api.liquid.ai/decisions/v1/systemone`; the TypeSafe SDKs work with the base URL `https://api.liquid.ai` | Yes: a top-level `images` array of base64 data URLs (at most eight, body under 4.5 MB, no remote URLs) in a direct HTTPS JSON request; the TypeSafe SDKs have no image parameter |
| [Vercel AI Gateway](https://vercel.com/docs/ai-gateway/modalities/decision) | `typesafe-ai/jev` (pinned: `typesafe-ai/jev-1.13.0`, `typesafe-ai/jev-1.14.0`), `openai/gpt-6-luna-decisions`, `microsoft/microsoft-decision-1`, `liquid/d1`, `liquid/d1-ultra`, `perplexity/pplx-decider-v1.2`, `perplexity/pplx-decider-flash-v1.2` (the [Decision filter](https://vercel.com/ai-gateway/models?capabilities=decision) is the current list) | One gateway key for all of them, four ways in: AI SDK `experimental_decide` with `gateway.decisionModel(id)`; `POST https://ai-gateway.vercel.sh/v1/evaluate`; OpenAI's `decisions.create` against `https://ai-gateway.vercel.sh/v1`; the TypeSafe SDK against `https://ai-gateway.vercel.sh/typesafe` | Only when the answering model takes images; a text-only model returns 400 |

Jev is also served through OpenRouter and Cloudflare; see [setup](setup.md#gateways-and-frameworks).
A gateway adds a recipient of the state: check its terms as well as the model provider's.

## What differs under the same shape

- **Yes/no has three names.** `noul` in TypeSafe-style requests, `predicate` at OpenAI, `boolean`
  in the AI SDK and the gateway's `/v1/evaluate`. Each returns the probability of yes and has no
  separate confidence.
- **Questions are a map or an array.** TypeSafe-style requests key each question by your ID, and
  TypeSafe does not show that ID to the model, so the instructions must say which item is
  judged. OpenAI takes an array and echoes each `name`.
- **Options are spelled differently.** TypeSafe-style `criteria` is a map of option to description
  for a Choice and an ordered array for a Score. OpenAI uses `choices` and `levels`.
- **OpenAI can refuse one question.** That answer has `type: "refusal"` while the others are
  answered. Route it to review; it is not a negative answer.
- **Cloudflare cuts long text silently.** Images and questions that exceed the context window
  fail the request, but a long text `state` is truncated to fit without an error. Measure the
  input before the call when the whole source has to be read.
- **Confidence is a provider statistic** about how concentrated a Choice or Score distribution
  is. It is not accuracy and not comparable across providers. A language-model fallback on
  Vercel's gateway has neither a confidence nor a distribution; see
  [setup](setup.md#gateways-and-frameworks).
- **Images count as input tokens** toward the price and the context window, and each provider
  has its own size and count limits on the linked page.
- **The AI SDK function was renamed.** `experimental_decide` and `decisionModel` need `ai` 7.0.128
  or later; `experimental_evaluate` and `evaluationModel` remain as deprecated aliases.

On calibration the providers agree with each other: OpenAI's guide says to set thresholds from
labelled examples of your own application, Microsoft's announcement says to validate calibration
on your own data, and Vercel's guide says matching response shapes imply neither matching
judgments nor matching calibration.

## Open decision models you host yourself

Several open-weight models take the same `state` and `questions` request and run on your own
GPU, so the state never leaves your infrastructure. Licences and dates below are from each
Hugging Face card and the Hub API, read 2026-10-21; read the card again before adopting one.

| Model | Sizes | Licence | Notes |
| --- | --- | --- | --- |
| d3 family by vLLM Semantic Router | [`vllm-sr/d3`](https://huggingface.co/vllm-sr/d3) and [`d3-turbo`](https://huggingface.co/vllm-sr/d3-turbo) about 26B, [`d3-flash`](https://huggingface.co/vllm-sr/d3-flash) 8B, [`d3-mini`](https://huggingface.co/vllm-sr/d3-mini) 4.5B | Apache-2.0 | Reads images (and video); a Python `system_one()` call or `POST /v1/systemone` through vLLM. `d3-turbo` is the newest (Hub entry 2026-10-19) |
| [`perplexity-ai/pplx-decider-v1.2`](https://huggingface.co/perplexity-ai/pplx-decider-v1.2) | 26B; also [`pplx-decider-flash-v1.2`](https://huggingface.co/perplexity-ai/pplx-decider-flash-v1.2) | Apache-2.0 | Text and images; also hosted on the Vercel gateway (table above) |
| [Amos 1 Large](https://huggingface.co/mukaddamzaid/amos-1-large) | 27B | Apache-2.0 | Text, JSON or a photo. Its hosted endpoint's [docs](https://amos.scira.ai/docs/) say every request is kept to improve the models: send it public material only, or self-host |

The [Jev Decision Index](https://huggingface.co/spaces/multimodalart/jev-decision-index) ranks
these and newer ones; the [jev-skills README](https://github.com/laguagu/jev-skills#-open-models)
lists more open models and their skills. Rankings are English and general: measure on your own
task before choosing, and size the GPU from the card (the 26-27B models need one large
data-centre GPU each in BF16).
