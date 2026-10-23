export function initDialogs(root?: ParentNode): void;
export function initTabs(root?: ParentNode): void;
export function initMenus(root?: ParentNode): void;
export function initTooltips(root?: ParentNode): void;
export function initAll(root?: ParentNode): void;
export interface ToastOptions {
  title: string;
  body?: string;
  /** A toast with an action never dismisses itself. */
  action?: { label: string; onClick?: () => void };
  /** Milliseconds before a toast without an action leaves. 0 keeps it. Default 6000. */
  duration?: number;
}
export function showToast(region: string | Element, options: ToastOptions): { element: HTMLElement; dismiss: () => void };
