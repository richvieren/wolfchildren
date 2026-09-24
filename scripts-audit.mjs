#!/usr/bin/env node
// Audit a text file against the anti-slop rules: node scripts-audit.mjs <file>
import { audit, report, BY_HAND } from './src/lib/slop.mjs';
import { readFileSync } from 'node:fs';
const hits = audit(readFileSync(process.argv[2], 'utf8'));
console.log(report(hits));
if (process.argv[3] === '--byhand') console.log('\nstill needs a human read:\n  ' + BY_HAND.join('\n  '));
process.exit(hits.length ? 1 : 0);
