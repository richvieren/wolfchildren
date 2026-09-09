// timefield.js — locale-independent birth time field.
//
// <input type="time"> renders according to the client's OS locale: a US device
// shows a 12-hour control with a separate AM/PM segment, a European one shows
// 24-hour. The stored value is always 24-hour "HH:MM", so a fixed label reading
// "(24-hour)" was wrong for every US client, and a half-filled native control
// blocked submission with the browser's own "Please enter a valid value" and no
// explanation of which part was missing (Sara Rios, 2026-08-31).
//
// Three explicit selects render identically everywhere, so the label always
// matches what the client is looking at. The canonical "HH:MM" is written into a
// hidden input, so every existing reader of #tob keeps working unchanged.
//
// Lifted from Cato's portal/timefield.js (Task 14, Wolf Children). Converted
// to an ES module and toCanonical() extracted from _tobSync's own conversion
// (Task 14, Step 2) so the conversion itself is testable without a DOM. No
// other logic changed.

function _tobEls(id) {
  // Guarded for the same reason the auto-init at the foot of this file is:
  // readChildForm() now calls tobError() (C2) and is unit-tested without a
  // DOM. No elements means nothing to validate, which tobError reads as valid.
  if (typeof document === 'undefined') return [null, null, null];
  return [document.getElementById(id + '-h'),
          document.getElementById(id + '-m'),
          document.getElementById(id + '-ap')];
}

/** Canonical 24-hour "HH:MM" for a given hour/minute/am-pm, or '' if any part is missing. */
export function toCanonical(hour, minute, ampm) {
  if (!hour || !minute || !ampm) return '';
  var h = parseInt(hour, 10) % 12;
  if (ampm === 'PM') h += 12;
  return (h < 10 ? '0' : '') + h + ':' + minute;
}

/** Write canonical 24-hour HH:MM into the hidden input, or '' if incomplete. */
function _tobSync(id) {
  var e = _tobEls(id), hidden = document.getElementById(id);
  if (!hidden || !e[0]) return;
  hidden.value = toCanonical(e[0].value, e[1].value, e[2].value);
}

/** Build the three selects into <div id="{id}-selects"> beside <input type="hidden" id="{id}">. */
export function initTobField(id) {
  var hidden = document.getElementById(id);
  var mount = document.getElementById(id + '-selects');
  if (!hidden || !mount || mount.dataset.built) return;
  mount.dataset.built = '1';

  // Layout only. R66: this string used to carry Cato's brand tokens
  // (font-family:Jost, var(--stone), var(--mist)) — none of which Wolf
  // Children defines, so the selects rendered in the browser default font on
  // a colour that did not exist. The site's own stylesheet owns type and
  // colour; border-bottom with no colour inherits currentColor.
  var css = 'background:transparent;border:none;border-bottom:1px solid;' +
            'font-weight:300;font-size:1rem;' +
            'padding:0.6rem 0.2rem;outline:none';
  var h = '<option value="">Hour</option>';
  for (var i = 1; i <= 12; i++) h += '<option value="' + i + '">' + i + '</option>';
  var m = '<option value="">Min</option>';
  for (var j = 0; j < 60; j++) { var mm = (j < 10 ? '0' : '') + j; m += '<option value="' + mm + '">' + mm + '</option>'; }

  mount.innerHTML =
    '<div style="display:flex;gap:0.6rem;align-items:baseline">' +
      '<select id="' + id + '-h" style="' + css + '">' + h + '</select>' +
      '<span>:</span>' +
      '<select id="' + id + '-m" style="' + css + '">' + m + '</select>' +
      '<select id="' + id + '-ap" style="' + css + '">' +
        '<option value="">AM/PM</option><option value="AM">AM</option><option value="PM">PM</option>' +
      '</select>' +
    '</div>';

  var els = _tobEls(id);
  for (var k = 0; k < els.length; k++) {
    els[k].addEventListener('change', function () { _tobSync(id); });
  }
  _tobSync(id);
}

/** Populate the selects from a canonical "HH:MM". */
export function setTobValue(id, hhmm) {
  var e = _tobEls(id);
  if (!e[0] || !hhmm) return;
  var p = String(hhmm).split(':');
  var h24 = parseInt(p[0], 10);
  if (isNaN(h24)) return;
  e[0].value = String(h24 % 12 || 12);
  e[1].value = p[1] ? p[1].slice(0, 2) : '00';
  e[2].value = h24 >= 12 ? 'PM' : 'AM';
  _tobSync(id);
}

/**
 * null when valid, otherwise a plain-English message naming what is missing.
 * All three empty is valid — birth time is optional and always has been.
 */
export function tobError(id) {
  var e = _tobEls(id);
  if (!e[0]) return null;
  var filled = 0;
  for (var i = 0; i < 3; i++) if (e[i].value) filled++;
  if (filled === 0 || filled === 3) return null;
  var missing = [];
  if (!e[0].value) missing.push('hour');
  if (!e[1].value) missing.push('minutes');
  if (!e[2].value) missing.push('AM or PM');
  var last = missing.pop();
  var list = missing.length ? missing.join(', ') + ' and ' + last : last;
  return 'Your birth time is missing the ' + list + '. Please complete it, or clear all three boxes if you do not know your birth time.';
}

// Guarded: this module is imported by tests/timefield.test.js under
// node --test, which has no `document`. The browser always has one, so this
// changes nothing there — it only stops the import itself from throwing.
// R68: the 'f-tob' init went with Cato's profile page, and so did the
// DOB_MIN / dobMaxDate() block — both names live in Cato's db.js, which does
// not exist here, so the block only ever evaluated to two no-ops.
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    initTobField('tob');
  });
}
