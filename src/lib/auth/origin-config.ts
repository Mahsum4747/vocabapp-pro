/** Server configuration only: never derive trust from request headers or arbitrary Vercel hosts. */
export function authOriginConfig(
  environment: { baseURL?: string; vercelEnvironment?: string; vercelURL?: string },
  previewAllowedHosts: readonly string[],
) {
  const localOrigins = ["http://localhost:8080", "http://127.0.0.1:8080", "http://[::1]:8080"];
  const hostname = environment.vercelURL?.trim();
  // VERCEL_URL is a platform-generated deployment hostname, without a scheme.
  // Trust this exact HTTPS deployment only, never *.vercel.app or request Host.
  const deploymentOrigin =
    environment.vercelEnvironment === "preview" &&
    hostname &&
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.vercel\.app$/i.test(hostname)
      ? `https://${hostname.toLowerCase()}`
      : undefined;
  const explicitBaseURL = environment.baseURL?.trim() || undefined;
  const fixedBaseURL = explicitBaseURL ?? deploymentOrigin;
  return {
    baseURL: fixedBaseURL ?? {
      allowedHosts: [...previewAllowedHosts, "localhost", "127.0.0.1", "[::1]"],
      protocol: "auto" as const,
      fallback: "http://localhost:8080",
    },
    trustedOrigins: fixedBaseURL
      ? [new URL(fixedBaseURL).origin, ...localOrigins]
      : [
          ...previewAllowedHosts,
          ...previewAllowedHosts.flatMap((host) => [`https://${host}`, `http://${host}`]),
          ...localOrigins,
        ],
  };
}
