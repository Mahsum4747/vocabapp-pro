import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as Star, o as Shuffle } from "../_libs/lucide-react.mjs";
import { a as Route$3, d as useStudyStore, h as shuffle, m as cn, u as useSet } from "./router-DG_-w2tf.mjs";
import { n as Button, t as AppShell } from "./app-shell-BP9Jai7z.mjs";
import { t as EmptyState } from "./empty-state-DtnF40uE.mjs";
import { t as StudyChrome } from "./study-chrome-CXNXh-k2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sets._setId.flashcards-BiBK1-y6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FlashCard({ term, definition, flipped, onFlip }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flip-scene h-80 w-full md:h-96",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onFlip,
			className: cn("flip-card h-full w-full rounded-2xl", flipped && "is-flipped"),
			"aria-label": flipped ? "Terimi göster" : "Tanımı göster",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flip-face flex h-full flex-col justify-between rounded-2xl bg-surface p-8 text-left shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium tracking-wide text-muted uppercase",
						children: "Terim"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-medium tracking-tight text-balance md:text-4xl",
						children: term
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-subtle",
						children: "Çevirmek için dokun"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flip-back flip-face flex h-full flex-col justify-between rounded-2xl bg-primary p-8 text-left text-primary-fg shadow-[var(--shadow-card)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium tracking-wide text-primary-fg/70 uppercase",
						children: "Tanım"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl leading-snug text-pretty md:text-2xl",
						children: definition
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-primary-fg/70",
						children: "Çevirmek için dokun"
					})
				]
			})]
		})
	});
}
function FlashcardsPage() {
	const { setId } = Route$3.useParams();
	const studySet = useSet(setId);
	const toggleStar = useStudyStore((s) => s.toggleStar);
	const bumpMastery = useStudyStore((s) => s.bumpMastery);
	const markStudied = useStudyStore((s) => s.markStudied);
	const [order, setOrder] = (0, import_react.useState)([]);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [flipped, setFlipped] = (0, import_react.useState)(false);
	const [starredOnly, setStarredOnly] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const source = (0, import_react.useMemo)(() => {
		if (!studySet) return [];
		const cards = starredOnly ? studySet.cards.filter((c) => c.starred) : studySet.cards;
		return cards.length > 0 ? cards : studySet.cards;
	}, [studySet, starredOnly]);
	(0, import_react.useEffect)(() => {
		setOrder(source.map((c) => c.id));
		setIndex(0);
		setFlipped(false);
		setDone(false);
	}, [source]);
	(0, import_react.useEffect)(() => {
		if (studySet) markStudied(studySet.id);
	}, [studySet, markStudied]);
	const card = studySet?.cards.find((c) => c.id === order[index]);
	const go = (0, import_react.useCallback)((delta) => {
		setFlipped(false);
		setIndex((i) => {
			const next = i + delta;
			if (next >= order.length) {
				setDone(true);
				return i;
			}
			return Math.max(0, next);
		});
	}, [order.length]);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === " " || e.key === "Enter") {
				e.preventDefault();
				setFlipped((f) => !f);
			} else if (e.key === "ArrowRight") go(1);
			else if (e.key === "ArrowLeft") go(-1);
			else if (e.key.toLowerCase() === "s" && card) toggleStar(setId, card.id);
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		go,
		card,
		setId,
		toggleStar
	]);
	if (!studySet) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Set bulunamadı",
		description: "Bu kartlar artık yok.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Kütüphaneye dön"
			})
		})
	}) });
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyChrome, {
		setId,
		title: studySet.title,
		mode: "Kartlar",
		index: order.length,
		total: order.length,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: "Tur bitti"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [order.length, " kartı çevirdin."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							setIndex(0);
							setFlipped(false);
							setDone(false);
						},
						children: "Baştan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/sets/$setId",
							params: { setId },
							children: "Sete dön"
						})
					})]
				})
			]
		})
	});
	if (!card) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyChrome, {
		setId,
		title: studySet.title,
		mode: "Kartlar",
		index: 0,
		total: 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Kart yok",
			description: "Bu sette çalışacak kart bulunmuyor."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudyChrome, {
		setId,
		title: studySet.title,
		mode: "Kartlar",
		index,
		total: order.length,
		headerRight: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: starredOnly ? "secondary" : "ghost",
				size: "icon-sm",
				onClick: () => setStarredOnly((v) => !v),
				"aria-label": "Yalnız yıldızlılar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: starredOnly ? "size-4 fill-fg" : "size-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon-sm",
				"aria-label": "Karıştır",
				onClick: () => {
					setOrder(shuffle(order));
					setIndex(0);
					setFlipped(false);
					setDone(false);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-4" })
			})]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlashCard, {
				term: card.term,
				definition: card.definition,
				flipped,
				onFlip: () => setFlipped((f) => !f)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-center justify-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => go(-1),
						disabled: index === 0,
						children: "Önceki"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => toggleStar(setId, card.id),
						"aria-label": "Yıldızla",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: card.starred ? "size-5 fill-fg text-fg" : "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							bumpMastery(setId, card.id, -1);
							go(1);
						},
						children: "Tekrar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							bumpMastery(setId, card.id, 1);
							go(1);
						},
						children: "Biliyorum"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-center text-xs text-subtle",
				children: "Boşluk çevirir · ok tuşları gezer · S yıldızlar"
			})
		]
	});
}
//#endregion
export { FlashcardsPage as component };
