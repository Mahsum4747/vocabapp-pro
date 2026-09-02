import { h as shuffle } from "./router-DG_-w2tf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-BoAiW--t.js
function multipleChoice(cards, card, ask = "definition", optionCount = 4) {
	const answer = ask === "definition" ? card.term : card.definition;
	const pool = cards.filter((c) => c.id !== card.id);
	const distractors = shuffle(pool).slice(0, Math.max(0, optionCount - 1)).map((c) => ask === "definition" ? c.term : c.definition);
	const options = shuffle([answer, ...distractors]);
	return {
		type: "mc",
		cardId: card.id,
		prompt: ask === "definition" ? card.definition : card.term,
		promptSide: ask,
		options,
		answer
	};
}
function writtenQuestion(card, ask = "definition") {
	return {
		type: "written",
		cardId: card.id,
		prompt: ask === "definition" ? card.definition : card.term,
		answer: ask === "definition" ? card.term : card.definition
	};
}
function trueFalse(cards, card) {
	const others = cards.filter((c) => c.id !== card.id);
	const lie = others.length > 0 && Math.random() < .5;
	const paired = lie ? others[Math.floor(Math.random() * others.length)] : card;
	const statement = `${card.term}  →  ${paired?.definition ?? card.definition}`;
	return {
		type: "tf",
		cardId: card.id,
		prompt: "Bu eşleşme doğru mu?",
		statement,
		answer: !lie
	};
}
function buildTest(cards, limit = 12) {
	const usable = shuffle(cards.filter((c) => c.term.trim() && c.definition.trim()));
	return usable.slice(0, Math.min(limit, usable.length)).map((card, index) => {
		const slot = index % 3;
		if (slot === 0 && usable.length >= 3) return multipleChoice(usable, card);
		if (slot === 1) return writtenQuestion(card);
		return trueFalse(usable, card);
	});
}
function masteryPercent(cards) {
	if (cards.length === 0) return 0;
	const sum = cards.reduce((acc, card) => acc + card.mastery, 0);
	return Math.round(sum / (cards.length * 5) * 100);
}
//#endregion
export { writtenQuestion as i, masteryPercent as n, multipleChoice as r, buildTest as t };
