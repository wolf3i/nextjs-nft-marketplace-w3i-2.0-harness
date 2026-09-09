# STATUS.md

Einzige Quelle für Phasenstand und Scope des Harness. `CLAUDE.md` und
`ARCHITECTURE.md` verweisen hierher statt den Stand zu duplizieren
(siehe `state/memory-map.md`).

## Aktuelle Phase

Phase 2b — Anweisungsdokumente. `CLAUDE.md`, `ARCHITECTURE.md` und diese
Datei bringen den Harness auf einen widerspruchsfreien Stand, bevor Phase 2c
die Gates in der CI scharf schaltet.

## Erledigt

- Phase 1: Harness-Skelett angelegt (`state/tasks/harness-phase1-skelett.md`).
- Phase 2a: `npm run check` auf grün gebracht (`state/tasks/harness-phase2a-check-gruen.md`).
- Phase 2b: `CLAUDE.md` um den Arbeitsrahmen des Harness ergänzt,
  `ARCHITECTURE.md` neu angelegt (nur belegte Konventionen), diese Datei
  angelegt (`state/tasks/harness-phase2b-anweisungsdokumente.md`).

## Offen

- Phase 2c: CI-Job von `build-test` auf `check` umbenennen, Harness-Gates in
  die CI aufnehmen, Secret-Gate, Branch Protection auf `main`
  (`state/tasks/harness-phase2c-gates-scharf.md`).
- Fachlicher Scope (was am Marktplatz selbst gebaut wird): siehe
  `specs/marktplatz-fertigstellung.md` — Ziel, V-Aussagen, Nicht-Ziele,
  Constraints, offene Fragen stehen dort, nicht hier.
- Betriebliche Detailliste (Hardening, Observability, Reliability): siehe
  `docs/development/PROJECT_CHECKLIST.md`.
