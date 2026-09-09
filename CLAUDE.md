# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Pflichtlektüre

Lies `ARCHITECTURE.md` bevor du Code schreibst. Alle Konventionen dort sind
verbindlich. Aktueller Phasenstand und Scope: siehe `docs/STATUS.md`.

## Commands

```bash
# Development
npm run dev                    # Next.js dev server (Turbopack)
npm run build                  # Production build
npm start                      # Start production server

# Quality gates (run all three before considering work done — CI runs the same)
npm run lint                   # ESLint
npm run typecheck              # tsc --noEmit
npm run test:coverage          # Vitest with coverage

# Tests
npm test                       # Vitest watch mode
npm run test:run               # Vitest single run
npx vitest run path/to/file.test.ts        # Single test file
npx vitest run -t "test name"              # Single test by name
npm run test:e2e               # Playwright e2e (tests/e2e/*.spec.ts)
npm run test:e2e:headed        # Playwright with browser visible

# Background worker (separate process from the web server — see Runtime roles below)
npm run worker:start
npm run sync:marketplace        # One-off TheGraph → MongoDB sync
npm run env:check               # Validate required env vars are set
npm run env:check:prod          # Same, against production requirements
```

Node version: see `engines` in `package.json` and `.nvmrc` for the pinned dev version.

## Architecture

### Runtime roles: web vs. worker

This app runs as two separate processes sharing one codebase, controlled by `APP_RUNTIME_ROLE` (`web` | `worker` | `all`):

- `instrumentation.ts` (Next.js server startup hook) calls `initializeBackgroundServices()` from `src/lib/init-services.ts` unless `APP_RUNTIME_ROLE=web`.
- The **worker** process runs the NFT sync service, MongoDB index setup, marketplace/image cache prewarming, and image enrichment — see `scripts/production/background-worker.ts` and `npm run worker:start`.
- The **web** process (`APP_RUNTIME_ROLE=web`) skips all of that and only serves requests.
- When developing locally with `npm run dev`, background services start in the same process (`role=all` by default).

Do not assume every server-side module runs in every request — code under `src/services/nft-sync/` and `src/lib/init-services.ts` is worker-lifecycle code, not per-request code.

### Data architecture: three MongoDB collections, one source of truth

Three collections (`nft_metadata`, `marketplace_items`, `nft_stats`) — full field breakdown and sync strategy in `docs/database/README.md`.

When adding a feature that reads NFT data, prefer reading from `nft_metadata` (via `src/lib/db/nft-metadata.ts`) over calling Alchemy or the chain directly — measured with `npm run bench:api`, that is ~56ms p50 versus ~497ms for a cold Alchemy discovery call.

### API layer: `apiHandler` + middleware, always

Every route in `src/app/api/**/route.ts` is wrapped in `apiHandler()` (`src/lib/api/handler.ts`), which handles error formatting, logging, rate limiting, and CORS. Don't hand-roll try/catch + `NextResponse.json` in a route — throw a typed error instead. <!-- check-docs-ignore: NextResponse.json ist ein Methodenaufruf, kein Dateiname --> Quick-reference examples and the full middleware list (`withAuth`, `withAdmin`, `withValidation`, `rateLimit`) are in `src/lib/README.md`; rate-limit tiers are in `docs/api/routes.md`; the admin signature/session flow is in `docs/api/authentication.md`.

Admin routes (`/admin/*`, `/api/admin/*`, `/api/nft/admin/*`) are additionally gated at the edge by `middleware.ts`, which verifies the `admin-session` JWT cookie before the request even reaches the route handler.

### Context layer: one domain = Context + Cache + Service (+ Events)

State for each data domain lives under `src/contexts/<domain>/` following a consistent Context + Cache + Service split — domain list and usage examples in `src/contexts/README.md`.

Cross-cutting cache invalidation goes through `src/services/validation/data-invalidation.ts` (`invalidateAfterListing`, `invalidateAfterPurchase`, `invalidateAllCachesForNFT`, etc.) and a `nft-stats-updated` / invalidation event system — mutating one collection's data without invalidating the related caches is a common source of stale-UI bugs here, so always route mutations through the existing invalidation helpers rather than updating context state directly.

