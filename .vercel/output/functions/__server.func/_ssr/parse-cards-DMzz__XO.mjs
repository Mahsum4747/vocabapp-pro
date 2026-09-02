//#region node_modules/.nitro/vite/services/ssr/assets/parse-cards-DMzz__XO.js
function parseCardText(raw) {
	return raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
		if (line.includes("	")) {
			const [term, ...rest] = line.split("	");
			return {
				term: (term ?? "").trim(),
				definition: rest.join(" ").trim()
			};
		}
		const split = line.split(/\s+[–—-]\s+|;\s+/);
		if (split.length >= 2) return {
			term: split[0].trim(),
			definition: split.slice(1).join(" - ").trim()
		};
		return {
			term: line,
			definition: ""
		};
	}).filter((card) => card.term.length > 0);
}
function serializeSetExport(payload) {
	return JSON.stringify(payload, null, 2);
}
//#endregion
export { serializeSetExport as n, parseCardText as t };
