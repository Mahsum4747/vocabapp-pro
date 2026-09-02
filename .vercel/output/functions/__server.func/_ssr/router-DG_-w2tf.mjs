import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as Link, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as object, i as number, o as string, r as literal, s as union } from "../_libs/zod.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DG_-w2tf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-lg font-medium",
				children: "Bir şeyler ters gitti"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: error.message || "Beklenmeyen bir hata. Sayfayı yenilemeyi dene."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function set(partial) {
	const now = partial.createdAt ?? Date.now();
	return {
		...partial,
		createdAt: now,
		updatedAt: now,
		lastStudiedAt: null
	};
}
function cards(pairs) {
	return pairs.map(([term, definition], index) => ({
		id: `card-${term.slice(0, 12)}-${index}`,
		term,
		definition,
		starred: false,
		mastery: 0
	}));
}
var SEED_SETS = [
	set({
		id: "seed-en-daily",
		title: "İngilizce günlük ifadeler",
		description: "Konuşmada sık geçen 16 ifade ve doğal Türkçe karşılıkları.",
		subject: "Dil",
		cards: cards([
			["anyway", "Her neyse; konuyu bağlamak veya geçiştirmek için."],
			["actually", "Aslında; beklenenin aksini belirtmek için."],
			["by the way", "Bu arada; yeni bir konuya geçerken."],
			["I mean", "Yani; söylediğini netleştirirken."],
			["kind of", "Bir bakıma; tam emin olunmayan bir durumu yumuşatır."],
			["make sense", "Mantıklı gelmek; anlaşılır olmak."],
			["no wonder", "Şaşılacak bir şey yok; nedeni açık."],
			["on the other hand", "Öte yandan; karşıt bir bakış ekler."],
			["as well", "Ayrıca; de/da anlamında."],
			["rather than", "… yerine; tercih belirtir."],
			["so far", "Şimdiye kadar."],
			["at least", "En azından; durumu hafifletmek için."],
			["used to", "Eskiden alışkanlık; artık yapılmayan bir şey."],
			["end up", "Sonunda … ile bitmek."],
			["look forward to", "Dört gözle beklemek (sonrası -ing alır)."],
			["take for granted", "Kanıksamak; değerini fark etmemek."]
		])
	}),
	set({
		id: "seed-capitals",
		title: "Avrupa başkentleri",
		description: "Ülke adından başkente — coğrafya tekrarı için kısa set.",
		subject: "Coğrafya",
		cards: cards([
			["Fransa", "Paris"],
			["Almanya", "Berlin"],
			["İtalya", "Roma"],
			["İspanya", "Madrid"],
			["Portekiz", "Lizbon"],
			["Yunanistan", "Atina"],
			["Polonya", "Varşova"],
			["Avusturya", "Viyana"],
			["Belçika", "Brüksel"],
			["Hollanda", "Amsterdam"],
			["İsveç", "Stockholm"],
			["Norveç", "Oslo"],
			["Çekya", "Prag"],
			["Macaristan", "Budapeşte"],
			["İrlanda", "Dublin"]
		])
	}),
	set({
		id: "seed-cell",
		title: "Hücre organelleri",
		description: "Lise biyoloji: organel adı ve temel görevi.",
		subject: "Fen",
		cards: cards([
			["Mitokondri", "Hücresel solunumla ATP üretir; enerji santrali."],
			["Ribozom", "Protein sentezini gerçekleştirir."],
			["Golgi aygıtı", "Protein ve lipidleri paketler, değiştirir, gönderir."],
			["Endoplazmik retikulum", "Protein ve lipid sentezi için kanal ağı."],
			["Lizozom", "Sindirim enzimleriyle atıkları parçalar."],
			["Çekirdek", "DNA’yı barındırır; hücre faaliyetlerini yönetir."],
			["Kloroplast", "Bitkilerde fotosentez yapar."],
			["Koful", "Su, atık ve besin depolar; bitkide büyük olur."],
			["Hücre zarı", "Madde alışverişini seçici geçirgen kontrol eder."],
			["Sentrozom", "Hayvan hücresinde iğ ipliklerini oluşturur."]
		])
	}),
	set({
		id: "seed-js",
		title: "JavaScript temelleri",
		description: "Günlük kodda çıkan kavramlar, kısa tanımlarla.",
		subject: "Yazılım",
		cards: cards([
			["const", "Yeniden atanamayan bağlama; referansın kendisi sabittir."],
			["let", "Blok kapsamında, yeniden atanabilir değişken."],
			["===", "Hem değer hem tip eşitliğini kontrol eder."],
			["map", "Diziyi dönüştürüp aynı uzunlukta yeni dizi üretir."],
			["filter", "Koşulu sağlayan elemanlarla yeni dizi döner."],
			["reduce", "Diziyi tek bir değere indirger."],
			["Promise", "Asenkron işlemin ileride tamamlanacağını temsil eder."],
			["async/await", "Promise’leri senkron görünüşlü yazar."],
			["closure", "İç fonksiyonun dış kapsamdaki değişkenleri hatırlaması."],
			["spread", "… operatörüyle dizi veya nesneyi açmak."],
			["optional chaining", "obj?.x — yoksa hata yerine undefined."],
			["event loop", "Çağrı yığını boşalınca kuyruktaki işleri çalıştırır."]
		])
	})
];
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return crypto.randomUUID();
}
function shuffle(items) {
	const next = [...items];
	for (let i = next.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		const a = next[i];
		const b = next[j];
		if (a === void 0 || b === void 0) continue;
		next[i] = b;
		next[j] = a;
	}
	return next;
}
function normalizeAnswer(value) {
	return value.trim().toLocaleLowerCase("tr").normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, " ");
}
function answersMatch(a, b) {
	return normalizeAnswer(a) === normalizeAnswer(b) && normalizeAnswer(a).length > 0;
}
var SUBJECTS = [
	"Dil",
	"Fen",
	"Tarih",
	"Coğrafya",
	"Yazılım",
	"Genel"
];
function toCards(drafts) {
	return drafts.map((draft) => ({
		id: uid(),
		term: draft.term.trim(),
		definition: draft.definition.trim(),
		starred: false,
		mastery: 0
	})).filter((card) => card.term || card.definition);
}
var useStudyStore = create()(persist((set, get) => ({
	sets: SEED_SETS,
	addSet: ({ title, description, subject, cards }) => {
		const id = uid();
		const now = Date.now();
		set({ sets: [{
			id,
			title: title.trim() || "Adsız set",
			description: description.trim(),
			subject: subject.trim() || "Genel",
			createdAt: now,
			updatedAt: now,
			lastStudiedAt: null,
			cards: toCards(cards)
		}, ...get().sets] });
		return id;
	},
	updateSetMeta: (id, patch) => {
		set({ sets: get().sets.map((studySet) => studySet.id === id ? {
			...studySet,
			...patch,
			updatedAt: Date.now()
		} : studySet) });
	},
	replaceCards: (id, cards) => {
		const existing = get().sets.find((s) => s.id === id);
		if (!existing) return;
		const previous = new Map(existing.cards.map((card) => [card.term.trim().toLowerCase(), card]));
		const nextCards = toCards(cards).map((card) => {
			const prior = previous.get(card.term.toLowerCase());
			if (!prior) return card;
			return {
				...card,
				starred: prior.starred,
				mastery: prior.mastery
			};
		});
		set({ sets: get().sets.map((studySet) => studySet.id === id ? {
			...studySet,
			cards: nextCards,
			updatedAt: Date.now()
		} : studySet) });
	},
	deleteSet: (id) => {
		set({ sets: get().sets.filter((studySet) => studySet.id !== id) });
	},
	toggleStar: (setId, cardId) => {
		set({ sets: get().sets.map((studySet) => studySet.id !== setId ? studySet : {
			...studySet,
			cards: studySet.cards.map((card) => card.id === cardId ? {
				...card,
				starred: !card.starred
			} : card)
		}) });
	},
	bumpMastery: (setId, cardId, delta) => {
		set({ sets: get().sets.map((studySet) => studySet.id !== setId ? studySet : {
			...studySet,
			cards: studySet.cards.map((card) => card.id === cardId ? {
				...card,
				mastery: Math.min(5, Math.max(0, card.mastery + delta))
			} : card)
		}) });
	},
	resetMastery: (setId) => {
		set({ sets: get().sets.map((studySet) => studySet.id !== setId ? studySet : {
			...studySet,
			updatedAt: Date.now(),
			cards: studySet.cards.map((card) => ({
				...card,
				mastery: 0
			}))
		}) });
	},
	markStudied: (setId) => {
		const now = Date.now();
		set({ sets: get().sets.map((studySet) => studySet.id === setId ? {
			...studySet,
			lastStudiedAt: now,
			updatedAt: now
		} : studySet) });
	},
	importSet: (incoming) => {
		const id = uid();
		const now = Date.now();
		set({ sets: [{
			...incoming,
			id,
			createdAt: now,
			updatedAt: now,
			lastStudiedAt: null,
			cards: incoming.cards.map((card) => ({
				...card,
				id: uid()
			}))
		}, ...get().sets] });
		return id;
	},
	restoreSeeds: () => {
		const existingIds = new Set(get().sets.map((s) => s.id));
		const missing = SEED_SETS.filter((s) => !existingIds.has(s.id)).map((s) => ({
			...s,
			createdAt: Date.now(),
			updatedAt: Date.now()
		}));
		if (missing.length === 0) {
			set({ sets: [...SEED_SETS.map((s) => ({ ...s })), ...get().sets.filter((s) => !s.id.startsWith("seed-"))] });
			return;
		}
		set({ sets: [...missing, ...get().sets] });
	}
}), {
	name: "karta-library",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	partialize: (state) => ({ sets: state.sets })
}));
function useSet(id) {
	return useStudyStore((state) => state.sets.find((item) => item.id === id));
}
function Logo({ className, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: cn("flex items-center gap-2.5 text-fg no-underline", className),
		"aria-label": "Karta ana sayfa",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative grid size-8 place-items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0.5 left-1.5 size-5 rounded-sm bg-surface-2 shadow-[var(--shadow-border)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-1.5 left-0.5 grid size-5 place-items-center rounded-sm bg-primary text-[10px] font-semibold text-primary-fg",
				children: "K"
			})]
		}), compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-xl font-medium tracking-tight",
			children: "Karta"
		})]
	});
}
function HydrationGate({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const unsub = useStudyStore.persist.onFinishHydration(() => setReady(true));
		if (useStudyStore.persist.hasHydrated()) setReady(true);
		else useStudyStore.persist.rehydrate();
		return unsub;
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Kütüphane açılıyor…"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function TooltipProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration: 250,
		children
	});
}
var styles_default = "/assets/styles-LF5lEhh2.css";
var APP_NAME = "Karta";
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Kartlarla öğren — kişisel çalışma setleri."
			},
			{
				name: "theme-color",
				content: "#F3EFE7"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400..700;1,400..700&family=Fraunces:ital,opsz,wght@0,9..144,500..700;1,9..144,500..700&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "tr",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrationGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "bottom-center",
					theme: "light",
					toastOptions: { className: "font-sans" }
				})] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$8 = () => import("./routes--bmJFQVd.mjs");
