// children.js — portal/children.html: add a child, list existing children.
// R57 (Task 14, fix round 1): the add-child fields are the shared
// child-form.js component, also used by intake.js — see that file for the
// Places wiring.
//
// 2026-09-13: wording per docs/portal-copy-audit-2026-09-13.md. The remove
// confirmation says what the API does: the birth details go, readings already
// made stay on the dashboard without the name (dashboard.js, "removed").

import { getSession } from './auth.js?v=c0266db9';
import { getChildren, addChild, deleteChild, firstErrorMessage } from './api.js?v=9e96d9b6';
import { mountChildForm, readChildForm } from './child-form.js?v=9e142cbe';

export function removeConfirmText(name) {
  return `Remove ${name}? The birth details are deleted. Readings already made stay on your dashboard, without the name. This cannot be undone.`;
}

export function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return String(iso || '');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}

async function renderChildren(list, status) {
  list.textContent = '';
  const children = await getChildren();
  for (const child of children) {
    const li = document.createElement('li');
    const line = document.createElement('span');
    line.textContent = `${child.name} · born ${formatDate(child.dob)} · ${child.place_name}`;
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'secondary';
    del.textContent = 'Remove';
    del.addEventListener('click', async () => {
      if (!confirm(removeConfirmText(child.name))) return;
      try {
        await deleteChild(child.id);
        status.textContent = '';
        await renderChildren(list, status);
      } catch (err) {
        // I5: err.message is api.js's internal "/v1/children/3 failed: 422".
        status.textContent = firstErrorMessage(err);
      }
    });
    li.append(line, ' ', del);
    list.append(li);
  }
  if (children.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No children added yet.';
    list.append(li);
  }
}

async function init() {
  const session = await getSession();
  if (!session) {
    window.location.href = '/portal/';
    return;
  }

  const mapsKeyMeta = document.querySelector('meta[name="wc-maps-key"]');
  const mapsKey = (mapsKeyMeta && mapsKeyMeta.content) || '';

  const form = document.getElementById('add-child-form');
  const fields = document.getElementById('child-fields');
  const status = document.getElementById('status');
  const list = document.getElementById('children-list');

  mountChildForm(fields, { mapsKey });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    try {
      const childFields = await readChildForm(fields, { mapsKey });
      await addChild(childFields);
      form.reset();
      status.textContent = 'Saved.';
      await renderChildren(list, status);
    } catch (err) {
      status.textContent = firstErrorMessage(err);
    }
  });

  // I2: renderChildren awaits GET /v1/children, which throws "signed out" on
  // an expired token. Unguarded that escaped init() and left the page showing
  // an empty list and a form that would 401 on submit, with nothing said.
  try {
    await renderChildren(list, status);
  } catch {
    window.location.href = '/portal/';
  }
}

if (typeof document !== 'undefined' && document.getElementById('add-child-form')) {
  init();
}
