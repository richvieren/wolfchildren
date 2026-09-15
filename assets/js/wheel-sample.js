// wheel-sample.js — the live wheel on the Compass landing page. Reads the
// sample chart the build inlines (a child who does not exist: 12 January 2020,
// 14:30, Ghent) and draws it with wheel.js, interaction included.
import { renderWheel } from './wheel.js?v=f627a5c2';

const data = document.getElementById('wheel-sample-data');
const mount = document.getElementById('wheel-sample');
if (data && mount) renderWheel(mount, JSON.parse(data.textContent), { name: 'Sample chart' });
