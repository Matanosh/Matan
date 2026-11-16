# Site conventions

As of Matanosh/Matan@3fb2178 (2026-11-16):
- Hebrew index.html is the source; tools/build_i18n.py builds en/ and fr/ from the table in tools/i18n_home.py and fails on any missing string. tools/build_legal.py does the legal pages.
- Prices use a `.project__price` line under the status; currencies as given by the owner (EUR, USD, AED shown as "דירהם").
- After each change: axe check, Playwright pass at phone and desktop sizes in all three languages, commit, push, trigger the Render deploy, republish the Claude artifact copy.
- 2026-11-15: Lesson: test the phone menu after scrolling, not only at the top (bug fixed in commit 55ec011).

Related: [hosting-and-domain](hosting-and-domain.md).
