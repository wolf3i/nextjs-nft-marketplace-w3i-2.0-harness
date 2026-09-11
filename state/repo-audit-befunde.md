<!--
Ziel-Pfad im Repo: state/repo-audit-befunde.md
Stand dieser Fassung: 10.09.2026
Erzeugt durch: state/tasks/harness-phase3b-doku-sanierung.md, Verfahren
.claude/skills/repo-audit/SKILL.md. Momentaufnahme, kein Anhänge-Protokoll —
ein späterer Audit schreibt eine neue Fassung, statt Zeilen anzuhängen.
-->
# Repo-Audit-Befunde — nextjs-nft-marketplace-w3i-2.0

## Klassen

- **A** — in diesem Auftrag behoben (Auftrag Punkt 3/4/5, Gate rot, oder toter
  Pfadverweis **in Anweisungs- und Harness-Dokumenten**: `CLAUDE.md`,
  `ARCHITECTURE.md`, `README.md`, `SETUP.md`, `.claude/`, `state/`,
  `docs/harness/`). Diese Eingrenzung hat der Mensch am 10.09.2026 entschieden;
  wörtlich genommen hätte Klasse A alle rund 145 toten Verweise umfasst.
- **B** — gemeldet, nicht behoben. Vorlage für einen späteren Auftrag.
- **C** — Falschtreffer, mit Begründung.

## Verfahren und Abdeckung

Ehrliche Grenze vorab: Die Doku ist **nicht** Aussage für Aussage vollständig
geprüft. `docs/` hat 70 Markdown-Dateien (nicht 59 wie im Auftrag, Stand
07.09.2026), das Repo insgesamt 131 getrackte, zusammen rund 31 000 Zeilen.

| Prüfung | Umfang | Tiefe |
|---|---|---|
| Tote Pfadverweise (Backtick-Pfade und Markdown-Links, aufgelöst relativ zur Datei und zur Wurzel, dazu Suche nach verschobenen Dateien) | alle getrackten `.md` außer `**/archive/**` und `state/tasks/` (abgeschlossene Verträge, historisch) — 123 Dateien | vollständig, maschinell, jeder Treffer einzeln eingeordnet |
| Strukturbäume in Codeblöcken | `README.md`, `docs/harness/HARNESS-OVERVIEW.md` | vollständig |
| Aussage für Aussage | `CLAUDE.md`, `ARCHITECTURE.md`, `.github/copilot-instructions.md` | vollständig |
| Aussage für Aussage | `README.md` | Abschnitte Getting Started, Known Issues, Project Structure, Deployment, Development, API Routes. **Nicht**: Features, Deep Dive, Configuration, Architecture Benefits, Contributing |
| Aussage für Aussage | `.claude/agents/*.md`, `SETUP.md`, `state/memory-map.md` | nur Stichprobe auf prüfbare Behauptungen (`memory-map.md` beim Ergänzen gelesen) |
| Aussage für Aussage | übrige 67 Dateien in `docs/`, `src/**/README.md`, `.claude/skills/` | **nicht geprüft** — Budget. Eigener Auftrag |

## Zusammenfassung

| Klasse | Befunde | davon Einzelverweise |
|---|---|---|
| A | 6 | 35 geänderte Stellen (21 Baum-Einträge, 10 Überschriften, 2 Verweise, 1 Regelzeile, 1 Löschung) |
| B | 44 | 19 Einzelbefunde + 25 Altdokumente mit zusammen 106 toten Verweisen, dazu ein Code-Hinweis |
| C | 12 | Trefferzahl je Zeile in der Tabelle |

## Klasse A — behoben

