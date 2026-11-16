---
name: jev-curator
description: Finds and checks Jev repositories, skills, open decision models and examples, then updates the jev-skills README. Use when refreshing this collection, adding or checking an entry, finding new ecosystem projects from awesome-jev lists or GitHub, or fixing stale, deleted, archived, renamed or duplicate entries.
license: MIT
---

# Curate Jev Skills

Work in the user's jev-skills checkout. Read its README and recent changes first.
Find candidates in the README's "More collections" lists that are still updated (such as
[yibie/awesome-jev](https://github.com/yibie/awesome-jev) and
[logicrw/awesome-jev-projects](https://github.com/logicrw/awesome-jev-projects)),
[AnotiaWang/awesome-decision-models](https://github.com/AnotiaWang/awesome-decision-models) for
other decision models, new repos under `gh api orgs/typesafe-ai/repos`, and fresh GitHub
searches. To compare lists, collect the GitHub links from each list's README
(`gh api repos/OWNER/NAME/readme -H "Accept: application/vnd.github.raw"`), drop those already
in this README, and rank the rest by how many lists name them. Follow each lead to its primary
docs and actual code or SKILL.md.

## Check each candidate

- Look it up with `gh api repos/OWNER/NAME`: it exists, is not archived, and its canonical
  owner/name is the one you link, since renamed repos redirect. A listed repo that was renamed
  is a duplicate, not a new entry.
- Run the same lookup for every repo already listed: entries are deleted, made private,
  archived or moved between refreshes. Remove a 404, and replace an archived entry with the
  successor its README names, if that is worth listing.
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
Correct stale entries and duplicates, and update the README's "checked" dates.

Link benchmark repositories rather than copying their results into the README or the skills. Keep
navigation working, use the small logos in `docs/logos/` only where they help scanning, and avoid
badges and link-count targets.

Link maintained upstream skills. Bundle one only when it adds a missing capability and its
license allows reuse; preserve attribution. Keep the official TypeSafe skill upstream.
Check every link and anchor, validate changed skills and manifests, and summarize additions and
removals with reasons. Commit and push when requested.
