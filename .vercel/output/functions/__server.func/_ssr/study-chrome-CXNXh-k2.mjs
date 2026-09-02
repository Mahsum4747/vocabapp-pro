import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as Progress } from "./progress-B4zdsnB8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/study-chrome-CXNXh-k2.js
var import_jsx_runtime = require_jsx_runtime();
function StudyChrome({ setId, title, mode, index, total, headerRight, children }) {
	const pct = total === 0 ? 0 : Math.round(index / total * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border/80",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-16 max-w-4xl items-center gap-3 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/sets/$setId",
						params: { setId },
						className: "inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg",
						"aria-label": "Sete dön",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [mode, total > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [
									" ",
									"· ",
									Math.min(index + 1, total),
									" / ",
									total
								]
							}) : null]
						})]
					}),
					headerRight
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: pct,
				className: "h-1 rounded-none"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto w-full max-w-4xl px-4 py-8",
			children
		})]
	});
}
//#endregion
export { StudyChrome as t };
