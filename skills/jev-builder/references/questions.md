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
- **Name the narrowest fact that decides it.** Rebuilding paragraphs from flattened text, "are
  these lines the same paragraph?" merged unbulleted lists, because list items share a topic;
  "does this line pick up mid-sentence?" did not: 17 blocks against 12 in the
  [structure recovery cookbook](https://docs.typesafe.ai/cookbooks/autoformat).
- **Ask about the idea, not the field.** A question named after its parameter, such as "Which
  resolution?", gives the input nothing to match against
  ([function calling](https://docs.typesafe.ai/cookbooks/function_calling)).
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
- **Define every Choice option, not just name it.** A bare label leaves close neighbours such as
  `order_physical_card` and `get_physical_card` to guesswork. On a 77-intent banking set, one
  sentence per option that separated it from its nearest neighbour cut errors by about 40%.
- **Name options so the name alone is right.** The decision can follow an option's name over the
  definition bound to it: swapping which name labelled which rubric moved AUC from 0.81 to 0.58
  in one [study](evaluations.md#wording-and-context). A name that contradicts its definition wins.

Score levels need their own care. Each level is judged on its own, and the model sees neither
its number nor its neighbours, so a level defined as worse than the one before it says nothing.
Describe a situation per level, leave numerals out of the text, and give a rare extreme its own
level when code must treat it differently. For Choice, include an explicit outcome for nothing
fits whenever the listed options may not cover every input.

## Give it only what it needs

- Filter in code before sending. Unrelated detail acts as a distractor and accuracy falls as it grows.
  Merge repeated inputs so each distinct one is asked once, and strip identifiers the judgment
  does not use, such as account, card and reference numbers. Both cut calls and distractors.
  For batched candidates, name the exact candidate each question judges and measure whether
  sharing state changes accuracy.
- Convert machine encodings to words: a colour name rather than a hex value, a named bucket
  rather than a raw figure.
- Keep counting, sums, ordering, and date arithmetic in code. Ask instead for extraction, or for
  one Noul per item, and total the results yourself.
- State is data, but it is not treated as hostile. Text inside it can argue for its own answer.
  Say in the criteria what counts, and test adversarial and self-describing inputs before rollout.

## Accepting a citation

For a binary support check, make the yes criteria explicit. This example asks whether every
part of the claim is established by the passage:

```json
{
  "type": "noul",
  "instructions": "An assistant wrote the claim and cited the passage as its source. Both are in Finnish. Does the passage fully support the claim?",
  "criteria": {
    "true": "Everything the claim asserts is stated in the passage or follows directly from it, including every number, time limit, actor, condition and scope, and whether something is required, allowed or possible.",
    "false": "At least one part of the claim is not established by the passage: it adds a detail the passage does not give, drops a condition or limitation the passage attaches, widens the scope, changes what is required or allowed, or states something the passage contradicts or never mentions."
  }
}
```

The state holds `claim` and `passage`. Use a three-way Choice when code must distinguish
contradiction from silence; the [official citation cookbook](https://docs.typesafe.ai/cookbooks/citation_check)
shows that shape. Test dropped conditions, valid inferences and changes from *may* to *must*
separately. An extra check can catch more errors while rejecting valid claims; evaluate the
combined policy and consider sending flagged cases for [review](patterns.md#verify-then-escalate).
This wording was measured on Finnish claims: [Evaluations](evaluations.md#citation-check).

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

Measure on your own language. The docs name English as Jev's primary training language and
where its accuracy is currently best ([models](https://docs.typesafe.ai/models#language-support)).

Pin the versioned model ID while revising, such as `jev-1.13.0`, and log the `model` each response
reports. The `jev-latest` alias moves when a release ships, and the display name is not an ID:
`jev-1.13` is rejected with HTTP 400.

Do not carry a threshold from one primitive to another, and do not expect a question and its
negation to sum to one. Separate questions are separate judgments, not terms in an equation.
