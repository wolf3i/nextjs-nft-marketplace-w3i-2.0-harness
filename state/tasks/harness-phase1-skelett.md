SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git status` und `git branch -vv` zeigen. Der Arbeitsbaum muss sauber
sein und auf `main` stehen, Stand `e717a5d`. Weicht etwas ab, anhalten und
melden — nicht raten.

Zielverzeichnis: /home/wolfgang/w3i/nextjs-nft-marketplace-w3i-2.0-harness

## TASK: harness-phase1-skelett

GOAL:
Das Harness-Skelett liegt im Repo, die Prüfkette `npm run check` existiert und
läuft von Anfang bis Ende durch alle sechs Glieder, ohne an einem fehlenden
Skript oder Modul abzubrechen. Prüfbar an: `.claude/{hooks,agents,skills,commands}`
und `settings.json` existieren und sind getrackt (`git ls-files .claude | wc -l`
> 0) · `scripts/check-docs.mjs`, `check-rules.mjs`, `check-contract.mjs`,
`_mode.ts` existieren · **jedes der sechs Kettenglieder wurde einzeln ausgeführt**
und sein Ergebnis protokolliert · die Ausgaben liegen als Datei vor.

**Ein rotes Ergebnis ist hier das erwartete Ergebnis, kein Fehlschlag.**
`check-docs.mjs` wird Befunde melden; die zu beheben ist der Folgeauftrag, nicht
dieser. Entscheidend ist, dass die Kette läuft und die Befunde protokolliert sind.

CONTEXT:
- [Fakt] Quelle des Skeletts: `https://github.com/DerStefan89/claude-projekt-template`,
  Branch `main`, HEAD `9189959` (18.08.2026). In ein Verzeichnis **außerhalb** des
  Zielverzeichnisses klonen (z. B. `/tmp/harness-src`) und von dort kopieren. Die
  Git-Historie des Templates wird nicht übernommen.
- [Fakt] `.gitignore:27` des Zielrepos enthält `.claude/`, gesetzt von Commit
  `0cb7d6a` (12.09.2025). Solange die Zeile steht, wären Agents, Skills, Hooks und
  die geteilte `settings.json` nicht versioniert — damit existierten Ebene 2 und 3
  der Regelhierarchie nur lokal.
- [Fakt] Das Zielrepo committet `.env` **absichtlich** (dokumentiert im Kopf von
  `.env` und in `.gitignore:34-38`: nur Team-Defaults, keine Secrets). Die
  `.gitignore` des Templates ignoriert `.env` — diese Zeile darf **nicht**
  übernommen werden.
- [Fakt] `package.json` des Zielrepos: `"test": "vitest"` startet den **Watch-Modus**
  und kehrt nie zurück. Für die Prüfkette ist `test:run` (`vitest run`) zu
  verwenden, nicht `test`. Die Template-`package.json` verwendet `npm run test` —
  das übernommen führt zu einer hängenden Kette.
- [Fakt] `scripts/check-contract.mjs` prüft jede `.md` in `state/tasks/` auf die
  Präambel `SCHRITT 0` und acht Marker. Diese Auftragsdatei liegt selbst dort und
  wird also mitgeprüft. Läuft der Vertrags-Check grün über sie, ist das der erste
  belegte Grün-Fall dieses Gates.
- [Fakt] Die `state/*.md` und `docs/harness/*.md` des Templates tragen teils die
  Kalibrierungs- und Lernhistorie des Templates selbst (`state/gates.md`: 397
  Zeilen). Diese Historie wird ausdrücklich nicht übernommen — Entscheidung
  Wolfgang, 03.09.2026.
- [Fakt] Alle übernommenen Dateien enthalten den Platzhalter `[PROJEKTNAME]`.
- [Annahme] `npm run lint`, `npm run typecheck` und `npm run test:run` laufen
  grün, weil die CI dieselben Schritte fährt. Ungeprüft in dieser Umgebung.

