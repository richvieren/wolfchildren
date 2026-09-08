// dashboard.js — pure grouping logic for the portal dashboard. No DOM, no
// fetch. main-portal.js renders whatever this returns with cards.js.

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
 *              child, one card per generated product, matched by child_id.
 *   waiting:   [{ product, grant }] — generated-product grants with no
 *              child_id yet (bought, not yet assigned to a child).
 *   downloads: [{ product, grant }] — instant/manual products the caller
 *              already owns a grant for.
 *   locked:    [{ product, grant: null }] — everything else not yet theirs:
 *              instant/manual products with no grant, and generated
 *              products with no child to host them and no waiting grant.
 */
export function groupGrants(products, grants, children) {
  const grantable = products.filter((p) => p.fulfilment !== 'bundle');
  const productBySlug = new Map(grantable.map((p) => [p.slug, p]));
  const generated = grantable.filter((p) => p.fulfilment === 'generated');
  const others = grantable.filter((p) => p.fulfilment !== 'generated');

  const byChild = children.map((child) => ({
    child,
    cards: generated.map((product) => ({
      product,
      grant: grants.find((g) => g.product === product.slug && g.child_id === child.id) || null,
    })),
  }));

  const waiting = [];
  for (const grant of grants) {
    const product = productBySlug.get(grant.product);
    if (!product) continue;
    if (product.fulfilment === 'generated' && grant.child_id == null) {
      waiting.push({ product, grant });
    }
  }

  const downloads = [];
  const locked = [];
  for (const product of others) {
    const grant = grants.find((g) => g.product === product.slug) || null;
    if (grant) downloads.push({ product, grant });
    else locked.push({ product, grant: null });
  }

  if (children.length === 0) {
    for (const product of generated) {
      const hasWaitingGrant = grants.some(
        (g) => g.product === product.slug && g.child_id == null
      );
      if (!hasWaitingGrant) locked.push({ product, grant: null });
    }
  }

  return { byChild, waiting, downloads, locked };
}
