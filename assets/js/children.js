// children.js — portal/children.html: add a child, list existing children.
// R57 (Task 14, fix round 1): the add-child fields are the shared
// child-form.js component, also used by intake.js — see that file for the
// Places/tz wiring.

import { getSession } from './auth.js?v=96b93ff5';
import { getChildren, addChild, deleteChild } from './api.js?v=c3ed6e8e';
import { mountChildForm, readChildForm } from './child-form.js?v=ff8752de';

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
      document.getElementById('tob').value = ''; // the timefield selects' reset doesn't re-sync the hidden #tob
      status.textContent = 'Child added.';
      await renderChildren(list, status);
    } catch (err) {
      status.textContent = err.message;
    }
  });

  await renderChildren(list, status);
}

init();
