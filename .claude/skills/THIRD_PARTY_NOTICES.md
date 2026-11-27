# Third-party skills in this project

These skill folders were copied unmodified (a LICENSE file added where upstream keeps it only at the repo root) from their upstream repositories.
Each folder keeps its upstream license file next to its `SKILL.md`.

| Skill folder | Upstream | Path in upstream | Commit | License | Copyright |
|---|---|---|---|---|---|
| `emil-design-eng/` | https://github.com/emilkowalski/skills | `skills/emil-design-eng/` | `0f2e23b` | MIT (`emil-design-eng/LICENSE`) | © 2026 Emil Kowalski |
| `impeccable/` (v4.9.1) | https://github.com/pbakaus/impeccable | `.claude/skills/impeccable/` | `fb46cc6` | Apache-2.0 (`impeccable/LICENSE`, `impeccable/NOTICE.md`) | Paul Bakaus and contributors |
| `design-taste-frontend/` (tasteskill 2.5.1) | https://github.com/Leonxlnx/taste-skill | `skills/taste-skill/` | `f6b7657` | MIT (`design-taste-frontend/LICENSE`) | © 2026 Leonxlnx |
| `craft/`, `craft-critique/`, `craft-explore/`, `craft-setup/`, `craft-states/`, `craft-sync/`, `craft-system/`, `using-craft/` | https://github.com/diego3g/craft | `skills/<name>/` | `2b1f0ee` | MIT (`<name>/LICENSE`) | © 2026 Diego Fernandes |

Also copied from Impeccable (same commit and license), because the `impeccable` skill delegates to them:
`../agents/impeccable-asset-producer.md`, `../agents/impeccable-documenter.md`,
`../agents/impeccable-finish-reviewer.md`, `../agents/impeccable-manual-edit-applier.md`.

Impeccable's `NOTICE.md` credits ehmo's `platform-design-skills` (MIT) for
`impeccable/reference/ios.md` and `impeccable/reference/android.md`.
The photographs bundled in `design-taste-frontend/assets/photos/` carry their own
credits as documented in that skill's `references/photos.md`.

Impeccable's design hook was turned on with the user's approval through
`impeccable hooks on`, which wrote `../settings.local.json` and `../../.impeccable/config.json`.
It runs Impeccable's engine binary (engine 0.1.24, checksum-verified on first download into
`~/.impeccable/bin/`) after Edit/Write on UI files and at turn end.

Not installed on purpose:
- Every other skill in the Emil Kowalski and Taste Skill repositories.

## Matt Pocock's skills

Copied unmodified from https://github.com/mattpocock/skills at commit `5863806`,
MIT License (each folder's `LICENSE`), © 2026 Matt Pocock.

| Skill folder | Path in upstream |
|---|---|
| `chief-of-staff/` | `skills/in-progress/chief-of-staff/` |
| `retro/` | `skills/engineering/retro/` |
| `to-spec/` | `skills/engineering/to-spec/` |
| `to-tickets/` | `skills/engineering/to-tickets/` |
| `implement-spec/` | `skills/engineering/implement-spec/` |
| `tdd/` | `skills/engineering/tdd/` |
| `codebase-design/` | `skills/engineering/codebase-design/` |
| `setup-matt-pocock-skills/` | `skills/engineering/setup-matt-pocock-skills/` |
| `writing-for-agents/` | `skills/productivity/writing-for-agents/` |

`chief-of-staff` is the one asked for; it reads `retro`, `to-spec`, `to-tickets` and
`implement-spec` by relative path, and those in turn call `writing-for-agents`, `tdd`,
`codebase-design` and `setup-matt-pocock-skills`, so they come along. Upstream marks
`chief-of-staff` as in-progress.
