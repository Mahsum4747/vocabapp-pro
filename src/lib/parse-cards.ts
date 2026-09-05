export type ParsedCard = { term: string; definition: string };

/**
 * Delimiters tried in order, most-precise first, so a term that happens to
 * contain a comma or a hyphen (e.g. "well-known") doesn't get mis-split by a
 * looser pattern before a more specific one gets a chance. Each pattern
 * matches exactly one split point — the first occurrence in the line.
 */
const DELIMITERS: RegExp[] = [
  /\t+/, // tab (spreadsheet/export paste)
  /\s*;\s*/, // semicolon
  /\s+[-–—−]\s+/, // dash with a space on both sides: "term - definition"
  /[-–—−]\s+|\s+[-–—−]/, // dash with a space on just one side: "term- definition" / "term -definition"
  /:\s+/, // colon followed by a space
  /,\s+/, // comma followed by a space
  /[-–—−]/, // bare dash, no surrounding space at all — last resort
];

function splitOnFirstDelimiter(line: string): ParsedCard | null {
  for (const pattern of DELIMITERS) {
    const match = pattern.exec(line);
    if (!match) continue;
    const term = line.slice(0, match.index).trim();
    const definition = line.slice(match.index + match[0].length).trim();
    if (term && definition) return { term, definition };
  }
  return null;
}

export function parseCardText(raw: string): ParsedCard[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => splitOnFirstDelimiter(line) ?? { term: line, definition: "" })
    .filter((card) => card.term.length > 0);
}

export function serializeSetExport(payload: unknown) {
  return JSON.stringify(payload, null, 2);
}