### Service layer (`src/services/`)

Stateless, framework-agnostic business logic — never hold React state here, never call these directly from a component without going through a hook. Directory breakdown (`blockchain/`, `cache/`, `marketplace/`, `nft-sync/`, `multisig/`) is in `src/services/README.md`.

### Import conventions (enforced by ESLint, not just style)

- **No relative imports.** `eslint.config.mjs` has `no-restricted-imports` forbidding `../` patterns — always import via the `@/` path alias, even for sibling files.
- **Never import from `**/archive/**` or `*.deprecated*`** — these exist for reference only and are excluded from the build; importing them is an ESLint error.

### Deployment / process model

- `nixpacks.toml` / `Dockerfile` build for Railway-style deployment; `APP_RUNTIME_ROLE` differentiates the web dyno from the worker dyno at runtime (same image, different start command — `npm start` vs `npm run worker:start`).
- Sentry is wired in `instrumentation.ts` / `sentry.server.config.ts` / `sentry.edge.config.ts`.

## Where to look for more detail

`docs/` is organized by topic and generally up to date — check it before re-deriving architecture from scratch:
- `docs/architecture/overview.md` — contexts, caching, data flow, component patterns.
- `docs/api/routes.md`, `docs/api/authentication.md` — full API surface and auth flow.
- `docs/database/README.md` and `docs/database/schemas/` — collection schemas.
- `docs/development/setup.md` — environment setup.
- Several subfolders (`src/lib/`, `src/contexts/`, `src/services/`) have their own `README.md` with quick-reference usage examples for that layer.

## Arbeitsweise — IMMER einhalten

### Vor jeder Aufgabe: Briefing
```
1. Ziel der Iteration
2. Relevante Referenz (Design-Screenshot, Spec-Datei — je nach Projekt)
3. Komponenten/Module und Datenbedarf
4. Zustände: Default / Leer / Ladend / Fehler / Hover
5. Akzeptanzkriterien
6. Risiken
```

### Iterationsprinzip
- Jede Iteration ist klein, prüfbar und abgeschlossen.
- Keine großen Funktionspakete auf einmal. Erst planen, dann umsetzen.
- Ein Task nach dem anderen pro Arbeitsverzeichnis — mehrere
  Arbeitsverzeichnisse (Worktrees) dürfen parallel laufen.
- Ein Schreiber pro Arbeitsverzeichnis. Keine zweite Sitzung im selben
  Ordner; parallele Arbeit nur in getrennten git-Worktrees.
- Ein Zielverzeichnis pro Auftrag. Hat eine Sitzung Zugriff auf mehrere
  Ordner, benennt jeder Auftrag sein Zielverzeichnis ausdrücklich und
  beginnt mit einer Prüfung des Arbeitsverzeichnisses — passt es nicht,
  wird abgebrochen statt gewechselt. Jeder Befehlsblock beginnt mit `cd`
  auf den vollständigen Pfad, nie mit einem relativen Sprung. Das gilt für
  Mensch und Modell gleichermaßen: Ein verfügbarer Zweitordner ist bequem
  und genau deshalb gefährlich.
- Iterationsende heißt: `git status` prüfen, Freigabe einholen, committen
  UND pushen (Skill `git-flow`). Eine Bremse ohne Gaspedal erzeugt Halden.
- Keine Versionsnummern in Prosa. Versionen stehen ausschließlich in der
  Paketdatei des Stacks.
- Zuschnitt-Heuristik für Handoff-Verträge: ein Baudurchgang plus höchstens
  eine Korrekturrunde ohne Eskalation, mit eigenständig prüfbarem Artefakt
  (Test + grünes `npm run check`). Abhängigkeit von einer vorherigen Phase
  ist kein Zuschnittsfehler, solange sie im CONTEXT-Abschnitt explizit
  benannt ist.

