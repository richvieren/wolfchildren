// compare — the comparison table, after Grüns' "Us vs. Them" and MUD\WTR's
// "How it Stacks Up". Self-contained: markup, CSS from tokens, no script.
// The wave along its top edge is a page setting (edge: 'wave-2'), not code here.
export const id = 'compare';

const COLUMNS = [
  { name: 'Compass', note: '$27', us: true },
  { name: 'A free horoscope app', note: null, us: false },
  { name: 'A chart report PDF', note: 'about $20', us: false },
  { name: 'A parenting book', note: 'about $18', us: false },
];

const ROWS = [
  ['About your child alone', [1, 0, 1, 0]],
  ['Reads the whole chart', [1, 0, 1, 0]],
  ['In plain words', [1, 0, 0, 1]],
  ['No predictions', [1, 0, 0, 1]],
  ['No labels or types', [1, 0, 0, 0]],
  ['Ready in minutes', [1, 1, 0, 0]],
];

const TICK = '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">'
  + '<circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.2"/>'
  + '<path d="M6 10.4 8.8 13.2 14 7.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CROSS = '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">'
  + '<circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.2"/>'
  + '<path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

export const css = `
/* 2026-10-08, Richard: half the space between the wave and the headline. The
   section's own padding was 108px, which left 106px under the wave's 2px lap;
   55px leaves 53px. */
.compare-s{background:var(--b-paper);color:var(--b-green);padding-top:55px}
.cmp{max-width:980px;margin:0 auto}
/* the skin caps an h2 at 20ch, which left the headline sitting to the left of
   its own block; it needs the full width to centre. */
.cmp-h{font-family:var(--b-display);font-weight:400;color:var(--b-green);
  font-size:var(--s-type-display);line-height:var(--s-type-display-lh);
  letter-spacing:var(--s-type-display-ls);text-align:center;
  max-width:none;margin:0 auto var(--s-space-section)}
/* the word for a screen reader, not for the page */
.cmp-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
  clip-path:inset(50%);white-space:nowrap;border:0}
.cmp-table{width:100%;border-collapse:collapse;table-layout:fixed}
.cmp-table th,.cmp-table td{padding:14px 10px;text-align:center;vertical-align:middle;
  border-bottom:1px solid var(--b-tan)}
.cmp-table thead th{border-bottom:1px solid var(--b-tan);vertical-align:bottom}
.cmp-table .cmp-row-h{text-align:left}
.cmp-row-h{font-family:var(--b-body);font-weight:400;
  font-size:var(--s-type-body);line-height:1.35;color:var(--b-green);width:30%}
.cmp-col{font-family:var(--b-body);font-weight:400;font-size:13px;line-height:1.35;
  color:var(--b-bark)}
.cmp-col b{display:block;font-weight:400;font-size:var(--s-type-body);color:var(--b-green)}
.cmp-us{background:rgba(73,85,67,.07)}
.cmp-us .cmp-col b,.cmp-us.cmp-col b{color:var(--b-green)}
thead .cmp-us{border-radius:10px 10px 0 0}
.cmp-yes{color:var(--b-green)}
.cmp-no{color:var(--b-tan)}
.cmp-act{margin-top:var(--s-space-section);text-align:center}
.cmp-cta{display:inline-block;font-family:var(--b-body);font-size:var(--s-type-body);
  letter-spacing:.06em;text-transform:uppercase;text-decoration:none;
  padding:0 32px;height:54px;line-height:50px;background:var(--b-green);color:var(--b-cream);
  border:var(--s-hard-border);border-radius:var(--s-radius-btn-hard);box-shadow:var(--s-shadow-hard)}
@media(max-width:699px){
  .cmp-table th,.cmp-table td{padding:10px 4px}
  .cmp-row-h{font-size:13px;width:34%}
  .cmp-col{font-size:11px}
  .cmp-col b{font-size:12.5px}
  .cmp-table svg{width:17px;height:17px}
}
`;

export function markup(copy, settings = {}) {
  const g = settings.className ? ` ${settings.className}` : '';
  const head = COLUMNS.map((c) => `        <th class="cmp-col${c.us ? ' cmp-us' : ''}" scope="col"><b>${c.name}</b>${c.note ? c.note : ''}</th>`).join('\n');
  const body = ROWS.map(([label, cells]) => `      <tr>
        <th class="cmp-row-h" scope="row">${label}</th>
${cells.map((v, i) => `        <td class="${v ? 'cmp-yes' : 'cmp-no'}${COLUMNS[i].us ? ' cmp-us' : ''}"><span class="cmp-sr">${v ? 'Yes' : 'No'}</span>${v ? TICK : CROSS}</td>`).join('\n')}
      </tr>`).join('\n');

  return `<section class="s compare-s${g}"><div class="wrap">
  <div class="cmp">
    <h2 class="cmp-h">${copy.heading}</h2>
    <table class="cmp-table">
      <thead>
        <tr><td></td>
${head}
        </tr>
      </thead>
      <tbody>
${body}
      </tbody>
    </table>
    <p class="cmp-act"><a class="cmp-cta" href="#atf">${copy.cta}</a></p>
  </div>
</div></section>`;
}
