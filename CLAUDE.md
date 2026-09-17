# vocabapp-pro

TanStack Start + Vite + Nitro tabanlı bir Almanca kelime öğrenme uygulaması. Deploy: Vercel (yalnızca `main` branch otomatik deploy — Ignored Build Step ile ayarlı).

## Mimari
- **Auth:** Better Auth + Neon Postgres (`src/lib/auth/`) — email/şifre ile, Firebase Auth DEĞİL.
- **Veri:** Firebase Firestore, SADECE sunucu tarafında `src/lib/study-sets.ts` üzerinden erişiliyor (`firebase-admin.server`, dinamik import ile). Client kodunda asla doğrudan Firestore çağrısı yapma.
- **Storage:** Devre dışı (`IMAGE_UPLOAD_ENABLED = false` — Firebase Storage paralı Blaze plan gerektiriyor, kod hazır ama flag kapalı).
- **Store:** `src/lib/store.ts` (Zustand), server function'ları çağırır.
- **Koleksiyonlar:** study sets, cards, cardProgress, reviewEvents, dailyStats, user_streaks.

## Kritik invariant'lar (bunları asla sessizce değiştirme)
- **Card id = `term.trim().toLowerCase()`.** Id'ler FSRS/mastery/progress state'ini taşıyor — normalize mantığını değiştirmeden önce mutlaka sor, kırılırsa kullanıcı verisi kaybolur.
- **Enrichment (gender/plural/example) sadece `resolveSetLanguages(set).term === 'de'` olduğunda uygulanır.** Diğer dil çiftlerini (EN/TR/KU) etkilememeli.
- **API key'ler (GEMINI_API_KEY, FIREBASE_PRIVATE_KEY vb.) asla client'a sızmamalı.**
- `replaceCards` gibi toplu güncelleme fonksiyonları geçmişte defalarca alan kaybettirdi (starred/mastery, sonra status). Yeni bir Card alanı eklerken bu tür fonksiyonların onu koruduğunu kontrol et.

## Bilinen tuzaklar
- `.grok/app-env.json`, `VITE_AUTH_ENABLED` değerini `.env`'in üzerine sessizce yazabilir — auth/env sorunlarında ikisini birlikte kontrol et.
- `firebase-admin`, Nitro'nun `traceDeps: ["firebase-admin*"]` ayarıyla (vite.config.ts) bundle'a dahil ediliyor — `rollupConfig.external` DEĞİL. Bu ayarı bozma.
- `better-auth/react` client'ını (`useCurrentUser`, `authClient`) her sayfada render edilen paylaşılan component'lere (AppShell gibi) eager import etme — rolldown'da `"ssr_exports is not defined"` bundling hatasını tetikliyor. Gerekliyse `React.lazy`/`Suspense` ile lazy-load et.
- `BETTER_AUTH_SECRET`, `DATABASE_URL`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `VITE_AUTH_ENABLED` Vercel'de zaten ayarlı — değiştirme.

## Bilinen baseline hatalar (dokunma)
- `typecheck`: 5 hata (popup.server.ts, seed.ts — dead code, ilgisiz)
- `test:scripts`: 13 pre-existing failure
- Bunlar senin değişikliğinden önce de vardı. Typecheck/test sonucunu bu sayıyla karşılaştır — artmadıysa sorun yok, düzeltmeye çalışma.
- Çalıştırılmamış iki dry-run migration script'i var: `migrate-share-ids.mjs`, `migrate-card-examples.mjs` — bunları kimse istemeden çalıştırma.

## Çalışma kuralı
- Kod değişikliğinden sonra sadece `npm run typecheck` çalıştır. Tarayıcıdan test etme, deploy tetikleme, kendi kendine ek doğrulama yapma — kullanıcı kendisi test edip sonucu bildirecek.
- Skip browser-based visual self-verification (no qa-*.tsx debug routes, no localhost screenshots, no standalone review HTML files) unless explicitly asked for one in the task prompt. Numeric/computed verification (WCAG contrast ratios, exact computed style values, typecheck, build) is sufficient proof of correctness for visual/CSS changes and should be used instead — it's cheaper and catches real regressions just as well. This applies project-wide, not just to the current UX/UI redesign work.
- Basit değişikliklerde (tek dosya, açık neden-sonuç) doğrudan eyleme geç.
- Kök nedeni belirsiz bug'larda (build/bundling hataları, cross-file state sorunları) önce kısaca hangi hipotezi test ettiğini belirt, sonra düzelt — burada acele etme.
- Bitince kısa özet ver.

## Yanıt stili
- Nezaket ifadesi kullanma ("Elbette", "Anladım", "İşte kod", "Başarılar").
- Yalnızca değiştirilmesi gereken kodu veya çalıştırılacak komutu ver, kodun nasıl çalıştığını açıklama.
- "Şunu yapacağım" gibi planlama metni üretme, doğrudan eyleme geç (yukarıdaki belirsiz-bug istisnası hariç).
- Hata yaparsan özür dileme, doğrudan çözümü yaz.

## Şu anki odak
Almanca zenginleştirme hattı: 3A (dil kodları) → 3B (sözlük) → 3B.5 (article grading) tamamlandı. Şu an örnek cümle kaynağı üzerinde çalışılıyor — bundled Wiktionary verisi hem definition hem example paneline besleniyor (DE/EN/TR güçlü, Kurdish zayıf kapsam), AI otomatik tetiklenmiyor, "Generate with AI" fallback olarak duruyor.