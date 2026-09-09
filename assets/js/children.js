// children.js — portal/children.html: add a child, list existing children.
// R57 (Task 14, fix round 1): the add-child fields are the shared
// child-form.js component, also used by intake.js — see that file for the
// Places wiring.

import { getSession } from './auth.js?v=b9374f9e';
import { getChildren, addChild, deleteChild, firstErrorMessage } from './api.js?v=efad900d';
import { mountChildForm, readChildForm } from './child-form.js?v=66dea573';

async function renderChildren(list, status) {
  list.textContent = '';
  const children = await getChildren();
  for (const child of children) {
    const li = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = child.name;
    const dob = document.createElement('span');
    dob.textContent = child.dob;
    const place = document.createElement('span');
    place.textContent = child.place_name;
    const del = document.createElement('button');
    del.type = 'button';
    del.textContent = 'Delete';
    del.addEventListener('click', async () => {
      if (!confirm("This removes the child's details and readings. It cannot be undone.")) return;
      try {
        await deleteChild(child.id);
        status.textContent = '';
        await renderChildren(list, status);
      } catch (err) {
        // I5: err.message is api.js's internal "/v1/children/3 failed: 422".
        status.textContent = firstErrorMessage(err);
      }
    });
    li.append(name, ' ', dob, ' ', place, ' ', del);
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
      status.textContent = 'Child added.';
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

init();