| Fundort | Behauptung | Ist-Stand | Kategorie | Alter | Behebung |
|---|---|---|---|---|---|
| `.github/copilot-instructions.md` | Projekt-Checkliste und Architekturüberblick | Inhalt deckungsgleich mit `README.md` (Messwerte samt Datum dort Z. 608–613), Rest unbelegt oder veraltet (`useCollectionWhitelist` „removed“ — existiert noch) | veraltet | 03.09.2026 | gelöscht (`git rm`). Grep: nur `state/tasks/*.md` nennen den Pfad, und zwar als Löschanweisung — Mensch hat Löschung am 10.09.2026 freigegeben |
| 10 Überschriften: `docs/harness/HARNESS-{CHANGELOG:2,GLOSSARY:5,LEARNING-STATE:12,OVERVIEW:7}.md`, `state/{assumption-ledger:2,gates:2,memory-map:2,reibung:21,tooling:2,triggers:2}.md` | Projektname `…-w3i-2.0-harness` | Projektname laut `package.json`: `nextjs-nft-marketplace-w3i-2.0` | veraltet | 08.09.2026 | auf Paketnamen umgestellt |
| `CLAUDE.md:132` | DoD-Regel enthält Bestandszahlen 206 / 24 | Zahl in einer Regel ist nach der ersten Änderung nicht mehr von einem Fehler zu unterscheiden | veraltet | 08.09.2026 | Zahlen aus der Regel entfernt, datierte Messnotiz mit Befehl darunter |
| `README.md`, Strukturbaum (Abschnitt ab Z. 231) | 21 Pfade (`core/BaseCard.tsx` …, fünf Context-Dateien, `useForm.ts`, `TransactionService.ts`, `services/nft/`, `types/{nft,api,events}.ts`, drei `utils/*.ts`, `constants/`, `schemas/`) | verschoben in Unterordner bzw. ohne Nachfolger gelöscht | tot | 08.09.2026 | auf reale Orte korrigiert; ohne Nachfolger (`NFTContext`, `services/nft/`, `constants/`, `schemas/`) entfernt |
| `SETUP.md:61` | `state/tasks/harness-fix-4-pruefkette-und-vertragspruefung.md` | Template-Auftrag, nie in dieses Repo übernommen | tot | 08.09.2026 | durch Herkunftsangabe ohne Pfad ersetzt |
| `docs/harness/HARNESS-GLOSSARY.md:15` | Fundstelle `README.md` und `docs/guide/00-START-HIER.md` | Datei existiert nicht, `README.md` erwähnt den Begriff nicht; erklärt wird er in `docs/harness/HARNESS-OVERVIEW.md` ab Z. 64 | tot | 08.09.2026 | Fundstelle korrigiert |

## Klasse B — gemeldet, nicht behoben

### Anweisungsdokumente und Gates

| Fundort | Behauptung | Ist-Stand | Kategorie | Alter |
|---|---|---|---|---|
| `CLAUDE.md:132` (bis 10.09.2026) | „davon 24 in den Dateien, die die aktuelle Migration umbaut" | **Entfernt, weil nicht reproduzierbar**: Die Dateiliste der Migration ist nirgends festgehalten, und keine Zählung über die vier Routen aus `specs/marktplatz-fertigstellung.md` ergibt 24 (18, 18, 36 oder 41, je nach Muster). Die Zahl 206 steht weiter in `specs/marktplatz-fertigstellung.md:155` und `:176` | unbelegt | 08.09.2026 |
| `CLAUDE.md:69`, `ARCHITECTURE.md:30` | `invalidateAllCachesForNFT` liegt in `src/services/validation/data-invalidation.ts` | liegt in `src/lib/cache.ts:112`; `data-invalidation.ts` exportiert es nicht | veraltet | 08.09.2026 |
| `CLAUDE.md:18` | „Quality gates (run all three … CI runs the same)": lint, typecheck, test:coverage | Gate laut DoD ist `npm run check` (sieben Stufen); CI fährt `check`, `test:coverage`, Audit, Build | veraltet | 08.09.2026 |
| `CLAUDE.md:82` | Web-Prozess startet mit `npm start` | `Dockerfile:36` startet `npm run start:web`; nur `nixpacks.toml:11` nutzt `npm start` | veraltet | 08.09.2026 |
| `Dockerfile:1` ↔ `.nvmrc` | — | Produktionsimage `node:22`, Entwicklungsstand `.nvmrc` 20.19.0; nirgends dokumentiert, ob Absicht | undokumentiert | 18.03.2026 |
| `.claude/agents/code-reviewer.md:19` | „kein Escape-Hatch (kein `any` o.ae.)" | widerspricht der Geltungsgrenze der DoD („kein **neues** `any` in geändertem Code") — der Reviewer mahnt Altbestand an | veraltet | 08.09.2026 |
| `README.md:148` | Node.js 18.17 or later | `package.json` engines `>=20.19.0`; zudem Versionsangabe außerhalb der Paketdatei | veraltet | 08.09.2026 |
| `README.md:157`, `:466` | Klon-/Deploy-URL `github.com/yourusername/…` | Platzhalter; welches Repo gemeint ist (dieses, `NiklasHoffmann/…` aus `docs/development/setup.md:18`, `web3ideation/…` aus `MigrationBanner.tsx:74`), entscheidet der Mensch | veraltet | 08.09.2026 |
| `README.md:179–198` | Env-Block: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_INFURA_PROJECT_ID`, `COINGECKO_API_KEY` | Code liest `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (`src/config/wagmi.ts:28`); die übrigen drei liest kein Code. Kein Code-Fehler: beide Templates führen beide Schreibweisen, `env:check` prüft die richtige | veraltet | 08.09.2026 |
| `README.md:227` | Known Issue: `@ts-ignore` in Middleware und Routen | 0 Vorkommen in `src/` | veraltet | 08.09.2026 |
| `README.md:228`, `docs/api/authentication.md:407` | Admin-Auth-Tests „pending" / „(TODO)" | drei Testdateien existieren (`src/lib/middleware/__tests__/auth.test.ts`, `src/app/api/auth/{session,verify}/route.test.ts`) | veraltet | 08.09.2026 / 03.09.2026 |
| `README.md:460` | „Vercel (Recommended)" | Projekt braucht eigenen Worker-Prozess (`CLAUDE.md` Runtime roles, `Dockerfile:38–52`), den Vercel nicht betreibt | veraltet | 08.09.2026 |
| `README.md:483` | Code Quality: lint, `tsc`, build | `npm run check` fehlt | veraltet | 08.09.2026 |
| `SETUP.md:54–56` | CI von `check:template` auf `check` umstellen | längst erledigt, `ci.yml:32` fährt `npm run check` | veraltet | 08.09.2026 |
| `state/memory-map.md:29` | Aufteilungsregel steht im Kopfkommentar von `ARCHITECTURE.md` | `ARCHITECTURE.md` hat keinen Kopfkommentar und keine Aufteilungsregel — Template-Rest | tot (Abschnitt, kein Pfad) | 08.09.2026 |
| `state/memory-map.md:30` | Datenbankschema wird aus Migrationen erzeugt, keine handgepflegte Schema-Datei unter `docs/` | es gibt keine Migrationen; `docs/database/schemas/` ist handgepflegt — Template-Rest eines anderen Stacks | veraltet | 08.09.2026 |
| `state/memory-map.md:31` | API-Vertrag wird aus dem Code erzeugt, keine handgepflegte API-Datei unter `docs/` | `docs/api/routes.md` (652 Zeilen) ist handgepflegt und wird von `CLAUDE.md` als Referenz genannt | veraltet | 08.09.2026 |
| `scripts/check-docs.mjs`, Prüfung 1 | prüft Pfadverweise in Anweisungsdokumenten | sieht nur Pfade **in Backticks** — 21 tote Einträge im README-Strukturbaum liefen grün durch | Gate-Lücke | 08.09.2026 |
| `scripts/check-docs.mjs`, Prüfung 2 | findet Versionsnummern | liest „Stand 08.09.2026" als Techname + Version (Fehlalarm); die Messnotiz in `CLAUDE.md` ist deshalb als „Messung vom …" formuliert (Entscheidung des Menschen, 10.09.2026) | Gate-Fehlalarm | 08.09.2026 |

