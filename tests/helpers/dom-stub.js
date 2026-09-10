// tests/helpers/dom-stub.js — the smallest DOM that can answer the questions
// this suite asks. Not a browser, and not trying to be one.
//
// It exists for one finding above all: C1. A `required` input inside a hidden
// container blocks form submission in every browser — `hidden` does NOT exempt
// an element from constraint validation; only `disabled` and `type="hidden"`
// do. checkValidity() below implements exactly that rule, so a test that
// passes here is testing the thing that broke the live forms.
//
// Lives under tests/helpers/ so `node --test tests/*.test.js` does not pick it
// up as a test file.

class StubText {
  constructor(data) {
    this.nodeType = 3;
    this.data = String(data);
    this.parentNode = null;
  }
  get textContent() { return this.data; }
  set textContent(v) { this.data = String(v); }
}

const VALIDATED = new Set(['INPUT', 'SELECT', 'TEXTAREA']);

class StubElement {
  constructor(tagName, doc) {
    this.nodeType = 1;
    this.tagName = String(tagName).toUpperCase();
    this.ownerDocument = doc;
    this.childNodes = [];
    this.parentNode = null;
    this.dataset = {};
    this.style = {};
    this.attributes = {};
    this._listeners = new Map();
    this.id = '';
    this.className = '';
    this.name = '';
    this.type = '';
    this.htmlFor = '';
    this.autocomplete = '';
    this.href = '';
    this.hidden = false;
    this.required = false;
    this.disabled = false;
    this.checked = false;
    this._value = '';
  }

  get value() { return this._value; }
  set value(v) { this._value = (v === null || v === undefined) ? '' : String(v); }

  get children() { return this.childNodes.filter((n) => n.nodeType === 1); }

  get textContent() {
    return this.childNodes.map((n) => n.textContent).join('');
  }
  set textContent(v) {
    for (const n of this.childNodes) n.parentNode = null;
    this.childNodes = [];
    if (v !== '' && v !== null && v !== undefined) {
      const t = new StubText(v);
      t.parentNode = this;
      this.childNodes.push(t);
    }
  }

  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null; }
  hasAttribute(name) { return Object.hasOwn(this.attributes, name); }

  appendChild(node) {
    if (node.parentNode) node.parentNode.removeChild(node);
    node.parentNode = this;
    this.childNodes.push(node);
    // A <select> reports its first option's value until something sets one.
    if (this.tagName === 'SELECT' && node.nodeType === 1 && node.tagName === 'OPTION'
        && this.children.filter((c) => c.tagName === 'OPTION').length === 1) {
      this._value = node.value;
    }
    return node;
  }

  append(...nodes) {
    for (const n of nodes) {
      this.appendChild(typeof n === 'string' ? new StubText(n) : n);
    }
  }

  removeChild(node) {
    const i = this.childNodes.indexOf(node);
    if (i !== -1) this.childNodes.splice(i, 1);
    node.parentNode = null;
    return node;
  }

  /**
   * insertBefore(node, referenceNode) — referenceNode null appends, like the
   * real DOM. Added for Task 7 fix round 1 (intake.js's places fieldset must
   * land at a specific position, not just at the end).
   */
  insertBefore(node, referenceNode) {
    if (node.parentNode) node.parentNode.removeChild(node);
    node.parentNode = this;
    if (referenceNode == null) {
      this.childNodes.push(node);
    } else {
      const i = this.childNodes.indexOf(referenceNode);
      if (i === -1) throw new Error('referenceNode is not a child of this node');
      this.childNodes.splice(i, 0, node);
    }
    return node;
  }

  remove() { if (this.parentNode) this.parentNode.removeChild(this); }

  replaceWith(node) {
    const parent = this.parentNode;
    if (!parent) return;
    const i = parent.childNodes.indexOf(this);
    if (node.parentNode) node.parentNode.removeChild(node);
    node.parentNode = parent;
    parent.childNodes[i] = node;
    this.parentNode = null;
  }

  addEventListener(type, fn) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(fn);
  }

  /** Returns whatever the listeners returned, so an async listener is awaitable. */
  dispatchEvent(event) {
    const type = typeof event === 'string' ? event : event.type;
    const detail = typeof event === 'string' ? { type } : event;
    if (!detail.preventDefault) detail.preventDefault = () => { detail.defaultPrevented = true; };
    if (!detail.target) detail.target = this;
    return (this._listeners.get(type) || []).map((fn) => fn.call(this, detail));
  }

  matches(selector) { return matchesSelector(this, selector); }

  closest(selector) {
    let node = this;
    while (node && node.nodeType === 1) {
      if (matchesSelector(node, selector)) return node;
      node = node.parentNode;
    }
    return null;
  }

  querySelector(selector) {
    for (const node of descendants(this)) {
      if (matchesSelector(node, selector)) return node;
    }
    return null;
  }

  querySelectorAll(selector) {
    return [...descendants(this)].filter((n) => matchesSelector(n, selector));
  }

  set innerHTML(html) {
    for (const n of this.childNodes) n.parentNode = null;
    this.childNodes = [];
    parseInto(this, String(html), this.ownerDocument);
  }
  get innerHTML() { return ''; }

  /**
   * Constraint validation, the browser's own rule: a required control with no
   * value is invalid whether or not it — or an ancestor — is `hidden`. Only
   * `disabled` and `type="hidden"` opt out. This is C1 in one method.
   */
  checkValidity() {
    for (const node of descendants(this)) {
      if (!VALIDATED.has(node.tagName)) continue;
      if (!node.required || node.disabled || node.type === 'hidden') continue;
      const filled = node.type === 'checkbox' || node.type === 'radio'
        ? node.checked
        : node.value !== '';
      if (!filled) return false;
    }
    return true;
  }
}

