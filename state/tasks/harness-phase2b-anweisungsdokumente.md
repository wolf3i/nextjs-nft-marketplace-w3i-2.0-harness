SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git status` und `git branch -vv` zeigen. Der Arbeitsbaum muss sauber
sein und auf `harness/phase1-skelett` stehen, Stand `1a1bf66` oder jünger.
Danach `npm run check` laufen lassen und den Ausgangsstand protokollieren
(erwartet: Exit 0). Ist er rot, anhalten und melden — dieser Auftrag setzt
eine grüne Kette voraus.

Zielverzeichnis: /home/wolfgang/w3i/nextjs-nft-marketplace-w3i-2.0-harness

## TASK: harness-phase2b-anweisungsdokumente

GOAL:
Die drei Anweisungsdokumente des Harness existieren und sind widerspruchsfrei:
`CLAUDE.md` trägt zusätzlich zu ihrem heutigen Inhalt den Arbeitsrahmen des
Harness, `ARCHITECTURE.md` trägt ausschließlich belegte Konventionen, und
`docs/STATUS.md` ist die einzige Quelle für Phasenstand und Scope. Prüfbar an:
`npm run check` → Exit 0 · `CLAUDE.md` enthält Briefing-Vorlage,
Iterationsprinzip, Definition of Done, Entscheidungsregel, Status-Format,
Prüfrollen-Tabelle · jede Zeile in `ARCHITECTURE.md` nennt ihre Belegstelle ·
`docs/STATUS.md` verweist auf `specs/marktplatz-fertigstellung.md` und
dupliziert keinen Inhalt daraus.

CONTEXT:
- [Fakt] Die heutige `CLAUDE.md` (87 Zeilen) ist inhaltlich gut und beschreibt
  Laufzeitrollen, Datenarchitektur, API-Schicht, Context-Schicht, Service-Schicht,
  Import-Konventionen und Deployment. Sie wird **ergänzt, nicht ersetzt**.
- [Fakt] Vorlage für die zu ergänzenden Abschnitte: `CLAUDE.md` im Template
  `https://github.com/DerStefan89/claude-projekt-template`, HEAD `9189959`.
  Nach `/tmp/harness-src` klonen und von dort lesen. Zu übernehmen sind die
  Abschnitte „Arbeitsweise — IMMER einhalten" (Briefing, Iterationsprinzip,
  Definition of Done), „Prüfrollen als Subagenten", „Entscheidungsregel bei
  Unsicherheit", „Status-Format", „Bekannte Fallen".
- [Fakt] Abweichung von der Vorlage, bewusst: Die DoD-Zeile
  `[ ] Typisiert, kein any` bekommt eine Geltungsgrenze und lautet
  **„kein neues `any` in geändertem Code"**. Grund: 206 Vorkommen im Bestand,
  davon 24 in genau den Dateien, die die Migration umbaut. Ohne Grenze ist die
  Checkbox eine Ermessensfrage.
- [Fakt] Die „Bekannten Fallen" der Vorlage nennen drei umgebungsbedingte
  Fälle. Entwickelt wird unter WSL im Linux-Dateisystem, Host ist Windows. Die
  CRLF-Falle bleibt relevant, die OneDrive-Falle nicht — nur übernehmen, was
  zutrifft.
- [Fakt] `ARCHITECTURE.md` existiert nicht. Sie darf **nur belegte**
  Konventionen enthalten. Belegt sind heute:
  · Import-Regeln: `eslint.config.mjs`, `no-restricted-imports` — keine
    relativen Imports, keine Imports aus `**/archive/**` oder `*.deprecated*`
  · Jede Route über `apiHandler()`: `src/lib/api/handler.ts`, beschrieben in
    `CLAUDE.md`
  · Cache-Invalidierung über `src/services/validation/data-invalidation.ts`
  · Rollen und Sessions: `docs/architecture/ROLES_AND_PERMISSIONS.md`
  · Hook-Platzierung „in 2+ Stellen genutzt → global":
    `src/app/sell/ARCHITECTURE.md`, Zeilen 209–211
  · Test-Werkzeuge: vitest und Playwright, belegt durch `vitest.config.ts`,
    `playwright.config.ts` und `package.json`
  · Kommentar-Standard: `docs/kommentar-standard.md`
- [Fakt] Es existieren zwei routenlokale `ARCHITECTURE.md`
  (`src/app/sell/`, `src/app/history-towers/`). Die Wurzel-Datei braucht
  deshalb einen Rückverweis auf beide und eine Zeile in `state/memory-map.md`,
  sonst stehen drei gleichnamige Dateien ohne Rangordnung nebeneinander
  (Aufteilungsregel, Kopfkommentar der Template-`ARCHITECTURE.md`).
- [Fakt] `scripts/check-docs.mjs` Prüfung 2 prüft `CLAUDE.md` **und**
  `ARCHITECTURE.md` auf Versionsnummern. Jede Versionsangabe in der neuen Datei
  macht die Kette rot. Prüfung 1 prüft beide auf tote Verweise — jeder neu
  gesetzte Pfad muss existieren.
