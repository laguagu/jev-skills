# Write and fix the question

A typed decision succeeds or fails on wording. Jev answers the question you wrote rather than
the one you meant, so most accuracy work happens here rather than in the policy around it.
Check TypeSafe's [primitives](https://docs.typesafe.ai/primitives) and the model's
[jagged edges](https://docs.typesafe.ai/model-jaggedness) for current, version-specific detail.

## Write it

- **One property per question.** A question that weighs two things returns a worse answer and
  lower confidence than two questions combined in code.
- **Name the field being judged.** Question IDs are bookkeeping; the model never sees them.
- **State the condition exactly, including the boundary you have in mind.** Negations, scoping
  words, and implied conditions are read at face value.
- **Point the criteria the same way as the instruction.** A Noul whose yes side describes
  a no performs worse than one written in a single direction.
- **Write examples as instances**, such as a sentence a user would actually send, rather than
  as a description of that kind of input.
- **Keep policy out of the question.** Thresholds, weights, and precedence rules belong in code,
  where they can change without invalidating earlier answers.
- **Write the assumption into a speculative question.** When one question picks the branch and
  another supplies the detail that branch needs, say so: ask which target *if* the operation is
  the one named, and state that a separate question decides the operation. Left implicit, the
  second question starts deciding the branch again on its own terms.
- **Bound the answer to what you offered.** When the options are candidates you numbered this
  turn, require one of those indices; an ID the application cannot resolve is a failed decision.

Score levels need their own care. Each level is judged on its own, and the model sees neither
its number nor its neighbours, so a level defined as worse than the one before it says nothing.
Describe a situation per level, leave numerals out of the text, and give a rare extreme its own
level when code must treat it differently. For Choice, include an explicit outcome for nothing
fits whenever the listed options may not cover every input.

## Give it only what it needs

- Filter in code before sending. Unrelated detail acts as a distractor and accuracy falls as it grows.
- Convert machine encodings to words: a colour name rather than a hex value, a named bucket
  rather than a raw figure.
- Keep counting, sums, ordering, and date arithmetic in code. Ask instead for extraction, or for
  one Noul per item, and total the results yourself.
- State is data, but it is not treated as hostile. Text inside it can argue for its own answer.
  Say in the criteria what counts, and test adversarial and self-describing inputs before rollout.

## Fix it

Find the question that fails before changing anything: run labelled examples and compare each
question's answer and its probabilities against the label.

| Symptom | Likely cause | Change |
| --- | --- | --- |
| Confidently wrong | The instruction was read literally | State the exact condition; put the boundary case in the criteria |
| Low confidence on a Choice | Options overlap, or none fits | Contrast the options; add an outcome for nothing fits |
| Scores bunch in the middle | Levels describe degrees or carry numerals | Rewrite each level as a distinct situation |
| Top-of-scale cases look alike | The extreme has no level of its own | Add one |
| A Noul sits near 0.5 | The condition is vague | Define it; 0.5 means unsure, not medium — use a Score for degree |
| Accuracy drops as input grows | Distractors in state | Filter in code; send only the fields the questions use |
| Errors on counts, dates, or magnitudes | The question implies arithmetic | Move the arithmetic to code |
| Rewording trades one error for another | The question weighs several properties | Split it and combine in code |
| Every answer is right but the decision is wrong | The policy is wrong | Change thresholds or weights, not the questions |

## Revise on evidence

Change one or two questions per revision; probabilities shift in ways that are hard to predict,
so leave questions that already discriminate well alone. Judge the revision on labelled data,
because higher confidence alone does not mean a better question. Once code depends on an answer
space, keep it stable: adding or removing a level or an option changes what every earlier answer meant.

Do not carry a threshold from one primitive to another, and do not expect a question and its
negation to sum to one. Separate questions are separate judgments, not terms in an equation.