function* descendants(root) {
  for (const child of root.childNodes) {
    if (child.nodeType !== 1) continue;
    yield child;
    yield* descendants(child);
  }
}

// Selectors used by the code under test: '#id', '.class', 'tag',
// '[attr]', 'tag[attr="v"]', and any concatenation of those.
function matchesSelector(el, selector) {
  const parts = String(selector).trim().match(/^[a-zA-Z0-9-]+|#[^.#[\s]+|\.[^.#[\s]+|\[[^\]]+\]/g);
  if (!parts) return false;
  for (const part of parts) {
    if (part.startsWith('#')) {
      if (el.id !== part.slice(1)) return false;
    } else if (part.startsWith('.')) {
      if (!String(el.className).split(/\s+/).includes(part.slice(1))) return false;
    } else if (part.startsWith('[')) {
      const m = part.slice(1, -1).match(/^([^=]+)(?:="?([^"]*)"?)?$/);
      const name = m[1];
      const has = Object.hasOwn(el.attributes, name)
        || (name.startsWith('data-') && Object.hasOwn(el.dataset, dataKey(name)));
      if (!has) return false;
      if (m[2] !== undefined) {
        const actual = Object.hasOwn(el.attributes, name)
          ? el.attributes[name] : el.dataset[dataKey(name)];
        if (String(actual) !== m[2]) return false;
      }
    } else if (el.tagName !== part.toUpperCase()) {
      return false;
    }
  }
  return true;
}

const dataKey = (attr) => attr.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());

// A deliberately small HTML parser: enough for timefield.js's selects markup.
const TAG_RE = /<(\/?)([a-zA-Z0-9-]+)((?:\s+[a-zA-Z-]+(?:="[^"]*")?)*)\s*(\/?)>/g;
const ATTR_RE = /([a-zA-Z-]+)(?:="([^"]*)")?/g;

function parseInto(root, html, doc) {
  const stack = [root];
  let last = 0;
  TAG_RE.lastIndex = 0;
  let m;
  while ((m = TAG_RE.exec(html)) !== null) {
    const text = html.slice(last, m.index);
    if (text) stack[stack.length - 1].append(text);
    last = TAG_RE.lastIndex;
    const [, closing, tag, attrs, selfClosing] = m;
    if (closing) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    const el = doc.createElement(tag);
    ATTR_RE.lastIndex = 0;
    let a;
    while ((a = ATTR_RE.exec(attrs)) !== null) {
      const [, name, raw] = a;
      const value = raw === undefined ? '' : raw;
      if (name === 'id') el.id = value;
      else if (name === 'value') el.value = value;
      else if (name === 'class') el.className = value;
      else if (name === 'style') el.setAttribute('style', value);
      else if (name === 'type') el.type = value;
      else el.setAttribute(name, value);
    }
    stack[stack.length - 1].appendChild(el);
    if (!selfClosing) stack.push(el);
  }
  const tail = html.slice(last);
  if (tail) stack[stack.length - 1].append(tail);
}

class StubDocument {
  constructor() {
    this._listeners = new Map();
    this.documentElement = new StubElement('html', this);
    this.body = new StubElement('body', this);
    this.head = new StubElement('head', this);
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
  }
  createElement(tag) { return new StubElement(tag, this); }
  createTextNode(text) { return new StubText(text); }
  getElementById(id) {
    for (const node of descendants(this.documentElement)) {
      if (node.id === id) return node;
    }
    return null;
  }
  querySelector(selector) { return this.documentElement.querySelector(selector); }
  querySelectorAll(selector) { return this.documentElement.querySelectorAll(selector); }
  addEventListener(type, fn) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(fn);
  }
  dispatchEvent(event) {
    const type = typeof event === 'string' ? event : event.type;
    return (this._listeners.get(type) || []).map((fn) => fn.call(this, event));
  }
}

export function createDocument() { return new StubDocument(); }
export { StubElement, StubText };