- [Fakt] `specs/marktplatz-fertigstellung.md` existiert und trägt Ziel, 27
  V-Aussagen, Nicht-Ziele, Constraints und offene Fragen.
- [Annahme] `docs/development/PROJECT_CHECKLIST.md` bleibt als Detailliste
  bestehen; `docs/STATUS.md` verweist darauf, statt sie zu ersetzen.

SCOPE:
1. Template nach `/tmp/harness-src` klonen (`--depth 1`), falls nicht vorhanden.
2. `CLAUDE.md` ergänzen: die unter CONTEXT genannten Abschnitte aus der Vorlage
   übernehmen, mit der DoD-Abweichung und den zutreffenden Fallen. Der heutige
   Inhalt bleibt vollständig erhalten und wird nicht umgeschrieben.
   In den Kopf einen Verweis auf `ARCHITECTURE.md` als Pflichtlektüre vor dem
   Schreiben von Code, und einen auf `docs/STATUS.md` für Phasenstand und Scope.
3. `ARCHITECTURE.md` anlegen. Struktur aus der Vorlage übernehmen (Ordner­struktur,
   Datenzugriff, Auth, Fehlerbehandlung, Kommentar-Standard, Test-Werkzeug,
   Verbotene Patterns, Definition of Done). Jeden Abschnitt **nur** mit den unter
   CONTEXT belegten Konventionen füllen; jede Regel nennt ihre Belegstelle.
   Abschnitte ohne Beleg bleiben ausdrücklich leer, mit einem Satz warum.
   Rückverweis auf die beiden routenlokalen `ARCHITECTURE.md` aufnehmen.
4. `state/memory-map.md`: Zeile für die routenlokalen `ARCHITECTURE.md`
   ergänzen, mit „nicht hierhin"-Spalte.
5. `docs/STATUS.md` anlegen, kurz: aktuelle Phase, was erledigt ist, offene
   Punkte. Verweise auf `specs/marktplatz-fertigstellung.md` und
   `docs/development/PROJECT_CHECKLIST.md` statt deren Inhalt zu wiederholen.
6. `npm run check` laufen lassen. Erwartung Exit 0.

NICHT:
- Konventionen in `ARCHITECTURE.md` schreiben, die nicht unter CONTEXT belegt
  sind. Kein „üblicherweise", kein „sollte". Eine ungeprüfte Regel gilt danach
  als verbindlich und kostet ab dem ersten Tag Reibung.
- Die heutige `CLAUDE.md` umformulieren, kürzen oder umsortieren.
- Die beiden routenlokalen `ARCHITECTURE.md` ändern oder zusammenführen.
- `docs/development/PROJECT_CHECKLIST.md` ersetzen oder Inhalte daraus nach
  `docs/STATUS.md` kopieren.
- `.github/workflows/ci.yml`, Branch Protection, gitleaks. Das ist Phase 2c.
- `.github/copilot-instructions.md` löschen. Phase 3.
- Versionsnummern in `CLAUDE.md` oder `ARCHITECTURE.md` schreiben.
- Committen oder pushen ohne ausdrückliche Freigabe.

BUDGET:
Ein Durchgang plus höchstens eine Korrekturrunde. Drei Dokumente, davon eines
neu. Richtwert 1,5 Stunden.

OUTPUT:
- `CLAUDE.md` (ergänzt), `ARCHITECTURE.md` (neu), `docs/STATUS.md` (neu),
  `state/memory-map.md` (eine Zeile mehr).
- Kurzbericht mit dem Exit-Code von `npm run check` und einer Liste der
  Konventionen, die in `ARCHITECTURE.md` gelandet sind, je mit Belegstelle.
- Beim Stagen ausschließlich explizite Pfade, nie `-A` oder `.`.
- Kein Commit ohne Freigabe. Für den Commit den Skill `git-flow` nutzen.

ESCALATE:
- `npm run check` wird nach den Änderungen rot: die Befunde melden, nicht durch
  `check-docs-ignore:` stummschalten. Eine Ausnahme ist nur zulässig, wenn der
  Befund nachweislich ein Falschtreffer ist.
- Eine Konvention wirkt verbindlich, ist aber nicht belegbar: in
  `state/assumption-ledger.md` eintragen statt in `ARCHITECTURE.md` schreiben.
- Die heutige `CLAUDE.md` widerspricht einer der belegten Konventionen:
  anhalten und melden, nicht selbst entscheiden welche gilt.

FOLGT:
`state/tasks/harness-phase2c-gates-scharf.md` — CI-Job von `build-test` auf
`check` umbenennen, Harness-Gates in die CI aufnehmen, Secret-Gate
(Dateinamensprüfung plus gitleaks mit Allowlist), Branch Protection auf `main`.
