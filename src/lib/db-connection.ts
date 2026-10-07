export function normalizePgConnectionString(value: string): string {
  try {
    const url = new URL(value);
    if (url.searchParams.get("sslmode") === "require") {
      url.searchParams.set("sslmode", "verify-full");
    }
    return url.toString();
  } catch {
    return value;
  }
}
