// @innerspark/flint/react. Built from react/src by react/build.mjs. Do not edit.

// src/basics.jsx
import { Children, cloneElement, createContext, isValidElement, useContext, useEffect, useId, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var cx = (...parts) => parts.filter(Boolean).join(" ");
var svgProps = { viewBox: "0 0 20 20", "aria-hidden": "true", focusable: "false" };
var ring = (d) => /* @__PURE__ */ jsxs("svg", { ...svgProps, children: [
  /* @__PURE__ */ jsx("circle", { cx: "10", cy: "10", r: "8", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
  /* @__PURE__ */ jsx("path", { d, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
] });
var icons = {
  info: ring("M10 9v5M10 6.2v.01"),
  success: ring("M6.5 10.5l2.5 2.5 4.5-5"),
  warning: /* @__PURE__ */ jsxs("svg", { ...svgProps, children: [
    /* @__PURE__ */ jsx("path", { d: "M10 2.5l8 14.5H2z", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M10 8v4M10 14.6v.01", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
  ] }),
  error: ring("M7 7l6 6M13 7l-6 6"),
  close: /* @__PURE__ */ jsx("svg", { ...svgProps, children: /* @__PURE__ */ jsx("path", { d: "M6 6l8 8M14 6l-8 8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
};
function Button({ variant = "primary", size, iconOnly, busy, disabledFocusable, className, onClick, type = "button", ...props }) {
  const off = busy || disabledFocusable;
  return /* @__PURE__ */ jsx(
    "button",
    {
      type,
      className: cx("flint-btn", `flint-btn--${variant}`, size === "sm" && "flint-btn--sm", iconOnly && "flint-btn--icon", className),
      "aria-busy": busy || void 0,
      "aria-disabled": off || void 0,
      onClick: off ? (e) => e.preventDefault() : onClick,
      ...props
    }
  );
}
function Link({ standalone, className, children, target, ...props }) {
  return /* @__PURE__ */ jsxs("a", { className: cx("flint-link", standalone && "flint-link--standalone", className), target, ...props, children: [
    children,
    target === "_blank" && /* @__PURE__ */ jsx("span", { className: "flint-sr-only", children: " (opens in a new tab)" })
  ] });
}
function Field({ label, helper, error, required, className, children, id: idProp }) {
  const auto = useId();
  const id = idProp || `flint-field-${auto}`;
  const helpId = helper ? `${id}-help` : void 0;
  const errId = error ? `${id}-error` : void 0;
  const control = Children.only(children);
  const describedBy = [errId, helpId, control.props["aria-describedby"]].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxs("div", { className: cx("flint-field", className), children: [
    /* @__PURE__ */ jsxs("label", { className: "flint-field__label", htmlFor: id, children: [
      label,
      required && /* @__PURE__ */ jsx("span", { className: "flint-field__required", children: " (required)" })
    ] }),
    isValidElement(control) && cloneElement(control, { id, "aria-describedby": describedBy, "aria-invalid": error ? true : control.props["aria-invalid"], required: required || control.props.required }),
    helper && /* @__PURE__ */ jsx("span", { className: "flint-field__helper", id: helpId, children: helper }),
    error && /* @__PURE__ */ jsxs("span", { className: "flint-field__error", id: errId, children: [
      icons.error,
      error
    ] })
  ] });
}
var Input = ({ className, ...props }) => /* @__PURE__ */ jsx("input", { className: cx("flint-input", className), ...props });
var Textarea = ({ className, rows = 3, ...props }) => /* @__PURE__ */ jsx("textarea", { className: cx("flint-input", className), rows, ...props });
var Select = ({ className, ...props }) => /* @__PURE__ */ jsx("select", { className: cx("flint-select", className), ...props });
function Checkbox({ label, indeterminate, className, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return /* @__PURE__ */ jsxs("label", { className: cx("flint-choice", className), children: [
    /* @__PURE__ */ jsx("input", { ref, type: "checkbox", className: "flint-check", ...props }),
    " ",
    label
  ] });
}
function Radio({ label, className, ...props }) {
  const group = useContext(RadioContext);
  return /* @__PURE__ */ jsxs("label", { className: cx("flint-choice", className), children: [
    /* @__PURE__ */ jsx("input", { type: "radio", className: "flint-radio", name: group?.name, ...props }),
    " ",
    label
  ] });
}
var RadioContext = createContext(null);
function RadioGroup({ legend, name, className, children, ...props }) {
  const auto = useId();
  return /* @__PURE__ */ jsx(RadioContext.Provider, { value: { name: name || `flint-radio-${auto}` }, children: /* @__PURE__ */ jsxs("fieldset", { className: cx("flint-fieldset", className), ...props, children: [
    /* @__PURE__ */ jsx("legend", { className: "flint-fieldset__legend", children: legend }),
    children
  ] }) });
}
var Switch = ({ label, className, ...props }) => /* @__PURE__ */ jsxs("label", { className: cx("flint-choice", className), children: [
  /* @__PURE__ */ jsx("input", { type: "checkbox", role: "switch", className: "flint-switch", ...props }),
  " ",
  label
] });
var Badge = ({ intent = "neutral", className, ...props }) => /* @__PURE__ */ jsx("span", { className: cx("flint-badge", intent !== "neutral" && `flint-badge--${intent}`, className), ...props });
function Chip({ intent = "neutral", outlined, onRemove, removeLabel, className, children, ...props }) {
  return /* @__PURE__ */ jsxs("span", { className: cx("flint-chip", intent !== "neutral" && `flint-chip--${intent}`, outlined && "flint-chip--outlined", className), ...props, children: [
    children,
    onRemove && /* @__PURE__ */ jsx("button", { type: "button", className: "flint-chip__remove", "aria-label": removeLabel || `Remove ${typeof children === "string" ? children : ""}`.trim(), onClick: onRemove, children: icons.close })
  ] });
}
function Alert({ intent = "info", title, icon, className, children, ...props }) {
  return /* @__PURE__ */ jsxs("div", { className: cx("flint-alert", intent !== "info" && `flint-alert--${intent}`, className), ...props, children: [
    icon === void 0 ? icons[intent] : icon,
    title && /* @__PURE__ */ jsx("p", { className: "flint-alert__title", children: title }),
    /* @__PURE__ */ jsx("div", { className: "flint-alert__body", children })
  ] });
}
function SkipLink({ href = "#main", children = "Skip to content", className, ...props }) {
  return /* @__PURE__ */ jsx(
    "a",
    {
      href,
      className: cx("flint-skip-link", className),
      onClick: (e) => {
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus();
        history.pushState(null, "", href);
      },
      ...props,
      children
    }
  );
}
function Icon({ size = "md", muted, label, className, children, viewBox = "0 0 20 20", ...props }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      className: cx("flint-icon", size !== "md" && `flint-icon--${size}`, muted && "flint-icon--muted", className),
      viewBox,
      ...label ? { role: "img", "aria-label": label } : { "aria-hidden": "true", focusable: "false" },
      ...props,
      children
    }
  );
}

// src/overlays.jsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as MenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var cx2 = (...parts) => parts.filter(Boolean).join(" ");
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogClose = DialogPrimitive.Close;
function DialogContent({ title, description, footer, closeLabel = "Close", className, children, ...props }) {
  return /* @__PURE__ */ jsxs2(DialogPrimitive.Portal, { children: [
    /* @__PURE__ */ jsx2(DialogPrimitive.Overlay, { className: "flint-dialog-overlay" }),
    /* @__PURE__ */ jsxs2(DialogPrimitive.Content, { className: cx2("flint-dialog", "flint-dialog--floating", className), ...description ? {} : { "aria-describedby": void 0 }, ...props, children: [
      /* @__PURE__ */ jsxs2("div", { className: "flint-dialog__header", children: [
        /* @__PURE__ */ jsx2(DialogPrimitive.Title, { className: "flint-dialog__title", children: title }),
        /* @__PURE__ */ jsx2(DialogPrimitive.Close, { className: "flint-btn flint-btn--text flint-btn--icon", "aria-label": closeLabel, children: icons.close })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "flint-dialog__body", children: [
        description && /* @__PURE__ */ jsx2(DialogPrimitive.Description, { children: description }),
        children
      ] }),
      footer && /* @__PURE__ */ jsx2("div", { className: "flint-dialog__footer", children: footer })
    ] })
  ] });
}
var Tabs = ({ className, ...props }) => /* @__PURE__ */ jsx2(TabsPrimitive.Root, { className: cx2("flint-tabs", className), ...props });
var TabList = ({ className, ...props }) => /* @__PURE__ */ jsx2(TabsPrimitive.List, { className: cx2("flint-tabs__list", className), ...props });
var Tab = ({ className, ...props }) => /* @__PURE__ */ jsx2(TabsPrimitive.Trigger, { className: cx2("flint-tabs__tab", className), ...props });
var TabPanel = ({ className, ...props }) => /* @__PURE__ */ jsx2(TabsPrimitive.Content, { forceMount: true, className: cx2("flint-tabs__panel", className), ...props });
var Menu = MenuPrimitive.Root;
var MenuTrigger = MenuPrimitive.Trigger;
function MenuContent({ className, sideOffset = 4, align = "start", ...props }) {
  return /* @__PURE__ */ jsx2(MenuPrimitive.Portal, { children: /* @__PURE__ */ jsx2(MenuPrimitive.Content, { sideOffset, align, className: cx2("flint-menu", "flint-menu--floating", className), ...props }) });
}
var MenuItem = ({ danger, className, ...props }) => /* @__PURE__ */ jsx2(MenuPrimitive.Item, { className: cx2("flint-menu__item", danger && "flint-menu__item--danger", className), ...props });
var MenuSeparator = ({ className, ...props }) => /* @__PURE__ */ jsx2(MenuPrimitive.Separator, { className: cx2("flint-menu__separator", className), ...props });
var TooltipProvider = TooltipPrimitive.Provider;
function Tooltip({ content, side = "top", children, ...props }) {
  return /* @__PURE__ */ jsxs2(TooltipPrimitive.Root, { ...props, children: [
    /* @__PURE__ */ jsx2(TooltipPrimitive.Trigger, { asChild: true, children }),
    /* @__PURE__ */ jsx2(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx2(TooltipPrimitive.Content, { side, sideOffset: 8, className: "flint-tooltip flint-tooltip--floating", children: content }) })
  ] });
}
var ToastProvider = ToastPrimitive.Provider;
var ToastRegion = ({ className, ...props }) => /* @__PURE__ */ jsx2(ToastPrimitive.Viewport, { className: cx2("flint-toast-region", className), ...props });
function Toast({ title, description, action, actionAltText, dismissLabel, duration, className, ...props }) {
  return /* @__PURE__ */ jsxs2(ToastPrimitive.Root, { className: cx2("flint-toast", className), duration: action ? Infinity : duration, ...props, children: [
    /* @__PURE__ */ jsx2(ToastPrimitive.Title, { className: "flint-toast__title", children: title }),
    description && /* @__PURE__ */ jsx2(ToastPrimitive.Description, { className: "flint-toast__body", children: description }),
    action && /* @__PURE__ */ jsx2("div", { className: "flint-toast__actions", children: /* @__PURE__ */ jsx2(ToastPrimitive.Action, { className: "flint-toast__action", altText: actionAltText || action.label, onClick: action.onClick, children: action.label }) }),
    /* @__PURE__ */ jsx2(ToastPrimitive.Close, { className: "flint-toast__close", "aria-label": dismissLabel || `Dismiss: ${title}`, children: icons.close })
  ] });
}
export {
  Alert,
  Badge,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Field,
  Icon,
  Input,
  Link,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Radio,
  RadioGroup,
  Select,
  SkipLink,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Toast,
  ToastProvider,
  ToastRegion,
  Tooltip,
  TooltipProvider
};
