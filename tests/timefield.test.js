import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toCanonical } from '../assets/js/timefield.js';

test('midnight is 00:00', () => assert.equal(toCanonical('12', '00', 'AM'), '00:00'));
test('noon is 12:00',     () => assert.equal(toCanonical('12', '00', 'PM'), '12:00'));
test('1 AM is 01:00',     () => assert.equal(toCanonical('1', '00', 'AM'), '01:00'));
test('7:15 AM',           () => assert.equal(toCanonical('7', '15', 'AM'), '07:15'));
test('11:59 PM',          () => assert.equal(toCanonical('11', '59', 'PM'), '23:59'));
test('incomplete is empty', () => assert.equal(toCanonical('7', '', 'AM'), ''));
