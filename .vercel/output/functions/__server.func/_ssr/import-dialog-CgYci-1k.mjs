import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime, d as DialogContent$1, f as DialogOverlay, h as DialogTrigger$1, l as Dialog$1, m as DialogTitle, p as DialogPortal, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as object, i as number, o as string, t as _enum } from "../_libs/zod.mjs";
import { a as Sparkles, c as Plus, m as FileUp, r as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as cn } from "./router-DG_-w2tf.mjs";
import { n as Button } from "./app-shell-BP9Jai7z.mjs";
import { n as Textarea, t as Input } from "./input-BT4dNZ54.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as parseCardText } from "./parse-cards-DMzz__XO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-dialog-CgYci-1k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium text-fg", className),
		...props
	});
}
function CardEditor({ cards, onChange }) {
	function update(id, patch) {
		onChange(cards.map((card) => card.id === id ? {
			...card,
			...patch
		} : card));
	}
	function remove(id) {
		onChange(cards.length <= 1 ? cards : cards.filter((card) => card.id !== id));
	}
	function add() {
		onChange([...cards, {
			id: crypto.randomUUID(),
			term: "",
			definition: ""
		}]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [cards.map((card, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium text-muted tabular-nums",
					children: index + 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon-sm",
					onClick: () => remove(card.id),
					"aria-label": "Kartı sil",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `term-${card.id}`,
						children: "Terim"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `term-${card.id}`,
						value: card.term,
						onChange: (e) => update(card.id, { term: e.target.value }),
						placeholder: "ör. mitokondri"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `def-${card.id}`,
						children: "Tanım"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: `def-${card.id}`,
						value: card.definition,
						onChange: (e) => update(card.id, { definition: e.target.value }),
						placeholder: "Kısa, net bir tanım",
						className: "min-h-11 md:min-h-20"
					})]
				})]
			})]
		}, card.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "outline",
			className: "w-full",
			onClick: add,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Kart ekle"]
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var inputSchema = object({
	topic: string().trim().min(2).max(200),
	count: number().int().min(6).max(20),
	language: _enum([
		"tr",
		"en",
		"mixed"
	])
});
var generateStudySet = createServerFn({ method: "POST" }).validator((input) => inputSchema.parse(input)).handler(createSsrRpc("332b9b5ce4684d975fbeea4c3c21b16d9906be4cfd882c2c56bbe08063d3bcb5"));
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
function DialogContent({ className, children, title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-fg/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-6 shadow-[var(--shadow-card)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "pr-8 font-display text-xl font-medium tracking-tight",
				children: title
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
				className: "absolute top-4 right-4 rounded-md p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Kapat"
				})]
			})
		]
	})] });
}
var LANGS = [
	{
		id: "tr",
		label: "Türkçe"
	},
	{
		id: "en",
		label: "English"
	},
	{
		id: "mixed",
		label: "EN terim / TR tanım"
	}
];
function GenerateDialog({ onGenerated, forceOpen = 0 }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [topic, setTopic] = (0, import_react.useState)("");
	const [count, setCount] = (0, import_react.useState)(12);
	const [language, setLanguage] = (0, import_react.useState)("tr");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (forceOpen > 0) setOpen(true);
	}, [forceOpen]);
	async function run() {
		if (topic.trim().length < 2) {
			toast.error("Bir konu yaz.");
			return;
		}
		setLoading(true);
		try {
			const result = await generateStudySet({ data: {
				topic: topic.trim(),
				count,
				language
			} });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			onGenerated(result.set);
			setOpen(false);
			toast.success("Set hazır, kartları gözden geçir.");
		} catch {
			toast.error("Bir şeyler ters gitti.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), "Konudan oluştur"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			title: "Konudan set oluştur",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Bir konu yaz, kartlar senin için doldurulsun. Kaydetmeden önce düzenleyebilirsin."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "topic",
						children: "Konu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "topic",
						value: topic,
						onChange: (e) => setTopic(e.target.value),
						placeholder: "ör. Osmanlı padişahları, A2 fiiller, CSS flexbox",
						onKeyDown: (e) => {
							if (e.key === "Enter") run();
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						htmlFor: "count",
						children: ["Kart sayısı · ", count]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "count",
						type: "range",
						min: 6,
						max: 20,
						value: count,
						onChange: (e) => setCount(Number(e.target.value)),
						className: "w-full accent-primary"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: LANGS.map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: language === lang.id ? "default" : "secondary",
						onClick: () => setLanguage(lang.id),
						children: lang.label
					}, lang.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					className: "w-full",
					onClick: () => void run(),
					disabled: loading,
					children: loading ? "Hazırlanıyor…" : "Oluştur"
				})
			]
		})]
	});
}
function ImportDialog({ onImport }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)("");
	function apply() {
		const parsed = parseCardText(text);
		if (parsed.length === 0) {
			toast.error("Satır bulunamadı.");
			return;
		}
		onImport(parsed.map((card) => ({
			id: crypto.randomUUID(),
			...card
		})));
		setOpen(false);
		toast.success(`${parsed.length} kart eklendi.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, {}), "Yapıştır"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			title: "Kartları yapıştır",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Her satır bir kart. Quizlet dışa aktarımı gibi sekme ile, veya",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-fg",
							children: "terim - tanım"
						}),
						" yaz."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "mitokondri	Hücrenin enerji santrali\nanyway - her neyse",
					className: "min-h-40 font-mono text-sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					className: "w-full",
					onClick: apply,
					children: "Kartlara ekle"
				})
			]
		})]
	});
}
//#endregion
export { Label as i, GenerateDialog as n, ImportDialog as r, CardEditor as t };
