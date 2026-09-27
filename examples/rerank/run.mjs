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
  // One attempt, no retries. The reranker stops waiting at its deadline; the SDK's own timeout,
  // set above it, then ends the abandoned request.
  const client = new TypeSafeClient({
    logLevel: 'off', timeout: 5_000, retry: { maxRetries: 0 }, fetch: fetchWholeBody,
  });
  const rerank = createReranker({ systemOne: (request) => client.systemOne(request), deadlineMs: 3_500 });
  const started = performance.now();
  const result = await rerank(query, candidates);
  console.log(JSON.stringify({ milliseconds: Math.round(performance.now() - started), ...result }, null, 2));
}

/**
 * The SDK's fetch, reading the whole body before the SDK sees the response. SDK 0.6.0 clones each
 * response and reads the copy; when its timeout aborts that read mid-body, the fetch bundled with
 * Node 22 and some Node 24 and 25 releases throws an AbortError that no caller can catch, and the
 * process exits (https://github.com/typesafe-ai/typesafe-sdk-js/issues/2). Here the timeout ends
 * this read as an ordinary rejection, and the SDK receives a body already in memory.
 */
async function fetchWholeBody(url, init) {
  const response = await fetch(url, init);
  const body = await response.arrayBuffer();
  return new Response([204, 205, 304].includes(response.status) ? null : body, {
    status: response.status, statusText: response.statusText, headers: response.headers,
  });
}
