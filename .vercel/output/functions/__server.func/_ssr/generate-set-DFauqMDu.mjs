import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-set-DFauqMDu.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var inputSchema = object({
	topic: string().trim().min(2).max(200),
	count: number().int().min(6).max(20),
	language: _enum([
		"tr",
		"en",
		"mixed"
	])
});
var cardSchema = object({
	term: string().min(1).max(200),
	definition: string().min(1).max(500)
});
var payloadSchema = object({
	title: string().min(1).max(120),
	description: string().max(280).optional().default(""),
	subject: string().max(40).optional().default("Genel"),
	cards: array(cardSchema).min(4).max(20)
});
function extractJson(text) {
	const raw = text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? text;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start === -1 || end === -1) throw new Error("JSON bulunamadı");
	return JSON.parse(raw.slice(start, end + 1));
}
var generateStudySet_createServerFn_handler = createServerRpc({
	id: "332b9b5ce4684d975fbeea4c3c21b16d9906be4cfd882c2c56bbe08063d3bcb5",
	name: "generateStudySet",
	filename: "src/lib/generate-set.ts"
}, (opts) => generateStudySet.__executeServer(opts));
var generateStudySet = createServerFn({ method: "POST" }).validator((input) => inputSchema.parse(input)).handler(generateStudySet_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Yapay zekâ bu ortamda kullanılamıyor."
	};
	const languageLine = data.language === "en" ? "Write terms and definitions in English." : data.language === "mixed" ? "Terms in English, definitions in Turkish." : "Write terms and definitions in Turkish.";
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .6,
			max_tokens: 2200,
			messages: [{
				role: "system",
				content: "You create concise flashcard study sets. Reply with JSON only, no markdown."
			}, {
				role: "user",
				content: [
					`Create ${data.count} high-quality flashcards about: ${data.topic}.`,
					languageLine,
					"JSON shape: {\"title\":\"\",\"description\":\"\",\"subject\":\"Dil|Fen|Tarih|Coğrafya|Yazılım|Genel\",\"cards\":[{\"term\":\"\",\"definition\":\"\"}]}",
					"Each definition is one or two short sentences. No numbering in terms."
				].join("\n")
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: "Set oluşturulamadı, tekrar dene."
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	try {
		return {
			ok: true,
			set: payloadSchema.parse(extractJson(text))
		};
	} catch {
		return {
			ok: false,
			error: "Yanıt okunamadı, tekrar dene."
		};
	}
});
//#endregion
export { generateStudySet_createServerFn_handler };
