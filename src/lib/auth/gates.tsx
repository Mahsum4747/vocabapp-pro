import { useState, type ReactNode } from "react";
import { Link, Navigate } from "@tanstack/react-router";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { authEnabled, signOut } from "./client";
import { useCurrentUser, useCurrentUserState, type AppUser } from "./use-current-user";

/**
 * Auth state components — plain wrappers around `useCurrentUserState()`.
 *
 * With auth on, visitors are signed out until they authenticate — in the sandbox
 * live preview too, which does real sign-in. The shared dev user appears only
 * when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
 * While the session is still resolving, gates that care about signed-out state
 * render nothing so there's no signed-out flash on hard reload.
 */

/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
export const SIGN_IN_PATH = "/login";

/** Render children only when a user is present (real session, or the disabled-auth dev user). */
export function SignedIn({ children }: { children: ReactNode }) {
  const { user } = useCurrentUserState();
  return user ? <>{children}</> : null;
}

/**
 * Render children only once we KNOW the visitor is signed out (`isPending` has
 * cleared and there is no user). Hidden while the session is still loading.
 */
export function SignedOut({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || user) return null;
  return <>{children}</>;
}

/**
 * Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
 * `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
 * session loading, which feels like a second "Loading…" on /login.
 *
 * Guard routes by waiting out `isPending` first (see `use-current-user`), then
 * render this.
 */
export function RedirectToSignIn({ to = SIGN_IN_PATH }: { to?: string }) {
  return <Navigate to={to} />;
}

/**
 * Full-page auth guard: renders `children` once signed in, redirects to
 * /login once we know the visitor is signed out (nothing rendered while the
 * session is still resolving, same as `SignedOut` — no signed-out flash).
 *
 * Only ever import this via `React.lazy` from a route (see AppShell's
 * `UserButton` for the pattern) — a static import here pulls the auth client
 * (better-auth/react) into that route's eager bundle, which is what broke
 * the Nitro/rolldown SSR chunk ("ssr_exports is not defined") the last time
 * this happened.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

/** Shared dropdown body for both the header avatar and the mobile nav's Account tab. */
function AccountMenuContent({ user }: { user: AppUser }) {
  // Sign-out can take a moment (and can fail when deployed), so the control
  // shows it is working and cannot be fired twice.
  const [signingOut, setSigningOut] = useState(false);
  const label = user.displayName ?? user.primaryEmail ?? "Account";

  return (
    <DropdownMenuContent align="end">
      <div className="px-3 py-2">
        <p className="truncate text-sm font-medium text-fg">{label}</p>
        {user.primaryEmail ? (
          <p className="truncate text-xs text-muted">{user.primaryEmail}</p>
        ) : null}
      </div>
      {authEnabled && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={signingOut}
            onSelect={() => {
              setSigningOut(true);
              // Success navigates away; on failure re-enable so it can be retried.
              void signOut().catch(() => setSigningOut(false));
            }}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  );
}

/**
 * Signed-in account menu: an initial-letter avatar that opens a dropdown with
 * the user's name, email, and a sign-out action. Sign-out is only shown when
 * auth is enabled (the disabled-auth dev user has nothing to sign out of).
 */
export function UserButton() {
  const user = useCurrentUser();
  if (!user) return null;
  const label = user.displayName ?? user.primaryEmail ?? "Account";
  const initial = label.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-sm font-medium text-primary-fg outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="size-9 object-cover" />
          ) : (
            initial
          )}
        </button>
      </DropdownMenuTrigger>
      <AccountMenuContent user={user} />
    </DropdownMenu>
  );
}

/**
 * Account tab for the mobile bottom nav — same account menu as `UserButton`,
 * styled as an icon+label nav item instead of a circular avatar. Signed-out
 * visitors get a plain link to `/login` instead of a dropdown.
 */
export function AccountNavItem({ className }: { className?: string }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return null;

  if (!user) {
    return (
      <Link to={SIGN_IN_PATH} className={className}>
        <User className="size-5" />
        Account
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={cn(className, "outline-none")}>
          <span className="grid size-5 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-[10px] font-medium text-primary-fg">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="" className="size-5 object-cover" />
            ) : (
              (user.displayName ?? user.primaryEmail ?? "A").charAt(0).toUpperCase()
            )}
          </span>
          Account
        </button>
      </DropdownMenuTrigger>
      <AccountMenuContent user={user} />
    </DropdownMenu>
  );
}