SCOPE:
1. Template nach `/tmp/harness-src` klonen (`--depth 1`).
2. Unverändert ins Zielrepo kopieren:
   - `.claude/hooks/` (alle fünf `.js`), `.claude/agents/` (drei `.md`),
     `.claude/skills/` (alle sieben Verzeichnisse), `.claude/commands/lessons.md`,
     `.claude/settings.json`
   - `scripts/check-docs.mjs`, `scripts/check-rules.mjs`,
     `scripts/check-contract.mjs`, `scripts/_mode.ts`
   - `state/triggers.md`, `state/assumption-ledger.md`, `state/memory-map.md`,
     `state/reibung.md`, `state/zwischenstand/VORLAGE.md`, `state/tasks/.gitkeep`
   - `docs/adr/TEMPLATE.md`, `docs/kommentar-standard.md`,
     `docs/examples/design-guardian.example.md`, `docs/harness/werkzeug-katalog.md`,
     `docs/harness/HARNESS-GLOSSARY.md`, `docs/harness/HARNESS-CHANGELOG.md`,
     `docs/harness/HARNESS-LEARNING-STATE.md`, `docs/harness/HARNESS-OVERVIEW.md`
   - `.gitattributes`, `.worktreeinclude`, `.claudeignore`, `SETUP.md`
   - `specs/` als leeres Verzeichnis mit `.gitkeep`
3. Zwei Dateien **strukturell** übernehmen, Inhalt leeren:
   - `state/gates.md`: Kopfkommentar, Überschrift, Einleitungsabsatz, Tabellenkopf
     und die Überschrift `## Kalibrierungs-Log` behalten. Alle Tabellenzeilen und
     alle Log-Einträge des Templates entfernen.
   - `state/tooling.md`: Struktur und alle erklärenden Absätze behalten. In
     „Im Einsatz" nur die Zeile zu `.claude/skills/ponytail/` behalten (gilt hier
     ebenso). Die gitleaks-Zeile und den Abschnitt „Offener Fund: Node-Bindung"
     entfernen — beides Template-intern.
4. In allen kopierten Dateien `[PROJEKTNAME]` durch
   `nextjs-nft-marketplace-w3i-2.0-harness` ersetzen.
5. `.gitignore` des Zielrepos **ergänzen**, nicht ersetzen:
   - Zeile `.claude/` samt Kommentarzeile `# claude` entfernen
   - ergänzen: `.claude/settings.local.json`, `state/zwischenstand/*.md`,
     `!state/zwischenstand/VORLAGE.md`, `state/freigabe-commit.md` — jeweils mit
     der Begründungszeile aus der Template-`.gitignore`
6. `package.json` ergänzen:
   - `"check": "npm run lint && npm run typecheck && node scripts/check-docs.mjs && node scripts/check-rules.mjs && node scripts/check-contract.mjs && npm run test:run"`
   - `dev:clean` entfernen (`taskkill`, unter WSL/Linux wirkungslos)
   - sonst nichts ändern
7. Diese Auftragsdatei nach `state/tasks/harness-phase1-skelett.md` legen.
8. `npm install` (falls nötig). Dann die Baseline erheben, und zwar in dieser
   Reihenfolge:
   a) **Jedes Kettenglied einzeln** ausführen und die vollständige Ausgabe samt
      Exit-Code festhalten: `npm run lint`, `npm run typecheck`,
      `node scripts/check-docs.mjs`, `node scripts/check-rules.mjs`,
      `node scripts/check-contract.mjs`, `npm run test:run`.
      Grund: die Kette ist mit `&&` verknüpft und bricht beim ersten roten Glied
      ab. Ein `npm run check` allein liefert deshalb **keine** vollständige
      Baseline — die Glieder hinter dem ersten Fehler blieben ungemessen.
   b) Danach `npm run check` einmal als Ganzes, um das Kettenverhalten selbst zu
      protokollieren (Abbruchstelle, Exit-Code).
   c) Alles zusammen nach `state/phase1-check-baseline.txt`, je Glied ein
      Abschnitt mit Befehl, Exit-Code und wörtlicher Ausgabe.

