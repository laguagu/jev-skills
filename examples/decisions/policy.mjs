// Illustrative thresholds. Calibrate on your own labelled data before deployment.
const MIN_CONFIDENCE = 0.8;
const IMMEDIATE_PROBABILITY = 0.9;
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
  throw new Error('Unknown example');
}
