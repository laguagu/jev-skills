import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { decision } from './policy.mjs';

const request = name => JSON.parse(readFileSync(new URL(`./requests/${name}.json`, import.meta.url)));
const choice = (label, confidence = 0.95) => ({ type: 'choice', choice: label, confidence });
const score = (value, confidence = 0.95) => ({ type: 'score', score: value, confidence });

test('an urgent unknown ticket goes to triage, not an invented queue', () => {
  assert.deepEqual(decision('routing', request('routing'), {
    route: choice('unknown'), urgent: { type: 'noul', noul: 0.99 },
  }), { queue: 'triage', immediate: true });
});

test('uncertain routing falls back even when a team is selected', () => {
  assert.equal(decision('routing', request('routing'), {
    route: choice('billing', 0.2), urgent: { type: 'noul', noul: 0.1 },
  }).queue, 'triage');
});

test('ranking preserves exact source identity and sorts expected rubric scores', () => {
  const input = request('ranking');
  const output = decision('ranking', input, { p0: score(2.8), p1: score(0.1), p2: score(1.3) });
  assert.deepEqual(output.passages.map(p => p.id), ['retention', 'logging', 'billing']);
  for (const p of output.passages) assert.equal(p.text, input.state.passages.find(s => s.id === p.id).text);
});

test('uncertain ranking retains all original context', () => {
  const input = request('ranking');
  const output = decision('ranking', input, { p0: score(2.8), p1: score(0.1, 0.1), p2: score(1) });
  assert.equal(output.review, true);
  assert.deepEqual(output.passages, input.state.passages);
});

test('tool choices remain proposals, and none abstains', () => {
  assert.deepEqual(decision('tools', request('tools'), { tool: choice('search_docs') }),
    { proposedTool: 'search_docs', executed: false });
  assert.equal(decision('tools', request('tools'), { tool: choice('none') }).proposedTool, null);
});

test('malformed answers and out-of-catalog tools fail before policy use', () => {
  const input = request('tools');
  for (const answers of [{}, { tool: choice('delete_everything') }, { tool: choice('read_file', NaN) }]) {
    assert.throws(() => decision('tools', input, answers));
  }
});
