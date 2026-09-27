// run.mjs --live in a child process against a local server. An AbortError that no caller can catch
// ends the process with exit code 1 after the reranker has already served its fallback, so only a
// separate process shows it. Synthetic key, loopback only, no paid call; needs `npm install`.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const installed = await import('@typesafe-ai/sdk').then(() => true, () => false);
const { candidates } = JSON.parse(await readFile(new URL('./shortlist.json', import.meta.url), 'utf8'));
const firstStage = candidates.map((c) => c.id);

/** Starts a server that handles each request with respond(res, body), runs run.mjs --live against it. */
async function runLive(respond) {
  const requests = [];
  const sockets = new Set();
  const server = createServer((req, res) => {
    let text = '';
    req.on('data', (chunk) => { text += chunk; });
    req.on('end', () => {
      const body = JSON.parse(text);
      requests.push({ path: req.url, authorization: req.headers.authorization, body });
      respond(res, body);
    });
  });
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  const env = Object.fromEntries(Object.entries(process.env)
    .filter(([name]) => !/^(TYPESAFE_|NODE_TEST_CONTEXT$)/i.test(name)));
  env.TYPESAFE_API_KEY = 'synthetic-test-key';
  env.TYPESAFE_BASE_URL = `http://127.0.0.1:${server.address().port}`;
  const child = spawn(process.execPath, ['--unhandled-rejections=throw', 'run.mjs', '--live'], {
    cwd: fileURLToPath(new URL('.', import.meta.url)),
    env,
  });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const guard = setTimeout(() => child.kill(), 20_000);
  try {
    const [code, signal] = await once(child, 'exit');
    return { code, signal, stdout, stderr, requests };
  } finally {
    clearTimeout(guard);
    for (const socket of sockets) socket.destroy();
    await new Promise((resolve) => server.close(resolve));
  }
}

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
