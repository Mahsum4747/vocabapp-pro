import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Input } from "./ui/input";
import {
  acceptedValencySearchTerms,
  sourceValencyPronounQuestions,
} from "@/lib/german/valency-practice";
import { lookupAcceptedValencyReferences } from "@/lib/german/verb-valency-index";

/** Reference acceptance is independent of permission to diagnose an arbitrary answer. */
export function VerbValencyReference({ term }: { term?: string }) {
  const [query, setQuery] = useState("");
  const verb = term ?? query;
  const frames = lookupAcceptedValencyReferences(verb);
  return (
    <section className="mt-6 rounded-card bg-surface p-4" aria-label="Verb patterns">
      <h2 className="font-display text-lg font-medium">Verb patterns</h2>
      {!term && (
        <div className="mt-3">
          <label htmlFor="valency-verb" className="text-sm text-muted">
            Look up a German verb
          </label>
          <Input
            id="valency-verb"
            list="valency-verbs"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. sehen, sich erinnern"
          />
          <datalist id="valency-verbs">
            {acceptedValencySearchTerms().map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>
        </div>
      )}
      {!frames.length && (
        <p className="mt-3 text-sm text-muted">
          {verb.trim()
            ? "No sourced patterns available for this verb yet."
            : "Search to see patterns by meaning, with examples and sources."}
        </p>
      )}
      <div className="mt-3 space-y-4">
        {frames.map((frame) => {
          const context = frame.context[0];
          return (
            <article key={frame.provenance.record} className="border-t border-border pt-3 text-sm">
              <h3 className="font-medium" lang="de">
                {frame.construction} + {frame.preposition ? `${frame.preposition} + ` : ""}
                {frame.case === "akkusativ"
                  ? "Akkusativ"
                  : frame.case === "dativ"
                    ? "Dativ"
                    : "Genitiv"}
              </h3>
              <p className="mt-1 text-muted">Meaning: {context.glosses.join("; ")}</p>
              {context.requiredReflexive && (
                <p className="mt-1">
                  Use with a reflexive pronoun; this pattern does not apply to every use of the base
                  verb.
                </p>
              )}
              <details className="mt-2">
                <summary className="tap-target cursor-pointer text-muted">
                  Usage and source wording
                </summary>
                {context.rawGlosses.map((gloss, index) => (
                  <p key={index} className="mt-2 break-words">
                    {gloss}
                  </p>
                ))}
                {context.tags.filter(
                  (tag) =>
                    !["weak", "strong", "transitive", "intransitive", "irregular"].includes(tag) &&
                    !tag.startsWith("class-"),
                ).length > 0 && (
                  <p className="mt-2 text-muted">
                    {context.tags
                      .filter(
                        (tag) =>
                          !["weak", "strong", "transitive", "intransitive", "irregular"].includes(
                            tag,
                          ) && !tag.startsWith("class-"),
                      )
                      .join(", ")}
                  </p>
                )}
              </details>
              {context.examples.slice(0, 2).map((example, index) =>
                typeof example === "object" &&
                example !== null &&
                "text" in example &&
                typeof example.text === "string" ? (
                  <p key={index} className="mt-2" lang="de">
                    {example.text}
                  </p>
                ) : null,
              )}
              <a
                className="mt-2 inline-flex min-h-11 items-center text-primary-ink underline"
                href={`https://en.wiktionary.org/wiki/${encodeURIComponent(frame.lemma)}#German`}
                target="_blank"
                rel="noreferrer"
              >
                Wiktionary source
              </a>
            </article>
          );
        })}
      </div>
      {verb.trim() && sourceValencyPronounQuestions(verb).length > 0 && (
        <Link
          className="tap-target mt-3 inline-flex items-center rounded-control bg-primary-soft px-4 py-2 text-primary-ink"
          to="/grammar/pronomen"
          search={{ verb: verb.trim().toLocaleLowerCase("de-DE") }}
        >
          Practice pronouns in these examples
        </Link>
      )}
      {!!frames.length && (
        <p className="mt-3 text-xs text-muted">
          Patterns depend on meaning and usage. Source: Wiktionary via Kaikki, 3 October 2026.{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            CC BY-SA 4.0
          </a>
          . Source glosses are in English.
        </p>
      )}
    </section>
  );
}
