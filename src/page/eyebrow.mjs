// eyebrow.mjs — the highlighter every eyebrow wears in place of its short rule.
// 2026-10-09, Richard: a band of #E0A030 at 45% behind the text, over the
// lower 60% of its height, a few px past the text each side, slightly rounded
// and tilted a degree so it reads as a pen stroke. The text is the darkest
// green on every ground, for contrast on the yellow.
export const css = `
.wc-hl{position:relative;display:inline-block;z-index:0;color:#2F382B}
.wc-hl::before{content:"";position:absolute;left:-6px;right:-6px;top:40%;bottom:0;z-index:-1;
  background:rgba(224,160,48,.45);border-radius:3px;transform:rotate(-1deg)}
`;
