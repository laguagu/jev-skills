// Illustrative thresholds. Calibrate on your own labelled data before deployment.
const MIN_CONFIDENCE = 0.8;
const IMMEDIATE_PROBABILITY = 0.9;
const APPROVAL_SCORE = 2; // Risk rubric level from which a human approves the action.
const SUPPORTED_PROBABILITY = 0.9; // Publish above this; the band below it is for review.
const REFUTED_PROBABILITY = 0.2;
const within = (value, max = 1) => Number.isFinite(value) && value >= 0 && value <= max;

export function decision(example, request, answers) {
  const entries = Object.entries(request.questions);
  if (!answers || Object.keys(answers).length !== entries.length) throw new Error('Missing answers');
  for (const [id, question] of entries) {
    const answer = answers[id];
    if (!answer || answer.type !== question.type) throw new Error('Invalid answer type');
    if (question.type === 'noul') {
      if (!within(answer.noul)) throw new Error('Invalid probability');
    } else {
      if (!within(answer.confidence)) throw new Error('Invalid confidence');
      if (question.type === 'choice' && !Object.hasOwn(question.criteria, answer.choice)) {
        throw new Error('Unknown choice');
      }
      if (question.type === 'score' && !within(answer.score, question.criteria.length - 1)) {
        throw new Error('Invalid score');
      }
    }
  }
  if (example === 'routing') {
    return {
      queue: answers.route.confidence < MIN_CONFIDENCE || answers.route.choice === 'unknown'
        ? 'triage' : answers.route.choice,
      immediate: answers.urgent.noul >= IMMEDIATE_PROBABILITY,
    };
  }
  if (example === 'ranking') {
    if (Object.values(answers).some(answer => answer.confidence < MIN_CONFIDENCE)) {
      return { review: true, passages: request.state.passages }; // Keep context on uncertainty.
    }
    return {
      review: false,
      passages: request.state.passages.map((passage, i) => ({ ...passage, score: answers[`p${i}`].score }))
        .sort((a, b) => b.score - a.score),
    };
  }
  if (example === 'tools') {
    return {
      proposedTool: answers.tool.confidence < MIN_CONFIDENCE || answers.tool.choice === 'none'
        ? null : answers.tool.choice,
      executed: false, // The application still needs valid arguments and authorization.
    };
  }
  if (example === 'workflow') {
    const { attempts, maxAttempts } = request.state;
    const next = answers.next.confidence < MIN_CONFIDENCE ? 'ask_user' : answers.next.choice;
    // The retry budget is counted in code; the answer cannot extend it.
    return { next: next === 'retry' && attempts >= maxAttempts ? 'ask_user' : next, attempts };
  }
  if (example === 'risk') {
    return {
      requiresApproval: answers.risk.confidence < MIN_CONFIDENCE || answers.risk.score >= APPROVAL_SCORE,
      notifyNow: answers.time_critical.noul >= IMMEDIATE_PROBABILITY,
      executed: false, // Approval and delivery stay in the application.
    };
  }
  if (example === 'verify') {
    // An unsupported draft is blocked; anything between the two bands goes to a person.
    if (answers.supported.noul <= REFUTED_PROBABILITY) return { disposition: 'block' };
    return {
      disposition: answers.supported.noul >= SUPPORTED_PROBABILITY
        && answers.in_scope.noul >= SUPPORTED_PROBABILITY ? 'publish' : 'review',
    };
  }
  throw new Error('Unknown example');
}