var Route$8 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./create-DW1HNMlE.mjs");
var Route$7 = createFileRoute("/create")({
	validateSearch: (search) => ({ ai: search.ai === true || search.ai === "true" }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./sets._setId-Cd43bsU7.mjs");
var Route$6 = createFileRoute("/sets/$setId")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./sets._setId.index-BX9Q9jS6.mjs");
var Route$5 = createFileRoute("/sets/$setId/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./sets._setId.edit-XAXOmPQW.mjs");
var Route$4 = createFileRoute("/sets/$setId/edit")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./sets._setId.flashcards-BiBK1-y6.mjs");
var Route$3 = createFileRoute("/sets/$setId/flashcards")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./sets._setId.learn-C8kipquN.mjs");
var Route$2 = createFileRoute("/sets/$setId/learn")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./sets._setId.match-CiXDz8mr.mjs");
var Route$1 = createFileRoute("/sets/$setId/match")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./sets._setId.test-Bxb2Ru_z.mjs");
var Route = createFileRoute("/sets/$setId/test")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var CreateRoute = Route$7.update({
	id: "/create",
	path: "/create",
	getParentRoute: () => Route$9
});
var SetsSetIdRoute = Route$6.update({
	id: "/sets/$setId",
	path: "/sets/$setId",
	getParentRoute: () => Route$9
});
var SetsSetIdIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => SetsSetIdRoute
});
var SetsSetIdRouteChildren = {
	SetsSetIdEditRoute: Route$4.update({
		id: "/edit",
		path: "/edit",
		getParentRoute: () => SetsSetIdRoute
	}),
	SetsSetIdFlashcardsRoute: Route$3.update({
		id: "/flashcards",
		path: "/flashcards",
		getParentRoute: () => SetsSetIdRoute
	}),
	SetsSetIdLearnRoute: Route$2.update({
		id: "/learn",
		path: "/learn",
		getParentRoute: () => SetsSetIdRoute
	}),
	SetsSetIdMatchRoute: Route$1.update({
		id: "/match",
		path: "/match",
		getParentRoute: () => SetsSetIdRoute
	}),
	SetsSetIdTestRoute: Route.update({
		id: "/test",
		path: "/test",
		getParentRoute: () => SetsSetIdRoute
	}),
	SetsSetIdIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	CreateRoute,
	SetsSetIdRoute: SetsSetIdRoute._addFileChildren(SetsSetIdRouteChildren)
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { Route$3 as a, Route$7 as c, useStudyStore as d, SUBJECTS as f, shuffle as h, Route$2 as i, Logo as l, cn as m, Route as n, Route$4 as o, answersMatch as p, Route$1 as r, Route$5 as s, router_exports as t, useSet as u };
