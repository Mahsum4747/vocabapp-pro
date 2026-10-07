import { ArrowLeft, BookOpenText, ChevronDown, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { EmptyState } from "@/components/empty-state";
import { GrammarRuleContent } from "@/components/grammar-rule-content";
import { PersonalGrammarNoteGenerator } from "@/components/personal-grammar-note-generator";
import { Input } from "@/components/ui/input";
import { GRAMMAR_RULES, type GrammarRuleTopic } from "@/content/grammar-rules";

export const Route = createFileRoute("/grammar/rules")({
  component: GrammarRulesRoute,
});

/**
 * Read-only browse page over the same `GRAMMAR_RULES` content the "See the
 * rule" dialogs (grammar-drill-runner.tsx, via `GrammarRuleContent`) already
 * show mid-drill — no new rule text, just a second way to reach the
 * existing content without opening a drill first. Category grouping and
 * labels mirror grammar.index.tsx's own CATEGORIES/standaloneTo links for
 * these topics (duplicated here only as this small static map, not as a
 * reimport — grammar.index.tsx's CATEGORIES carries icons/eligibility
 * functions this page has no use for).
 */
const RULE_CATEGORIES: { title: string; topics: GrammarRuleTopic[] }[] = [
  { title: "Basics", topics: ["plural", "nicht-kein"] },
  { title: "Cases & Pronouns", topics: ["possessive", "pronomen", "helfen-dativ", "mit-dativ", "adjektivendungen"] },
  { title: "Verbs", topics: ["trennbare-verben", "modalverben", "imperativ", "passiv", "konjunktiv"] },
  { title: "Sentences", topics: ["steigerung", "relativsaetze"] },
  {
    title: "B2/C1",
    topics: [
      "partizipialkonstruktionen",
      "nominalisierung",
      "funktionsverbgefuege",
      "modalpartikeln",
      "konjunktiv1",
      "subjektive-modalverben",
      "passiversatzformen",
    ],
  },
];

function GrammarRulesRoute() {
  return (
    <AuthGate>
      <GrammarRulesPage />
    </AuthGate>
  );
}

function GrammarRulesPage() {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<GrammarRuleTopic>>(new Set());

  const q = query.trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!q) return RULE_CATEGORIES;
    return RULE_CATEGORIES.map((category) => ({
      title: category.title,
      topics: category.topics.filter((topic) => GRAMMAR_RULES[topic].title.toLowerCase().includes(q)),
    })).filter((category) => category.topics.length > 0);
  }, [q]);

  const totalShown = filteredCategories.reduce((n, c) => n + c.topics.length, 0);

  function toggle(topic: GrammarRuleTopic) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  }

  return (
    <AppShell>
      <Link
        to="/grammar"
        className="tap-target inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        Grammar
      </Link>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary-ink">Reviewed reference</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">Grammar Reference</h1>
          <p className="mt-2 text-muted">
            Reviewed Karta explanations, linked to personal notes and targeted practice.
          </p>
        </div>
        <Link
          to="/grammar/notes"
          className="tap-target inline-flex items-center gap-2 rounded-control bg-surface-2 px-3 py-2 text-sm font-medium"
        >
          <BookOpenText className="size-4" />
          My Grammar Notes
        </Link>
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rules by topic…"
          className="pl-9"
        />
      </div>

      {totalShown === 0 ? (
        <div className="mt-8">
          <EmptyState title="No matching rules" description="Try a different search term." />
        </div>
      ) : (
        <div className="mt-section space-y-section">
          {filteredCategories.map((category) => (
            <div key={category.title}>
              <h2 className="text-sm font-medium tracking-wide text-muted uppercase">{category.title}</h2>
              <div className="mt-3 space-y-2">
                {category.topics.map((topic) => {
                  const rule = GRAMMAR_RULES[topic];
                  const isCollapsed = collapsed.has(topic);
                  return (
                    <div
                      key={topic}
                      id={topic}
                      className="scroll-mt-24 rounded-card bg-surface p-4 shadow-[var(--elevation-1)]"
                    >
                      <button
                        type="button"
                        onClick={() => toggle(topic)}
                        className="tap-target flex w-full items-center gap-1.5 text-left font-display text-base font-medium"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="size-4 shrink-0 text-muted" />
                        ) : (
                          <ChevronDown className="size-4 shrink-0 text-muted" />
                        )}
                        {rule.title}
                      </button>
                      {!isCollapsed ? (
                        <div className="mt-2 pl-[22px]">
                          <GrammarRuleContent rule={rule} />
                          <PersonalGrammarNoteGenerator topic={topic} />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
