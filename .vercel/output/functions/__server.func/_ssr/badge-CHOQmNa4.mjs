import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { m as cn } from "./router-DG_-w2tf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CHOQmNa4.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tone === "muted" && "bg-surface-2 text-muted", tone === "primary" && "bg-primary text-primary-fg", tone === "success" && "bg-success-soft text-success", tone === "danger" && "bg-danger-soft text-danger", className),
		...props
	});
}
//#endregion
export { Badge as t };
