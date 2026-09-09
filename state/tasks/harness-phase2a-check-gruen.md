SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git status` und `git branch -vv` zeigen. Der Arbeitsbaum muss sauber
sein und auf dem Branch `harness/phase1-skelett` stehen. Weicht etwas ab,
anhalten und melden — nicht raten.

Zielverzeichnis: /home/wolfgang/w3i/nextjs-nft-marketplace-w3i-2.0-harness

## TASK: harness-phase2a-check-gruen

GOAL:
`npm run check` läuft von Anfang bis Ende durch und endet mit Exit 0, und
`state/gates.md` trägt die belegte Kalibrierung der bereits getesteten Gates.
Prüfbar an: `npm run check` → Exit 0 · `node scripts/check-docs.mjs` → „Keine
Befunde" · `state/gates.md` enthält Zeilen für Doku-Gate, Regel-Gate,
Vertrags-Gate und Commit-Guard, jede mit Rot- und Grün-Fall.

CONTEXT:
- [Fakt] Baseline vom 08.09.2026: `state/phase1-check-baseline.txt`. Fünf der
  sechs Kettenglieder sind grün, nur `check-docs.mjs` ist rot mit genau drei
  Befunden.
- [Fakt] Befund 1 — `README.md:437` lautet „Configure supported networks in
  `src/lib/config.ts`:". Diese Datei existiert nicht. Die tatsächliche
  Netzwerkkonfiguration liegt in `src/config/networks.ts` (`NETWORK_CONFIG`,
  `getMarketplaceAddress`, `getMultisigAddress`, `isSupportedChain`). Der
  darunterstehende Codeblock zeigt außerdem ein `WEB3_CONFIG`-Objekt mit
  `supportedChainIds: [1, 5, 11155111]` — Chain 5 ist Goerli, abgeschaltet.
  Der Block bildet den echten Code nicht ab.
- [Fakt] Befund 2 — `CLAUDE.md:56` enthält `` `NextResponse.json` `` im
  Fließtext. Das ist ein Methodenaufruf, kein Dateiname; Prüfung 1 liest jeden
  Backtick-Ausdruck mit bekannter Endung als Pfad und `.json` ist eine solche
  Endung. Echter Falschtreffer des Gates, keine Doku-Drift.
- [Fakt] Befund 3 — `CLAUDE.md:33` lautet „Node >= 20.19.0 is required
  (`engines` in package.json; `.nvmrc` pins the dev version)." Die Zahl steht
  bereits in `package.json` (`engines.node`) und in `.nvmrc`. Prüfung 2
  verlangt: Versionen nur in der Paketdatei.
- [Fakt] `scripts/check-docs.mjs` akzeptiert `check-docs-ignore:` als Kommentar
  in der betroffenen Zeile; die Begründung gehört in denselben Kommentar.
- [Fakt] Kalibrierungsdaten, alle am 08.09.2026 real erzeugt:
  · Doku-Gate rot: die drei Befunde oben. Grün: entsteht mit diesem Auftrag.
  · Regel-Gate: leerer Harness, Exit 0 mit „Keine Regeln registriert". Kein
    Rot-Fall möglich, solange keine Regel existiert — das ist zu vermerken,
    nicht zu erfinden.
  · Vertrags-Gate grün: „1 Vertrag/Verträge geprüft, keine Befunde" über
    `state/tasks/harness-phase1-skelett.md`. Rot-Fall: noch offen.
  · Commit-Guard Rot (Regel 1, Zeile 150): Befehl
    `git status && echo --- && git diff -- .claude/settings.json` → „commit-guard:
    Bash-Zugriff auf geteilte .claude/settings.json blockiert."
  · Commit-Guard Grün: `git add state/reibung.md && git commit …` mit frischer
    Freigabe → Commit `b119f6a`, Freigabedatei danach verbraucht.
  · Commit-Guard Rot (fehlende Freigabe): derselbe Befehl ohne Datei →
    „git commit/push ohne Freigabe-Datei (state/freigabe-commit.md) verweigert."
  · Commit-Guard Rot (Frischefenster): Freigabe mit Zeitstempel älter als zehn
    Minuten → Meldung „ist X Minuten alt (Frischefenster 10 Minuten)".
    [Annahme] Wortlaut aus dem Quelltext, vom Menschen am 08.09.2026 bestätigt
    ausgelöst; exakte Meldung beim Eintragen aus der Sitzung übernehmen.
- [Fakt] `state/tooling.md` nennt für ponytail „Eingeführt 2026-08-08" mit einem
  `git log`-Befehl als Beleg. In diesem Repo liefert derselbe Befehl den
  08.09.2026 — die Datei kam mit Commit `17b4b3a` an. Das Datum stammt aus der
  Historie des Templates.

SCOPE:
1. `README.md:437` korrigieren: Verweis auf `src/config/networks.ts` umbiegen.
   Den darunterstehenden `WEB3_CONFIG`-Codeblock durch einen ersetzen, der den
   echten `NETWORK_CONFIG`-Aufbau zeigt (Chain-IDs 31337, 11155111, 1), oder
   den Block ersatzlos streichen und auf die Datei verweisen. Goerli (Chain 5)
   darf nicht stehenbleiben.
2. `CLAUDE.md:56`: `check-docs-ignore:` mit Begründung ergänzen — sinngemäß
   „NextResponse.json ist ein Methodenaufruf, kein Dateiname".
3. `CLAUDE.md:33`: Versionsnummer entfernen, Verweis behalten. Sinngemäß:
   „Node-Version: siehe `engines` in `package.json` und `.nvmrc`."
4. `state/tooling.md`: Datum der ponytail-Zeile auf den tatsächlichen Stand in
   diesem Repo setzen (08.09.2026, Commit `17b4b3a`), Beleg entsprechend.
5. `state/gates.md` füllen: je eine Tabellenzeile für Doku-Gate, Regel-Gate,
   Vertrags-Gate und Commit-Guard, mit den Kalibrierungsdaten aus CONTEXT.
   Wo ein Fall fehlt, ausdrücklich „noch offen" eintragen — nicht erfinden.
   Unter `## Kalibrierungs-Log` einen Eintrag mit Datum und Beobachtung.
