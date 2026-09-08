#!/bin/bash
# stamp-assets.sh (Wolf Children) — content-hash every local <script src="*.js"> in the
# site/portal HTML, AND every relative JS import specifier between assets/js/*.js files.
#
# GitHub Pages serves .js files with cache-control: max-age=600 and that is not
# configurable. Without a version string a client can run up to 10 minutes of
# stale JS after a deploy. On 2026-08-30 that was a live suspicion when a client
# reported an error the fix had already removed.
#
# R40 (2026-09-09, fix round 1 on Task 8): a bare `import ... from './x.js'`
# specifier inside another assets/js/*.js file is JS the browser loads too, and
# was never stamped. assets/js/main-portal.js:5 imported './auth.js' with no
# version, so a deploy that touched only auth.js (the token logic) left clients
# on a stale copy for up to 10 minutes. The JS-import pass below runs BEFORE the
# HTML pass and repeats until a full pass changes nothing: stamping X's
# specifier inside Y changes Y's own bytes, so Y's hash changes, so anything
# that references Y (another JS file, or an HTML <script> tag) must be
# re-stamped too. Imports are acyclic, so this converges; capped at 10
# iterations, which fails loudly rather than looping forever if it doesn't.
#
# Run this after ANY change to a .js file and before committing. Idempotent:
# re-running with no js changes produces no diff.
#
# Usage: bash stamp-assets.sh [--check]
#   --check  exit 1 if any stamp is stale, change nothing (for CI / pre-deploy)

set -euo pipefail
cd "$(dirname "$0")"

CHECK=false
[[ "${1:-}" == "--check" ]] && CHECK=true

# Rewrite relative import/from specifiers among assets/js/*.js to carry
# ?v=<hash of the referenced file's CURRENT content>. Repeats until a full
# pass makes no change. Operates on whatever is in the current directory
# (the real tree, or a scratch copy of it — see check mode below).
stamp_js_imports() {
    local changed iter js other hash base esc_base
    changed=1
    iter=0
    while [[ $changed -eq 1 ]]; do
        iter=$((iter + 1))
        if [[ $iter -gt 10 ]]; then
            echo "JS import stamping did not converge after 10 iterations (import cycle?)" >&2
            exit 1
        fi
        changed=0
        for js in assets/js/*.js; do
            [[ -f "$js" ]] || continue
            hash=$(md5 -q "$js" | cut -c1-8)
            base=$(basename "$js")
            esc_base=${base//./\\.}
            for other in assets/js/*.js; do
                [[ -f "$other" ]] || continue
                [[ "$other" == "$js" ]] && continue
                grep -qE "(from|import)[[:space:]]+['\"]\./$esc_base(\?v=[0-9a-f]{8})?['\"]" "$other" || continue
                if grep -qE "(from|import)[[:space:]]+['\"]\./$esc_base\?v=$hash['\"]" "$other"; then
                    continue
                fi
                perl -pi -e "s#(from|import)(\s+)(['\"])\./$esc_base(\?v=[0-9a-f]{8})?(['\"])#\${1}\${2}\${3}./$base?v=$hash\${5}#g" "$other"
                echo "  stamped $other -> ./$base?v=$hash"
                changed=1
            done
        done
    done
}

# Rewrite <script src="assets/js/*.js"> (with or without a leading slash) in
# every HTML file to carry ?v=<hash of the referenced file's CURRENT content>.
# Runs AFTER stamp_js_imports so it stamps tags against post-cascade hashes.
stamp_html() {
    local js html hash esc
    for js in assets/js/*.js; do
        [[ -f "$js" ]] || continue
        hash=$(md5 -q "$js" | cut -c1-8)
        esc=${js//./\\.}
        while IFS= read -r html; do
            grep -qE "src=\"/?$esc(\?v=[0-9a-f]{8})?\"" "$html" || continue
            if grep -qE "src=\"/?$esc\?v=$hash\"" "$html"; then continue; fi
            perl -pi -e "s#src=\"(/?)$esc(\?v=[0-9a-f]{8})?\"#src=\"\$1$js?v=$hash\"#g" "$html"
            echo "  stamped $html -> $js?v=$hash"
        done < <(find . -name '*.html' -not -path './.git/*')
    done
}

if $CHECK; then
    # --check must change nothing, but detecting a cascade (X changes ->
    # X's importer Y's own bytes would change -> whatever references Y is
    # stale too) genuinely requires computing Y's post-stamp hash, not just
    # comparing on-disk bytes. So simulate a full real run against a throwaway
    # copy of the tree, and read off which files that run touched — each
    # "stamped" line it would have printed becomes a "STALE" line here, and
    # nothing on disk is touched.
    SCRATCH=$(mktemp -d)
    trap 'rm -rf "$SCRATCH"' EXIT

    mkdir -p "$SCRATCH/assets/js"
    for js in assets/js/*.js; do
        [[ -f "$js" ]] || continue
        cp "$js" "$SCRATCH/assets/js/"
    done
    while IFS= read -r html; do
        mkdir -p "$SCRATCH/$(dirname "$html")"
        cp "$html" "$SCRATCH/$html"
    done < <(find . -name '*.html' -not -path './.git/*')

    STALE=0
    # A cascade can stamp the same file more than once across iterations
    # (its target's hash keeps moving as upstream files settle) — keep only
    # the last, final stamp per file so each stale file is reported once.
    while IFS= read -r line; do
        [[ -z "$line" ]] && continue
        file=${line#  stamped }
        file=${file%% -> *}
        target=${line##* -> }
        path=${target%%\?v=*}
        hash=${target##*\?v=}
        if [[ "$path" == ./* ]]; then
            base=${path#./}
            echo "STALE: $file imports ./$base without the current hash ($hash)"
        else
            echo "STALE: $file references $path without the current hash ($hash)"
        fi
        STALE=1
    done < <(cd "$SCRATCH" && { stamp_js_imports && stamp_html; } | tail -r | awk -F' -> ' '!seen[$1]++' | tail -r)

    if [[ $STALE -eq 1 ]]; then
        echo "Asset stamps are stale. Run: bash stamp-assets.sh"
        exit 1
    fi
    echo "Asset stamps: OK"
else
    stamp_js_imports
    stamp_html
fi
