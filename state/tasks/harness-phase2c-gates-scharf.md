SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git status` und `git branch -vv` zeigen. Der Arbeitsbaum muss sauber
sein und auf `harness/phase1-skelett` stehen. Danach `npm run check` laufen
lassen (erwartet: Exit 0). Ist er rot, anhalten und melden.

Zielverzeichnis: /home/wolfgang/w3i/nextjs-nft-marketplace-w3i-2.0-harness

## TASK: harness-phase2c-gates-scharf

GOAL:
Die deterministischen Gates laufen auch auf fremder Maschine und decken
Secrets ab. Prüfbar an: der CI-Job heißt `check` (nicht mehr `build-test`) ·
die CI ruft `npm run check` auf statt lint/typecheck/test einzeln · ein
Secret-Gate schlägt fehl, wenn eine `.env*.local` getrackt ist · gitleaks
läuft in der CI und ist grün · `npm run check` lokal Exit 0 · `state/gates.md`
trägt Zeilen für die neuen Gates.

Branch Protection ist ausdrücklich **nicht** Teil dieses Auftrags — sie
existiert nur als GitHub-Einstellung und wird vom Menschen im Browser gesetzt,
nachdem dieser Auftrag gepusht und die CI einmal gelaufen ist.

CONTEXT:
- [Fakt] `.github/workflows/ci.yml` heute: ein Job `build-test` (Zeile 11) mit
  den Schritten Checkout, Setup Node, `npm ci`, `npm run lint`,
  `npm run typecheck`, `npm run test:coverage`, Coverage-Artefakt hochladen,
  `npm audit --omit=dev`, `npm run build`.
- [Fakt] Der Jobname ist das, woran Branch Protection greift. Er muss `check`
  heißen, damit der Required Status Check denselben Namen trägt wie die
  Prüfkette.
- [Fakt] `npm run check` umfasst lint, typecheck, check-docs, check-rules,
  check-contract, `test:run`. Die CI führt zusätzlich `test:coverage` aus, um
  das Coverage-Artefakt zu erzeugen. Die Tests laufen dadurch zweimal
  (45 Tests, rund 1,2 Sekunden je Lauf). Diese Dopplung wird **bewusst in Kauf
  genommen** — sie kostet weniger als eine Sonderlogik, die lokal und in der CI
  unterschiedliche Ketten fährt.
- [Fakt] Das Repo committet `.env` absichtlich (nur Team-Defaults). Der Inhalt
  besteht aus `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_INSIGHTS_ADMIN_ADDRESSES`
  (öffentliche Wallet-Adressen) und zwei Subgraph-URLs ohne Schlüssel.
  `.env.local` und `.env*.local` stehen in `.gitignore` (Zeilen 39–40).
- [Fakt] `.env.local.template` und `.env.production.template` sind committet
  und enthalten Platzhalter wie `__GENERATE_A_LONG_RANDOM_SECRET_HERE__` und
  `YOUR_ALCHEMY_KEY`. [offene Unsicherheit] Ob gitleaks daran anschlägt, ist
  ungeprüft.
- [Fakt] Commit `b6e0ca8` (27.08.2026) entfernte echte Zugangsdaten aus
  `docs/environment/ENV_VARIABLES.md` und `src/config/wagmi.ts`. Sie stehen
  weiter in der Git-Historie. Ein Historien-Scan wäre deshalb dauerhaft rot.
- [Fakt] `docs/adr/TEMPLATE.md` existiert, `docs/adr/` enthält sonst nichts.
- [Schlussfolgerung] Die Regel „`.env*.local` darf nie getrackt sein" ist eine
  Dateinamensprüfung, kein Musterproblem. Sie gehört als eigenes kleines Gate in
  die Kette, nicht in `check-rules.mjs` — das ist der AST-Harness für
  TypeScript-Struktur.

SCOPE:
1. `scripts/check-secrets.mjs` anlegen: prüft über `git ls-files`, ob eine
   getrackte Datei auf `.env.local` oder `.env.<irgendwas>.local` passt.
   Treffer → Befund ausgeben, Exit 1. Kein Treffer → Exit 0 mit einer Zeile
   Ausgabe. Dateikopf nach `docs/kommentar-standard.md`. Keine
   Fremdabhängigkeit, nur `node:child_process`.
2. `package.json`: `check-secrets.mjs` in die `check`-Kette aufnehmen, direkt
   nach `check-contract.mjs`. Sonst nichts an der Kette ändern.
3. `.github/workflows/ci.yml` umbauen:
   - Job `build-test` in `check` umbenennen
   - die Einzelschritte Lint, Typecheck und Tests durch einen Schritt
     `npm run check` ersetzen
   - `npm run test:coverage`, den Coverage-Upload, `npm audit --omit=dev` und
     `npm run build` unverändert behalten
   - `actions/checkout` und `actions/setup-node` unverändert lassen
4. gitleaks als eigenen CI-Schritt ergänzen, **nach** `npm run check`:
   Docker-Aufruf mit `detect --source /repo --no-git`. Version pinnen, nicht
   `latest`. Kein Historien-Scan.
5. gitleaks **zuerst lokal einmal laufen lassen** (derselbe Docker-Aufruf) und
   die tatsächlichen Befunde protokollieren. Erst danach entscheiden, ob eine
   `.gitleaks.toml` mit Allowlist nötig ist — und wenn ja, nur für die real
   gemeldeten Pfade, mit Begründung als Kommentar. Keine Allowlist auf Verdacht.
6. `docs/adr/0001-kein-historien-scan.md` nach `docs/adr/TEMPLATE.md` anlegen:
   Kontext (Zugangsdaten stehen seit Commit `b6e0ca8` weiter in der Historie),
   Optionen (Historie umschreiben / Historien-Scan mit Allowlist / kein
   Historien-Scan), Entscheidung (kein Historien-Scan), Begründung (die Daten
   sind über das öffentliche Ursprungs-Repo ohnehin exponiert; Rotation ist die
   wirksame Maßnahme und liegt beim abgebenden Entwickler; eine
   Historien-Umschreibung würde alle Commit-Hashes ändern, ohne die Exposition
   rückgängig zu machen).
7. `state/assumption-ledger.md`: Zeile für die noch ausstehende Rotation der
   Zugangsdaten aus `b6e0ca8`, Status offen.
8. `state/gates.md`: Zeilen für Secret-Gate und gitleaks ergänzen. Rot-Fall für
   das Secret-Gate durch einen echten Gegentest belegen: temporär eine leere
   `.env.test.local` anlegen, `git add -f` darauf, Gate laufen lassen (muss rot
   werden), Ausgabe festhalten, danach `git rm --cached` und Datei löschen.
   Grün-Fall ist der normale Lauf. gitleaks-Kalibrierung nach dem Lauf aus
   Punkt 5 eintragen.
9. `npm run check` laufen lassen. Erwartung Exit 0.

NICHT:
- Branch Protection setzen oder Ruleset anlegen. Das macht der Mensch im
  Browser, nach diesem Auftrag.
- Die Prüfkette umbauen, um die doppelte Testausführung in der CI zu vermeiden.
- Historien-Scan einrichten oder Git-Historie umschreiben.
- Zugangsdaten rotieren oder rotieren lassen.
- `.env`, `.env.local.template` oder `.env.production.template` ändern.
- Regeln in `check-rules.mjs` eintragen.
- `.github/copilot-instructions.md` löschen. Phase 3.
- `CLAUDE.md`, `ARCHITECTURE.md` oder `docs/STATUS.md` inhaltlich ändern —
  außer `docs/STATUS.md` in Punkt 9 der Vollständigkeit halber nachziehen,
  falls die dortige Phasenangabe danach falsch wäre.
- Committen oder pushen ohne ausdrückliche Freigabe.

BUDGET:
Ein Durchgang plus höchstens eine Korrekturrunde. Ein neues Skript, eine
CI-Datei, ein ADR, zwei State-Dateien. Richtwert 1,5 Stunden, davon der
Großteil der erste gitleaks-Lauf.

OUTPUT:
- `scripts/check-secrets.mjs` (neu), `.github/workflows/ci.yml` (geändert),
  `package.json` (eine Zeile), `docs/adr/0001-kein-historien-scan.md` (neu),
  `state/assumption-ledger.md`, `state/gates.md`, ggf. `.gitleaks.toml`.
- Kurzbericht mit: Exit-Code von `npm run check`, wörtliche Ausgabe des ersten
  gitleaks-Laufs, wörtliche Ausgabe des Secret-Gate-Gegentests (rot und grün).
- Beim Stagen ausschließlich explizite Pfade, nie `-A` oder `.`.
- Kein Commit ohne Freigabe. Für den Commit den Skill `git-flow` nutzen.

ESCALATE:
- gitleaks meldet Befunde in `.env` oder den `.template`-Dateien: **nicht**
  stillschweigend eine Allowlist schreiben. Die Befunde melden und entscheiden
  lassen, ob Allowlist oder Änderung an der Datei die richtige Antwort ist.
- gitleaks meldet einen Befund, der wie ein echtes Secret aussieht: sofort
  anhalten und melden, nichts committen.
- Der Docker-Aufruf für gitleaks ist lokal nicht möglich (kein Docker):
  melden, den CI-Schritt trotzdem schreiben, den lokalen Lauf aus Punkt 5 als
  offen kennzeichnen und die Kalibrierung in `state/gates.md` als „noch offen"
  eintragen statt sie zu erfinden.
- `npm run check` wird durch `check-secrets.mjs` rot, obwohl keine `.env*.local`
  getrackt ist: das Muster ist zu breit, melden statt lockern.

FOLGT:
Nach dem Push dieses Auftrags setzt der Mensch im GitHub-Browser das Ruleset
für `main` (Settings → Rules → Rulesets, Required Status Check `check`, leere
Bypass-Liste) und führt den Gegentest durch. Ergebnis nach `state/gates.md`.
Danach `state/tasks/harness-phase3-sanierung.md` — `repo-audit`,
`.github/copilot-instructions.md` entfernen, Doku-Drift beseitigen.
