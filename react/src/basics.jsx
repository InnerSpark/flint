// Flint React, part 1: components that only render the components.css classes. No styles of their own,
// no behavior beyond what HTML gives. Every prop not listed passes through to the underlying element.
import { Children, cloneElement, createContext, isValidElement, useContext, useEffect, useId, useRef } from 'react';

const cx = (...parts) => parts.filter(Boolean).join(' ');
const svgProps = { viewBox: '0 0 20 20', 'aria-hidden': 'true', focusable: 'false' };
const ring = (d) => (
  <svg {...svgProps}>
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const icons = {
  info: ring('M10 9v5M10 6.2v.01'),
  success: ring('M6.5 10.5l2.5 2.5 4.5-5'),
  warning: (
    <svg {...svgProps}><path d="M10 2.5l8 14.5H2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M10 8v4M10 14.6v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  ),
  error: ring('M7 7l6 6M13 7l-6 6'),
  close: <svg {...svgProps}><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
};

/** variant: primary | secondary | danger | text. busy keeps the button focusable and blocks the click. */
export function Button({ variant = 'primary', size, iconOnly, busy, disabledFocusable, className, onClick, type = 'button', ...props }) {
  const off = busy || disabledFocusable;
  return (
    <button
      type={type}
      className={cx('flint-btn', `flint-btn--${variant}`, size === 'sm' && 'flint-btn--sm', iconOnly && 'flint-btn--icon', className)}
      aria-busy={busy || undefined}
      aria-disabled={off || undefined}
      onClick={off ? (e) => e.preventDefault() : onClick}
      {...props}
    />
  );
}

/** Always underlined. standalone: on its own line, 600 weight, 24px tall. */
export function Link({ standalone, className, children, target, ...props }) {
  return (
    <a className={cx('flint-link', standalone && 'flint-link--standalone', className)} target={target} {...props}>
      {children}
      {target === '_blank' && <span className="flint-sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/**
 * A visible label, "(required)" in words, helper text and an error, wired to the one control inside:
 * the control gets the id, aria-describedby, aria-invalid and required.
 */
export function Field({ label, helper, error, required, className, children, id: idProp }) {
  const auto = useId();
  const id = idProp || `flint-field-${auto}`;
  const helpId = helper ? `${id}-help` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const control = Children.only(children);
  const describedBy = [errId, helpId, control.props['aria-describedby']].filter(Boolean).join(' ') || undefined;
  return (
      <div className={cx('flint-field', className)}>
        <label className="flint-field__label" htmlFor={id}>
          {label}{required && <span className="flint-field__required"> (required)</span>}
        </label>
        {isValidElement(control) && cloneElement(control, { id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : control.props['aria-invalid'], required: required || control.props.required })}
        {helper && <span className="flint-field__helper" id={helpId}>{helper}</span>}
        {error && <span className="flint-field__error" id={errId}>{icons.error}{error}</span>}
      </div>
  );
}

export const Input = ({ className, ...props }) => <input className={cx('flint-input', className)} {...props} />;
export const Textarea = ({ className, rows = 3, ...props }) => <textarea className={cx('flint-input', className)} rows={rows} {...props} />;
export const Select = ({ className, ...props }) => <select className={cx('flint-select', className)} {...props} />;

/** A checkbox with its label. indeterminate shows a bar and is announced as mixed. */
export function Checkbox({ label, indeterminate, className, ...props }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return <label className={cx('flint-choice', className)}><input ref={ref} type="checkbox" className="flint-check" {...props} /> {label}</label>;
}

/** One radio with its label. Group them in a RadioGroup so they share a name and a legend. */
export function Radio({ label, className, ...props }) {
  const group = useContext(RadioContext);
  return <label className={cx('flint-choice', className)}><input type="radio" className="flint-radio" name={group?.name} {...props} /> {label}</label>;
}
const RadioContext = createContext(null);
export function RadioGroup({ legend, name, className, children, ...props }) {
  const auto = useId();
  return (
    <RadioContext.Provider value={{ name: name || `flint-radio-${auto}` }}>
      <fieldset className={cx('flint-fieldset', className)} {...props}>
        <legend className="flint-fieldset__legend">{legend}</legend>
        {children}
      </fieldset>
    </RadioContext.Provider>
  );
}

/** On/off that takes effect at once. The label names the setting, not the state. */
export const Switch = ({ label, className, ...props }) => (
  <label className={cx('flint-choice', className)}><input type="checkbox" role="switch" className="flint-switch" {...props} /> {label}</label>
);

/** intent: neutral | success | warning | error | info */
export const Badge = ({ intent = 'neutral', className, ...props }) => (
  <span className={cx('flint-badge', intent !== 'neutral' && `flint-badge--${intent}`, className)} {...props} />
);

/** onRemove adds a remove button named after the chip ("Remove WCAG 2.2 AA"). */
export function Chip({ intent = 'neutral', outlined, onRemove, removeLabel, className, children, ...props }) {
  return (
    <span className={cx('flint-chip', intent !== 'neutral' && `flint-chip--${intent}`, outlined && 'flint-chip--outlined', className)} {...props}>
      {children}
      {onRemove && <button type="button" className="flint-chip__remove" aria-label={removeLabel || `Remove ${typeof children === 'string' ? children : ''}`.trim()} onClick={onRemove}>{icons.close}</button>}
    </span>
  );
}

/**
 * intent: info | success | warning | error. A static message gets no role; pass role="status" when it
 * appears after an action, or role="alert" for an error that needs attention now.
 */
export function Alert({ intent = 'info', title, icon, className, children, ...props }) {
  return (
    <div className={cx('flint-alert', intent !== 'info' && `flint-alert--${intent}`, className)} {...props}>
      {icon === undefined ? icons[intent] : icon}
      {title && <p className="flint-alert__title">{title}</p>}
      <div className="flint-alert__body">{children}</div>
    </div>
  );
}

/** First thing in the page. Moves focus to the target (give it tabindex="-1"), not just the scroll. */
export function SkipLink({ href = '#main', children = 'Skip to content', className, ...props }) {
  return (
    <a
      href={href}
      className={cx('flint-skip-link', className)}
      onClick={(e) => {
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus();
        history.pushState(null, '', href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

/** Wraps an svg's contents. label makes it meaningful (role="img"); without one it is decorative. */
export function Icon({ size = 'md', muted, label, className, children, viewBox = '0 0 20 20', ...props }) {
  return (
    <svg
      className={cx('flint-icon', size !== 'md' && `flint-icon--${size}`, muted && 'flint-icon--muted', className)}
      viewBox={viewBox}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true', focusable: 'false' })}
      {...props}
    >
      {children}
    </svg>
  );
}
