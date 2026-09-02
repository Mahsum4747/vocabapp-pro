import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as useStudyStore, m as cn, n as Route, p as answersMatch, u as useSet } from "./router-DG_-w2tf.mjs";
import { n as Button, t as AppShell } from "./app-shell-BP9Jai7z.mjs";
import { t as Input } from "./input-BT4dNZ54.mjs";
import { t as EmptyState } from "./empty-state-DtnF40uE.mjs";
import { t as buildTest } from "./quiz-BoAiW--t.mjs";
import { t as StudyChrome } from "./study-chrome-CXNXh-k2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sets._setId.test-Bxb2Ru_z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TestPage() {
	const { setId } = Route.useParams();
	const studySet = useSet(setId);
	const bumpMastery = useStudyStore((s) => s.bumpMastery);
	const markStudied = useStudyStore((s) => s.markStudied);
	const [round, setRound] = (0, import_react.useState)(0);
	const questions = (0, import_react.useMemo)(() => studySet ? buildTest(studySet.cards, Math.min(12, studySet.cards.length)) : [], [studySet?.id, round]);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [written, setWritten] = (0, import_react.useState)("");
	const [tf, setTf] = (0, import_react.useState)(null);
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [score, setScore] = (0, import_react.useState)(0);
	const [missed, setMissed] = (0, import_react.useState)([]);
	const [done, setDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (studySet) markStudied(studySet.id);
	}, [studySet, markStudied]);
	function restart() {
		setIndex(0);
		setPicked(null);
		setWritten("");
		setTf(null);
		setRevealed(false);
		setScore(0);
		setMissed([]);
		setDone(false);
		setRound((n) => n + 1);
	}
	const q = questions[index];
	function finish(ok) {
		if (!q) return;
		setRevealed(true);
		if (ok) setScore((n) => n + 1);
		else {
			const card = studySet?.cards.find((c) => c.id === q.cardId);
			if (card) setMissed((m) => [...m, card.term]);
		}
		bumpMastery(setId, q.cardId, ok ? 1 : -1);
	}
	function next() {
		setPicked(null);
		setWritten("");
		setTf(null);
		setRevealed(false);
		if (index + 1 >= questions.length) {
			setDone(true);
			return;
		}
		setIndex((i) => i + 1);
	}
	if (!studySet) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Set bulunamadı",
		description: "Test açılmıyor.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Kütüphaneye dön"
			})
		})
	}) });
	if (questions.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyChrome, {
		setId,
		title: studySet.title,
		mode: "Test",
		index: 0,
		total: 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Kart yok",
			description: "Test için kart ekle."
		})
	});
	if (done) {
		const pct = Math.round(score / questions.length * 100);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyChrome, {
			setId,
			title: studySet.title,
			mode: "Test",
			index: questions.length,
			total: questions.length,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-md rounded-xl bg-surface p-8 text-center shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Test sonucu"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-display text-5xl font-medium tracking-tight tabular-nums",
						children: [pct, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							score,
							" / ",
							questions.length,
							" doğru"
						]
					}),
					missed.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-muted uppercase",
							children: "Kaçırılanlar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1 text-sm",
							children: missed.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: term }, term))
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-success",
						children: "Hepsi yerinde."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: restart,
							children: "Yeni test"
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
	if (!q) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudyChrome, {
		setId,
		title: studySet.title,
		mode: "Test",
		index,
		total: questions.length,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: q.type === "mc" ? "Çoktan seçmeli" : q.type === "written" ? "Yazılı" : "Doğru / yanlış"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-display text-3xl font-medium tracking-tight text-balance",
				children: q.prompt
			}),
			q.type === "mc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-2",
				children: q.options.map((option) => {
					const chosen = picked === option;
					const show = revealed && (option === q.answer || chosen);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: revealed,
						onClick: () => {
							setPicked(option);
							finish(option === q.answer);
						},
						className: cn("rounded-lg bg-surface px-4 py-3.5 text-left text-sm shadow-[var(--shadow-border)]", show && option === q.answer && "bg-success-soft text-success", show && chosen && option !== q.answer && "bg-danger-soft text-danger"),
						children: option
					}, option);
				})
			}) : null,
			q.type === "written" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!revealed) finish(answersMatch(written, q.answer));
					else next();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: written,
						onChange: (e) => setWritten(e.target.value),
						placeholder: "Yanıtın",
						disabled: revealed,
						autoFocus: true
					}),
					revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-sm", answersMatch(written, q.answer) ? "text-success" : "text-danger"),
						children: answersMatch(written, q.answer) ? "Doğru" : `Doğrusu: ${q.answer}`
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: revealed ? "Devam" : "Kontrol et"
					})
				]
			}) : null,
			q.type === "tf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg bg-surface px-4 py-4 text-lg shadow-[var(--shadow-border)]",
					children: q.statement
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [true, false].map((value) => {
						const label = value ? "Doğru" : "Yanlış";
						const chosen = tf === value;
						const show = revealed && (value === q.answer || chosen);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: revealed,
							onClick: () => {
								setTf(value);
								finish(value === q.answer);
							},
							className: cn("h-12 rounded-lg bg-surface text-sm font-medium shadow-[var(--shadow-border)]", show && value === q.answer && "bg-success-soft text-success", show && chosen && value !== q.answer && "bg-danger-soft text-danger"),
							children: label
						}, String(value));
					})
				})]
			}) : null,
			revealed && q.type !== "written" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6 w-full",
				onClick: next,
				children: "Devam"
			}) : null
		]
	});
}
//#endregion
export { TestPage as component };
