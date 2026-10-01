# Lesen reading passages — attribution

`lesen-data.ts` in this directory is a third-party dataset, not original
work of this project. It carries license obligations that survive being
bundled into the application.

## Source

| | |
|---|---|
| Project | [diprajkadlag/german-exam-trainer](https://github.com/diprajkadlag/german-exam-trainer) by Dipraj Kadlag |
| Files used | `content/exams/{a1,a2}-pruefung-01` through `-05`, the `lesen` section of each `exam.json` |
| License (content) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — see that repo's own `LICENSE-CONTENT` file |
| License (code, not used here) | MIT — see that repo's own `LICENSE` |

The repo licenses its source code (`apps/`, `packages/`, `tools/`) under
MIT and its exam content (`content/`, including generated audio/PDF)
separately under CC BY 4.0, per its own `LICENSE-CONTENT` and `NOTICE`
files and each `exam.json`'s `meta.lizenz` field. Only the content license
applies to anything in this file — no code from that repo was used.

## Required attribution

CC BY 4.0 requires credit, a link to the license, and a note of any
changes made. Using the exact wording that repo's own `LICENSE-CONTENT`
suggests:

> Exam content from **GermanExamTrainer** by Dipraj Kadlag,
> https://github.com/diprajkadlag/german-exam-trainer — licensed under
> [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## What we changed

Every passage's text, every question's prompt/options/answer, and every
explanation (`begruendung.en`) is the source's own content, used verbatim
— nothing was rewritten, corrected, or invented. What changed is only the
nesting: the source groups five comprehension items under one `teil`,
sometimes spanning two texts (A1 "kurzmitteilungen") or five texts (A1
"hinweisschilder"); this file regroups each individual text with just its
own matching items, so every record here is one passage with its own
question set, independent of its original siblings.

Not everything in the source's `lesen` section was carried over — see
`lesen-data.ts`'s own header comment for exactly which two item types
(A1 "wo_finde_ich", A2 "zuordnung_anzeigen") were left out and why
(matching/ad-pairing exercises, not single-passage comprehension).

## Originality — not independently verified

The source repo's own `LICENSE-CONTENT` and `docs/DISCLAIMER.md` state
that every exam text is original work created for that project, with no
connection to or copying from Goethe-Institut, telc, or ÖSD official
materials. **This claim was not independently verified against official
exam papers or commercial prep materials** — it rests entirely on the
source repository's own statement. If that statement turns out to be
inaccurate, the CC BY 4.0 grant may not actually cover this content, since
a license can only grant rights the licensor actually holds.
