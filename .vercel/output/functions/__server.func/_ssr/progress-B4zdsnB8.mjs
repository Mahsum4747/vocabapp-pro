import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { m as cn } from "./router-DG_-w2tf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-B4zdsnB8.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ value, className }) {
	const clamped = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className),
		role: "progressbar",
		"aria-valuenow": clamped,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-primary transition-[width] duration-200 ease-[var(--ease-smooth-out)]",
			style: { width: `${clamped}%` }
		})
	});
}
//#endregion
export { Progress as t };
