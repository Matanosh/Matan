---
name: MS Group Global
description: One Israeli home for investing in property abroad, told as a single scroll from budget to key. Hebrew, right-to-left.
colors:
  night-navy: "#0a1836"
  harbor-navy: "#0c1d40"
  dusk-navy: "#15284b"
  ivory: "#fbf8f1"
  mist: "#ddd6c6"
  slate: "#9fb2db"
  champagne-gold: "#d2a249"
  pale-champagne: "#e9cb8c"
  antique-gold: "#a47b30"
  gold-hairline: "rgba(210, 162, 73, 0.26)"
  ivory-hairline: "rgba(251, 248, 241, 0.1)"
  coral-error: "#f0a29a"
typography:
  display:
    fontFamily: "Frank Ruhl Libre, David Libre, Georgia, serif"
    fontSize: "clamp(3rem, 6.4vw, 6rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Frank Ruhl Libre, David Libre, Georgia, serif"
    fontSize: "clamp(2.2rem, 4.4vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  statement:
    fontFamily: "Frank Ruhl Libre, David Libre, Georgia, serif"
    fontSize: "clamp(1.9rem, 4vw, 3.6rem)"
    fontWeight: 300
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Frank Ruhl Libre, David Libre, Georgia, serif"
    fontSize: "clamp(2rem, 3.4vw, 3.2rem)"
    fontWeight: 400
    lineHeight: 1.1
  title-small:
    fontFamily: "Frank Ruhl Libre, David Libre, Georgia, serif"
    fontSize: "clamp(1.4rem, 2vw, 1.8rem)"
    fontWeight: 400
    lineHeight: 1.2
  lead:
    fontFamily: "Heebo, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.2vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Heebo, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(17px, 1.05vw + 12px, 19px)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Heebo, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.01em"
  latin-caption:
    fontFamily: "Heebo, Segoe UI, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 400
    letterSpacing: "0.36em"
rounded:
  hairline: "2px"
  pill: "999px"
  circle: "50%"
spacing:
  gutter: "clamp(20px, 5vw, 64px)"
  wrap: "1240px"
  nav-height: "72px"
  column-gap: "6vw"
  section-y: "clamp(100px, 14vh, 160px)"
  rule-row: "26px"
components:
  button-primary:
    backgroundColor: "{colors.champagne-gold}"
    textColor: "{colors.night-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.hairline}"
    padding: "0 30px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.pale-champagne}"
    textColor: "{colors.night-navy}"
  button-small:
    backgroundColor: "{colors.champagne-gold}"
    textColor: "{colors.night-navy}"
    rounded: "{rounded.hairline}"
    padding: "0 20px"
    height: "42px"
  link-arrow:
    textColor: "{colors.pale-champagne}"
    height: "44px"
  input-field:
    backgroundColor: "rgba(251, 248, 241, 0.04)"
    textColor: "{colors.ivory}"
    rounded: "{rounded.hairline}"
    padding: "0 16px"
    height: "52px"
  input-field-focus:
    backgroundColor: "rgba(251, 248, 241, 0.07)"
    textColor: "{colors.ivory}"
  chip:
    textColor: "{colors.mist}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  chip-selected:
    backgroundColor: "rgba(210, 162, 73, 0.14)"
    textColor: "{colors.pale-champagne}"
    rounded: "{rounded.pill}"
  step-number:
    textColor: "{colors.champagne-gold}"
    rounded: "{rounded.circle}"
    size: "52px"
  country-panel:
    backgroundColor: "rgba(15, 26, 45, 0.6)"
    rounded: "{rounded.hairline}"
    padding: "clamp(28px, 3.5vw, 52px)"
  nav-solid:
    backgroundColor: "rgba(11, 18, 32, 0.82)"
    height: "{spacing.nav-height}"
---

# DESIGN.md · MS Group Global

> Craft brief: read this first. If this file and the code disagree, the code wins until the owner decides; note the conflict under Open questions. The full design system follows below the brief.

