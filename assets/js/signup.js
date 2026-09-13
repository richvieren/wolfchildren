// signup.js — posts the moon-calendar form to Loops without leaving the page.
// Contract (Loops custom-form docs, fetched 2026-09-13): POST the form's
// action as application/x-www-form-urlencoded; 200 {success:true}; 400/500
// {success:false, message}; 429 when one IP submits too often. Without this
// script the form still works as a plain POST to Loops, which answers with
// its own page.

const COPY = {
  success: 'Check your inbox. The calendar is on its way.',
  tooMany: 'Too many signups from here just now. Try again in a few minutes.',
  failed: 'That did not go through. Check the address and try again.',
  sending: 'Sending…',
};

export function wireSignup(form, { fetchFn = fetch } = {}) {
  const status = form.parentNode.querySelector('[data-signup-status]');
  const success = form.parentNode.querySelector('[data-signup-success]');
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const body = new URLSearchParams();
    for (const el of form.querySelectorAll('input[name]')) body.set(el.name, el.value);
    status.textContent = COPY.sending;
    button.disabled = true;
    try {
      const res = await fetchFn(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      let data = {};
      try { data = await res.json(); } catch { data = {}; }
      if (res.ok && data.success) {
        status.textContent = '';
        form.hidden = true;
        success.hidden = false;
      } else if (res.status === 429) {
        status.textContent = COPY.tooMany;
      } else {
        status.textContent = COPY.failed;
      }
    } catch {
      status.textContent = COPY.failed;
    } finally {
      button.disabled = false;
    }
  });
}

if (typeof document !== 'undefined') {
  for (const form of document.querySelectorAll('form[data-signup]')) wireSignup(form);
}
