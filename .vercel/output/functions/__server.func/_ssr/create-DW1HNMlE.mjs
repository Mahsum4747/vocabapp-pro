import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Route$7, d as useStudyStore, f as SUBJECTS } from "./router-DG_-w2tf.mjs";
import { n as Button, t as AppShell } from "./app-shell-BP9Jai7z.mjs";
import { n as Textarea, t as Input } from "./input-BT4dNZ54.mjs";
import { i as Label, n as GenerateDialog, r as ImportDialog, t as CardEditor } from "./import-dialog-CgYci-1k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-DW1HNMlE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function blankCards() {
	return [
		{
			id: crypto.randomUUID(),
			term: "",
			definition: ""
		},
		{
			id: crypto.randomUUID(),
			term: "",
			definition: ""
		},
		{
			id: crypto.randomUUID(),
			term: "",
			definition: ""
		}
	];
}
function CreatePage() {
	const { ai } = Route$7.useSearch();
	const navigate = useNavigate();
	const addSet = useStudyStore((s) => s.addSet);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("Genel");
	const [cards, setCards] = (0, import_react.useState)(blankCards);
	const [aiOpenSignal, setAiOpenSignal] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (ai) setAiOpenSignal((n) => n + 1);
	}, [ai]);
	function save() {
		const filled = cards.filter((c) => c.term.trim() && c.definition.trim());
		if (!title.trim()) {
			toast.error("Set için bir başlık yaz.");
			return;
		}
		if (filled.length < 2) {
			toast.error("En az iki kart ekle.");
			return;
		}
		const id = addSet({
			title,
			description,
			subject,
			cards: filled
		});
		toast.success("Set kaydedildi.");
		navigate({
			to: "/sets/$setId",
			params: { setId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted",
				children: "Yeni set"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-medium tracking-tight",
				children: "Kartlarını yaz"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Elle ekle, metin yapıştır veya bir konudan otomatik doldur."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenerateDialog, {
					forceOpen: aiOpenSignal,
					onGenerated: (generated) => {
						setTitle(generated.title);
						setDescription(generated.description ?? "");
						setSubject(generated.subject || "Genel");
						setCards(generated.cards.map((card) => ({
							id: crypto.randomUUID(),
							term: card.term,
							definition: card.definition
						})));
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportDialog, { onImport: (incoming) => setCards((prev) => [...prev.filter((c) => c.term || c.definition), ...incoming]) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-6",
				onSubmit: (e) => {
					e.preventDefault();
					save();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "title",
							children: "Başlık"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "title",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "ör. Avrupa başkentleri"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "desc",
							children: "Açıklama"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "desc",
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: "Bu set ne işe yarar?"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Konu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: SUBJECTS.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: subject === name ? "default" : "secondary",
								onClick: () => setSubject(name),
								children: name
							}, name))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardEditor, {
						cards,
						onChange: setCards
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sticky bottom-4 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							children: "Seti kaydet"
						})
					})
				]
			})
		]
	}) });
}
//#endregion
export { CreatePage as component };
