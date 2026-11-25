---
name: ship
description: "Publish website changes: rebuild translations, run the browser and accessibility check in he/en/fr at phone and desktop sizes, check facts, commit, push, deploy on Render. Use when the owner says ship, publish, or put it live."
disable-model-invocation: true
---

# Ship

The owner has asked to publish the current changes. They are a beginner and never want terminal commands: do every step yourself and report in plain words. Stop at the first failing step, fix it if the fix is clear, otherwise explain what is wrong and ask.

## Steps

1. **Rebuild translations.** Run `python3 tools/build_i18n.py` and then `python3 tools/build_legal.py` from the project root. If either fails, a Hebrew string no longer matches its row in `tools/i18n_home.py` or `tools/build_legal.py`: update the row with matching English and French text and run both again.

2. **Make sure axe-core is available** for the accessibility check. If `.cache/node/node_modules/axe-core` is missing, install it with `npm install --no-save --no-audit --no-fund --prefix .cache/node axe-core`. The `.cache/` folder is ignored by git.

3. **Browser check.** Run `node tools/site_check.mjs`. It covers 4 pages × 3 languages × phone and desktop: JavaScript errors, missing files, sideways scroll, the phone menu after scrolling, and serious or critical axe issues. Every combination must pass. Look at a few screenshots in `.cache/site-check/` for the parts that changed, in all three languages.

4. **Facts check.** If the change touches projects, prices, returns, statuses, testimonials, team or company claims, dispatch the `facts-checker` agent with the diff (`git diff` against the last pushed commit). Resolve every item it flags with the owner before going on. Never invent a fact to fill a gap.

5. **Wiki.** If something was learned that a future session needs (a new convention, a lesson, an owner preference), add a dated line to the matching page under `docs/wiki/`.

6. **Commit** with a short plain-language message describing what changed for visitors.

7. **Push** to the branch this session was told to use. The live site deploys from the branch named in `render.yaml` (`branch:`). If that is a different branch, tell the owner the change is saved but not live yet, and ask before putting it on the live branch.

8. **Deploy.** Auto-deploy on Render is unreliable (see `docs/wiki/hosting-and-domain.md`), so once the live branch has the change, trigger a deploy of the `ms-group-global` service with the Render tools and wait until it reports live.

9. **Report** in two or three plain sentences: what changed, that the checks passed, and whether it is live.
