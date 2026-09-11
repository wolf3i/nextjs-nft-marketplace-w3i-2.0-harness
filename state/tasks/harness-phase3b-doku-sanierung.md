SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git status` und `git branch -vv` zeigen. Der Arbeitsbaum muss sauber
sein und auf `harness/phase3b-doku-sanierung` stehen, abgezweigt von einem
`main`, das Phase 3a **und** die Branch-Protection-Kalibrierung enthält —
prüfbar daran, dass `state/gates.md` sowohl eine Zeile „Branch Protection" als
auch eine Zeile „Dependency-Audit" trägt. Fehlt eine davon, anhalten und melden.
Danach `npm run check` laufen lassen (erwartet: Exit 0). Ist er rot, anhalten.

Zielverzeichnis: /home/wolfgang/w3i/nextjs-nft-marketplace-w3i-2.0-harness

## TASK: harness-phase3b-doku-sanierung

GOAL:
Die Dokumentation ist einmal vollständig geprüft, die Befunde stehen schriftlich
fest, und die drei bekannten Drift-Stellen sind beseitigt. Prüfbar an:
`state/repo-audit-befunde.md` existiert und listet jeden Befund mit Fundstelle
und Einstufung · `.github/copilot-instructions.md` existiert nicht mehr · der
Projektname ist im ganzen Repo einheitlich · die Definition of Done in
`CLAUDE.md` enthält keine Bestandszahlen mehr, sondern eine datierte Messnotiz
mit reproduzierendem Befehl · `npm run check` endet mit Exit 0.

Der Auftrag prüft breit, ändert aber schmal. Das ist Absicht: ein Audit über 59
Markdown-Dateien kann beliebig viel Arbeit erzeugen, und ein Auftrag, der alles
Gefundene gleich mitrepariert, hat kein Ende.

CONTEXT:
- [Fakt] `.claude/skills/repo-audit/SKILL.md` existiert.
  [offene Unsicherheit] Sein genauer Ablauf ist hier **nicht** wiedergegeben. Er
  ist zuerst zu lesen und zu befolgen; dieser Auftrag beschreibt nur, was mit
  seinen Befunden geschieht.
- [Fakt] `docs/` enthält 59 Markdown-Dateien (Stand 07.09.2026,
  `claude/todo-abgleich-altliste.md`).
- [Fakt] `.github/copilot-instructions.md` existiert. Geprüft am 08.09.2026:
  die Datei enthält nichts, was nicht schon anderswo steht. Die
  Hook-Platzierungsregel steht wörtlich in `src/app/sell/ARCHITECTURE.md`,
  Zeilen 209–211; die Komponentenkonventionen in zehn weiteren Dateien; die
  API-Konventionen in `CLAUDE.md` und `docs/architecture/README.md`.
  Entscheidung des Menschen vom 08.09.2026: löschen.
- [Fakt] Der Projektname ist uneinheitlich: `ARCHITECTURE.md` nennt
  `nextjs-nft-marketplace-w3i-2.0`, mehrere Dateien unter `state/` und
  `docs/harness/` nennen `nextjs-nft-marketplace-w3i-2.0-harness`.
  [Fakt] `package.json` führt `"name": "nextjs-nft-marketplace-w3i-2.0"`.
  [Fakt] Das GitHub-Repo heißt `wolf3i/nextjs-nft-marketplace-w3i-2.0-harness`.
  [Schlussfolgerung] Beide Namen sind für sich richtig, aber für
  Verschiedenes: der eine benennt das Projekt, der andere das Repo. Verbindlich
  für den Projektnamen ist die Paketdatei — dasselbe Prinzip, nach dem Prüfung 2
  von `check-docs.mjs` Versionsangaben nur in `package.json` duldet.
- [Fakt] Die Definition of Done in `CLAUDE.md` nennt 206 `any`-Vorkommen im
  Bestand, davon 24 in den Dateien, die die Migration umbaut.
  [Schlussfolgerung] Eine Zahl in einer Regel veraltet mit der ersten Änderung
  und ist danach nicht mehr von einem Fehler zu unterscheiden. Die
  Geltungsgrenze „kein neues `any` in geändertem Code" trägt ohne die Zahlen.
- [Fakt] Bekannte Doku-Lücken aus `claude/todo-abgleich-altliste.md`
  (07.09.2026), die in diesem Auftrag **gemeldet und nicht behoben** werden:
  · `LICENSE` trägt den Platzhalter „Copyright (c) 2024 NextJS NFT Marketplace"
    statt eines realen Rechteinhabers
  · kein `NOTICE` und kein Third-Party-Attributionsdokument
  · kein `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`
  · `docs/development/PROJECT_CHECKLIST.md`: „Release/versioning workflow
    documented" offen
- [Fakt] `state/memory-map.md` führt für jede Ablage eine Zeile mit einer
  „nicht hierhin"-Spalte. Eine neue Datei unter `state/` braucht dort einen
  Eintrag, sonst steht sie ohne Rangordnung neben den übrigen.

SCOPE:
1. `.claude/skills/repo-audit/SKILL.md` lesen und den dort beschriebenen Ablauf
   befolgen. Ergebnis nach `state/repo-audit-befunde.md`: je Befund Fundstelle
   (Datei, Zeile), was nicht stimmt, und eine Einstufung in genau eine von drei
   Klassen:
   - **A — in diesem Auftrag behoben**: fällt unter Punkt 3, 4 oder 5, **oder**
     macht ein Gate rot, **oder** ist ein toter Verweis auf einen Pfad.
   - **B — gemeldet, nicht behoben**: alles Übrige, das eine Entscheidung des
     Menschen braucht (Lizenz, fehlende Dokumente, inhaltliche Lücken).
   - **C — Falschtreffer**: mit Begründung, warum kein Befund vorliegt.
   Kein Befund darf ohne Klasse bleiben.
2. Nur Klasse A wird in diesem Auftrag geändert. Klasse B bleibt in der
   Befunddatei stehen; sie ist die Vorlage für einen späteren Auftrag.
3. `.github/copilot-instructions.md` löschen. **Vorher** über das gesamte Repo
   (ohne `node_modules`, `.next`) auf Verweise auf diesen Pfad greppen und das
   Ergebnis im Bericht zeigen. Gibt es Verweise: siehe ESCALATE.
4. Projektnamen vereinheitlichen:
   - Zuerst alle Fundstellen beider Schreibweisen auflisten (Datei, Zeile,
     welche Form) und im Bericht zeigen.
   - Dann: als **Projektname** überall `nextjs-nft-marketplace-w3i-2.0`
     verwenden. `nextjs-nft-marketplace-w3i-2.0-harness` bleibt nur dort
     stehen, wo tatsächlich das GitHub-Repo gemeint ist (Klon-Befehle, URLs,
     Verweise auf den Ablageort).
   - `package.json` dabei nicht anfassen.
5. `CLAUDE.md`, Definition of Done: die Zahlen 206 und 24 aus der Regelzeile
   entfernen. Die Regel lautet weiterhin „kein neues `any` in geändertem Code".
   Direkt darunter eine **datierte Messnotiz** ergänzen, sinngemäß: Stand
   08.09.2026 — 206 Vorkommen im Bestand, davon 24 in den Dateien, die die
   Migration umbaut; dazu den Befehl, mit dem sich die Zahl reproduzieren lässt.
   Die Notiz muss als Messung erkennbar sein, nicht als Regel.
6. `state/memory-map.md`: Zeile für `state/repo-audit-befunde.md` ergänzen, mit
   gefüllter „nicht hierhin"-Spalte.
7. `docs/STATUS.md` nachziehen: Phase 3 abgeschlossen, nächster Schritt ist die
   Fertigstellung der Spezifikation. Keine Inhalte aus
   `specs/marktplatz-fertigstellung.md` oder
   `docs/development/PROJECT_CHECKLIST.md` duplizieren, nur verweisen.
8. `npm run check` laufen lassen. Erwartung Exit 0.

NICHT:
- Befunde beheben, die nicht unter Klasse A fallen. Auch nicht, wenn die
  Korrektur klein aussieht. Der Auftrag prüft breit und ändert schmal.
- `LICENSE` ändern. Der Rechteinhaber ist eine Entscheidung des Menschen, keine
  Doku-Korrektur.
- `NOTICE`, `CONTRIBUTING.md`, `SECURITY.md` oder `CODE_OF_CONDUCT.md` anlegen.
- Die beiden routenlokalen `ARCHITECTURE.md` (`src/app/sell/`,
  `src/app/history-towers/`) ändern oder mit der Wurzeldatei zusammenführen.
- `docs/development/PROJECT_CHECKLIST.md` ersetzen oder Inhalte daraus nach
  `docs/STATUS.md` kopieren.
- Abhängigkeiten anfassen: kein `npm audit fix`, kein
  `npx update-browserslist-db`, keine Änderung an `package.json` oder
  `package-lock.json`. Das gehört zum zurückgestellten Abhängigkeits-Umbau,
  siehe `docs/adr/0002-abhaengigkeiten-zurueckgestellt.md`.
- `/api/marketplace/sync` anfassen. Eigener Befund, Antwort des abgebenden
  Entwicklers steht aus.
- Befunde durch `check-docs-ignore:` stummschalten, außer sie sind
  nachweislich Falschtreffer — dann Klasse C mit Begründung.
- Committen oder pushen ohne ausdrückliche Freigabe.

BUDGET:
Ein Durchgang plus höchstens eine Korrekturrunde. Der Großteil ist der
Audit-Lauf über 59 Dokumente; die Änderungen selbst sind klein. Richtwert zwei
Stunden. Wenn der Audit-Lauf allein das Budget sprengt: anhalten, die bis dahin
erfassten Befunde schreiben, melden — nicht schneller prüfen.

OUTPUT:
- `state/repo-audit-befunde.md` (neu), `state/memory-map.md`, `CLAUDE.md`,
  `docs/STATUS.md`, die unter Punkt 4 geänderten Dateien, sowie die Löschung
  von `.github/copilot-instructions.md` — alles im Arbeitsbaum, unkommittet.
- Kurzbericht mit: Anzahl der Befunde je Klasse · dem Grep-Ergebnis aus Punkt 3
  · der Fundstellenliste aus Punkt 4 vorher/nachher · dem Exit-Code von
  `npm run check`.
- Beim Stagen ausschließlich explizite Pfade, nie `-A` oder `.`. Die Löschung
  ausdrücklich mit `git rm` stagen.
- Kein Commit ohne Freigabe. Für den Commit den Skill `git-flow` nutzen.

ESCALATE:
- Eine Datei verweist auf `.github/copilot-instructions.md`: **nicht** löschen.
  Melden, wer verweist, und entscheiden lassen.
- Beim Vereinheitlichen des Projektnamens fällt eine Fundstelle auf, bei der
  unklar ist, ob Projekt oder Repo gemeint ist: melden, nicht raten.
- `npm run check` wird nach der Änderung an `CLAUDE.md` rot, weil Prüfung 2 die
  Zahl in der Messnotiz als Versionsangabe liest: melden. Dann ist zu
  entscheiden, ob die Notiz umformuliert oder das Gate kalibriert wird — nicht
  einfach `check-docs-ignore:` setzen.
- Der Audit meldet einen Befund, der auf einen echten Fehler im Code deutet
  (nicht in der Doku): als Klasse B erfassen und melden, nicht beheben.
- Die Befunddatei würde länger als etwa 200 Zeilen: melden. Dann ist der
  Zuschnitt zu groß und wird geteilt, statt in einem Durchgang abgearbeitet.

FOLGT:
Damit ist die Harness-Adaption abgeschlossen. Als Nächstes kommt kein
Harness-Auftrag mehr, sondern die inhaltliche Arbeit: Spezifikation
vervollständigen (`specs/marktplatz-fertigstellung.md`, Version 3), daraus
Plan v1, Advisor-Pass durch `architecture-advisor`, Plan v2, und erst dann
Arbeitspakete als Handoff-Verträge unter `state/tasks/`.
