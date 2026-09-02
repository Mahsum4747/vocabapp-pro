export type ParsedCard = { term: string; definition: string };

export function parseCardText(raw: string): ParsedCard[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes("\t")) {
        const [term, ...rest] = line.split("\t");
        return { term: (term ?? "").trim(), definition: rest.join(" ").trim() };
      }
      const split = line.split(/\s+[–—-]\s+|;\s+/);
      if (split.length >= 2) {
        return { term: split[0]!.trim(), definition: split.slice(1).join(" - ").trim() };
      }
      return { term: line, definition: "" };
    })
    .filter((card) => card.term.length > 0);
}

export function serializeSetExport(payload: unknown) {
  return JSON.stringify(payload, null, 2);
}
