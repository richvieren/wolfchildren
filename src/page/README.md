# The Compass page, assembled from parts

The live page at `/readings/compass/mengto-skeuomorphic/` is a **config**, not a
template. Everything else is a part it names.

```
src/page/
  pages/<id>.mjs      one page: ordered module ids, a copy variant each, the ATF cell
  modules/<id>.mjs    one module: its markup, its own CSS, its permanent id
  copy/<id>.mjs       that module's copy, by variant (A, B, …)
  render.mjs          assembles a config into HTML
build-mengto.mjs      builds every config in pages/, and nothing else
```

## Make a new variant

1. Copy `pages/mengto-skeuomorphic.mjs` to `pages/mengto-ab-<name>.mjs`.
2. Edit **that file only**:
   - `id` and `url` become `mengto-ab-<name>` / `readings/compass/mengto-ab-<name>`.
   - Reorder, add or remove entries in `modules` to change the page's order.
   - Change a module's `copy: 'A'` to `'B'` to swap its words.
   - Change `atf.cell` to another cell in `src/lib/atf-copy.mjs` to swap the
     headline, subline, eyebrow, button label or images above the fold.
   - Add `settings: { ground: 'green' }` to a module for anything that used to
     depend on where it sat.
3. Add the page to the covered list in `tests/pixel.test.js`.
4. Build and check:

```
node build-mengto.mjs                 # every config
node build-mengto.mjs mengto-ab-demo  # one
node --test tests/*.test.js
git status --porcelain                # only the files you meant to touch
```

`mengto-ab-demo.mjs` is a worked example: it imports the live config, swaps two
modules and points the ATF at another cell.

## Grounds

Grounds alternate **by position, assigned by the renderer**, so reordering
modules re-alternates them. The ATF is light, so the first module is dark, the
next light, and so on. A photograph is **neutral**: it declares
`export const ground = 'neutral'`, takes no ground, and does not flip the
alternation.

A config may override one module:

```js
{ id: 'sample', copy: 'A', ground: 'light' }
```

If an override leaves two non-neutral modules side by side on the same ground,
the build prints a warning naming both. It does not stop the build.

Colours come from the ground's tokens and never from a literal in a module:

| token | light | dark |
|---|---|---|
| `--g-bg` | `#DFD7C3` cream | `#333D2F` shell green |
| `--g-surface` (card fill) | `#F8F5EC` | `#3A4435` |
| `--g-text` | `#495543` green | `#DFD7C3` cream |
| `--g-quiet` | `#6B4A2F` bark | `rgba(223,215,195,.62)` |
| `--g-accent` | `#AC2E20` ember | `#AC2E20` ember |
| `--g-rule` | `#CDB494` tan | `#495543` |
| `--g-shade` (shadow) | `rgba(73,85,67,.14)` | `rgba(0,0,0,.3)` |

Bark is light-only: it is 1.01:1 on the shell green. Every module must render on
both grounds, so a new rule that needs a colour reaches for a token.

## Rules

- **Ids are permanent.** A retired module keeps its file and simply stops being
  named in a config. An id is never reused and never renumbered.
- **A module knows nothing about its neighbours.** No `nth-child`, no "the
  section after the hero". Anything positional is a setting in the config.
- **Copy lives in `copy/`,** read from the one approved source
  (`src/lib/compass-copy.mjs`). Nothing is reworded on the way through, and a
  new variant is a new key, never an edit to A.
- **New CSS belongs to its module,** in that module's `css` export, scoped to
  its own class. The page skin (the colours and type of this design) still lives
  in `variants2.mjs` under the slug named by `skin`.
- **Every page carries its id** as `<meta name="wc-variant">`, `<body
  data-variant>` and a `VariantView` pixel event, so results split per variant.
