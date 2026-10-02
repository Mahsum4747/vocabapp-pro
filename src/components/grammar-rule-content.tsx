import type { GrammarRule } from "@/content/grammar-rules";

/**
 * The intro/table/examples body of a `GrammarRule` — exactly the markup
 * grammar-drill-runner.tsx's "See the rule" dialog used to render inline.
 * Pulled out so the standalone rule library (grammar.rules.tsx) can show
 * the identical content without a second copy of this JSX.
 */
export function GrammarRuleContent({ rule }: { rule: Omit<GrammarRule, "topic"> }) {
  return (
    <>
      <p className="text-sm text-muted">{rule.intro}</p>
      {rule.table ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {rule.table.headers.map((header) => (
                  <th key={header} className="p-2 text-left font-medium text-muted">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rule.table.rows.map((row) => (
                <tr key={row.join("|")} className="border-b border-border/60">
                  {row.map((cell, i) => (
                    <td key={i} className="p-2 text-fg">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {rule.examples ? (
        <ul className="mt-4 space-y-1 text-sm text-fg">
          {rule.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