## Product
A marketing site for MS Group Global, the abroad arm of MS Group (msgp.co.il), which markets and initiates real-estate projects in Cyprus, Portugal, Romania, Georgia, Dubai and Ras Al Khaimah, Ukraine, the USA (Miami) and more. Static HTML/CSS/JS, no build step. Visitors arrive from search and from project-specific ads, mostly on phones and also on desktop. Main job: leave a consultation request. Second job: read as a serious, premium operator at first sight, and as one "home" that handles everything from budget to key. Details: `PRODUCT.md`.

## Audience and voice
Israeli private investors buying property abroad, in two equal groups: first-timers who need the process explained and want their hand held, and experienced investors looking for new markets, numbers and a professional operator. Many are older. Voice: warm and confident, "we are your home abroad", all-inclusive; never talk down to either group. Hebrew, right-to-left, is the source; English (`/en/`) and French (`/fr/`) are generated from it by `tools/build_i18n.py` and `tools/build_legal.py`. Israeli formats (phone 072-2133266).

## Mood
Words: classic luxury (executed straight, no irony), warm, confident. Never like: a listings portal of price cards; a flashy "get rich" ad with invented returns; a generic real-estate template; a bright white tech page (assumed from the owner's principles and references; the owner had no further preference).

## Brand
Design system source: `assets/css/site.css` (`:root`: 22 tokens; colours taken from msgp.co.il) and the system documented below. Logo: the MS Group logo `assets/img/msgroup-logo.png`, favicon `assets/img/favicon.png`; no separate MS Group Global logo exists yet. Colours: night navy, champagne gold, ivory (from msgp.co.il). Fonts: Frank Ruhl Libre headings, Heebo body (from msgp.co.il). Dark theme only.

## References
- Apple product pages: take the scroll-driven effects, the finish and polish, big calm type, one idea per screen; avoid too much scrolling before the contact form, the bright white product-lab look, and too little information (investors need concrete facts and steps, not only slogans).
- msgp.co.il (the parent brand): take the logo and colours, the track-record numbers (34 projects completed, 28 in marketing, 15 cities), the project showcase with renders, and the family-brand feel so trust carries over; avoid the dated template look, crowded pages, static pages with no motion, and Israel-only framing.

## Constraints
Web, phone first and desktop; breakpoints at 900px and 700px, pinned stages off under 900px wide or 560px tall. RTL mirrored throughout in Hebrew; LTR in English and French. Body text 17px minimum at 1.65 line height, generous contrast, 44px minimum targets. Dark theme only. Authored line-drawn SVG icons and arrows, no glyphs. Scroll-led, once-only motion on two easings; every piece of content is present with reduced motion. Never invent projects, prices, returns, counts or testimonials: missing facts are visible slots.

## Decisions log
- 2026-11-14 — Palette, fonts and logo taken from msgp.co.il — the owner asked that the parent brand be used.
- 2026-11-14 — English and French versions generated from the Hebrew page — one source of truth for copy; run both build tools after any Hebrew change.
- 2026-11-14 — Classic luxury real estate, executed straight, chosen over a dealt direction — the owner's standing preference.
- 2026-11-21 — Craft brief added on top of the existing design system, which stays the source of truth for tokens and components — `craft-setup`; references and their take/avoid confirmed by the owner.
- 2026-11-21 — Brief approved by the owner. Foundations are the existing tokens in `assets/css/site.css`; no design tool is used, so craft builds in HTML from them and nothing is imported — the system already lives in the code.
- 2026-11-21 — First project landing page, `projects/azure.html` (he/en/fr), for project ads — a visitor from an ad must be able to trust the project and leave a request without the home page. Built only from existing pieces: project panel and gallery, project film, ruled facts list, the home page's "One home" section, the contact section and form. No new components or tokens.
- 2026-11-21 — Missing project facts (unit types and sizes, handover, payment plan, developer profile) are visible "to be added" slots — nothing invented.
- 2026-11-21 — The starting price carries "price correct as of 14.11.2026" (the date the owner supplied it) — prices change after ads go live. The budget question stays on the project form (owner's choice).
- 2026-11-21 — The project form pre-selects the UAE and sends the project name (a "Project" row and the email subject) — the office knows which ad the lead came from.
- 2026-11-21 — English and French project pages are generated by `tools/build_projects.py`, reusing the home page's translation table for shared parts — the three languages can't drift apart.
- 2026-11-21 — Project presentation app, one per project (`present/<project>/`, first: `present/azure/`, he/en/fr), modelled on and improving the Gindi Space 360 presenter: nine full-height screens (welcome, surroundings, project, highlights, unit types, payment plan, film, who's with you, next step) for both a presenter (keys, remote, full screen) and a client alone on a phone. No 3D: renders, film, globe and facts only. Components approved on `design/boards/present-components.html`.
- 2026-11-21 — Screens never vanish when their data is missing: they show the shared "coming soon" state, whose link sends the request (e.g. "payment plan") with the lead — an unanswered question becomes a lead.
- 2026-11-21 — The app changes screens only on keys, arrows and the menu, never by hijacking scroll — clients scroll freely, presenters step precisely.
- 2026-11-21 — New token `--glass` / `--glass-edge`: the header's existing glass value given a role name; the phone bar uses it.

## Open questions
- What the site must never look like: the list under Mood is assumed; confirm or change it.
- Does MS Group Global get its own logo, or keep the MS Group logo?
- Does MS Group Global use MS Group's phone, email and Bene Brak address? A WhatsApp number?
- Where should the consultation form send? (It currently opens a prepared email to the office.)
- Renders and facts for the projects that have none on disk yet.
- Conflict in the text below: the brand caveat at the top of the design system and the last Don't still say msgp.co.il has not been seen and the logo is a stand-in, but `PRODUCT.md` and `site.css` show the parent palette, fonts and logo applied on 2026-11-14. The code wins; update that text when the owner confirms.

# Design System: MS Group Global

<!-- Brand caveat: the parent brand msgp.co.il has not been seen and the real logo has not been received. When they are supplied, the logo and its colours override this palette. The "MS" box wordmark in the build is a stand-in, not a system element. -->

## Overview

**Creative North Star: "The Night Crossing"**

Classic luxury real estate, executed straight: a deep night-navy ground, champagne-gold line work, ivory type. The page is one continuous crossing from Tel Aviv to a key in the investor's hand, and every surface behaves like a chart drawn in gold ink on a dark sea. Gold is drawn, never poured: it arrives as hairlines, strokes, outlines and single emphasised words, and only the primary button is a solid gold field.

Density is low and the pace is slow. Sections are separated by tall vertical rhythm and hairline rules, not by boxes. The Hebrew serif carries every headline at large scale and light weight; the Hebrew sans carries reading and action. Motion is scroll-led and deliberate in the manner of Apple product pages: the hero enters once, a statement lights word by word, the journey is pinned and scrubbed until the key lights, the destinations travel sideways under a pinned frame, and line drawings ink themselves once. Nothing is hidden from a visitor who reduces motion.

The layout is mirrored for right-to-left reading throughout: text holds the right (start) side, visuals sit opposite on the left, arrows point left to mean "forward", progress fills from the right.

**Key Characteristics:**
- Night-navy ground in three close tones; no light sections.
- Gold as line, not fill: hairlines, SVG strokes, outlines, one gold phrase per headline.
- Frank Ruhl Libre display at light weight over Heebo body, both Hebrew-native.
- Hairline-ruled lists instead of cards; one framed panel type only (the country panel and the form).
- Near-square corners (2px) everywhere except chips (pill) and step numbers (circle).
- Scroll-driven, once-only motion on two custom easings; full content under reduced motion.
- Visible slots for every fact not yet supplied; nothing invented.

## Colors

A three-step night-navy ground, an ivory-to-slate ink ladder, and a three-step champagne-gold accent used as line and emphasis.

### Primary
- **Champagne Gold** (`--gold`): the one accent. Primary button fill, SVG line drawings (journey path, skylines, check marks), the hero globe's rim and arcs, step-number outlines, the brand mark outline, the selected-chip border, text caret, selection background, the gold word in a headline.
- **Pale Champagne** (`--gold-2`): the lit state of gold. Button hover, link text, active nav link, pillar titles, the lit key at the end of the journey, focus rings, form status text.
- **Antique Gold** (`--gold-deep`): the quiet gold. Scrollbar thumb, the dotted underline of a slot.

### Neutral
- **Night Navy** (`--bg`): the page ground, button text on gold, the browser theme colour.
- **Harbor Navy** (`--bg-2`): alternate section ground (due-diligence list, journey) and the fill of unlit journey nodes.
- **Dusk Navy** (`--bg-3`): the far end of the contact section's vertical gradient only.
- **Ivory** (`--ink`): headlines and primary text; Tel Aviv's marker on the globe.
- **Mist** (`--ink-2`): body copy, leads, nav links at rest, field labels, unselected chips.
- **Slate** (`--ink-3`): metadata and fine print: fact labels, footer, contact-row labels, slot text.
- **Gold Hairline** (`--line`): structural rules where the line is meant to be seen: due-diligence and pillar rules, the form frame, step rails, unlit nodes and key.
- **Ivory Hairline** (`--line-soft`): the quietest rule: section borders, fact rows, contact rows, field borders at rest, country panel border, the unlit journey track.
- **Coral Error** (`--error`): invalid field border and error message only.

### Named Rules
**The Gold Is Drawn Rule.** Gold appears as stroke, outline, hairline or a single emphasised phrase. The only solid gold surfaces are the primary button and the skip link. No gold section backgrounds, no gold cards, no gold gradients as fills (the faint gold radial behind the hero and the 7% gold tint at the top of a country panel are the ceiling).

**The One Gold Phrase Rule.** A headline carries at most one gold span, and it is the payoff ("בחו״ל", "ההזדמנות נמצאת מעבר לים", "הכל כולל הכל"). In display type the gold span is bolder than its line (700 against 300).

**The Night Only Rule.** Every section sits on one of the three navies. Depth between sections is made by switching navy tone or by a gradient from one navy to another, never by a light band.

## Typography

**Display Font:** Frank Ruhl Libre (with David Libre, Georgia, serif)
**Body Font:** Heebo (with Segoe UI, system-ui, sans-serif)

**Character:** A Hebrew book serif set large and light carries the voice of a long-established house; a clear humanist Hebrew sans carries reading and every action. Both load from Google Fonts in weights 300 to 700.

### Hierarchy
- **Display** (300, clamp(3rem, 6.4vw, 6rem), 1.02, -0.02em): the hero headline only, one phrase per line, the gold line at 700.
- **Headline** (400, clamp(2.2rem, 4.4vw, 4rem), 1.08, -0.01em): every section heading. A closing headline may scale up to clamp(2.6rem, 6vw, 5.6rem) at 1.05.
- **Statement** (300, clamp(1.9rem, 4vw, 3.6rem), 1.3): the scroll-lit manifesto paragraph, max 24ch.
- **Country name** (400, clamp(2.8rem, 5.2vw, 5rem), 1): the name on a destination panel.
- **Title** (400, clamp(2rem, 3.4vw, 3.2rem), 1.1): the active journey step.
- **Title, small** (400, clamp(1.4rem, 2vw, 1.8rem) to clamp(1.5rem, 2.2vw, 2rem)): ruled-list headings (due diligence, pillars). Pillar titles are Pale Champagne.
- **Lead** (Heebo 400, clamp(1.05rem, 1.2vw, 1.25rem), Mist): the hero support line, max 34ch. Section intros use 1.12rem, max 36 to 46ch.
- **Body** (Heebo 400, clamp(17px, 1.05vw + 12px, 19px), 1.65): all reading text. Measure 32 to 46ch; nothing runs wider.
- **Label** (Heebo 700, 1rem, 0.01em): buttons. Links use 600. Nav links 400 at 0.98rem.
- **Latin caption** (Heebo 400, 0.82rem, 0.36em tracking, Champagne Gold, LTR): the Latin transliteration set beneath a country name. It follows the name; it never precedes a heading.
- **Fine print** (Heebo, 0.9 to 0.95rem, Slate): footer, parent-company line, fact labels.

Headlines use `text-wrap: balance`; paragraphs use `text-wrap: pretty`. Numerals in step markers use lining figures.

### Named Rules
**The Light Serif Rule.** Display and statement serif type is set at 300; headlines at 400. Weight is reserved for the single gold phrase. Never set a serif headline in 600 or above.

**The Large Body Rule.** Body text never drops below 17px and keeps 1.65 line height. The audience includes older investors reading Hebrew on phones.

## Layout

A centred wrap of min(1240px, 100% minus two gutters), with a fluid gutter of clamp(20px, 5vw, 64px). Desktop compositions are two columns at roughly 1.1fr / 1fr with a 6vw gap, headline on the start (right) side and supporting copy or a visual opposite, aligned to a shared baseline (`align-items: end`) rather than tops. The hero is a full-viewport (100svh) split: copy right, globe left.

Vertical rhythm is generous and viewport-relative: sections pad clamp(100px, 14vh, 160px) to clamp(110px, 16vh, 180px) top and bottom; the manifesto takes clamp(120px, 24vh, 240px). Ruled lists sit clamp(56px, 8vh, 96px) below their heading. The fixed navigation is 72px and every anchored scroll lands below it.

Two sections are tall scroll stages on desktop: the journey (520vh) and the destinations (560vh), each holding a 100svh sticky frame.

**Breakpoints:** 900px collapses every two-column grid to one, hides the inline nav for a full-screen menu, stacks the hero (globe above copy, buttons full width). The pinned stages switch off at max-width 900px **or** max-height 560px, so short landscape screens get the static version. 700px collapses the pillars to one column.

## Elevation & Depth

Flat. Depth comes from navy tonal steps, soft radial glows and translucency, not shadows. There are no card shadows anywhere.

### Shadow Vocabulary
- **Key glow** (`filter: drop-shadow(0 6px 18px rgba(210, 162, 73, 0.45))`): only on the lit key at the end of the journey. It is the single reward glow in the system.
- **Nav glass** (`background: rgba(11, 18, 32, 0.82); backdrop-filter: saturate(140%) blur(14px)`): the navigation once the page has scrolled past 24px, with an Ivory Hairline bottom border. Transparent at the top.
- **Hero atmosphere**: two radial gradients behind the hero (a 10% gold glow on the copy side, a 35% blue-navy wash from the top) over Night Navy.

### Named Rules
**The Flat Night Rule.** Surfaces are flat. A glow is earned by arrival (the key), never applied to a resting element.

## Shapes

Near-square: the system radius is a 2px hairline corner on buttons, fields, the country panel and focus rings. Two exceptions carry meaning: chips are full pills (choices you can toggle), step numbers and journey nodes are circles (stations on a route). The scroll cue is the one other rounded form (14px).

The defining shape language is the **hairline**. Lists are a stack of rows split by 1px rules (`border-top` on each row, a closing `border-bottom` on the list), never a stack of boxes. Two hairline weights exist: Gold Hairline where the rule is structural and meant to be read, Ivory Hairline where it only separates.

Line drawings (SVG) use round caps and joins, 1.6 to 2.5px strokes, no fills, normalised with `pathLength="1"` so they can be inked by `stroke-dashoffset`.

## Components

### Buttons
Solid, quiet and decisive: the only solid gold on the page.
- **Shape:** near-square (2px), min-height 52px, padding 0 30px, Heebo 700 at 1rem.
- **Primary:** Champagne Gold fill, Night Navy text.
- **Hover (fine pointers only):** fill lifts to Pale Champagne and a soft white sheen (a 100deg linear gradient at 45% white) sweeps across once over 900ms on the ease-out curve.
- **Active:** scale(0.97) over 160ms.
- **Focus:** the global ring, 2px Pale Champagne, 4px offset.
- **Small:** 42px high, 0 20px, 0.92rem; used in the navigation.
- **Wide:** full width; the form submit and full-width hero buttons under 900px.

### Links with the arrow
The secondary action next to a button and the call to action on each country panel.
- **Style:** Pale Champagne, Heebo 600, min-height 44px, no underline at rest.
- **Arrow:** an authored inline SVG, not a glyph: a 16 by 12 viewBox, path `M15 6H1.5M6.5 1 1.5 6l5 5`, no fill, stroke currentColor at 1.6, round caps and joins. It points left, which is forward in RTL.
- **Hover (fine pointers only):** a 1px currentColor underline grows from the right edge to full width over 300ms; the arrow nudges 4px forward (left) over 200ms.
- **In-body links** (parent company, footer): plain underline with 4px offset, underline in Gold Hairline.

### Chips
- **Style:** pill, min-height 44px, padding 0 18px, Ivory Hairline border, Mist text, transparent fill. A visually hidden checkbox covers the whole chip.
- **Selected:** Champagne Gold border, gold fill at 14%, Pale Champagne text.
- **Active:** scale(0.97). **Focus:** 2px Pale Champagne ring at 3px offset on the visible pill.
- Country links on the destination panels pre-select their chip in the form.

### Inputs / Fields
- **Style:** 52px high, 0 16px padding, ivory fill at 4%, Ivory Hairline border, 2px corners, Ivory text, gold caret. Labels sit above in Mist at 0.95rem with an 8px gap.
- **Select:** native appearance removed; an authored gold chevron (12 by 8, stroke 1.5) sits on the left (end) side.
- **Hover:** border to Gold Hairline. **Focus:** no outline; border to Champagne Gold, fill to 7%.
- **Error:** border to Coral Error, message below in Coral Error at 0.92rem, linked by `aria-describedby`, first invalid field focused.
- **Phone field:** typed LTR, aligned right.
- **The form frame:** Gold Hairline border, Night Navy at 55%, padding clamp(24px, 3vw, 44px), 22px between fields. The status line is Pale Champagne and is empty (hidden) until something is said. The form never claims to have sent when no endpoint is set.

### Navigation
- **Style:** fixed, 72px, transparent over the hero; becomes Nav glass after 24px of scroll. Brand on the start side, links in Mist at 0.98rem with 32px gaps, small primary button at the end.
- **Active:** the link for the section in view takes Pale Champagne and `aria-current`. Hover takes the same colour over 200ms.
- **Mobile (under 900px):** a 48px square toggle with a Gold Hairline border; three 1.5px Ivory bars that cross into an X. The menu is a full-screen Night Navy sheet of serif links at 2rem, each over an Ivory Hairline, with a primary button below. Escape closes it and returns focus.

### Ruled List
The system's replacement for cards (due diligence, pillars, facts, contact rows).
- Rows split by hairlines with 26 to 36px vertical padding. A row may hold a 32px line-drawn icon, a serif title and a Mist description in two inner columns (0.9fr / 1.1fr) that stack under 900px.
- Facts and contact rows are a label (Slate) and a value (Ivory 600, or a slot) pushed to opposite ends.

### Country Panel
The one framed container.
- Flex basis min(68vw, 880px) on desktop, 84vw on touch; min-height min(56svh, 520px).
- Ivory Hairline border, 2px corners, a 160deg gradient from 7% gold to Harbor Navy at 60%, padding clamp(28px, 3.5vw, 52px).
- Two columns (1.2fr / 1fr): a line-drawn skyline on one side; name, Latin caption, a ruled fact list and an arrow link on the other. One column on touch.
- Skylines are four gold SVG paths at 1.6px; each country has its own drawing. Photos, when supplied, take the full panel width at 16:7 above the name.

### Step Number
A 52px circle with a 1px Champagne Gold border and a serif numeral in gold at 1.3rem (44px and 1.1rem on touch). Marks each journey stage.

### Hero Globe (signature)
A canvas globe on the visual side of the hero, at most 680px square (88vw / 440px on touch), feathered by a radial mask (opaque to 86%).
- 1,700 points on a Fibonacci sphere, drawn as gold dots whose opacity and size grow toward the viewer; a gold rim stroke at 55%; a navy radial glow behind; a dark linear shade across the lower left limb.
- Real coordinates: Tel Aviv as home (ivory marker), Cyprus, Portugal, Romania, Georgia and Dubai (champagne markers), each with a Hebrew label in Heebo 600 at 13px and a slow pulsing ring.
- Great-circle arcs lift off the surface and draw from Tel Aviv to each destination, staggered 380ms, each drawn over 1.5s within a 7s cycle, with a bright leading point.
- The globe sways slowly (4 degrees over a 9s sine) so every destination stays on the visible side, and tilts a few degrees toward a mouse pointer with eased follow. It renders at up to 2x device pixels, pauses when off screen or when the tab is hidden.
- Under reduced motion it draws one still frame with every arc complete and no pulse.

### Journey (signature)
Six stages from budget to key on a pinned stage.
- **Desktop:** a 520vh section holds a sticky 100svh frame. One side is an SVG route: an Ivory Hairline track, a 2.5px gold path drawn by scroll (`stroke-dashoffset` from a `--p` variable), five circular nodes that fill gold as the path passes them, and a line-drawn key at the end. The path reaches the key at 75% of the scroll; the remaining scroll holds the arrival. The other side shows one step at a time: the active step is sharp; others wait blurred (6px), lowered 16px and transparent, crossing over 500ms. On the last step the key lights to Pale Champagne, gains the Key glow, and a ring pulses outward once (scale 1 to 3.2, 1400ms).
- **Touch and short screens:** the stage unpins into a vertical list on a Gold Hairline rail with 11px gold dots, every step visible, and the key below the last step, lighting once when 90% of it is on screen.

### Destinations Gallery (signature)
- **Desktop:** a 560vh section holds a sticky frame; vertical scroll translates the track of country panels sideways, with a 1px progress rule under it filling in gold from the right.
- **Touch and short screens:** a native horizontal swipe carousel with mandatory centre snap, hidden scrollbar, 14px gaps; copy switches from "scroll" to "swipe" wording.

### Slots
Every fact not yet supplied is a visible slot, not an invention.
- **Text slot:** Slate text with a dotted Antique Gold underline at 5px offset, phrased as "to be added" in Hebrew. The element carries `data-slot="<name>"` (for example `units`, `contacts`) and an HTML comment naming what replaces it.
- **Photo slot:** an empty `<figure class="country__photo" data-slot="photo-<country>" hidden>` in each country panel. Filling it means adding an `<img>` and removing `hidden`; the figure then spans the panel at 16:7.
- **Logo slot:** the nav and footer wordmark is a stand-in, marked by comment, awaiting the real logo.

### Motion Grammar
The system-wide motion rules every component above draws on.

Two easings carry everything: **ease-out** `cubic-bezier(0.23, 1, 0.32, 1)` for arrivals, presses and reveals, and **ease-in-out** `cubic-bezier(0.77, 0, 0.175, 1)` for line drawings and the scroll cue. Colour changes use plain `ease` at 200 to 400ms.

- **Hero entrance (once, on load):** after fonts are ready (or 1.2s at most), the headline's lines rise from behind a clip over 1100ms, staggered 0 / 90 / 170ms; lead, actions and parent line fade up 18px over 900ms, staggered from 280ms in 110ms steps. This is the only load-time entrance on the page; no other section fades in on scroll.
- **Scroll-lit statement:** the manifesto is split into words at 18% ivory; as it crosses the viewport, words light to Ivory in reading order over 400ms each, with the key words lighting to Champagne Gold.
- **Pinned journey and pinned gallery:** scrubbed directly by scroll position through one requestAnimationFrame-throttled handler; see Components.
- **Once-only line drawings:** country skylines ink over 1800ms (ease-in-out, paths staggered 200ms) when 35% of a panel is visible; due-diligence check marks ink over 700ms (ease-out) staggered 120ms per row; the touch end-key lights once. Each observer disconnects after firing. Content is never hidden behind these; only the drawings wait.
- **Micro-interactions:** press scale 0.97 at 160ms; link underline 300ms; arrow nudge 200ms; button sheen 900ms; nav glass 300ms.
- **Reduced motion:** smooth scrolling off; every keyframe animation reduced to an instant single run; the statement shows fully lit; skylines and checks show fully drawn; the globe holds one complete still frame; journey steps cross-fade over 200ms with no blur or travel. Scroll-linked position (the journey path, the gallery track) still follows the user's own scrolling.

### Presentation app (`assets/css/present.css`)
Approved 2026-11-21 with full states matrices on `design/boards/present-components.html`. Used by `present/<project>/` only.
- **App navigation:** a 268px rail on the start side (desktop) listing every screen with its number; the current one carries a 2px drawn gold mark and Pale Champagne text (no weight change), a "Soon" tag marks screens without data, and a gold progress rule fills from the start side. Under 900px it becomes a glass bottom bar (back · current screen · next; ends disabled) whose middle button opens a full-screen section sheet (Esc closes and returns focus).
- **Section frame (`.pslide`):** one idea per screen, at least the window's height, opened by a circled step number and a headline; navies alternate; longer content keeps scrolling. Variants: text, split (text and image), full media.
- **Unit-type card (`.unit`):** floor plan (monogram slot when missing), name, ruled facts, one arrow link; hover darkens only the border; sold-out swaps the link for a grey tag.
- **Coming soon (`.soon`):** line-drawn gold hourglass, one sentence on what is missing, the known facts if any, and an arrow link that requests the details.

## Do's and Don'ts

### Do:
- **Do** keep every section on Night Navy, Harbor Navy or Dusk Navy, with Ivory for headlines and Mist for reading text.
- **Do** draw gold: hairlines, 1.6 to 2.5px SVG strokes with round caps, outlines, and at most one gold phrase per headline.
- **Do** separate content with hairline rules (Gold Hairline structural, Ivory Hairline quiet) instead of cards.
- **Do** set serif headlines light (300 display, 400 headline) and let the gold phrase carry the weight.
- **Do** mirror for RTL: text at the start (right), visuals opposite, arrows pointing left for forward, progress filling from the right.
- **Do** use the authored SVG arrow and SVG chevron; never a text glyph.
- **Do** use the two custom easings and once-only reveals for drawings; keep hover effects behind `(hover: hover) and (pointer: fine)`.
- **Do** mark every missing fact as a slot (`data-slot`, dotted underline, comment) and keep the form honest about whether it sends.
- **Do** keep all content readable and present with reduced motion: no element may depend on an animation to become visible.

### Don't:
- **Don't** introduce light or white sections, or gold-filled panels; the primary button is the only solid gold.
- **Don't** add drop shadows to cards, buttons or panels; the key glow is the only glow.
- **Don't** nest framed panels; the country panel and the form are the only framed containers.
- **Don't** round corners beyond 2px except chips (pill) and stations (circle).
- **Don't** fade sections in on scroll; the hero entrance is the only load entrance and drawings are the only scroll reveals.
- **Don't** set body text below 17px or wider than about 46ch.
- **Don't** put a small label or eyebrow above a heading; the Latin caption belongs only beneath a country name.
- **Don't** invent project names, prices, returns, counts or testimonials to fill a slot.
- **Don't** treat the "MS" box wordmark or this palette as final brand: the real logo and msgp.co.il colours override them when supplied.
