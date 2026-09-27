# Screen a document against a long checklist

Read this when one document has to be checked against many conditions: a policy or compliance
checklist, intake review, due-diligence questions, or a triage form. Jev answers the conditions;
code applies the rules, and a person reviews what the rules cannot settle. A screen like this is
a first pass for a reviewer, not a finding, and in a regulated setting not advice.

## One request, many independent questions

Put the document in state once and ask every condition as its own question in the same request.
Questions over one state are judged in parallel and cannot see each other's answers, so a longer
checklist adds tokens, not round trips ([parallel questions](https://docs.typesafe.ai/cookbooks/parallel_questions),
[fan-out](https://docs.typesafe.ai/patterns/fan-out)). Splitting the checklist over several
requests sends the document again with each. Stay within the request budget: 32k tokens for the
state plus the longest question ([models](https://docs.typesafe.ai/models)); a longer document
needs its relevant sections selected first.

When a later question depends on an earlier answer, such as which duties apply once the category
is known, make it a second request. Ask the gate questions first, then only what their answers
leave open.

## Ask the same thing two ways

Where a mistake is costly, ask two questions that should agree but judge from different angles:
the subject a document is about, and the category of use it falls into. Neither sees the other,
so a disagreement is informative. Send it to review rather than resolving it in code.

## Earn every negative

A document that says little should not pass as "not applicable".

- **Ask for presence first.** Before accepting that a condition does not apply, ask whether the
  document states the relevant fact concretely, such as its purpose or who it affects. A vague
  document then lands in review instead of in a clean negative.
- **Require a receipt for a decisive answer.** Number the document's sentences in code and ask a
  Choice over those numbers plus `NONE`: which sentence establishes this answer? Copy the chosen
  sentence by index, so the quote cannot be invented. Accept a negative only when a sentence
  denies the condition; with `NONE`, record the condition as not stated.
  [Evidence](evidence.md) covers the span-selection shape.

## Use instability as a signal

Run a sample of documents more than once. Answers that change side between identical runs mark
boundary cases; route them to review and look at their wording
([self-consistency cookbook](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook)).

## Keep the rules in code

Thresholds, precedence, which answers settle which checks, and the final classification belong
in code, versioned with the questions. Quote the source text of each condition in the question
rather than paraphrasing it, and change a question only with a labelled comparison
([Questions](questions.md#revise-on-evidence)).

Typed questions can replace a generative extraction step that fills fields for the same rules:
keep the rules, swap what supplies the facts, and compare the outcomes on the same documents.
They do not replace text a person reads, such as a written finding.

## Test it

Use synthetic or public documents written to hit each boundary, including vague ones and ones
that deny a condition in their own words. Labels written by the person who wrote the questions
flatter the screen; add cases written after the questions were frozen. Report per condition how
often the screen settled it, how often it sent it to review, and how often it was wrong,
alongside the cost and time per document ([jev-evidence-eval](https://github.com/laguagu/jev-skills/tree/main/skills/jev-evidence-eval)).
