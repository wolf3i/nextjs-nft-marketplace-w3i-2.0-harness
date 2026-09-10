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
| Secret-Gate | `scripts/check-secrets.mjs` | Ob eine getrackte Datei auf `.env.local` oder `.env.<irgendwas>.local` passt (reine Dateinamensprüfung über `git ls-files`, kein Inhaltsscan) | 08.09.2026, echter Gegentest: leere `.env.test.local` angelegt und mit `git add -f` getrackt → Exit 1, „✗ 1 Befund(e) — lokale Umgebungsdatei(en) unter Versionskontrolle: - .env.test.local (entfernen mit: git rm --cached .env.test.local)". Danach `git rm --cached` + Datei gelöscht | 08.09.2026: „✓ 794 getrackte Dateien geprüft, keine lokale Umgebungsdatei getrackt." → Exit 0 (Normalzustand des Repos; `.env` und die `.template`-Dateien sind absichtlich getrackt und lösen bewusst nicht aus) |
| gitleaks | `.github/workflows/ci.yml` (Schritt „Secret scan (gitleaks)"), Image `zricethezav/gitleaks:v8.30.1` | Secret-Muster im Arbeitsbaum (`detect --source /repo --no-git --redact`). Bewusst **kein** Historien-Scan — siehe `docs/adr/0001-kein-historien-scan.md` | 08.09.2026, Positivkontrolle: Datei `gitleaks-probe.tmp.txt` mit AWS-förmigem Testmuster im Repo-Wurzelverzeichnis → Exit 1, „leaks found: 1", RuleID `aws-access-token`, Entropy 3.684184. Eine Kopie derselben Datei unter `node_modules/` wurde **nicht** gemeldet → gitignorierte Pfade sind außerhalb des Scans, der CI-Lauf nach `npm ci` verhält sich also wie der lokale. Beide Proben danach gelöscht | 08.09.2026, erster echter Lauf über das unveränderte Repo: „scan completed in 8.41s / no leaks found" → Exit 0. **Keine `.gitleaks.toml` nötig**: weder `.env` noch `.env.local.template`/`.env.production.template` haben ausgelöst, es wurde daher keine Allowlist auf Verdacht angelegt |
| Commit-Guard | Regel 1 (Hook), Zeile 150 | Commit/Push-Zugriff auf geteilte Dateien und Freigabe-/Frischefenster-Pflicht | 08.09.2026, drei belegte Fälle: (1) Bash-Zugriff auf geteilte `.claude/settings.json` via `git status && echo --- && git diff -- .claude/settings.json` → „commit-guard: Bash-Zugriff auf geteilte .claude/settings.json blockiert."; (2) `git commit`/`push` ohne `state/freigabe-commit.md` → „git commit/push ohne Freigabe-Datei (state/freigabe-commit.md) verweigert."; (3) Freigabe älter als 10 Minuten → „ist X Minuten alt (Frischefenster 10 Minuten)" [Annahme: Wortlaut aus dem Quelltext, am 08.09.2026 vom Menschen bestätigt ausgelöst; exakte Meldung beim nächsten Auftreten aus der Sitzung übernehmen] | 08.09.2026: `git add state/reibung.md && git commit …` mit frischer Freigabe → Commit `b119f6a`, Freigabedatei danach verbraucht |
| Dependency-Audit | `.github/workflows/ci.yml` (Schritt „Dependency audit"), läuft **vor** `npm run build` | Bekannte Schwachstellen im Produktions-Abhängigkeitsbaum: `npm audit --omit=dev --audit-level=critical`. Der Schwellwert `critical` ist eine **bewusste Entscheidung**, keine Lockerung — Begründung, verworfene Optionen und Revisionsbedingung in `docs/adr/0002-abhaengigkeiten-zurueckgestellt.md` | 09.09.2026, echter Gegentest: derselbe Lauf mit abgesenktem Schwellwert, `npm audit --omit=dev --audit-level=high` → **Exit 1**, Zusammenfassung wörtlich: „54 vulnerabilities (2 low, 38 moderate, 14 high)". Die CI-Datei wurde dafür **nicht** geändert, der Schwellwert nur auf der Kommandozeile abgesenkt | 09.09.2026: `npm audit --omit=dev --audit-level=critical` → **Exit 0**, identische Zusammenfassung „54 vulnerabilities (2 low, 38 moderate, 14 high)" — **keine kritische**, deshalb grün. Ohne `--omit=dev` meldet dieselbe Messung „61 vulnerabilities (2 low, 40 moderate, 18 high, 1 critical)" → die eine kritische steckt ausschließlich in Dev-Abhängigkeiten und erreicht kein Produktionsartefakt. Am 09.09.2026 ist der Build in der CI gelaufen, der Audit-Schritt war also grün |

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

- 08.09.2026 — Phase 2c: Secret-Gate (`scripts/check-secrets.mjs`) neu in die
  `check`-Kette aufgenommen, direkt nach dem Vertrags-Gate. Rot-Fall durch einen
  echten Gegentest belegt (erzwungen getrackte `.env.test.local`), nicht durch
  Annahme. gitleaks als CI-Schritt ergänzt und **vor** dem Einbau einmal lokal
  gefahren: über das unveränderte Repo grün, kein Befund in `.env` oder den
  `.template`-Dateien — deshalb ausdrücklich keine Allowlist und keine
  `.gitleaks.toml`. Dass der grüne Lauf kein Falsch-Grün ist, wurde mit einer
  Positivkontrolle geprüft (Testmuster wird gefunden). Der CI-Jobname heißt ab
  jetzt `check` statt `build-test`, damit der Required Status Check denselben
  Namen trägt wie die Prüfkette. Branch Protection selbst ist noch offen — sie
  wird vom Menschen im Browser gesetzt, der Gegentest dazu gehört danach hierher.

- 09.09.2026 — Phase 3a: Dependency-Audit als achtes Gate in die Tabelle
  aufgenommen. Er lief seit dem 08.09.2026 in der CI, stand aber in keiner
  Zeile dieser Datei — ein laufendes Gate ohne Kalibrierung. Grün-Fall aus dem
  CI-Schwellwert `critical` (Exit 0), Rot-Fall durch einen echten Gegentest mit
  abgesenktem Schwellwert `high` (Exit 1) belegt, nicht durch Annahme. Beide
  Läufe melden dieselbe Zusammenfassung — der Unterschied liegt allein im
  Schwellwert, nicht im Befundstand. Damit ist belegt, dass das Gate bei einem
  kritischen Befund im Produktionsbaum auslösen würde und nicht bloß deshalb
  grün ist, weil es nichts prüft. Die CI-Datei wurde dafür nicht angefasst; der
  Schwellwert selbst ist in `docs/adr/0002-abhaengigkeiten-zurueckgestellt.md`
  als Entscheidung belegt, samt der ausdrücklichen Feststellung, dass die 14
  High-Befunde damit nicht für harmlos erklärt sind.