### Altdokumente — tote Pfadverweise, je Datei eine Zeile

Überwiegend verschobene Dateien (z. B. `src/components/admin/*` → `src/app/admin/components/*`,
`src/contexts/NFTStatsContext.tsx` → `src/contexts/nft-stats/`), dazu falsch relative
Markdown-Links (`../docs/…` aus `src/services/` zeigt auf `src/docs/…`).

| Fundort | Zeilen | Anzahl | Alter |
|---|---|---|---|
| `docs/admin/MULTISIG_MIGRATION_PLAN.md` | 58, 67, 70, 85, 90, 96, 101, 107, 114 — Datei behauptet „100% Complete", beschreibt also den Ist-Zustand | 9 | 22.01.2026 |
| `docs/admin/MULTISIG_WALLET_INTEGRATION.md` | 148, 165, 171, 189, 195, 202, 208, 215, 222 | 9 | 22.01.2026 |
| `docs/architecture/caching.md` | 170, 192, 243 | 3 | 22.01.2026 |
| `docs/architecture/components-placement-decision.md` | 36–39, 340, 341 | 6 | 23.01.2026 |
| `docs/architecture/events.md` | 51 (Link) | 1 | 10.02.2026 |
| `docs/architecture/features.md` | 10, 31, 67, 79, 300, 310, 363, 389, 400, 600, 641, 642 | 12 | 22.01.2026 |
| `docs/architecture/fees.md` | 9, 69, 74, 79, 84 | 5 | 22.01.2026 |
| `docs/architecture/overview.md` | 36, 56, 122, 219, 232 — dazu `invalidateAllCachesForNFT` wie oben | 5 | 22.01.2026 |
| `docs/architecture/route-components-analysis.md` | 40 | 1 | 23.01.2026 |
| `docs/architecture/utilities.md` | 88, 122 (2×) | 3 | 10.02.2026 |
| `docs/database/quick-fix.md` | 39 (Link) | 1 | 22.01.2026 |
| `docs/database/troubleshooting.md` | 98 — Skript liegt in `scripts/archive/tests/` | 1 | 22.01.2026 |
| `docs/development/CONFIG_MIGRATION.md` | 14, 15, 20, 33, 38, 48, 56, 57 | 8 | 12.02.2026 |
| `docs/development/setup.md` | 675 | 1 | 12.02.2026 |
| `scripts/README.md` | 201, 202 (Links) | 2 | 22.01.2026 |
| `src/app/README.md` | 498–501 (Links) | 4 | 12.02.2026 |
| `src/app/history-towers/ARCHITECTURE.md` | 1538, 1539 (Links) — routenlokal, laut Auftrag nicht anzufassen; Z. 1233 zudem verstümmelt („Part of … background: '#f8f9fa',") | 2 | 12.11.2025 |
| `src/app/history-towers/README.md` | 134 | 1 | 12.11.2025 |
| `src/components/README.md` | 78, 715 (Links) | 2 | 12.02.2026 |
| `src/components/core/README.md` | 809 (Link) | 1 | 23.01.2026 |
| `src/components/nft/README.md` | 341, 369, 397, 708 | 4 | 12.02.2026 |
| `src/hooks/README.md` | 651–653, 658, 659, 663, 664 | 7 | 12.02.2026 |
| `src/services/README.md` | 27, 246, 474, 475, 496–499, 519 | 9 | 12.02.2026 |
| `src/services/REORGANIZATION_SUMMARY.md` | 25, 26, 55, 137 | 4 | 23.01.2026 |
| `src/types/README.md` | 282, 509–511, 524 | 5 | 12.02.2026 |

Außerhalb der Doku, nur gemeldet: `src/app/admin/components/shared/MigrationBanner.tsx:74`
verlinkt `docs/admin/MULTISIG_MIGRATION_PLAN.md` im Repo `web3ideation/…` — im Code, nicht in der Doku.

## Klasse C — Falschtreffer

| Fundort | Treffer | Begründung |
|---|---|---|
| `CLAUDE.md:61`, `ARCHITECTURE.md:45`, `state/gates.md:11` | `NextResponse.json` | Methodenaufruf, kein Dateiname (in `CLAUDE.md`/`ARCHITECTURE.md` bereits mit `check-docs-ignore:` begründet) |
| `state/gates.md:11` | `src/lib/config.ts` | wörtlich zitierter historischer Befund im Kalibrierungs-Log |
| `state/gates.md:15`, `:40` | `.gitleaks.toml` | beide Stellen sagen ausdrücklich, dass es die Datei **nicht** gibt |
| `SETUP.md:34`, `state/triggers.md:22` | `docs/design-system.md` | Anlege-Anweisung für später, keine Behauptung, dass es sie gibt |
| `README.md:314` | `.env.local` | gitignored, entsteht beim Setup |
| `docs/harness/HARNESS-OVERVIEW.md:16`, `state/tasks/*` (Zielverzeichnis), `state/phase1-check-baseline.txt` | `…-w3i-2.0-harness` | Ablageort bzw. Repo gemeint, kein Projektname — bleibt laut Auftrag Punkt 4 |
| `state/tasks/harness-phase1-skelett.md:79` | `[PROJEKTNAME]` → `…-harness` | historischer Vertrag, Ursache der Namensdrift; ein abgeschlossener Vertrag wird nicht umgeschrieben |
| `README.md:17`, `:246`, `:330`, `:568` | „42+ handlers" | stimmt: 52 `route.ts` unter `src/app/api/` |
| `docs/CHANGELOG.md` (4 Treffer) | alte Pfade | historisches Protokoll — alte Pfade sind dort richtig |
| `docs/api/nft-data-platform-marketplace-migration.md` (24 Treffer) | `src/lib/nft-data-platform/*`, `tests/**` | „Suggested file" / „Test file suggestion" — Plan; `nft-api.md`, `wallet-api.md` liegen im Plattform-Repo |
| `specs/marktplatz-fertigstellung.md:80`, `docs/integrations/thegraph-setup.md:13`, `scripts/README.md:171`, `src/app/README.md:312–322`, `:479` | diverse | Datei im Plattform-Repo · Anlege-Anweisung · Namensbeispiel · Platzhalter-Vorlage · bewusst gelöschte Datei |
| `src/components/{core,nft}/README.md`, `src/types/README.md:430`, `src/utils/README.md:453`, `docs/architecture/{components-placement-decision.md:11–12,utilities.md:105–107}` (18 Treffer) | Backtick-Pfade | relativ zu `src/` bzw. zum eigenen Ordner geschrieben, Datei existiert |
