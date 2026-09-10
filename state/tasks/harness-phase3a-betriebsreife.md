SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git status` und `git branch -vv` zeigen. Der Arbeitsbaum muss sauber
sein und auf `harness/phase3a-betriebsreife` stehen. Danach `npm run check`
laufen lassen (erwartet: Exit 0). Ist er rot, anhalten und melden.

Zielverzeichnis: /home/wolfgang/w3i/nextjs-nft-marketplace-w3i-2.0-harness

## TASK: harness-phase3a-betriebsreife

GOAL:
Die Zurückstellung der Abhängigkeits-Sanierung ist eine belegte Entscheidung
statt einer stillen Lockerung, der Dependency-Audit steht als Gate in der
Tabelle, und die Fehlerdiagnose bei Datenbankfehlern verliert keine
Information mehr. Prüfbar an: `docs/adr/0002-abhaengigkeiten-zurueckgestellt.md`
existiert und nennt drei Optionen mit Entscheidung und Begründung ·
`state/gates.md` trägt eine Zeile für den Dependency-Audit mit belegtem Rot-
und Grün-Fall · `state/assumption-ledger.md` trägt einen Eintrag mit Vorbehalt ·
ein bereits erzeugter `MongoConnectionError` wird in `getCollection` nicht mehr
ein zweites Mal eingepackt · `npm run check` endet mit Exit 0.

CONTEXT:
- [Fakt] Messung vom 09.09.2026: `npm audit --omit=dev` meldet
  „54 vulnerabilities (2 low, 38 moderate, 14 high)". **Keine kritische.**
- [Fakt] Ohne `--omit=dev` meldet dieselbe Messung
  „61 vulnerabilities (2 low, 40 moderate, 18 high, 1 critical)".
  [Schlussfolgerung] Die eine kritische Schwachstelle steckt ausschließlich in
  Dev-Abhängigkeiten und erreicht kein Produktionsartefakt.
- [Fakt] Der CI-Schritt „Dependency audit" lautet
  `npm audit --omit=dev --audit-level=critical` und läuft **vor** `npm run build`.
  Am 09.09.2026 ist der Build gelaufen, der Audit-Schritt war also grün.
- [Fakt] `npm audit fix --dry-run` am 09.09.2026:
  „added 35 packages, removed 96 packages, changed 141 packages".
  Darunter `vite 7.3.1 => 8.2.2` (Hauptversionssprung),
  `vitest 4.0.18 => 4.1.11`, `viem 2.46.2 => 2.56.3`,
  `@sentry/* 10.43.0 => 10.74.0` sowie die Entfernung des gesamten
  OpenTelemetry-Instrumentierungsbaums unter Sentry.
- [Fakt] `@vitest/coverage-v8` ist in `package.json` **exakt** auf `4.0.18`
  festgelegt, ohne Caret, weil sein Peer-Range exakt `"vitest": "4.0.18"`
  verlangt. Ein Bump von vitest auf `4.1.11` ohne denselben Bump beim
  Coverage-Provider hat am 08.09.2026 den Fehler
  `SyntaxError: The requested module 'vitest/node' does not provide an export
  named 'BaseCoverageProvider'` erzeugt und die CI rot gemacht.
- [Schlussfolgerung] `npm audit fix` ist in diesem Repo kein Patch, sondern ein
  Umbau des Abhängigkeitsbaums. Drei Risikopunkte: der vite-Hauptversionssprung,
  der vitest-Bump gegen den exakten Coverage-Pin, und `viem`, das direkt unter
  Wallet-Signatur und Contract-Aufrufen sitzt und für das es keine
  E2E-Abdeckung des Kaufpfads gibt.
- [Fakt] `--audit-level=critical` wurde am 08.09.2026 während der CI-Reparatur
  gesetzt, außerhalb eines Handoff-Vertrags. Die Änderung steht bis heute in
  keinem ADR, in keinem Assumption-Ledger und in keiner Zeile von
  `state/gates.md`.
- [Fakt] `docs/adr/TEMPLATE.md` und `docs/adr/0001-kein-historien-scan.md`
  existieren. Die nächste freie Nummer ist 0002.
- [Fakt] `state/gates.md` führt sieben Gates (Doku, Regel, Vertrag, Secret,
  gitleaks, Commit-Guard, Branch Protection). Der Dependency-Audit fehlt,
  obwohl er ein CI-Gate ist wie gitleaks.
- [Fakt] Der `code-reviewer`-Subagent hat am 08.09.2026 in `src/lib/mongodb.ts`
  in `getCollection` festgestellt: ein bereits erzeugter `MongoConnectionError`
  wird im `catch` ein zweites Mal eingepackt, wodurch die ursprüngliche Meldung
  mit dem Hinweis auf die IP-Whitelist verlorengeht.
  [offene Unsicherheit] Die genaue Zeilennummer ist hier **nicht** belegt. Sie
  ist zuerst zu bestimmen und im Bericht zu zeigen.
- [Fakt] Build-Warnung im CI-Lauf vom 09.09.2026: „browsers data (caniuse-lite)
  is 9 months old."

SCOPE:
1. `docs/adr/0002-abhaengigkeiten-zurueckgestellt.md` nach dem Muster von
   `docs/adr/TEMPLATE.md` anlegen. Kontext: die Zahlen aus CONTEXT, wörtlich.
   Drei Optionen abwägen:
   (a) `npm audit fix` jetzt ausführen,
   (b) einzelne Pakete gezielt anheben (`axios`, `undici`, `form-data`, `hono`, `h3`),
   (c) zurückstellen und den Schwellwert `critical` belassen.
   Entscheidung: (c). Begründung: die drei Risikopunkte aus CONTEXT, dazu der
   Umstand, dass die anstehende Datenquellen-Migration den Abhängigkeitsbaum
   ohnehin anfasst. Ausdrücklich festhalten, was diese Entscheidung **nicht**
   behauptet: sie sagt nicht, dass die 14 High-Befunde harmlos sind, sondern
   dass sie zu diesem Zeitpunkt nicht blind behoben werden.
2. `state/gates.md`: eine Zeile für den Dependency-Audit ergänzen.
   Grün-Fall: der Lauf vom 09.09.2026 mit Exit 0 gegen den Schwellwert
   `critical`. Rot-Fall durch einen **echten Gegentest** belegen: lokal
   `npm audit --omit=dev --audit-level=high` ausführen, Exit-Code und
   Zusammenfassungszeile wörtlich festhalten. Die CI-Datei dabei **nicht**
   ändern. In der Zeile festhalten, dass der Schwellwert eine bewusste
   Entscheidung ist, mit Verweis auf ADR 0002.
3. `state/assumption-ledger.md`: Eintrag ergänzen, Status offen, Vorbehalt
   „vor Produktivbetrieb mit echten Daten neu bewerten", Verweis auf ADR 0002
   und auf die Messung vom 09.09.2026.
4. `src/lib/mongodb.ts`, Funktion `getCollection`: zuerst die betroffene Stelle
   bestimmen und im Bericht zeigen (Zeilennummern, Vorher-Zustand). Dann so
   ändern, dass ein bereits erzeugter `MongoConnectionError` unverändert
   weitergereicht statt erneut eingepackt wird. Alle anderen Fehler weiterhin
   genau wie bisher behandeln. Keine Signatur-, Namens- oder Typänderung.
   Kommentar nach `docs/kommentar-standard.md`, ein Satz zum Warum.
5. `npx update-browserslist-db@latest` ausführen. Erwartet: nur
   `package-lock.json` ändert sich. Ändert sich mehr, siehe ESCALATE.
6. `state/reibung.md`: eine Zeile zum Vorfall — die Abhängigkeits-Sanierung war
   als kleines Aufräumen eingeplant und stellte sich im Dry-Run als Umbau
   heraus; die Fehleinschätzung kostete eine Planungsrunde.
7. `npm run check` laufen lassen. Erwartung Exit 0.

NICHT:
- `npm audit fix` oder `npm audit fix --force` ausführen. Auch nicht „nur zum
  Sehen" — der Dry-Run liegt vor, ein echter Lauf verändert das Lockfile.
- Einzelne Pakete anheben, auch nicht `axios` oder `undici`. Das ist Option (b)
  und wurde in diesem Auftrag ausdrücklich nicht gewählt.
- `vitest` oder `@vitest/coverage-v8` anfassen.
- `.github/workflows/ci.yml` ändern. Der Schwellwert bleibt, wie er ist; die
  Entscheidung wird belegt, nicht revidiert.
- Weitere Stellen mit demselben Fehler-Verpackungsmuster mitreparieren, auch
  wenn sie beim Lesen auffallen. Ein Fund pro Auftrag, der Rest wird gemeldet.
- `/api/marketplace/sync` anfassen. Der Auto-Start des Sync-Dienstes beim Import
  ist ein eigener Befund, die Antwort des abgebenden Entwicklers steht aus.
- `.github/copilot-instructions.md` löschen oder Doku-Drift beseitigen. Das ist
  Phase 3b.
- Committen oder pushen ohne ausdrückliche Freigabe.

BUDGET:
Ein Durchgang plus höchstens eine Korrekturrunde. Ein ADR, drei State-Dateien,
eine Code-Stelle, ein Lockfile-Update. Richtwert eine Stunde.

OUTPUT:
- `docs/adr/0002-abhaengigkeiten-zurueckgestellt.md` (neu), `state/gates.md`,
  `state/assumption-ledger.md`, `state/reibung.md`, `src/lib/mongodb.ts`,
  `package-lock.json` im Arbeitsbaum, unkommittet.
- Kurzbericht mit: der bestimmten Fundstelle in `getCollection` (Zeilennummern,
  vorher/nachher), der wörtlichen Ausgabe des Gegentests aus Punkt 2 samt
  Exit-Code, der Liste der von `update-browserslist-db` geänderten Dateien und
  dem Exit-Code von `npm run check`.
- Beim Stagen ausschließlich explizite Pfade, nie `-A` oder `.`.
- Kein Commit ohne Freigabe. Für den Commit den Skill `git-flow` nutzen.

ESCALATE:
- Die Stelle in `getCollection` sieht anders aus als im CONTEXT beschrieben:
  anhalten und melden, nicht nach der plausibelsten Entsprechung suchen und
  umbauen.
- `npx update-browserslist-db@latest` ändert mehr als `package-lock.json`:
  anhalten, die geänderten Dateien zeigen, nichts committen.
- Der Gegentest aus Punkt 2 liefert Exit 0: dann stimmt die Zahl „14 high"
  nicht mehr. Melden statt den Gegentest umzubauen, bis er rot wird.
- `npm run check` wird rot: Befunde melden, nicht durch Anpassen von Tests oder
  Typen grün machen.
- Beim Lesen von `src/lib/mongodb.ts` fällt ein weiterer Fehler auf, der die
  Datenbankverbindung betrifft: melden, nicht mitreparieren.

FOLGT:
`state/tasks/harness-phase3b-doku-sanierung.md` — `repo-audit`-Skill über die
Dokumentation, `.github/copilot-instructions.md` entfernen, Doku-Drift
beseitigen, Projektnamen vereinheitlichen, die festen `any`-Zahlen aus der
Definition of Done in eine datierte Messnotiz verschieben.
