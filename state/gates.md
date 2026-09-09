<!-- Ziel-Pfad im Repo: state/gates.md -->
# Objective Gates — nextjs-nft-marketplace-w3i-2.0-harness

Jedes objektive (nicht-menschliche) Gate, das im Projekt läuft, mit
Kalibrierung: mindestens ein bekannter Fall, der es auslöst (rot), und
einer, der es nicht auslöst (grün). Ohne Kalibrierung ist ein Gate ein
ungeprüftes Versprechen.

| Gate | Datei | Prüft | Rot-Fall (bekannt) | Grün-Fall (bekannt) |
|---|---|---|---|---|
| Doku-Gate | `scripts/check-docs.mjs` | Doku-Verweise auf Dateien/Pfade und Versionsangaben gegen den echten Repo-Stand | 08.09.2026, vor Phase 2a: 3 Befunde — `CLAUDE.md:56` (`NextResponse.json` als vermeintlicher Dateipfad, Falschtreffer), `README.md:437` (Verweis auf nicht existierendes `src/lib/config.ts`), `CLAUDE.md:33` (Versionsnummer 20.19.0 dupliziert außerhalb der Paketdatei) | 08.09.2026, nach Phase 2a: „Keine Befunde" — README.md und CLAUDE.md korrigiert, `check-docs-ignore:`-Kommentar für den `NextResponse.json`-Falschtreffer gesetzt |
| Regel-Gate | `scripts/check-rules.mjs` | Registrierte Projektregeln gegen den Repo-Stand | noch offen — es existiert noch keine registrierte Regel, ein Rot-Fall ist damit noch nicht erzeugbar | 08.09.2026: Exit 0 mit „Keine Regeln registriert" (leerer Harness) |
| Vertrags-Gate | `scripts/check-contract.mjs` | Handoff-Verträge unter `state/tasks/` auf Vollständigkeit/Konsistenz | noch offen | 08.09.2026: „1 Vertrag/Verträge geprüft, keine Befunde" über `state/tasks/harness-phase1-skelett.md` |
| Commit-Guard | Regel 1 (Hook), Zeile 150 | Commit/Push-Zugriff auf geteilte Dateien und Freigabe-/Frischefenster-Pflicht | 08.09.2026, drei belegte Fälle: (1) Bash-Zugriff auf geteilte `.claude/settings.json` via `git status && echo --- && git diff -- .claude/settings.json` → „commit-guard: Bash-Zugriff auf geteilte .claude/settings.json blockiert."; (2) `git commit`/`push` ohne `state/freigabe-commit.md` → „git commit/push ohne Freigabe-Datei (state/freigabe-commit.md) verweigert."; (3) Freigabe älter als 10 Minuten → „ist X Minuten alt (Frischefenster 10 Minuten)" [Annahme: Wortlaut aus dem Quelltext, am 08.09.2026 vom Menschen bestätigt ausgelöst; exakte Meldung beim nächsten Auftreten aus der Sitzung übernehmen] | 08.09.2026: `git add state/reibung.md && git commit …` mit frischer Freigabe → Commit `b119f6a`, Freigabedatei danach verbraucht |

## Kalibrierungs-Log

Neue Kalibrierungs-Nachweise hier ergänzen (Datum, Gate, Beobachtung),
nicht die Tabelle oben stillschweigend überschreiben.

- 08.09.2026 — Doku-Gate: Rot-Kalibrierung aus der Phase-1-Baseline
  (`state/phase1-check-baseline.txt`) übernommen, drei Befunde behoben
  (README.md:437, CLAUDE.md:56, CLAUDE.md:33). Grün-Fall durch erneuten
  Lauf von `node scripts/check-docs.mjs` nach den Korrekturen belegt.
  Regel-Gate bleibt ohne Rot-Fall, da noch keine Regel registriert ist —
  vermerkt statt erfunden. Vertrags-Gate-Rot-Fall und Commit-Guard-
  Frischefenster-Wortlaut bleiben offen bzw. als Annahme markiert, bis sie
  real ausgelöst und aus der Sitzung übernommen werden.
