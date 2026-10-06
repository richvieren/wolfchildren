// The plain skin, built to prove the swap: flat cards, thin rules, no shadows,
// small radii, the same brand. It sets the same token names as mengto and adds
// no rules of its own, so the structure is identical and only the look moves.
import { css, atfCss } from './mengto.mjs';

export const id = 'plain';

export const tokens = `
  --s-radius-card:4px; --s-radius-card-lg:4px; --s-radius-btn:4px;
  --s-radius-btn-sm:4px; --s-radius-btn-hard:4px; --s-radius-chip:4px;
  --s-radius-panel:4px; --s-radius-pill:4px; --s-radius-shell:0px;
  --s-border:1px solid var(--g-rule);
  --s-frame-border:1px solid var(--g-rule);
  --s-hard-border:1px solid var(--g-rule);
  --s-btn-border:1px solid var(--b-cta);
  --s-btn-fill:var(--b-cta);
  --s-chip-fill:var(--b-cta);
  --s-shadow-card:none; --s-shadow-btn:none; --s-shadow-hard:none;
  --s-shadow-drop:none; --s-shadow-shell:none; --s-shadow-shell-top:none;
  --s-shadow-band:none; --s-shadow-chip:none; --s-shadow-chip-flat:none;
  --s-paper:var(--b-cream); --s-field-bg:var(--b-cream); --s-star:var(--b-bark);
  --s-space-section:72px; --s-space-section-wide:96px; --s-pad-card:20px;
  --s-type-display:clamp(32px,3vw,44px); --s-type-display-lh:.98; --s-type-display-ls:-.02em;
  --s-type-body:15px; --s-type-body-lh:1.5; --s-type-body-ls:-.01em;
  --s-space-block:24px; --s-space-para:18px;
  --s-radius-photo:4px; --s-tilt-a:0deg; --s-tilt-b:0deg;
  --s-type-lead:19.5px; --s-type-lead-lh:1.45;
  --s-type-eyebrow:10.5px; --s-type-eyebrow-ls:.22em;
  --s-texture:none; --s-texture-blend:normal;
`;

export { css, atfCss };
