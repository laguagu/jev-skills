// run.mjs --live in a child process against a local server. An AbortError that no caller can catch
// ends the process with exit code 1 after the reranker has already served its fallback, so only a
// separate process shows it. Synthetic key, loopback only, no paid call; needs `npm install`.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runLive as runLoopback } from '../loopback-server.mjs';

const installed = await import('@typesafe-ai/sdk').then(() => true, () => false);
const { candidates } = JSON.parse(await readFile(new URL('./shortlist.json', import.meta.url), 'utf8'));
const firstStage = candidates.map((c) => c.id);

const runLive = (respond) => runLoopback(new URL('.', import.meta.url), ['--live'], respond);

function assertFallbackAndCleanExit(run) {
  assert.equal(run.stderr, '');
  assert.equal(run.signal, null);
  assert.equal(run.code, 0);
  const result = JSON.parse(run.stdout);
  assert.equal(result.status, 'fallback');
  assert.equal(result.reason, 'deadline');
  assert.deepEqual(result.order, firstStage);
  assert.equal(run.requests.length, 1);
}

const skip = installed ? false : 'install dependencies in examples/rerank first: npm install';

describe('run.mjs --live against a local server', { concurrency: true }, () => {
  it('a complete answer is applied (control)', { skip }, async () => {
    const run = await runLive((res, body) => {
      const answers = Object.fromEntries(body.state.passages.map((_, i) => [`p${i}`, { type: 'noul', noul: i / 10 }]));
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ model: 'fixture', answers, usage: { input_tokens: 1, output_tokens: 0 } }));
    });
    assert.equal(run.stderr, '');
    assert.equal(run.code, 0);
    assert.deepEqual(JSON.parse(run.stdout).order, [...firstStage].reverse());
    assert.deepEqual(run.requests.map((r) => [r.path, r.authorization, r.body.model]),
      [['/v1/systemone', 'Bearer synthetic-test-key', 'jev-1.13.0']]);
  });

  it('headers, then a stalled body: the fallback is served and the process exits 0', { skip }, async () => {
    assertFallbackAndCleanExit(await runLive((res) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.flushHeaders();
    }));
  });

  it('part of the body, then a stall: the fallback is served and the process exits 0', { skip }, async () => {
    assertFallbackAndCleanExit(await runLive((res) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.write('{"model":"fixture","answers":{');
    }));
  });
});
