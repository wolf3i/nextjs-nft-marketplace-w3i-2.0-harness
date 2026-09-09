# ARCHITECTURE.md — nextjs-nft-marketplace-w3i-2.0

Pflichtlektüre vor jedem Commit. Verbindliche Code-Konventionen. Jede Regel
unten nennt ihre Belegstelle — eine Regel ohne Belegstelle gehört nicht in
diese Datei, sondern in `state/assumption-ledger.md`.

Zwei weitere `ARCHITECTURE.md` bestehen routenlokal und sind NICHT Teil
dieser Datei — sie regeln nur ihre eigene Route:
- `src/app/sell/ARCHITECTURE.md` — Architektur der `/sell`-Route.
- `src/app/history-towers/ARCHITECTURE.md` — Architektur des History-Towers-Spiels.

Siehe `state/memory-map.md` für die Abgrenzung, welche Information wohin
gehört.

## 1. Ordnerstruktur

Hook-Platzierung: Ein Hook, der in zwei oder mehr Stellen genutzt wird,
gehört global (`@/hooks/marketplace`); ein Hook, der nur innerhalb einer
Route gebraucht wird, bleibt routenlokal (`app/[route]/hooks`).
Belegt durch: `src/app/sell/ARCHITECTURE.md`, Zeilen 209–211.

Darüber hinaus gibt es noch keine belegte Konvention zur Ordnerstruktur —
nicht geprüft, deshalb hier nicht behauptet.

## 2. Datenzugriff

Jede Mutation, die `nft_metadata`, `marketplace_items` oder `nft_stats`
betrifft, muss durch die bestehenden Invalidierungs-Helfer in
`src/services/validation/data-invalidation.ts` laufen (`invalidateAfterListing`,
`invalidateAfterPurchase`, `invalidateAllCachesForNFT` u. a.) — direktes
Schreiben von Context-State ohne diese Helfer ist die häufigste Ursache für
veraltete UI-Anzeigen in diesem Projekt.
Belegt durch: `src/services/validation/data-invalidation.ts`, beschrieben in
`CLAUDE.md`.

## 3. Auth

Rollen und Sessions sind vollständig in einem eigenen Dokument geregelt.
Belegt durch: `docs/architecture/ROLES_AND_PERMISSIONS.md`.

## 4. Fehlerbehandlung

Jede Route unter `src/app/api/**/route.ts` wird mit `apiHandler()`
gewrappt — das übernimmt Fehlerformatierung, Logging, Rate-Limiting und
CORS. Kein handgerolltes try/catch + `NextResponse.json` <!-- check-docs-ignore: NextResponse.json ist ein Methodenaufruf, kein Dateiname --> in einer Route;
stattdessen einen typisierten Fehler werfen.
Belegt durch: `src/lib/api/handler.ts`, beschrieben in `CLAUDE.md`.

## 5. Kommentar-Standard

Siehe `docs/kommentar-standard.md`.

## 6. Test-Werkzeug

Vitest für Unit-/Komponententests, Playwright für E2E.
Belegt durch: `vitest.config.ts`, `playwright.config.ts`, `package.json`.

## 7. Verbotene Patterns

| Pattern | Warum verboten | Ausnahme | Belegstelle |
|---|---|---|---|
| Relative Imports (`../`, `../../`, …) | Erschwert Refactoring und Verschieben von Dateien | keine | `eslint.config.mjs`, `no-restricted-imports` |
| Import aus `**/archive/**` oder `*.deprecated*` | Diese Dateien sind nur Referenz, nicht Teil des Builds | keine | `eslint.config.mjs`, `no-restricted-imports` |

## 8. Definition of Done

Siehe `CLAUDE.md`. Keine projektspezifischen Ergänzungen über die dortige
Liste hinaus — nicht geprüft, deshalb hier nicht behauptet.
