SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git status` und `git branch -vv` zeigen. Der Arbeitsbaum muss sauber
sein und auf `harness/phase3c-anweisungsdokumente` stehen, abgezweigt von einem
`main`, das Phase 3b enthält — prüfbar daran, dass
`state/repo-audit-befunde.md` existiert und `.github/copilot-instructions.md`
nicht mehr. Trifft das nicht zu, anhalten und melden.
Danach `npm run check` laufen lassen (erwartet: Exit 0). Ist er rot, anhalten.

Zielverzeichnis: /home/wolfgang/w3i/nextjs-nft-marketplace-w3i-2.0-harness

## TASK: harness-phase3c-anweisungsdokumente

GOAL:
Die drei Anweisungsdokumente, die jeder künftige Auftrag als verbindlich liest,
enthalten keine widerlegten Aussagen mehr. Prüfbar an: `ARCHITECTURE.md`
Abschnitt 2 nennt für jede genannte Funktion die Datei, in der sie tatsächlich
liegt · `CLAUDE.md` nennt dieselbe Zuordnung und als Prüfkette `npm run check`
statt dreier Einzelbefehle · keine Prüfrollen-Definition unter `.claude/agents/`
verlangt mehr als die Definition of Done · `state/repo-audit-befunde.md` führt
die drei Befunde nicht mehr als offen · `npm run check` endet mit Exit 0.

Dieser Auftrag behebt **nur** diese drei Befunde. Die übrigen Klasse-B-Befunde
aus dem Audit bleiben stehen, auch die, die klein aussehen.

CONTEXT:
- [Schlussfolgerung] Alle drei Befunde stammen aus Phase 2b, nicht aus dem
  Altbestand. Sie sind beim Schreiben der Anweisungsdokumente entstanden und
  vom Doku-Gate nicht gefangen worden, weil es Pfade prüft, nicht Aussagen über
  Dateiinhalte.
- **Befund 1** — [Fakt] `ARCHITECTURE.md` sagt in ihrem Kopf: „Jede Regel unten
  nennt ihre Belegstelle — eine Regel ohne Belegstelle gehört nicht in diese
  Datei, sondern in `state/assumption-ledger.md`." Abschnitt 2 (Datenzugriff,
  Zeile 27–34) verlangt, Mutationen über die Helfer in
  `src/services/validation/data-invalidation.ts` laufen zu lassen, und nennt
  dabei `invalidateAfterListing`, `invalidateAfterPurchase` und
  `invalidateAllCachesForNFT`.
  [Fakt] `invalidateAllCachesForNFT` liegt in `src/lib/cache.ts:112`.
  `data-invalidation.ts` exportiert sie nicht. Der einzige Aufrufer im Code,
  `src/app/api/user/interactions/route.ts`, importiert sie aus `@/lib/cache`.
  [Schlussfolgerung] Eine Regel mit falscher Belegstelle ist schlechter als eine
  ohne — sie sieht geprüft aus. Dieselbe Aussage steht in `CLAUDE.md:69`.
- **Befund 2** — [Fakt] `.claude/agents/code-reviewer.md:19` prüft
  „Typisiert, kein Escape-Hatch (kein `any` o.ae.)". Die Definition of Done in
  `CLAUDE.md:132` lautet seit Phase 2b „kein **neues** `any` in geändertem
  Code", mit ausdrücklicher Geltungsgrenze für den Altbestand.
  [Schlussfolgerung] Der Reviewer mahnt damit bei jedem Durchgang Altbestand an
  — genau die Ermessensfrage, gegen die die Geltungsgrenze eingeführt wurde.
- **Befund 3** — [Fakt] `CLAUDE.md:18` lautet „Quality gates (run all three
  before considering work done — CI runs the same)" und nennt lint, typecheck,
  `test:coverage`. Die tatsächliche Kette ist `npm run check` (lint, typecheck,
  check-docs, check-rules, check-contract, check-secrets, test:run). Die CI
  fährt zusätzlich `test:coverage`, `npm audit --omit=dev --audit-level=critical`
  und `npm run build`.
- [Fakt] `state/repo-audit-befunde.md` führt alle drei als Klasse B und trägt
  im Kopf eine Zusammenfassungstabelle mit Befundzahlen, die beim Entfernen von
  Zeilen mitgezogen werden muss. Die Datei ist laut eigenem Kopfkommentar eine
  Momentaufnahme, kein Anhänge-Protokoll.
- [Fakt] Dateien unter `docs/harness/` und `state/` können einen Marker
  `Stand dieser Fassung:` tragen. Prüfung 3 von `check-docs.mjs` meldet jedes
  Datum im Text, das jünger ist als dieser Marker. Wer einer solchen Datei
  einen Eintrag mit heutigem Datum hinzufügt, ohne den Marker mitzuziehen,
  macht die Kette rot.

SCOPE:
1. **Zuerst messen, dann schreiben.** Die Export-Listen von
   `src/services/validation/data-invalidation.ts` und `src/lib/cache.ts`
   ausgeben und im Bericht zeigen. Erst danach Befund 1 formulieren — die neue
   Regel nennt jede Funktion mit der Datei, in der sie wirklich liegt, und
   behauptet keine Zuordnung, die nicht in der Ausgabe steht.
2. `ARCHITECTURE.md`, Abschnitt 2: Regel und Belegstelle korrigieren. Die
   inhaltliche Anforderung bleibt (Mutationen laufen über die vorhandenen
   Invalidierungs-Helfer, nicht über direktes Schreiben von Context-State);
   korrigiert werden die Funktionsnamen und die Dateien, in denen sie liegen.
   Der Kopfsatz der Datei zur Belegstellen-Pflicht bleibt unverändert.
3. `CLAUDE.md:69`: dieselbe Zuordnung korrigieren, im dortigen Fließtext und
   in der dortigen Sprache.
4. `CLAUDE.md:18`: Prüfkette auf `npm run check` umstellen. Dazu ein Satz, was
   die CI zusätzlich fährt (`test:coverage`, Dependency-Audit, Build), damit der
   Halbsatz „CI runs the same" nicht gegen die tatsächliche CI steht.
   **Keine Versionsnummern** in `CLAUDE.md` — Prüfung 2 wird sonst rot.
5. Alle drei Dateien unter `.claude/agents/` (`code-reviewer.md`, `qa.md`,
   `architecture-advisor.md`) auf denselben Widerspruch prüfen. Wo eine
   Prüfzeile `any` pauschal verbietet, auf die Geltungsgrenze der Definition of
   Done umstellen, mit Verweis auf `CLAUDE.md`. Nur diese eine Art von Zeile
   anfassen, sonst nichts an den Agenten ändern.
6. `state/repo-audit-befunde.md`: die drei behobenen Zeilen aus der
   Klasse-B-Tabelle entfernen und am Ende der Datei einen Abschnitt
   „## Nachtrag 10.09.2026 — in Phase 3c behoben" anlegen, der für jede der drei
   sagt, was geändert wurde. Die Befundzahlen in der Zusammenfassungstabelle
   entsprechend anpassen. Den `Stand dieser Fassung:`-Marker im Kopf auf das
   heutige Datum ziehen.
7. `docs/harness/HARNESS-LEARNING-STATE.md`: einen Eintrag zur Lehre aus diesen
   drei Befunden ergänzen — sinngemäß, dass ein Handoff-Vertrag die Fehler
   seiner CONTEXT-Liste mit überträgt, und dass das Doku-Gate Pfade prüft, nicht
   Aussagen über Dateiinhalte. Trägt die Datei einen `Stand dieser Fassung:`-
   Marker, diesen im selben Schritt auf das heutige Datum ziehen.
8. `npm run check` laufen lassen. Erwartung Exit 0.

NICHT:
- Weitere Klasse-B-Befunde aus `state/repo-audit-befunde.md` beheben. Auch
  nicht die, die in derselben Datei stehen und klein aussehen (README-Node-
  Version, Vercel-Empfehlung, WalletConnect-Variable, memory-map-Reste).
- Die 106 toten Verweise in den Altdokumenten anfassen.
- `scripts/check-docs.mjs` ändern. Die Gate-Lücke aus Prüfung 1 ist erfasst und
  bleibt ein eigener Auftrag.
- Abhängigkeiten anfassen: kein `npm audit fix`, kein
  `npx update-browserslist-db`, keine Änderung an `package.json` oder
  `package-lock.json`.
- `/api/marketplace/sync` anfassen.
- Die Definition of Done inhaltlich ändern. Sie ist die Referenz, an die die
  Prüfrollen angeglichen werden, nicht umgekehrt.
- Die routenlokalen `ARCHITECTURE.md` anfassen.
- Committen oder pushen ohne ausdrückliche Freigabe.

BUDGET:
Ein Durchgang. Drei Anweisungsdokumente, eine Befunddatei, eine Lernstandsdatei.
Richtwert 45 Minuten, davon der Großteil Punkt 1.

OUTPUT:
- `ARCHITECTURE.md`, `CLAUDE.md`, die geänderten Dateien unter `.claude/agents/`,
  `state/repo-audit-befunde.md`, `docs/harness/HARNESS-LEARNING-STATE.md` im
  Arbeitsbaum, unkommittet.
- Kurzbericht mit: den Export-Listen aus Punkt 1 · dem Wortlaut der drei
  korrigierten Stellen vorher/nachher · welche der drei Agentendateien den
  Widerspruch trugen · dem Exit-Code von `npm run check`.
- Beim Stagen ausschließlich explizite Pfade, nie `-A` oder `.`.
- Kein Commit ohne Freigabe. Für den Commit den Skill `git-flow` nutzen.

ESCALATE:
- Die Export-Listen aus Punkt 1 passen nicht zu dem, was CONTEXT beschreibt:
  anhalten und melden, nicht die plausibelste Zuordnung schreiben.
- Beim Korrigieren fällt auf, dass die inhaltliche Regel selbst nicht stimmt
  (Mutationen laufen im Code gar nicht über diese Helfer): anhalten und melden.
  Dann ist es kein Schreibfehler, sondern eine Konvention ohne Deckung, und die
  gehört nach `state/assumption-ledger.md` statt in `ARCHITECTURE.md`.
- `npm run check` wird rot, weil Prüfung 3 ein Datum in einer der beiden
  Dateien aus Punkt 6 oder 7 als jünger als den `Stand dieser Fassung:`-Marker
  liest: Marker mitziehen. Geht das nicht, melden statt
  `check-docs-ignore:` zu setzen.
- Eine der drei Agentendateien trägt den Widerspruch in anderer Form als
  beschrieben: melden, nicht umformulieren.

FOLGT:
Kein Harness-Auftrag mehr. Als Nächstes die inhaltliche Arbeit: Spezifikation
`specs/marktplatz-fertigstellung.md` auf Version 3 bringen, daraus Plan v1,
Advisor-Pass durch `architecture-advisor`, Plan v2, dann Arbeitspakete als
Handoff-Verträge unter `state/tasks/`.
