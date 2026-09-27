import { readFile } from 'node:fs/promises';
import { buildRequests, createReranker } from './rerank.mjs';

const [mode, ...extra] = process.argv.slice(2);
if (!['--dry-run', '--live'].includes(mode) || extra.length) {
  console.error('Usage: node run.mjs --dry-run|--live');
  process.exit(2);
}

const { query, candidates } = JSON.parse(await readFile(new URL('./shortlist.json', import.meta.url), 'utf8'));

if (mode === '--dry-run') {
  console.log(JSON.stringify({ firstStage: candidates.map((c) => c.id), requests: buildRequests(query, candidates) }, null, 2));
} else if (!process.env.TYPESAFE_API_KEY) {
  console.error('Set TYPESAFE_API_KEY in the environment or load it with node --env-file.');
  process.exitCode = 2;
} else {
  let TypeSafeClient;
  try {
    ({ TypeSafeClient } = await import('@typesafe-ai/sdk'));
  } catch {
    console.error('Install dependencies in examples/rerank first: npm install');
    process.exit(2);
  }
  // One attempt with its own timeout. The reranker stops waiting at its deadline but passes no
  // abort signal: cancelling a call in SDK 0.6.0 can end the process on Node 20 and 22
  // (https://github.com/typesafe-ai/typesafe-sdk-js/issues/2).
  const client = new TypeSafeClient({ logLevel: 'off', timeout: 3_000, retry: { maxRetries: 0 } });
  const rerank = createReranker({ systemOne: (request) => client.systemOne(request), deadlineMs: 3_500 });
  const started = performance.now();
  const result = await rerank(query, candidates);
  console.log(JSON.stringify({ milliseconds: Math.round(performance.now() - started), ...result }, null, 2));
}
