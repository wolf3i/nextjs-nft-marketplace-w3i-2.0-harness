# STATUS.md

Einzige Quelle für Phasenstand und Scope des Harness. `CLAUDE.md` und
`ARCHITECTURE.md` verweisen hierher statt den Stand zu duplizieren
(siehe `state/memory-map.md`).

## Aktuelle Phase

Phase 2c — Gates scharf. Die Prüfkette läuft unter demselben Namen lokal und
in der CI, ein Secret-Gate und gitleaks sind ergänzt. Offen bleibt allein die
Branch Protection auf `main`: sie ist eine GitHub-Einstellung und wird vom
Menschen im Browser gesetzt, nachdem die CI einmal unter dem neuen Jobnamen
gelaufen ist.

## Erledigt

- Phase 1: Harness-Skelett angelegt (`state/tasks/harness-phase1-skelett.md`).
- Phase 2a: `npm run check` auf grün gebracht (`state/tasks/harness-phase2a-check-gruen.md`).
- Phase 2b: `CLAUDE.md` um den Arbeitsrahmen des Harness ergänzt,
  `ARCHITECTURE.md` neu angelegt (nur belegte Konventionen), diese Datei
  angelegt (`state/tasks/harness-phase2b-anweisungsdokumente.md`).
- Phase 2c: CI-Job `build-test` → `check`, CI ruft `npm run check` statt
  Einzelschritte, Secret-Gate (`scripts/check-secrets.mjs`) in der Kette,
  gitleaks als CI-Schritt (Version gepinnt, kein Historien-Scan — begründet in
  `docs/adr/0001-kein-historien-scan.md`). Beide neuen Gates kalibriert in
  `state/gates.md` (`state/tasks/harness-phase2c-gates-scharf.md`).

## Offen

- Branch Protection auf `main` (Ruleset mit Required Status Check `check`,
  leere Bypass-Liste) — vom Menschen im Browser zu setzen, danach Gegentest
  nach `state/gates.md`.
- Rotation der mit Commit `b6e0ca8` exponierten Zugangsdaten — offen geführt
  in `state/assumption-ledger.md`.
- Fachlicher Scope (was am Marktplatz selbst gebaut wird): siehe
  `specs/marktplatz-fertigstellung.md` — Ziel, V-Aussagen, Nicht-Ziele,
  Constraints, offene Fragen stehen dort, nicht hier.
- Betriebliche Detailliste (Hardening, Observability, Reliability): siehe
  `docs/development/PROJECT_CHECKLIST.md`.
