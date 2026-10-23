/**
 * @innerspark/flint/behaviors.js: the keyboard and focus behavior components.css can't do alone, for
 * stacks without React (Astro, EJS, plain HTML). No dependencies. Each init is safe to call more than
 * once: it skips elements it has already set up. React apps use @innerspark/flint/react instead.
 *
 *   import { initAll, showToast } from '@innerspark/flint/behaviors.js';
 *   initAll();
 *
 * Patterns follow the WAI-ARIA Authoring Practices: Tabs (automatic activation), Menu Button, Tooltip,
 * and a polite live region for toasts. Dialogs use the native <dialog>, which traps focus itself.
 */

const done = new WeakSet();
const once = (el) => (done.has(el) ? false : (done.add(el), true));

/** Dialogs: [data-flint-dialog-open="id"] opens <dialog id> with showModal(); [data-flint-dialog-close]
 * inside it closes it. Focus goes back to the opener when it closes, however it closed (Esc included). */
export function initDialogs(root = document) {
  root.querySelectorAll('[data-flint-dialog-open]').forEach((opener) => {
    if (!once(opener)) return;
    opener.addEventListener('click', () => {
      const dialog = document.getElementById(opener.getAttribute('data-flint-dialog-open'));
      if (!dialog || dialog.open) return;
      dialog.showModal();
      dialog.addEventListener('close', () => opener.focus(), { once: true });
    });
  });
  root.querySelectorAll('dialog.flint-dialog').forEach((dialog) => {
    if (!once(dialog)) return;
    dialog.addEventListener('click', (e) => {
      if (e.target.closest('[data-flint-dialog-close]')) dialog.close();
    });
  });
}

/** Tabs: .flint-tabs__list[role=tablist] with role=tab buttons. Left and Right move and select
 * (wrapping), Home and End jump. Only the selected tab is in the Tab order. */
export function initTabs(root = document) {
  root.querySelectorAll('.flint-tabs__list[role="tablist"]').forEach((list) => {
    if (!once(list)) return;
    const tabs = () => [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      for (const t of tabs()) {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      }
      if (focus) tab.focus();
    };
    list.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab) select(tab, false);
    });
    list.addEventListener('keydown', (e) => {
      const all = tabs();
      const i = all.indexOf(document.activeElement);
      if (i < 0) return;
      const to = { ArrowRight: (i + 1) % all.length, ArrowLeft: (i - 1 + all.length) % all.length, Home: 0, End: all.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      select(all[to], true);
    });
    const current = tabs().find((t) => t.getAttribute('aria-selected') === 'true') || tabs()[0];
    if (current) select(current, false);
  });
}

/** Menus: a button with aria-haspopup="menu" and aria-controls pointing at a .flint-menu. Opening moves
 * focus to the first item (ArrowUp on the button: the last). Up, Down, Home and End move; Esc closes
 * and returns focus to the button; Tab or a click outside closes. */
export function initMenus(root = document) {
  root.querySelectorAll('[aria-haspopup="menu"][aria-controls]').forEach((button) => {
    if (!once(button)) return;
    const menu = document.getElementById(button.getAttribute('aria-controls'));
    if (!menu) return;
    const items = () => [...menu.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')];
    const isOpen = () => button.getAttribute('aria-expanded') === 'true';
    const open = (which) => {
      menu.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      const list = items();
      (which === 'last' ? list[list.length - 1] : list[0])?.focus();
      document.addEventListener('pointerdown', outside, true);
    };
    const close = (refocus) => {
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      document.removeEventListener('pointerdown', outside, true);
      if (refocus) button.focus();
    };
    const outside = (e) => { if (!menu.contains(e.target) && !button.contains(e.target)) close(false); };
    menu.querySelectorAll('[role="menuitem"]').forEach((item) => { item.tabIndex = -1; });
    button.addEventListener('click', () => (isOpen() ? close(false) : open('first')));
    button.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(e.key === 'ArrowUp' ? 'last' : 'first'); }
    });
    menu.addEventListener('keydown', (e) => {
      const list = items();
      const i = list.indexOf(document.activeElement);
      const to = { ArrowDown: (i + 1) % list.length, ArrowUp: (i - 1 + list.length) % list.length, Home: 0, End: list.length - 1 }[e.key];
      if (to !== undefined) { e.preventDefault(); list[to].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') close(false);
    });
    menu.addEventListener('click', (e) => {
      const item = e.target.closest('[role="menuitem"]');
      if (item && item.getAttribute('aria-disabled') !== 'true') close(true);
    });
  });
}

/** Tooltips: Esc hides any tooltip that is showing, without moving focus (WCAG 1.4.13). It shows again
 * the next time the pointer or focus arrives. */
export function initTooltips(root = document) {
  root.querySelectorAll('.flint-tooltip-anchor').forEach((anchor) => {
    if (!once(anchor)) return;
    const reset = () => anchor.removeAttribute('data-dismissed');
    anchor.addEventListener('pointerenter', reset);
    anchor.addEventListener('focusin', reset);
  });
  if (once(document)) {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.flint-tooltip-anchor:hover, .flint-tooltip-anchor:focus-within').forEach((a) => a.setAttribute('data-dismissed', ''));
    });
  }
}

const closeIcon = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

/**
 * Toasts: add one to a .flint-toast-region that is already in the page (role="status",
 * aria-live="polite"), so it is announced without taking focus. A toast with an action never
 * dismisses itself; others leave after `duration` ms, paused while hovered or focused.
 *   showToast('#toasts', { title: 'Report saved', body: 'It is in Reports.', action: { label: 'Undo', onClick } })
 */
export function showToast(region, { title, body, action, duration = 6000 } = {}) {
  const host = typeof region === 'string' ? document.querySelector(region) : region;
  if (!host) throw new Error('showToast: no .flint-toast-region found');
  const toast = document.createElement('div');
  toast.className = 'flint-toast';
  const t = document.createElement('p'); t.className = 'flint-toast__title'; t.textContent = title || '';
  toast.append(t);
  if (body) { const b = document.createElement('p'); b.className = 'flint-toast__body'; b.textContent = body; toast.append(b); }
  if (action) {
    const row = document.createElement('div'); row.className = 'flint-toast__actions';
    const a = document.createElement('button'); a.type = 'button'; a.className = 'flint-toast__action'; a.textContent = action.label;
    a.addEventListener('click', () => { action.onClick?.(); remove(); });
    row.append(a); toast.append(row);
  }
  const close = document.createElement('button');
  close.type = 'button'; close.className = 'flint-toast__close'; close.setAttribute('aria-label', `Dismiss: ${title}`); close.innerHTML = closeIcon;
  close.addEventListener('click', () => remove());
  toast.append(close);
  let timer;
  const remove = () => { clearTimeout(timer); toast.remove(); };
  const start = () => { if (!action && duration > 0) timer = setTimeout(remove, duration); };
  const pause = () => clearTimeout(timer);
  toast.addEventListener('pointerenter', pause); toast.addEventListener('pointerleave', start);
  toast.addEventListener('focusin', pause); toast.addEventListener('focusout', start);
  host.append(toast);
  start();
  return { element: toast, dismiss: remove };
}

/** Wire up everything in `root`. */
export function initAll(root = document) {
  initDialogs(root);
  initTabs(root);
  initMenus(root);
  initTooltips(root);
}