### Definition of Done
- [ ] Komponenten/Module sind wiederverwendbar
- [ ] Typisiert, kein neues `any` in geändertem Code (Geltungsgrenze: der
      Bestand hat 206 vorhandene `any`-Vorkommen, davon 24 in den Dateien,
      die die aktuelle Migration umbaut — ohne diese Grenze wäre die
      Checkbox eine Ermessensfrage)
- [ ] Fehlerzustände berücksichtigt (catch + Logging)
- [ ] Leere Zustände berücksichtigt
- [ ] Lange Texte zerstören das Layout nicht
- [ ] Mobile Darstellung berücksichtigt; jeder Container mit max-width hat
      auch width: 100%
- [ ] Design bleibt treu (Design-Tokens, keine neuen Farben/Schatten ohne
      Freigabe)
- [ ] Code ist sinnvoll kommentiert (Datei-Header + Funktionsdoku, siehe
      `docs/kommentar-standard.md`)
- [ ] `npm run check` → Exit 0
- [ ] KEINE Commits ohne explizite Freigabe

## Prüfrollen als Subagenten

Liegen als echte Subagenten in `.claude/agents/`: eigener Kontext, keine
Schreibrechte (`tools: Read, Grep, Glob`). Sie werden nicht gelesen, sondern
delegiert.

| Rolle | Wofür |
|---|---|
| `architecture-advisor` | Pläne VOR dem Bau prüfen |
| `code-reviewer` | Code nach dem Bauen prüfen |
| `qa` | Akzeptanztests und Randfälle definieren |

Sie können ihre Befunde nicht selbst wegräumen — das ist Absicht. Ein
Prüfer mit Schreibrechten wird heimlich zum Autor.

## Entscheidungsregel bei Unsicherheit

1. Design-Referenz respektieren
2. Aktuellen Scope laut `docs/STATUS.md` einhalten
3. Wartbarkeit bevorzugen
4. Komplexität reduzieren
5. Entscheidung dokumentieren — niemals stillschweigend in Code verwandeln

## Status-Format (Jede Ausgabe endet damit)

```
## Status
- [ ] Freigegeben
- [ ] Freigegeben mit Hinweisen
- [ ] Nicht freigegeben
- [ ] Blockiert

## Nächster sinnvoller Schritt
...
```

## Bekannte Fallen

Entwickelt wird unter WSL im Linux-Dateisystem, Host ist Windows. Von den
umgebungsbedingten Fallen einer Windows/WSL-Entwicklung ist hier nur eine
relevant — kein cloudsynchronisierter Ordner (OneDrive/Dropbox) im Spiel,
also entfällt die dortige Reparse-Point-Falle.

- Symptom: `git status` meldet Dutzende unangetasteter Dateien als
  geändert, der Diff zeigt jede Zeile als ersetzt — tritt auf, wenn
  dasselbe Repo aus einer Linux-Umgebung betrachtet wird (gemountetes
  Windows-Verzeichnis). Ursache: Arbeitskopie hat CRLF, die Git-Datenbank
  LF, `core.autocrlf` dort nicht gesetzt.
- Was tun: Nicht von der Linux-Seite aus stagen oder committen. Windows-Git
  ist die maßgebliche Sicht. Gegenprüfen: `git diff --ignore-cr-at-eol`
  oder `file <datei>` gegen `git show HEAD:<datei> | cat -A`.

- Symptom: Ein Test-/Gate-Lauf scheitert einmalig ohne erkennbaren Grund
  (kein Code, keine Config geändert) und läuft beim nächsten Versuch grün.
- Was tun: Erst wiederholen, bevor man etwas repariert. Tritt es erneut
  auf: Uhrzeit, Umgebungszustand (z. B. laufende Cloud-Sync) festhalten —
  ohne diese Angaben bleibt der Fehler unerklärbar.

- Projektspezifische Fallen hier ergänzen, sobald sie zweimal aufgetreten
  sind. Eine einmalige Beobachtung ist noch kein Muster.
