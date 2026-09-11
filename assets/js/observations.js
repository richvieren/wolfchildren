// observations.js — the product's own intake questions (registry
// intakeQuestions, from the catalog's reading.intake_questions), mounted on
// the intake page for a NEW or an EXISTING child. Richard, 2026-09-11: a
// returning parent picking an existing child used to be asked nothing, so
// every second reading a family bought had no specifics at all. The answers
// go with the intake (grants.intake), never with the child.

export function mountObservations(form, before, questions) {
  if (!questions || questions.length === 0) return null;
  const obs = document.createElement('fieldset');
  obs.id = 'observations';
  const legend = document.createElement('legend');
  legend.textContent = 'What you have noticed (optional)';
  // Richard, 2026-09-09 (option C): the parent is told, where they type, that
  // this text leaves our server. Name substitution is the only stripping.
  const why = document.createElement('p');
  why.className = 'small';
  why.id = 'obs-note';
  why.textContent = 'These help the reading point at things you have already seen. Leave any of them blank. '
    + 'What you write here is sent to the writing model together with the chart, with your child’s name removed. '
    + 'Please don’t include other names, places, dates, or anything you would not want a third party to hold. '
    + 'Your child’s name, date of birth and birthplace never leave our server.';
  obs.append(legend, why);
  for (const q of questions) {
    const id = `obs-${q.key}`;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = q.label;
    const ta = document.createElement('textarea');
    ta.id = id;
    ta.name = id;
    ta.dataset.key = q.key;
    ta.maxLength = 300;
    ta.rows = 2;
    obs.append(label, ta);
  }
  form.insertBefore(obs, before);
  return obs;
}

/**
 * The answers → the intake body's `observations`, keyed by question key,
 * trimmed and capped client-side as well as server-side. An empty object is
 * a real answer (the parent left every question blank); undefined means the
 * product asks nothing.
 */
export function readObservations(form, questions) {
  if (!questions || questions.length === 0) return undefined;
  const out = {};
  for (const q of questions) {
    const el = form.querySelector(`#obs-${q.key}`);
    const v = el && typeof el.value === 'string' ? el.value.trim().slice(0, 300) : '';
    if (v) out[q.key] = v;
  }
  return out;
}
