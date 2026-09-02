import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as Sparkles, c as Plus, f as Layers, s as Search } from "../_libs/lucide-react.mjs";
import { d as useStudyStore, f as SUBJECTS } from "./router-DG_-w2tf.mjs";
import { n as Button, t as AppShell } from "./app-shell-BP9Jai7z.mjs";
import { t as Input } from "./input-BT4dNZ54.mjs";
import { t as EmptyState } from "./empty-state-DtnF40uE.mjs";
import { n as masteryPercent } from "./quiz-BoAiW--t.mjs";
import { t as Badge } from "./badge-CHOQmNa4.mjs";
import { t as Progress } from "./progress-B4zdsnB8.mjs";
import { n as formatDistanceToNow, t as tr } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes--bmJFQVd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SetCard({ set }) {
	const mastery = masteryPercent(set.cards);
	const when = set.lastStudiedAt ? formatDistanceToNow(set.lastStudiedAt, {
		addSuffix: true,
		locale: tr
	}) : "Henüz çalışılmadı";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/sets/$setId",
		params: { setId: set.id },
		className: "group flex flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-smooth-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: set.subject }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-xs text-muted tabular-nums",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5" }),
						set.cards.length,
						" kart"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-display text-xl font-medium tracking-tight group-hover:text-primary",
				children: set.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-2 min-h-10 text-sm text-muted",
				children: set.description || "Açıklama yok"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "İlerleme" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums",
						children: [mastery, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: mastery })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-subtle",
				children: when
			})
		]
	});
}
function Home() {
	const sets = useStudyStore((s) => s.sets);
	const restoreSeeds = useStudyStore((s) => s.restoreSeeds);
	const [query, setQuery] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("Hepsi");
	const continueSet = (0, import_react.useMemo)(() => {
		return [...sets].filter((s) => s.lastStudiedAt).sort((a, b) => (b.lastStudiedAt ?? 0) - (a.lastStudiedAt ?? 0))[0];
	}, [sets]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLocaleLowerCase("tr");
		return sets.filter((set) => {
			if (subject !== "Hepsi" && set.subject !== subject) return false;
			if (!q) return true;
			return set.title.toLocaleLowerCase("tr").includes(q) || set.description.toLocaleLowerCase("tr").includes(q) || set.subject.toLocaleLowerCase("tr").includes(q) || set.cards.some((card) => card.term.toLocaleLowerCase("tr").includes(q) || card.definition.toLocaleLowerCase("tr").includes(q));
		});
	}, [
		sets,
		query,
		subject
	]);
	const subjects = ["Hepsi", ...SUBJECTS.filter((name) => sets.some((s) => s.subject === name))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "stagger-in",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted",
					children: "Kişisel kütüphane"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 max-w-xl font-display text-4xl font-medium tracking-tight md:text-5xl",
					children: "Bugün ne çalışacaksın?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-lg text-muted",
					children: "Kart çevir, öğren, test et, eşleştir. Setlerin bu cihazda kalır."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/create",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Yeni set"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/create",
							search: { ai: true },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), "Konudan oluştur"]
						})
					})]
				})
			]
		}),
		continueSet ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/sets/$setId",
			params: { setId: continueSet.id },
			className: "mt-10 flex flex-col justify-between gap-4 rounded-2xl bg-primary p-6 text-primary-fg shadow-[var(--shadow-card)] md:flex-row md:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-primary-fg/70 uppercase",
					children: "Kaldığın yer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-2xl font-medium tracking-tight",
					children: continueSet.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-primary-fg/75",
					children: [
						continueSet.cards.length,
						" kart · %",
						masteryPercent(continueSet.cards),
						" ilerleme"
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex h-11 items-center rounded-md bg-primary-fg px-4 text-sm font-medium text-primary",
				children: "Devam et"
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-medium tracking-tight",
				children: "Kütüphane"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full md:max-w-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Set veya kart ara",
					className: "pl-10",
					"aria-label": "Ara"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex gap-2 overflow-x-auto pb-1",
			children: subjects.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setSubject(name),
				className: "shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: subject === name ? "primary" : "muted",
					children: name
				})
			}, name))
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: sets.length === 0 ? "Kütüphane boş" : "Sonuç yok",
				description: sets.length === 0 ? "İlk setini oluştur veya örnek setleri geri yükle." : "Aramayı veya konuyu değiştir.",
				action: sets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/create",
							children: "Set oluştur"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => restoreSeeds(),
						children: "Örnekleri yükle"
					})]
				}) : void 0
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: filtered.map((set) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetCard, { set }, set.id))
		})
	] });
}
//#endregion
export { Home as component };
