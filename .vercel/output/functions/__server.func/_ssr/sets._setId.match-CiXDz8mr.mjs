import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as useStudyStore, h as shuffle, m as cn, r as Route$1, u as useSet } from "./router-DG_-w2tf.mjs";
import { n as Button, t as AppShell } from "./app-shell-BP9Jai7z.mjs";
import { t as EmptyState } from "./empty-state-DtnF40uE.mjs";
import { t as StudyChrome } from "./study-chrome-CXNXh-k2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sets._setId.match-CiXDz8mr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MatchPage() {
	const { setId } = Route$1.useParams();
	const studySet = useSet(setId);
	const bumpMastery = useStudyStore((s) => s.bumpMastery);
	const markStudied = useStudyStore((s) => s.markStudied);
	const [round, setRound] = (0, import_react.useState)(0);
	const tiles = (0, import_react.useMemo)(() => {
		if (!studySet) return [];
		const both = shuffle(studySet.cards.filter((c) => c.term && c.definition)).slice(0, 6).flatMap((card) => [{
			id: `${card.id}-t`,
			cardId: card.id,
			text: card.term,
			kind: "term"
		}, {
			id: `${card.id}-d`,
			cardId: card.id,
			text: card.definition,
			kind: "definition"
		}]);
		return shuffle(both);
	}, [studySet?.id, round]);
	const [matched, setMatched] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [wrong, setWrong] = (0, import_react.useState)([]);
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	const [running, setRunning] = (0, import_react.useState)(true);
	const totalPairs = tiles.length / 2;
	const done = totalPairs > 0 && matched.size === tiles.length;
	(0, import_react.useEffect)(() => {
		if (studySet) markStudied(studySet.id);
	}, [studySet, markStudied]);
	(0, import_react.useEffect)(() => {
		if (!running || done) return;
		const id = window.setInterval(() => setSeconds((s) => s + 1), 1e3);
		return () => window.clearInterval(id);
	}, [running, done]);
	(0, import_react.useEffect)(() => {
		if (done) setRunning(false);
	}, [done]);
	function restart() {
		setMatched(/* @__PURE__ */ new Set());
		setSelected(null);
		setWrong([]);
		setSeconds(0);
		setRunning(true);
		setRound((n) => n + 1);
	}
	function onTile(tile) {
		if (matched.has(tile.id) || wrong.length) return;
		if (!selected) {
			setSelected(tile);
			return;
		}
		if (selected.id === tile.id) {
			setSelected(null);
			return;
		}
		if (selected.cardId === tile.cardId && selected.kind !== tile.kind) {
			setMatched((prev) => /* @__PURE__ */ new Set([
				...prev,
				selected.id,
				tile.id
			]));
			bumpMastery(setId, tile.cardId, 1);
			setSelected(null);
		} else {
			setWrong([selected.id, tile.id]);
			bumpMastery(setId, selected.cardId, -1);
			window.setTimeout(() => {
				setWrong([]);
				setSelected(null);
			}, 450);
		}
	}
	if (!studySet) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Set bulunamadı",
		description: "Eşleştirme açılamıyor.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Kütüphaneye dön"
			})
		})
	}) });
	if (tiles.length < 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyChrome, {
		setId,
		title: studySet.title,
		mode: "Eşleştir",
		index: 0,
		total: 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Kart yetmiyor",
			description: "Eşleştirme için en az iki kart gerekir."
		})
	});
	const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
	const ss = String(seconds % 60).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyChrome, {
		setId,
		title: studySet.title,
		mode: "Eşleştir",
		index: matched.size / 2,
		total: totalPairs,
		headerRight: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-sm tabular-nums text-muted",
			children: [
				mm,
				":",
				ss
			]
		}),
		children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium tracking-tight",
					children: "Tamam"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						totalPairs,
						" eşleşme · ",
						mm,
						":",
						ss
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: restart,
						children: "Yeniden"
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
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 md:grid-cols-3",
			children: tiles.map((tile) => {
				const isOn = selected?.id === tile.id;
				const isMatch = matched.has(tile.id);
				const isWrong = wrong.includes(tile.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: isMatch,
					onClick: () => onTile(tile),
					className: cn("min-h-24 rounded-lg px-3 py-3 text-left text-sm shadow-[var(--shadow-border)] transition-[background-color,opacity,transform] duration-150", tile.kind === "term" ? "bg-primary text-primary-fg" : "bg-surface text-fg", isOn && "ring-2 ring-ring ring-offset-2 ring-offset-bg", isMatch && "opacity-35", isWrong && "bg-danger-soft text-danger"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-xs font-medium tracking-wide uppercase opacity-70",
						children: tile.kind === "term" ? "Terim" : "Tanım"
					}), tile.text]
				}, tile.id);
			})
		})
	});
}
//#endregion
export { MatchPage as component };
