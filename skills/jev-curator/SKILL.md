---
name: jev-curator
description: Finds and checks Jev repositories, skills and examples, then updates the jev-skills README. Use when refreshing this collection, finding new ecosystem projects or fixing stale entries.
license: MIT
---

# Curate Jev Skills

Work in the user's jev-skills checkout. Read its README and recent changes first.
Find candidates through [yibie/awesome-jev](https://github.com/yibie/awesome-jev),
[kraayenjon/awesome-jev](https://github.com/kraayenjon/awesome-jev),
[Charlie Hills' collection](https://charliehills.substack.com/p/the-top-20-jev-skills)
and fresh GitHub searches. Follow each lead to its primary docs and actual code or SKILL.md.

## Check each candidate

- Look it up with `gh api repos/OWNER/NAME`: it exists, is not archived, and its canonical
  owner/name is the one you link, since renamed repos redirect. A listed repo that was renamed
  is a duplicate, not a new entry.
- Read its README. When the README does not mention Jev, search the code
  (`gh search code jev --repo OWNER/NAME`) before accepting a list's claim, and link the file or
  docs page that shows the integration.
- When the repo has no license, end its line with "No repository license at review."
- Prefer entries two sources point to, or that fill a gap: a new language client, a framework
  integration, a distinct use. Skip near-duplicates of listed tools and large projects whose only
  link to Jev is a provider option.

## Write the entry

One source link and one short sentence of your own under the right heading; never copy another
list's wording. Say what the project does with Jev, and mark beta, experimental or demo status.
Distinguish skills, plugins, apps and demos; describe source review separately from tests run.
Correct stale entries and duplicates, and update the "Entries checked" date.

Keep benchmark numbers in `skills/jev-builder/references/evaluations.md`, and link benchmark
repositories rather than copying their results, including this kit's own
[jev-rerank-bench](https://github.com/laguagu/jev-rerank-bench). Keep navigation working and avoid
badges and link-count targets.

Link maintained upstream skills. Bundle one only when it adds a missing capability and its
license allows reuse; preserve attribution. Keep the official TypeSafe skill upstream.
Check every link and anchor, validate changed skills and manifests, and summarize additions and
removals with reasons. Commit and push when requested.
