import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as useStudyStore, f as SUBJECTS, o as Route$4, u as useSet } from "./router-DG_-w2tf.mjs";
import { n as Button, t as AppShell } from "./app-shell-BP9Jai7z.mjs";
import { n as Textarea, t as Input } from "./input-BT4dNZ54.mjs";
import { i as Label, n as GenerateDialog, r as ImportDialog, t as CardEditor } from "./import-dialog-CgYci-1k.mjs";
import { t as EmptyState } from "./empty-state-DtnF40uE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sets._setId.edit-XAXOmPQW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditPage() {
	const { setId } = Route$4.useParams();
	const studySet = useSet(setId);
	const navigate = useNavigate();
	const updateSetMeta = useStudyStore((s) => s.updateSetMeta);
	const replaceCards = useStudyStore((s) => s.replaceCards);
	const [title, setTitle] = (0, import_react.useState)(studySet?.title ?? "");
	const [description, setDescription] = (0, import_react.useState)(studySet?.description ?? "");
	const [subject, setSubject] = (0, import_react.useState)(studySet?.subject ?? "Genel");
	const [cards, setCards] = (0, import_react.useState)(studySet?.cards.map((c) => ({
		id: c.id,
		term: c.term,
		definition: c.definition
	})) ?? []);
	(0, import_react.useEffect)(() => {
		if (!studySet) return;
		setTitle(studySet.title);
		setDescription(studySet.description);
		setSubject(studySet.subject);
		setCards(studySet.cards.map((c) => ({
			id: c.id,
			term: c.term,
			definition: c.definition
		})));
	}, [studySet]);
	if (!studySet) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Set bulunamadı",
		description: "Düzenlenecek bir set yok.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Kütüphaneye dön"
			})
		})
	}) });
	function save() {
		const filled = cards.filter((c) => c.term.trim() && c.definition.trim());
		if (!title.trim()) {
			toast.error("Başlık gerekli.");
			return;
		}
		if (filled.length < 2) {
			toast.error("En az iki kart ekle.");
			return;
		}
		updateSetMeta(setId, {
			title,
			description,
			subject
		});
		replaceCards(setId, filled);
		toast.success("Değişiklikler kaydedildi.");
		navigate({
			to: "/sets/$setId",
			params: { setId }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-muted",
				children: "Düzenle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-medium tracking-tight",
				children: studySet.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenerateDialog, { onGenerated: (generated) => {
					setTitle(generated.title);
					setDescription(generated.description ?? "");
					setSubject(generated.subject || subject);
					setCards(generated.cards.map((card) => ({
						id: crypto.randomUUID(),
						term: card.term,
						definition: card.definition
					})));
				} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportDialog, { onImport: (incoming) => setCards((prev) => [...prev.filter((c) => c.term || c.definition), ...incoming]) })]
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
							onChange: (e) => setTitle(e.target.value)
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
							onChange: (e) => setDescription(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: SUBJECTS.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: subject === name ? "default" : "secondary",
							onClick: () => setSubject(name),
							children: name
						}, name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardEditor, {
						cards,
						onChange: setCards
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky bottom-4 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/sets/$setId",
								params: { setId },
								children: "Vazgeç"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							children: "Kaydet"
						})]
					})
				]
			})
		]
	}) });
}
//#endregion
export { EditPage as component };
