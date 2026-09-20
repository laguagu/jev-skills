import { readFile } from 'node:fs/promises';
import { decision } from './policy.mjs';

const [example, mode, ...extra] = process.argv.slice(2);
if (!['routing', 'ranking', 'tools'].includes(example) ||
    !['--dry-run', '--live'].includes(mode) || extra.length) {
  console.error('Usage: node run.mjs routing|ranking|tools --dry-run|--live');
  process.exit(2);
}

const request = JSON.parse(await readFile(new URL(`./requests/${example}.json`, import.meta.url), 'utf8'));
if (mode === '--dry-run') {
  console.log(JSON.stringify(request, null, 2));
} else if (!process.env.TYPESAFE_API_KEY) {
  console.error('Set TYPESAFE_API_KEY in the environment or load it with node --env-file.');
  process.exitCode = 2;
} else {
  try {
    const { TypeSafeClient } = await import('@typesafe-ai/sdk');
    const client = new TypeSafeClient({
      baseURL: 'https://api.typesafe.ai', logLevel: 'off', timeout: 30_000,
      retry: { maxRetries: 0 },
    });
    const started = performance.now();
    const result = await client.systemOne(request);
    const policy = decision(example, request, result.answers);
    console.log(JSON.stringify({
      model: result.model, milliseconds: Math.round(performance.now() - started),
      usage: result.usage, answers: result.answers, policy,
    }, null, 2));
  } catch (error) {
    // Provider errors may include input text: print only a controlled message.
    console.error(error.code === 'ERR_MODULE_NOT_FOUND'
      ? 'Install dependencies in examples/decisions first: npm install'
      : 'The request or response failed. Keep the existing fallback; no action was taken.');
    process.exitCode = 1;
  }
}
