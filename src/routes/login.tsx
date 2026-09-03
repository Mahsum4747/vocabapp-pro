import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0],
        });
        if (err) throw new Error(err.message ?? "Kayıt başarısız oldu.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
        });
        if (err) throw new Error(err.message ?? "Giriş başarısız oldu.");
      }
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir şeyler ters gitti.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">
          {mode === "signin" ? "Giriş yap" : "Hesap oluştur"}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          {mode === "signin"
            ? "Kelime setlerine erişmek için giriş yap."
            : "Ücretsiz bir hesap oluştur."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-sm font-medium">Ad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Adın"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="ornek@mail.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Şifre</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="En az 8 karakter"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-[#1f2b3a] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading
              ? "Bekleyin…"
              : mode === "signin"
                ? "Giriş yap"
                : "Kayıt ol"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === "signin" ? (
            <>
              Hesabın yok mu?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-medium text-[#1f2b3a] underline"
              >
                Kayıt ol
              </button>
            </>
          ) : (
            <>
              Zaten hesabın var mı?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-medium text-[#1f2b3a] underline"
              >
                Giriş yap
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}