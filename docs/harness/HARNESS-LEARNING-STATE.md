<!--
Ziel-Pfad im Repo: docs/harness/HARNESS-LEARNING-STATE.md
Diese Datei verändert sich mit jedem abgeschlossenen Zyklus — bei
Zyklus-Ende aktualisieren. Ein Zyklus-Abschluss ohne Nachtrag hier ist der
teuerste Fehler, den dieses Harness kennt: Er fällt keinem Gate auf, weil
eine nie aktualisierte Datei per Definition in sich konsistent ist —
genau deshalb existiert Prüfung 4 im Doku-Gate. Sofort nach
Zyklus-Ende committen, nicht als "eigener Schritt, falls nötig" vertagen.

Stand dieser Fassung: 10.09.2026
-->
# Harness Learning State — nextjs-nft-marketplace-w3i-2.0

Diese Datei existiert PRO PROJEKT, nicht zentral über mehrere Projekte
hinweg — auch wenn Funde und Fallen sich zwischen Projekten inhaltlich
ähneln können, sind sie hier an konkretem Code dieses Repos belegt. Das
dokumentübergreifende Doku-Gate (Prüfung 4 in `scripts/check-docs.mjs`)
setzt das voraus: es koppelt diese Datei an `HARNESS-CHANGELOG.md` IM
SELBEN REPO.

## Abgeschlossene Zyklen

- (noch keiner — dieses Projekt beginnt bei Zyklus 1)

## Bereits gelernt und gebaut (mit Repo-Nachweis)

[FÜLLUNG]

## Praktisch getestet (Nachweis im Repo vorhanden)

[FÜLLUNG]

## Noch unsicher / nicht aus dem Repo rekonstruierbar

[FÜLLUNG]

## Verhaltensregeln für künftige Sessions

<!-- Format: pro Regel ein fett gesetzter Satz, danach der reale Vorfall als
Beleg. Keine Regel ohne Vorfall — eine erfundene Regel ist ungeprüft. -->

- **Ein Handoff-Vertrag überträgt die Fehler seiner CONTEXT-Liste in jedes
  Dokument, das aus ihm geschrieben wird — ein `[Fakt]`-Marker macht eine
  Aussage nicht wahr, er behauptet nur, dass sie geprüft wurde.**
  Vorfall: Der Vertrag von Phase 2b führte unter „[Fakt] Belegt sind heute"
  die Cache-Invalidierung über `src/services/validation/data-invalidation.ts`.
  `ARCHITECTURE.md` Abschnitt 2 wurde daraus geschrieben; die Funktionsnamen
  kamen aus dem damaligen `CLAUDE.md` (Commit `b75a36d`) und mit ihnen
  `invalidateAllCachesForNFT`, das in `src/lib/cache.ts` liegt. Die Regel
  „jede Mutation läuft über die Helfer" hatte zudem keine Deckung im Code.
  Aufgefallen erst im Repo-Audit (Phase 3b), behoben in Phase 3c
  (`state/repo-audit-befunde.md`, Nachtrag 10.09.2026).
- **Das Doku-Gate prüft, ob Pfade existieren, nicht, ob Aussagen über
  Dateiinhalte stimmen — und wer eine Referenz ändert, muss die Dokumente
  nachziehen, die auf ihr aufbauen.**
  Vorfall: `CLAUDE.md` nannte als Prüfkette seit 27.07.2026 „run all three
  (lint, typecheck, test:coverage) — CI runs the same"; falsch wurde das, als
  Phase 2c die CI auf `npm run check` umstellte. `.claude/agents/code-reviewer.md`
  verbot `any` pauschal; widersprüchlich wurde das, als Phase 2b der
  Definition of Done die Geltungsgrenze „kein neues `any`" gab. Beide Stellen
  enthielten nur existierende Pfade und liefen deshalb grün durch
  `scripts/check-docs.mjs`. Behoben in Phase 3c.
