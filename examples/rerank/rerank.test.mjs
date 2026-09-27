import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRequests, createReranker } from './rerank.mjs';

const candidates = (n) => Array.from({ length: n }, (_, i) => ({ id: `c${i}`, title: `T${i}`, text: `passage ${i}` }));
const httpError = (status) => Object.assign(new Error(`HTTP ${status}`), { status });

// A fake backend: answers every question in a request, with probabilities chosen per passage text.
function fake(probability, { model = 'jev-1.13.0' } = {}) {
  const calls = [];
  const systemOne = async (request) => {
    calls.push(request);
    const answers = {};
    request.state.passages.forEach((p, i) => { answers[`p${i}`] = { type: 'noul', noul: probability(p.text) }; });
    return { model, answers, usage: { input_tokens: 100, output_tokens: 0 } };
  };
  return { systemOne, calls };
}

// A clock the tests can move.
function clock() {
  let t = 1_000;
  return { now: () => t, advance: (ms) => { t += ms; } };
}

test('batches of 15, each Noul bound to its index, and no ids in state', () => {
  const requests = buildRequests('q', candidates(31));
  assert.deepEqual(requests.map((r) => Object.keys(r.questions).length), [15, 15, 1]);
  assert.match(requests[1].questions.p14.instructions.judge, /passages\[14\]/);
  assert.equal(requests[0].model, 'jev-1.13.0');
  assert.deepEqual(Object.keys(requests[0].state.passages[0]), ['title', 'text']);
});

test('applied: sorted by probability, ties keep the first-stage order, the answering model is recorded', async () => {
  const p = { 'passage 0': 0.2, 'passage 1': 0.9, 'passage 2': 0.2, 'passage 3': 0.95 };
  const backend = fake((text) => p[text], { model: 'jev-1.13.0' });
  const result = await createReranker({ systemOne: backend.systemOne })('q', candidates(4));
  assert.equal(result.status, 'applied');
  assert.deepEqual(result.order, ['c3', 'c1', 'c0', 'c2']);
  assert.deepEqual(result.models, ['jev-1.13.0']);
});

test('an incomplete answer falls back to the first-stage order without a cooldown', async () => {
  let calls = 0;
  const systemOne = async () => { calls++; return { model: 'jev-1.13.0', answers: { p0: { type: 'noul', noul: 0.5 } } }; };
  const rerank = createReranker({ systemOne });
  const result = await rerank('q', candidates(3));
  assert.deepEqual(result, { order: ['c0', 'c1', 'c2'], status: 'fallback', reason: 'incomplete answer' });
  await rerank('q', candidates(3));
  assert.equal(calls, 2);
});

test('a probability outside 0 to 1 is not used', async () => {
  const result = await createReranker({ systemOne: fake(() => 1.7).systemOne })('q', candidates(2));
  assert.equal(result.reason, 'incomplete answer');
});

test('one failed batch fails the whole rerank', async () => {
  const systemOne = async (request) => {
    if (request.state.passages.length < 15) throw httpError(500);
    return fake(() => 0.9).systemOne(request);
  };
  const result = await createReranker({ systemOne })('q', candidates(20));
  assert.equal(result.status, 'fallback');
  assert.deepEqual(result.order, candidates(20).map((c) => c.id));
});

test('no answer by the deadline: first-stage order, then a cooldown', async () => {
  let calls = 0;
  const systemOne = () => { calls++; return new Promise(() => {}); };
  const time = clock();
  const rerank = createReranker({ systemOne, deadlineMs: 20, cooldownMs: 60_000, now: time.now });
  assert.equal((await rerank('q', candidates(3))).reason, 'deadline');
  assert.equal((await rerank('q', candidates(3))).status, 'skipped');
  assert.equal(calls, 1);
});

test('a 429 starts a cooldown that ends', async () => {
  let fail = true;
  let calls = 0;
  const systemOne = async (request) => {
    calls++;
    if (fail) throw httpError(429);
    return fake(() => 0.5).systemOne(request);
  };
  const time = clock();
  const rerank = createReranker({ systemOne, cooldownMs: 60_000, now: time.now });
  assert.equal((await rerank('q', candidates(3))).reason, 'HTTP 429');
  assert.equal((await rerank('q', candidates(3))).status, 'skipped');
  fail = false;
  time.advance(60_001);
  assert.equal((await rerank('q', candidates(3))).status, 'applied');
  assert.equal(calls, 2);
});

test('a 422 belongs to that request: no cooldown', async () => {
  let calls = 0;
  const systemOne = async () => { calls++; throw httpError(422); };
  const rerank = createReranker({ systemOne });
  assert.equal((await rerank('q', candidates(3))).reason, 'HTTP 422');
  await rerank('q', candidates(3));
  assert.equal(calls, 2);
});

test('too few candidates: nothing is sent', async () => {
  const backend = fake(() => 0.5);
  const result = await createReranker({ systemOne: backend.systemOne })('q', candidates(1));
  assert.equal(result.status, 'skipped');
  assert.equal(backend.calls.length, 0);
});
