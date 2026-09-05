import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // The browser can restore this exact page (with whatever was typed) from
  // back/forward cache when the user navigates back to /login — clear the
  // password (and any in-flight state) so it never lingers in a cached page.
  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (!e.persisted) return;
      setPassword("");
      setError(null);
      setLoading(false);
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

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
        if (err) throw new Error(err.message ?? "Sign up failed.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
        });
        if (err) throw new Error(err.message ?? "Sign in failed.");
      }
      // A full navigation (not the router's client-side navigate) so the
      // next page's session check starts from a clean client — better-auth's
      // reactive session store can otherwise still be showing "signed out"
      // for a few milliseconds after sign-in resolves (its own listeners are
      // notified via a short internal setTimeout), which raced the /login
      // redirect on the very first sign-in attempt. Mirrors signOut()'s
      // existing hard-redirect for the same reason, in the other direction.
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg px-4 text-fg">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl bg-surface p-8 shadow-[var(--shadow-card)]">
          <h1 className="mb-1 font-display text-2xl font-medium tracking-tight">
            {mode === "signin" ? "Sign in" : "Create an account"}
          </h1>
          <p className="mb-6 text-sm text-muted">
            {mode === "signin"
              ? "Sign in to access your study sets."
              : "Create a free account to get started."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-medium text-fg underline underline-offset-2"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-medium text-fg underline underline-offset-2"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
