/**
 * Forced states without a browser trick: every CSS rule that uses :hover or :focus-visible gets a twin
 * that uses .st-hover or .st-focus instead. A cell with class st-hover then renders exactly as its
 * real hover CSS says, for MUI (Emotion), shadcn (Tailwind) and plain CSS alike. Same idea as
 * Storybook's pseudo-states addon. Runs again after each render, because Emotion adds rules when the
 * theme changes.
 */
const seen = new WeakSet();
const STATEFUL = /:hover|:focus-visible/;

function walk(list) {
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const rule = list[i];
    if (seen.has(rule)) continue;
    seen.add(rule);
    const isStyle = typeof CSSStyleRule !== 'undefined' && rule instanceof CSSStyleRule;
    if (isStyle && STATEFUL.test(rule.selectorText)) {
      const selector = rule.selectorText.replace(/:hover/g, '.st-hover').replace(/:focus-visible/g, '.st-focus');
      const parent = rule.parentRule || rule.parentStyleSheet;
      try {
        parent.insertRule(selector + rule.cssText.slice(rule.cssText.indexOf('{') - 1), i + 1);
        seen.add(parent.cssRules[i + 1]);
      } catch (e) { /* a rule this browser can't re-insert stays as it is */ }
    } else if (rule.cssRules) {
      walk(rule.cssRules);
    }
  }
}

export function forceStates() {
  for (const sheet of document.styleSheets) {
    try { walk(sheet.cssRules); } catch (e) { /* cross-origin sheet: not ours */ }
  }
}
