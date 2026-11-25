---
name: add-project
description: "Add a new property project to the homepage projects section, with photos, status, price, and English and French translations. Use when the owner wants to add or list a new project."
disable-model-invocation: true
---

# Add a project

The owner wants a new project on the homepage. They are a beginner: ask in plain words, one short list at a time, and never give terminal commands.

## Hard rule

**Never invent anything.** Name, city, status, price, currency, description, video and photos all come from the owner or from material the owner supplied. If something is missing, leave it out and say so. Do not fill gaps from the developer's website or from memory without the owner confirming.

## 1. Collect

Ask for whatever is missing:
- Project name as shown (Latin letters, wrapped in `<bdi>`) and city or area in Hebrew.
- Country. The filter buttons use `data-country` values `uae`, `georgia`, `romania`, `portugal`, `ukraine`, `usa`, `cyprus`. A new country needs a new filter button too.
- Status: occupied (`project__status--done`, "אוכלס") or under construction (`project__status--build`, "בבנייה"), or the owner's exact wording.
- Starting price and currency, if the owner wants one shown. Currencies as given: EUR, USD, AED (shown as "דירהם").
- One or two descriptive sentences, or facts to write them from.
- Photos (ideally 3 to 7) and an optional YouTube link for the project film.

## 2. Photos

- Folder: `assets/img/projects/<slug>/`, where `<slug>` is a short lowercase id (also used for `tab-<slug>` and `panel-<slug>`).
- For each photo N, make `<slug>-N-900.webp` and `<slug>-N-1600.webp` (900 and 1600 px wide, quality about 80). Keep the real `width`/`height` of the 1600 file in the `<img>` tag.
- A film poster is `<slug>-film.webp` at 1280×720.
- Write Hebrew `alt` text that describes what is actually in each photo.

## 3. Edit `index.html` (Hebrew only)

- Copy an existing panel of the same kind (for example `panel-pontus`: with price, gallery and video) and keep its exact structure and classes.
- Add the tab button in `.project__tabs` with `data-country`, `hidden` and `tabindex="-1"` unless it is the first tab of the default country. Put the tab and the panel next to the other projects of the same country.
- Update that country's count in `.project__count` and the "N פרויקטים" total in the projects heading, if the total changes.
- The button's `data-pick` is the country's Hebrew name.
- If the country is new, also update "בשבע מדינות" and the country filter.

## 4. Translate

Add a row for every new Hebrew string to the table in `tools/i18n_home.py`, with English and French that say the same thing. The rebuild hook runs `tools/build_i18n.py` after each edit and says if anything is untranslated. Don't edit `en/` or `fr/` directly: they are generated, and a hook blocks it.

## 5. Check and show

Run `node tools/site_check.mjs`, look at the new project in the phone and desktop screenshots in all three languages, and show the owner. Offer `/ship` to publish.
