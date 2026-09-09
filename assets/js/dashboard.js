// dashboard.js — pure grouping logic for the portal dashboard. No DOM, no
// fetch. main-portal.js renders whatever this returns with cards.js.

/**
 * Every grant in `grants` for `product`, one card each, in the order the API
 * returned them; a single locked card when there are none.
 *
 * C3 (R48 applied to the whole file): `byChild` used to pick a child's grant
 * with `grants.find(...)`, so a second edition of the same reading for the
 * same child was silently dropped — bought, paid for, invisible. One helper
 * now answers "every grant for this product in this scope" everywhere.
 */
function cardsFor(product, grants) {
  const owned = grants.filter((g) => g.product === product.slug);
  if (owned.length === 0) return [{ product, grant: null }];
  return owned.map((grant) => ({ product, grant }));
}

/**
 * groupGrants(products, grants, children)
 *
 * products — grantable products only (never a bundle; this function also
 *            defensively drops any bundle it is handed, per spec §3.1a).
 * grants   — every grant row from GET /v1/grants.
 * children — every child row from GET /v1/children.
 *
 * Returns:
 *   byChild:   [{ child, cards: [{ product, grant }] }]  — one entry per
 *              child, one card per grant per generated product, matched by
 *              child_id, plus one locked card per generated product the child
 *              has no grant for.
 *   waiting:   [{ product, grant }] — generated-product grants with no
 *              child_id yet (bought, not yet assigned to a child).
 *   removed:   [{ label, cards }] — grants whose child_id is set but whose
 *              child is not in `children`. The API anonymises a deleted
 *              child's grants rather than dropping them, so this is a real
 *              row a real client owns; before C3 it rendered nowhere while
 *              its product also showed under "Not yet yours". `label` comes
 *              from the grant's child_name, or "Removed child" when the API
 *              has already nulled it.
 *   downloads: [{ product, grant }] — one entry per grant the caller owns on
 *              an instant/manual product (R48: a second purchase of the same
 *              product, e.g. a second edition of presets, is a second card,
 *              not a dropped one), in the order the API returned them.
 *   locked:    [{ product, grant: null }] — everything else not yet theirs:
 *              instant/manual products with no grant, and generated products
 *              with no child to host them and no unplaced grant. Inactive
 *              products are never advertised here (I7/R67) — photo-course and
 *              retreat are `active: false` and have no price, so "Not yet
 *              yours" was an offer of something that cannot be bought. They
 *              still render everywhere else if a grant exists.
 */
export function groupGrants(products, grants, children) {
  const grantable = products.filter((p) => p.fulfilment !== 'bundle');
  const productBySlug = new Map(grantable.map((p) => [p.slug, p]));
  const generated = grantable.filter((p) => p.fulfilment === 'generated');
  const others = grantable.filter((p) => p.fulfilment !== 'generated');
  const childIds = new Set(children.map((c) => c.id));

  const byChild = children.map((child) => {
    const mine = grants.filter((g) => g.child_id === child.id);
    const cards = [];
    for (const product of generated) {
      for (const card of cardsFor(product, mine)) {
        if (card.grant || product.active) cards.push(card);
      }
    }
    return { child, cards };
  });

  const waiting = [];
  const removedByChildId = new Map();
  for (const grant of grants) {
    const product = productBySlug.get(grant.product);
    if (!product || product.fulfilment !== 'generated') continue;
    if (grant.child_id == null) {
      waiting.push({ product, grant });
    } else if (!childIds.has(grant.child_id)) {
      let group = removedByChildId.get(grant.child_id);
      if (!group) {
        group = { label: grant.child_name || 'Removed child', cards: [] };
        removedByChildId.set(grant.child_id, group);
      }
      group.cards.push({ product, grant });
    }
  }
  const removed = [...removedByChildId.values()];

  const downloads = [];
  const locked = [];
  for (const product of others) {
    for (const card of cardsFor(product, grants)) {
      if (card.grant) downloads.push(card);
      else if (product.active) locked.push(card);
    }
  }

  if (children.length === 0) {
    for (const product of generated) {
      if (!product.active) continue;
      // A grant that is waiting, or that belongs to a removed child, already
      // renders in its own group. Offering the same product as "Not yet
      // yours" alongside it tells the client they do not own what they own.
      const hasUnplacedGrant = grants.some((g) => g.product === product.slug
        && (g.child_id == null || !childIds.has(g.child_id)));
      if (!hasUnplacedGrant) locked.push({ product, grant: null });
    }
  }

  return { byChild, waiting, removed, downloads, locked };
}
