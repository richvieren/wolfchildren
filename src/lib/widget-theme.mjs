// widget-theme.mjs — the palette tokens, the two card tones and the corner
// radius, in one place.
//
// This sits in its own module because widget-all.mjs imports the forms and the
// forms need the tokens, which is a cycle if the tokens live in widget-all.
// 2026-10-01.

// The palette as tokens, plus two card tones. Richard has asked more than once
// for colour variation: white grounds on some widgets, a dark green on others.
// Redefining the tokens on a wrapper repaints everything inside it, the drawings
// included, because the widgets draw with these same tokens rather than literals.
export const TOKENS = `:root{--cream:#DFD7C3;--green:#495543;--tan:#CDB494;--orange:#C0623A;
  --tan-soft:rgba(205,180,148,.45);--series3:#A9A07E;--on-accent:#F3EEE2;--orange-soft:rgba(192,98,58,.26)}
.tone-white{--cream:#F7F3E9;--tan:#D6C7A8}
.tone-green{--cream:#3A4435;--green:#EDE5D2;--tan:rgba(237,229,210,.34);--tan-soft:rgba(237,229,210,.16);
  --orange:#E09A6F;--orange-soft:rgba(224,154,111,.24);--series3:#9AA68E}
.tone-white>.card,.tone-green>.card,.card.tone-white,.card.tone-green{
  background:var(--cream);border-color:var(--tan);color:var(--green)}
`;

// Rounded corners on every widget, not just the ones I happened to draw.
export const ROUND = `.wc-live .card,.wc-live .stellium,.wc-live .photo,.wc-live .badge{border-radius:14px}
.wc-live .big3{border-radius:12px}
.wc-live .spec-track,.wc-live .bar-track{border-radius:999px}
`;

// Which widget gets which ground. Picked to break the run of cream rather than
// to mean anything; move any of them.
export const TONES = {
  N01: 'tone-green', N04: 'tone-white', N06: 'tone-white', N08: 'tone-green',
  N10: 'tone-white', E10: 'tone-white', E13: 'tone-white', E14: 'tone-green',
};

