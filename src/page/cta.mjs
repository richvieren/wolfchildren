// cta.mjs — one button for the whole page. These are the ATF's desktop buy
// button declarations, read from the live page on 2026-10-08:
//   Special Elite 16px, no transform, letter-spacing .06em (0.96px),
//   fill #495543, label #DFD7C3, radius 6px, border 2px #3A4435,
//   shadow 5px 5px 0 #3A4435, height 54px.
// A module adds .wc-cta to its button and keeps only its own width.
export const css = `
.wc-cta{display:inline-block;box-sizing:border-box;text-align:center;white-space:nowrap;
  font-family:var(--b-body);font-size:16px;text-transform:none;letter-spacing:.06em;
  text-decoration:none;height:54px;line-height:50px;padding:0 26px;
  background:var(--b-green);color:var(--b-cream);
  border:2px solid var(--b-green-deep);border-radius:6px;
  box-shadow:5px 5px 0 var(--b-green-deep)}
.wc-cta:hover{filter:brightness(1.08)}
/* the only thing a context may change is the width */
.wc-cta--full{display:block;width:100%;padding:0}
`;
