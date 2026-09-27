// Rerank a search shortlist with Jev, and keep search working when Jev does not answer.
// Illustrative, no dependencies: the caller passes in the function that makes the request.

export const MODEL = 'jev-1.13.0';
export const BATCH_SIZE = 15;

// Rewrite `corpus` and the criteria for what separates a right answer in your own data.
const INSTRUCTIONS = {
  task: 'A user asked a question. Decide whether this passage is a source that answers it.',
  corpus:
    'The passages come from the help centre of a project-management product. Many of them use the ' +
    'same words (delete, restore, days), so the wording of a passage says little about whether it ' +
    'answers the question.',
};
const CRITERIA = {
  true:
    'The passage contains the specific statement or rule the question asks about, so that someone ' +
    'reading this passage alone could answer the question.',
  false:
    'The passage is on a related subject, or shares vocabulary with the question, but does not ' +
    'contain the specific statement the question asks about.',
};

/** One request per batch; each Noul is told which passage it judges. */
export function buildRequests(query, candidates, { batchSize = BATCH_SIZE, model = MODEL } = {}) {
  const requests = [];
  for (let start = 0; start < candidates.length; start += batchSize) {
    const batch = candidates.slice(start, start + batchSize);
    const questions = {};
    batch.forEach((_, i) => {
      questions[`p${i}`] = {
        type: 'noul',
        instructions: {
          ...INSTRUCTIONS,
          judge:
            `Judge only the passage at passages[${i}]. The other passages are competing candidates ` +
            'for the same question; do not judge them and do not let them change this answer.',
        },
        criteria: CRITERIA,
      };
    });
    // Only the fields the judgment uses: no ids, which would be distractors.
    const passages = batch.map(({ title, text }) => ({ title, text }));
    requests.push({ model, state: { question: query, passages }, questions });
  }
  return requests;
}

class InvalidAnswer extends Error {}
class DeadlineExceeded extends Error {}

/** Every question must come back as a Noul with a probability; anything else fails the batch. */
export function readScores(request, result) {
  return Object.keys(request.questions).map((key) => {
    const answer = result?.answers?.[key];
    const p = answer?.noul;
    if (answer?.type !== 'noul' || typeof p !== 'number' || !(p >= 0 && p <= 1)) {
      throw new InvalidAnswer(`no usable answer for ${key}`);
    }
    return p;
  });
}

function withDeadline(promise, ms) {
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new DeadlineExceeded(`no answer within ${ms} ms`)), ms);
  });
  return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
}

/** Service trouble: the next request would probably fail too. A 400, 413 or 422 is this request's own. */
export function isServiceTrouble(error) {
  if (error instanceof InvalidAnswer) return false;
  const status = error?.status;
  if (typeof status !== 'number') return true; // deadline, timeout, connection
  return status === 401 || status === 403 || status === 408 || status === 429 || status >= 500;
}

/**
 * systemOne(request) returns a promise of { answers, model, usage }.
 * The result's `order` is always complete: the reranked order, or the first-stage order.
 */
export function createReranker({
  systemOne,
  deadlineMs = 1500,
  cooldownMs = 60_000,
  minCandidates = 2,
  batchSize = BATCH_SIZE,
  model = MODEL,
  now = () => Date.now(),
}) {
  let coolingUntil = 0;

  return async function rerank(query, candidates) {
    const firstStage = candidates.map((c) => c.id);
    if (candidates.length < minCandidates) {
      return { order: firstStage, status: 'skipped', reason: 'too few candidates' };
    }
    if (now() < coolingUntil) {
      return { order: firstStage, status: 'skipped', reason: 'cooling down after a service error' };
    }

    const requests = buildRequests(query, candidates, { batchSize, model });
    try {
      // One failed batch fails the whole rerank: a half-judged order would mislead.
      const results = await withDeadline(Promise.all(requests.map((r) => systemOne(r))), deadlineMs);
      const scores = new Map();
      results.forEach((result, b) => {
        readScores(requests[b], result).forEach((p, i) => scores.set(candidates[b * batchSize + i].id, p));
      });
      const order = candidates
        .map((c, position) => ({ id: c.id, position, p: scores.get(c.id) }))
        .sort((a, b) => b.p - a.p || a.position - b.position) // ties keep the first-stage order
        .map((c) => c.id);
      return {
        order,
        status: 'applied',
        models: [...new Set(results.map((r) => r.model))], // what answered, as the responses report it
        scores: Object.fromEntries(scores),
        inputTokens: results.reduce((sum, r) => sum + (r.usage?.input_tokens ?? 0), 0),
      };
    } catch (error) {
      if (isServiceTrouble(error)) coolingUntil = now() + cooldownMs;
      // Report a controlled reason only: provider errors can echo the input text.
      const reason = error instanceof DeadlineExceeded ? 'deadline'
        : error instanceof InvalidAnswer ? 'incomplete answer'
        : typeof error?.status === 'number' ? `HTTP ${error.status}` : 'request failed';
      return { order: firstStage, status: 'fallback', reason };
    }
  };
}
