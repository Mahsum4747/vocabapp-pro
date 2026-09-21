import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { HydrationGate } from "@/components/hydration-gate";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CelebrationProvider } from "@/components/celebration";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "Karta";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        // viewport-fit=cover lets the page run under the notch (safe-area tokens pad it
        // back); interactive-widget makes the software keyboard resize the layout
        // viewport on Android, as iOS already does. Zoom stays enabled.
        content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content",
      },
      { title: APP_NAME },
      { name: "description", content: "Learn with flashcards — your personal study sets." },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400..700;1,400..700&family=Geist:wght@400..700&display=swap",
      },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Browser chrome colour per scheme. Rendered here rather than in head():
            the router de-duplicates meta tags by name, which would keep only one
            of these two. Meta tags can't read CSS variables, so they mirror
            --color-bg (light and dark) in styles.css — keep in sync. */}
        <meta name="theme-color" content="#f7f4ef" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1c1b19" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="bg-bg text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <TooltipProvider>
            <CelebrationProvider>
              <HydrationGate>
                <Outlet />
              </HydrationGate>
            </CelebrationProvider>
            <Toaster
              position="bottom-center"
              theme="system"
              toastOptions={{
                className: "font-sans",
              }}
            />
          </TooltipProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
