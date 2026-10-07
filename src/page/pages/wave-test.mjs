// wave-test — not a variant. A bench for the wave edge and the parallax:
// the live page's whats-inside, then the same plain section twice, once per
// gradient. noindex like every page here, and linked from nowhere.
import live from './mengto-skeuomorphic.mjs';

const whatsInside = live.modules.find((m) => m.id === 'whats-inside');

export default {
  ...live,
  id: 'wave-test',
  title: 'Wave test',
  url: 'readings/compass/wave-test',
  modules: [
    // its contents move up at half the scroll speed while the wave passes over
    { ...whatsInside, ground: 'light', parallax: 0.5 },
    { id: 'wave-demo', copy: 'B', settings: { gradient: 'linear-gradient(90deg,#495543,#CDB494)' } },
  ],
};