NICHT:
- `CLAUDE.md` des Zielrepos anfassen. Die Zusammenführung mit dem Template-Kopf ist
  ein eigener Auftrag mit inhaltlichen Entscheidungen.
- `ARCHITECTURE.md` anlegen. Kommt schrittweise, gebunden an Arbeitspakete.
- `.github/workflows/ci.yml` ändern, Branch Protection setzen, gitleaks einrichten.
  Das ist Phase 2.
- Befunde aus `check-docs.mjs` beheben. Das ist der Folgeauftrag.
- `docs/guide/`, `state/plan-v1-*`, `state/plan-v2-*`, `state/advisor-findings-*`,
  `state/tasks/harness-fix-*`, `state/tasks/phase0-*`,
  `docs/harness/zaehne-taxonomie.md` übernehmen.
- `README.md`, `START-KLEIN.md`, `LICENSE`, `package.json`, `.gitignore` oder
  `ARCHITECTURE.md` des Templates übernehmen.
- `.github/copilot-instructions.md` löschen. Eigener Auftrag in Phase 3.
- `design-guardian` nach `.claude/agents/` kopieren. Die Vorlage bleibt vorerst in
  `docs/examples/`; das Anlegen braucht die Design-Referenzen des Projekts.
- Eigene Regeln in `check-rules.mjs` eintragen. Bleibt leer.
- Committen oder pushen ohne ausdrückliche Freigabe.

BUDGET:
Ein Durchgang plus höchstens eine Korrekturrunde. Reine Datei- und
Konfigurationsarbeit, keine inhaltlichen Entscheidungen. Richtwert 1–2 Stunden,
davon der Großteil `npm install` und der erste `npm run check`.

OUTPUT:
- Die unter SCOPE genannten Dateien im Zielrepo, unkommittet im Arbeitsbaum.
- `state/phase1-check-baseline.txt` mit je einem Abschnitt pro Kettenglied
  (Befehl, Exit-Code, wörtliche Ausgabe) plus dem Lauf von `npm run check` als
  Ganzes.
- Ein Kurzbericht in der Sitzung mit: `git status --short` (vollständig) und einer
  Tabelle der sechs Glieder mit Exit-Code — damit auf einen Blick sichtbar ist,
  welche grün sind und welche nicht.
- Beim Stagen ausschließlich explizite Pfade, nie `-A` oder `.`.
- Kein Commit ohne Freigabe. Für den Commit selbst den Skill `git-flow` nutzen.

ESCALATE:
- `npm run lint`, `npm run typecheck` oder `npm run test:run` schlägt fehl:
  anhalten und melden. Das ist ein Bestandsbefund am Projekt, nicht Teil dieses
  Auftrags — nicht reparieren.
- `npm run check` hängt: prüfen, ob `test` statt `test:run` in der Kette steht.
  Sonst abbrechen und melden.
- Eine der Quelldateien fehlt im Template oder heißt anders als hier angegeben:
  anhalten, melden, nicht nach einer plausiblen Entsprechung raten.
- Das Entfernen von `.claude/` aus der `.gitignore` bringt unerwartet viele
  Dateien in `git status` (etwa eine bestehende lokale `.claude/`-Ablage): anhalten
  und die Liste melden, bevor irgendetwas gestaged wird.
- `check-contract.mjs` meldet einen Befund an dieser Auftragsdatei selbst:
  melden, nicht die Datei stillschweigend anpassen.

FOLGT:
`state/tasks/harness-phase2-check-gruen.md` — die Befunde aus
`state/phase1-check-baseline.txt` beheben und `npm run check` auf Exit 0 bringen,
einschließlich der Zusammenführung von `CLAUDE.md`. Wird nach Vorliegen der
Baseline geschrieben.