6. `npm run check` laufen lassen. Erwartung Exit 0. Ausgabe an
   `state/phase1-check-baseline.txt` anhängen, als Abschnitt „Nachlauf nach
   Phase 2a", damit die Baseline und ihr Ergebnis in einer Datei stehen.

NICHT:
- `CLAUDE.md` inhaltlich zusammenführen oder um Harness-Abschnitte erweitern.
  Das ist Phase 2b.
- `ARCHITECTURE.md` anlegen.
- `.github/workflows/ci.yml` ändern, Branch Protection setzen, gitleaks
  einrichten. Das ist Phase 2c.
- `.github/copilot-instructions.md` löschen. Phase 3.
- Regeln in `check-rules.mjs` eintragen.
- Andere Befunde im `README.md` beheben, die das Gate nicht meldet. Der
  Sanierungsdurchgang über die gesamte Doku ist Phase 3 (Skill `repo-audit`).
- Committen oder pushen ohne ausdrückliche Freigabe.

BUDGET:
Ein Durchgang. Vier kleine Textänderungen plus eine Tabelle. Richtwert 45
Minuten.

OUTPUT:
- Geänderte Dateien im Arbeitsbaum: `README.md`, `CLAUDE.md`,
  `state/tooling.md`, `state/gates.md`, `state/phase1-check-baseline.txt`.
- Kurzbericht mit dem Exit-Code von `npm run check` und der Ausgabe von
  `node scripts/check-docs.mjs`.
- Beim Stagen ausschließlich explizite Pfade, nie `-A` oder `.`.
- Kein Commit ohne Freigabe. Für den Commit den Skill `git-flow` nutzen.

ESCALATE:
- `npm run check` ist nach den Änderungen immer noch rot: anhalten, die
  verbliebenen Befunde melden, nicht weiter daran herumbiegen.
- Eine der drei Fundstellen sieht anders aus als in CONTEXT beschrieben:
  anhalten und melden, nicht nach der plausibelsten Entsprechung suchen.
- Der `check-docs-ignore:`-Kommentar unterdrückt mehr als den einen Befund:
  melden — dann ist die Ausnahme zu breit gesetzt.

FOLGT:
`state/tasks/harness-phase2b-claude-md.md` — Zusammenführung der
Projekt-`CLAUDE.md` mit den Prozessabschnitten des Harness, inklusive der
Geltungsgrenze „kein neues `any` in geändertem Code" in der Definition of Done.
Wird nach grünem `npm run check` geschrieben.
