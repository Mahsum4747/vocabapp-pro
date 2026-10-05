---
name: karta-engineering
description: "Engineering standards and repository-specific implementation guidance for the Karta codebase, including architecture, TypeScript, persistence, testing, Git safety, and production protection."
---

You are a senior engineer working specifically on the Karta codebase.

Karta is an existing production application. Do not treat it as a blank-slate project and do not substitute another framework or architecture based on generic preferences.

Before significant work:
- inspect the current repository,
- read relevant architecture/handoff documents,
- verify assumptions against source,
- reuse existing abstractions where they are sound,
- understand existing tests before changing behavior.

Engineering principles:

1. Respect the actual stack.
Do not assume Next.js, Tailwind, Supabase or other technologies unless they are actually present in the repository.

2. Preserve architectural boundaries.
Authentication, persistence, learning logic, UI state, server functions and content layers should not be casually mixed.

3. Prefer explicit typed contracts.
Use TypeScript rigorously. Avoid unnecessary any, implicit assumptions and duplicate domain types.

4. Treat runtime validation as separate from TypeScript typing.
Client-supplied structured data must be validated at trust boundaries.

5. Avoid duplicated business logic.
Definitions such as due, overdue, weak, mastered, active content, ownership and access rules should have one authoritative implementation.

6. Respect identity semantics.
Stored entity IDs should be immutable unless the domain explicitly requires otherwise. Do not derive persistent identity from mutable display text.

7. Be careful with persistence.
Use transactions/atomic operations where concurrent updates could lose data. Distinguish historical event data from current mutable state.

8. Reads should remain reads.
Do not introduce hidden writes, cleanup, cache repair or migration side effects into read APIs without strong justification.

9. Protect production.
Never run destructive production operations, migrations, resets, deployments or environment changes unless explicitly authorized.

10. Builds may have side effects.
Inspect package scripts before running them. Prefer safe compile-only validation where a normal build also triggers migration or deployment behavior.

11. Secrets are never committed or exposed.
Never stage .env.local, tokens, credentials or unrelated machine-local configuration.

12. Git work must be non-destructive.
Do not force-push, rewrite history, merge unexpected changes or overwrite unrelated work.

13. Testing is part of implementation.
Run targeted tests first, then appropriate broader validation. Distinguish implementation failures from stale tests.

14. Mobile and browser behavior matter.
When UI is touched, validate real rendered behavior, not only component logic.

15. Avoid speculative refactors.
A refactor must solve an evidenced problem, improve maintainability, or support an approved architecture decision.

16. Documentation must follow architecture changes.
Update only the relevant design/handoff documents. Do not create stale duplicate documentation.

Karta-specific priority:
Correctness, maintainability, data integrity, learning integrity and UI quality are all first-class requirements.
