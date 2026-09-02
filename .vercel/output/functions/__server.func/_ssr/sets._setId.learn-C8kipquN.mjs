import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as useStudyStore, h as shuffle, i as Route$2, m as cn, p as answersMatch, u as useSet } from "./router-DG_-w2tf.mjs";
import { n as Button, t as AppShell } from "./app-shell-BP9Jai7z.mjs";
import { t as Input } from "./input-BT4dNZ54.mjs";
import { t as EmptyState } from "./empty-state-DtnF40uE.mjs";
import { i as writtenQuestion, r as multipleChoice } from "./quiz-BoAiW--t.mjs";
import { t as StudyChrome } from "./study-chrome-CXNXh-k2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sets._setId.learn-C8kipquN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LearnPage() {
	const { setId } = Route$2.useParams();
	const studySet = useSet(setId);
	const bumpMastery = useStudyStore((s) => s.bumpMastery);
	const markStudied = useStudyStore((s) => s.markStudied);
	const [round, setRound] = (0, import_react.useState)(0);
	const items = (0, import_react.useMemo)(() => {
		if (!studySet) return [];
		return shuffle(studySet.cards.filter((c) => c.term && c.definition)).map((card) => card.mastery >= 2 ? writtenQuestion(card) : multipleChoice(studySet.cards, card));
	}, [studySet?.id, round]);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [written, setWritten] = (0, import_react.useState)("");
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [correctCount, setCorrectCount] = (0, import_react.useState)(0);
	const [done, setDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (studySet) markStudied(studySet.id);
	}, [studySet, markStudied]);
	function restart() {
		setIndex(0);
		setSelected(null);
		setWritten("");
		setRevealed(false);
		setCorrectCount(0);
		setDone(false);
		setRound((n) => n + 1);
	}
	const item = items[index];
	function grade(ok) {
		if (!item) return;
		setRevealed(true);
		if (ok) setCorrectCount((n) => n + 1);
		bumpMastery(setId, item.cardId, ok ? 1 : -1);
	}
	function next() {
		setSelected(null);
		setWritten("");
		setRevealed(false);
		if (index + 1 >= items.length) {
			setDone(true);
			return;
		}
		setIndex((i) => i + 1);
	}
	if (!studySet) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Set bulunamadı",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Kütüphaneye dön"
			})
		}),
		description: "Bu set yok."
	}) });
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyChrome, {
		setId,
		title: studySet.title,
		mode: "Öğren",
		index: 0,
		total: 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Kart yok",
			description: "Öğrenmek için kart ekle."
		})
	});
	if (done) {
		const pct = Math.round(correctCount / items.length * 100);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyChrome, {
			setId,
			title: studySet.title,
			mode: "Öğren",
			index: items.length,
			total: items.length,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Tur sonucu"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-display text-5xl font-medium tracking-tight tabular-nums",
						children: [pct, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							correctCount,
							" / ",
							items.length,
							" doğru"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: restart,
							children: "Tekrar öğren"
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
	}
	if (!item) return null;
	const isMc = item.type === "mc";
	const isCorrect = isMc ? selected === item.answer : answersMatch(written, item.answer);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudyChrome, {
		setId,
		title: studySet.title,
		mode: "Öğren",
		index,
		total: items.length,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Tanımı karşılayan terim"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-3xl font-medium tracking-tight text-balance",
				children: item.prompt
			}),
			isMc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-2",
				children: item.options.map((option) => {
					const chosen = selected === option;
					const show = revealed && (option === item.answer || chosen);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: revealed,
						onClick: () => {
							setSelected(option);
							grade(option === item.answer);
						},
						className: cn("rounded-lg bg-surface px-4 py-3.5 text-left text-sm shadow-[var(--shadow-border)] transition-[background-color,box-shadow] duration-150", !revealed && "hover:shadow-[var(--shadow-border-hover)]", show && option === item.answer && "bg-success-soft text-success", show && chosen && option !== item.answer && "bg-danger-soft text-danger"),
						children: option
					}, option);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!revealed) grade(answersMatch(written, item.answer));
					else next();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: written,
						onChange: (e) => setWritten(e.target.value),
						placeholder: "Terimi yaz",
						disabled: revealed,
						autoFocus: true
					}),
					revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-sm", isCorrect ? "text-success" : "text-danger"),
						children: isCorrect ? "Doğru" : `Doğrusu: ${item.answer}`
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: revealed ? "Devam" : "Kontrol et"
					})
				]
			}),
			revealed && isMc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6 w-full",
				onClick: next,
				children: "Devam"
			}) : null
		]
	});
}
//#endregion
export { LearnPage as component };
