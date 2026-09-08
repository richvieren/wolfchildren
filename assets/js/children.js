// children.js — portal/children.html: add a child, list existing children.
// Google Places wiring for place_id/lat/lon/tz is Task 14; for now the
// hidden fields submit whatever they hold (empty, until then), and the API's
// 422 surfaces as the request's own error message.

import { getSession } from './auth.js?v=96b93ff5';
import { getChildren, addChild, deleteChild } from './api.js?v=c3ed6e8e';

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
        status.textContent = err.message;
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

  const form = document.getElementById('add-child-form');
  const status = document.getElementById('status');
  const list = document.getElementById('children-list');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    const fields = {
      name: form.name.value,
      dob: form.dob.value,
      tob_unknown: form.tob_unknown.checked,
      tob: form.tob_unknown.checked ? null : (form.tob.value || null),
      place_id: form.place_id.value,
      place_name: form.place_name.value,
      lat: form.lat.value ? Number(form.lat.value) : null,
      lon: form.lon.value ? Number(form.lon.value) : null,
      tz: form.tz.value,
    };
    try {
      await addChild(fields);
      form.reset();
      status.textContent = 'Child added.';
      await renderChildren(list, status);
    } catch (err) {
      status.textContent = err.message;
    }
  });

  await renderChildren(list, status);
}

init();
