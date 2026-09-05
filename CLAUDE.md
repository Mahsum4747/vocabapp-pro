# vocabapp-pro

TanStack Start + Vite + Nitro tabanlı bir kelime öğrenme uygulaması. Deploy: Vercel (main branch otomatik deploy).

## Mimari
- Auth: Better Auth + Neon Postgres (src/lib/auth/) — email/şifre ile
- Veri: Firebase Firestore, SADECE sunucu tarafında src/lib/study-sets.ts üzerinden erişiliyor (firebase-admin, dinamik import ile — client kodunda asla doğrudan Firestore çağrısı yapma)
- Store: src/lib/store.ts (Zustand), server function'ları çağırır

## Bilinen tuzaklar
- .grok/app-env.json dosyası VITE_AUTH_ENABLED değerini .env'in üzerine yazabilir, ikisini birlikte kontrol et
- firebase-admin paketi Nitro'nun traceDeps: ["firebase-admin*"] ayarıyla externalize edilmiş (vite.config.ts) — bunu bozma
- better-auth/react client'ını (useCurrentUser, authClient) her sayfada render edilen paylaşılan component'lere (AppShell gibi) eager import etme — bu, rolldown'da "ssr_exports is not defined" bundling hatasını tetikliyor. Gerekiyorsa React.lazy/Suspense ile lazy-load et.
- BETTER_AUTH_SECRET, DATABASE_URL, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, VITE_AUTH_ENABLED Vercel'de zaten ayarlı, değiştirme

## Çalışma kuralı
Kod değişikliğinden sonra sadece npm run typecheck çalıştır. Tarayıcıdan test etme, deploy tetikleme, kendi kendine ek doğrulama yapma — kullanıcı kendisi test edip sonucu bildirecek. Bitince kısa özet ver.
