// The ground layer: light or dark, as role tokens a module paints from. The
// renderer puts the class on each module; the class sets the tokens. Dark is
// also on :root, so a module without a class renders as the shell always did.
export const css = `/* ── Ground tokens ─────────────────────────────────────────────────────────
   A module paints itself from these and never from a literal. The renderer
   gives each module a ground class; the class sets the tokens. Dark is the
   default, on :root, so a module without a class renders as the shell always
   did. Bark lives only on light: it is 1.01:1 on the shell green. */
:root{
  --g-bg:#333D2F; --g-surface:#3A4435; --g-text:#DFD7C3;
  --g-quiet:rgba(223,215,195,.62); --g-accent:#AC2E20; --g-rule:#495543;
  --g-shade:rgba(0,0,0,.3);
}
.wc-ground-dark{
  --g-bg:#333D2F; --g-surface:#3A4435; --g-text:#DFD7C3;
  --g-quiet:rgba(223,215,195,.62); --g-accent:#AC2E20; --g-rule:#495543;
  --g-shade:rgba(0,0,0,.3);
}
.wc-ground-light{
  --g-bg:#DFD7C3; --g-surface:#F8F5EC; --g-text:#495543;
  --g-quiet:#6B4A2F; --g-accent:#AC2E20; --g-rule:#CDB494;
  --g-shade:rgba(73,85,67,.14);
}
/* every element inside a module inherits its ground's text colour, so a rule
   that sets no colour of its own cannot end up cream on cream. */
.wc-ground-light,.wc-ground-dark{color:var(--g-text)}`;
