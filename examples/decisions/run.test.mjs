// Synthetic key, loopback only, no paid call. A child process catches SDK crashes that
// an in-process assertion would miss, including failures after the runner's catch block.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runLive as runLoopback } from '../loopback-server.mjs';

const installed = await import('@typesafe-ai/sdk').then(() => true, () => false);
const skip = installed ? false : 'install dependencies in examples/decisions first: npm install';
const runLive = (respond) => runLoopback(new URL('.', import.meta.url), ['routing', '--live'], respond, 40_000);

function assertControlledFailure(run) {
  assert.equal(run.signal, null);
  assert.equal(run.code, 1);
  assert.equal(run.stdout, '');
  assert.equal(run.stderr, 'The request or response failed. Keep the existing fallback; no action was taken.\n');
  assert.equal(run.requests.length, 1);
}

describe('run.mjs --live against a local server', { concurrency: true }, () => {
  it('a complete answer is applied (control)', { skip }, async () => {
    const run = await runLive((res) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({
        model: 'fixture',
        answers: {
          route: { type: 'choice', choice: 'billing', confidence: 0.95 },
          urgent: { type: 'noul', noul: 0.1 },
        },
        usage: { input_tokens: 1, output_tokens: 0 },
      }));
    });
    assert.equal(run.signal, null);
    assert.equal(run.stderr, '');
    assert.equal(run.code, 0);
    assert.deepEqual(JSON.parse(run.stdout).policy, { queue: 'billing', immediate: false });
    assert.deepEqual(run.requests.map((r) => [r.path, r.authorization, r.body.model]),
      [['/v1/systemone', 'Bearer synthetic-test-key', 'jev-latest']]);
  });

  it('headers, then a stalled body: one controlled failure and no process crash', { skip }, async () => {
    assertControlledFailure(await runLive((res) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.flushHeaders();
    }));
  });

  it('part of the body, then a stall: one controlled failure and no process crash', { skip }, async () => {
    assertControlledFailure(await runLive((res) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.write('{"model":"fixture","answers":{');
    }));
  });
});
