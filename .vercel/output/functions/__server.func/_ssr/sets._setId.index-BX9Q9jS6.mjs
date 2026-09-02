import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as ArrowLeft, d as LayoutGrid, f as Layers, g as Download, h as Ellipsis, i as Star, l as Pencil, p as GraduationCap, r as Trash2, u as ListChecks } from "../_libs/lucide-react.mjs";
import { a as Trigger, i as Root2$1, n as Item2, r as Portal2$1, t as Content2$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as useStudyStore, m as cn, s as Route$5, u as useSet } from "./router-DG_-w2tf.mjs";
import { n as Button, r as buttonVariants, t as AppShell } from "./app-shell-BP9Jai7z.mjs";
import { n as serializeSetExport } from "./parse-cards-DMzz__XO.mjs";
import { t as EmptyState } from "./empty-state-DtnF40uE.mjs";
import { n as masteryPercent } from "./quiz-BoAiW--t.mjs";
import { t as Badge } from "./badge-CHOQmNa4.mjs";
import { t as Progress } from "./progress-B4zdsnB8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sets._setId.index-BX9Q9jS6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODES = [
	{
		to: "/sets/$setId/flashcards",
		title: "Kartlar",
		copy: "Çevir, yıldızla, kendi hızında tekrarla.",
		icon: Layers
	},
	{
		to: "/sets/$setId/learn",
		title: "Öğren",
		copy: "Seçmeli ve yazılı sorularla pekiştir.",
		icon: GraduationCap
	},
	{
		to: "/sets/$setId/test",
		title: "Test",
		copy: "Karışık soru tipleriyle kendini ölç.",
		icon: ListChecks
	},
	{
		to: "/sets/$setId/match",
		title: "Eşleştir",
		copy: "Terim ve tanımı hızla yakala.",
		icon: LayoutGrid
	}
];
function ModeGrid({ setId, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: MODES.map((mode) => {
			const Icon = mode.icon;
			const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 place-items-center rounded-md bg-surface-2 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-display text-lg font-medium tracking-tight",
				children: mode.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-sm text-muted",
				children: mode.copy
			})] })] });
			if (disabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-start gap-4 rounded-xl bg-surface p-5 opacity-50 shadow-[var(--shadow-border)]",
				children: inner
			}, mode.title);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: mode.to,
				params: { setId },
				className: "flex items-start gap-4 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-smooth-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]",
				children: inner
			}, mode.title);
		})
	});
}
var AlertDialog = Root2;
function AlertDialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Portal2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, { className: "fixed inset-0 z-50 bg-fg/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-6 shadow-[var(--shadow-card)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out", className),
		...props,
		children
	})] });
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
		className: cn("mt-2 text-sm text-muted", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-6 flex justify-end gap-2", className),
		...props
	});
}
function AlertDialogCancel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
		className: cn(buttonVariants({ variant: "ghost" }), className),
		...props
	});
}
function AlertDialogAction({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
		className: cn(buttonVariants({ variant: "danger" }), className),
		...props
	});
}
var DropdownMenu = Root2$1;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2$1, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		sideOffset,
		className: cn("z-50 min-w-44 overflow-hidden rounded-lg bg-surface p-1 shadow-[var(--shadow-card)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props
	}) });
}
function DropdownMenuItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none select-none focus:bg-surface-2 data-disabled:pointer-events-none data-disabled:opacity-40", className),
		...props
	});
}
function SetPage() {
	const { setId } = Route$5.useParams();
	const studySet = useSet(setId);
	const navigate = useNavigate();
	const deleteSet = useStudyStore((s) => s.deleteSet);
	const toggleStar = useStudyStore((s) => s.toggleStar);
	const resetMastery = useStudyStore((s) => s.resetMastery);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	if (!studySet) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Set bulunamadı",
		description: "Silinmiş veya bu cihazda yok.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Kütüphaneye dön"
			})
		})
	}) });
	const mastery = masteryPercent(studySet.cards);
	const starred = studySet.cards.filter((c) => c.starred).length;
	function exportJson() {
		const blob = new Blob([serializeSetExport(studySet)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${studySet.title.replace(/\s+/g, "-").toLowerCase()}.karta.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Set indirildi.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			className: "inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Kütüphane"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: studySet.subject }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted tabular-nums",
								children: [studySet.cards.length, " kart"]
							}),
							starred > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-fg" }), starred]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl font-medium tracking-tight",
						children: studySet.title
					}),
					studySet.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-muted",
						children: studySet.description
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 max-w-sm space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ustalık" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [mastery, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: mastery })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/sets/$setId/edit",
						params: { setId },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {}), "Düzenle"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Diğer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onSelect: exportJson,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Dışa aktar"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
							onSelect: () => {
								resetMastery(setId);
								toast.success("İlerleme sıfırlandı.");
							},
							children: "İlerlemeyi sıfırla"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							className: "text-danger",
							onSelect: () => setConfirmDelete(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Sil"]
						})
					]
				})] })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 mb-4 font-display text-2xl font-medium tracking-tight",
			children: "Çalış"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeGrid, {
			setId,
			disabled: studySet.cards.length < 2
		}),
		studySet.cards.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Çalışmak için en az iki kart gerekir."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-12 mb-4 font-display text-2xl font-medium tracking-tight",
			children: "Kartlar"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
			children: studySet.cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3 px-4 py-3 md:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => toggleStar(setId, card.id),
					className: "mt-0.5 grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg",
					"aria-label": card.starred ? "Yıldızı kaldır" : "Yıldızla",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: card.starred ? "size-4 fill-fg text-fg" : "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid min-w-0 flex-1 gap-1 md:grid-cols-2 md:gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: card.term
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted md:text-base",
						children: card.definition
					})]
				})]
			}, card.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: confirmDelete,
			onOpenChange: setConfirmDelete,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Set silinsin mi?" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [studySet.title, " kalıcı olarak kalkar. Bu işlem geri alınamaz."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Vazgeç" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => {
						deleteSet(setId);
						toast.success("Set silindi.");
						navigate({ to: "/" });
					},
					children: "Sil"
				})] })
			] })
		})
	] });
}
//#endregion
export { SetPage as component };
