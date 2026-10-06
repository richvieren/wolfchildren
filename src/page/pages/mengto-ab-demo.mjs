// A demo of what a page variant is: the same modules, two of them swapped, and
// the ATF on a different copy cell. Nothing else differs from the live page.
import live from './mengto-skeuomorphic.mjs';

const order = live.modules.map((m) => m.id);
const [a, b] = [order.indexOf('stats'), order.indexOf('reasons')];
const modules = live.modules.slice();
[modules[a], modules[b]] = [modules[b], modules[a]];   // reasons before stats

export default {
  ...live,
  id: 'mengto-ab-demo',
  title: 'MengTo · A/B demo, plain skin',
  skin: 'plain',                // the second skin: flat cards, thin rules, no shadows
  url: 'readings/compass/mengto-ab-demo',
  atf: { cell: 'ab-demo' },     // headline variant 1, from src/lib/atf-copy.mjs
  modules,
};
