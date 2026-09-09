SCHRITT 0: Arbeitsverzeichnis ausgeben und gegen das im Auftrag genannte
Zielverzeichnis prüfen. Bei Abweichung: abbrechen, melden, nichts ändern.
Danach: `git status` und `git branch -vv` zeigen, Branch muss
`harness/phase1-skelett` sein. Danach `npm run check` laufen lassen
(erwartet: Exit 0). Ist er rot, anhalten und melden.

Zielverzeichnis: /home/wolfgang/w3i/nextjs-nft-marketplace-w3i-2.0-harness

## TASK: fix-mongodb-lazy-init

GOAL:
`npm run build` läuft ohne gesetzte `MONGODB_URI` durch. Prüfbar an: nach dem
Umbau enthält `src/lib/mongodb.ts` auf Modulebene weder einen `throw` noch
einen Verbindungsaufbau · ein Build ohne `.env.local` endet mit Exit 0 ·
`npm run check` endet mit Exit 0 · das Verhalten zur Laufzeit ist unverändert:
fehlt `MONGODB_URI` beim ersten echten Datenbankzugriff, kommt derselbe
Fehlertext wie bisher.

CONTEXT:
- [Fakt] Der CI-Build scheitert im Schritt „Collecting page data" mit
  `Error: Please add your MongoDB URI to .env.local`, ausgelöst bei
  `/api/admin/dashboard/stats` und `/api/admin/fix-currency`.
- [Fakt] `src/lib/mongodb.ts:4-6` wirft auf Modulebene, wenn
  `process.env.MONGODB_URI` fehlt — also schon beim Import, nicht beim
  Zugriff.
- [Fakt] `src/lib/mongodb.ts:53-63` erzeugt die Verbindung ebenfalls auf
  Modulebene. Im Entwicklungsmodus über `global._mongoClientPromise` (HMR-
  Schutz), sonst direkt: `clientPromise = connectClientWithOptionalFallback(uri)`.
  `next build` läuft als production, also greift der zweite Zweig.
- [Schlussfolgerung] Jedes Modul, das `@/lib/mongodb` transitiv importiert,
  startet allein durchs Importieren eine Datenbankverbindung. Das ist die
  Ursache des Build-Fehlers und zugleich ein Problem unabhängig von der CI.
- [Fakt] 39 Dateien importieren aus `@/lib/mongodb`. **38 davon nutzen
  ausschließlich benannte Exporte** (`getDatabase`, `getCollection`,
  `getEnrichedNFTsCollection`, `connectToDatabase`, …). Diese Dateien werden
  nicht angefasst.
- [Fakt] Genau **eine** Datei nutzt den Default-Export:
  `src/lib/admin/multisig-proposals.ts:1` (`import clientPromise from
  '@/lib/mongodb'`) und `:9` (`const client = await clientPromise;`).
- [Fakt] `src/lib/mongodb.ts:67` exportiert `clientPromise` als Default.
- [Fakt] Der lokale Build zieht `MONGODB_URI` aus `.env.local`; ein Build mit
  vorhandener `.env.local` beweist deshalb nichts. Der CI-Zustand lässt sich
  lokal nur nachstellen, indem `.env.local` vorübergehend beiseitegelegt wird.

SCOPE:
1. `src/lib/mongodb.ts` auf verzögerte Initialisierung umbauen:
   - Der `throw` bei fehlender `MONGODB_URI` wandert aus dem Modulrumpf in die
     Initialisierungsfunktion. **Fehlertext wörtlich beibehalten**
     (`Please add your MongoDB URI to .env.local`) — er ist Teil des
     bekannten Verhaltens.
   - Eine Funktion `getClientPromise(): Promise<MongoClient>` einführen, die
     die Verbindung beim **ersten Aufruf** erzeugt und danach zwischenspeichert.
   - Das bisherige Verhalten beider Zweige erhalten: im Entwicklungsmodus
     weiterhin über `global._mongoClientPromise` zwischenspeichern (HMR),
     sonst in einer modulweiten Variablen.
   - `getClientPromise` exportieren. Der bisherige Default-Export entfällt.
   - Alle bestehenden benannten Exporte behalten Namen, Signatur und
     Rückgabetyp; intern rufen sie `getClientPromise()` statt der Variablen.
   - Dateikopf nach `docs/kommentar-standard.md` ergänzen bzw. anpassen, mit
     einem Satz dazu, warum die Initialisierung verzögert ist.
2. `src/lib/admin/multisig-proposals.ts`: Import auf
   `import { getClientPromise } from '@/lib/mongodb'` umstellen und in Zeile 9
   `await clientPromise` durch `await getClientPromise()` ersetzen. Sonst
   nichts an dieser Datei ändern.
3. Nachweis führen, dass der Build ohne Datenbank-Zugangsdaten läuft:
   - `cp .env.local /tmp/env-local-backup` (Sicherung)
   - `mv .env.local .env.local.disabled`
   - `npm run build`, Exit-Code festhalten
   - `mv .env.local.disabled .env.local` und mit `ls -la .env.local`
     bestätigen, dass sie wieder da ist
   Erwartung: Exit 0.
4. `npm run check` laufen lassen. Erwartung Exit 0.
5. `state/reibung.md`: eine Zeile zum Vorfall — Build-Fehler in der CI, Ursache
   Verbindungsaufbau auf Modulebene, gefunden erst beim ersten echten CI-Lauf.

NICHT:
- Eine der 38 Dateien anfassen, die benannte Exporte nutzen.
- Verbindungsoptionen, Timeouts, den `MONGODB_URI_DIRECT`-Fallback oder die
  Fehlerklasse `MongoConnectionError` ändern.
- Den Fehlertext umformulieren.
- `.github/workflows/ci.yml` ändern oder Dummy-Umgebungsvariablen einführen.
  Der Build soll ohne Zugangsdaten laufen, nicht mit erfundenen.
- Weitere Module auf verzögerte Initialisierung umbauen, auch wenn dasselbe
  Muster dort auftaucht. Ein Fund pro Auftrag.
- Tests hinzufügen oder ändern.
- Branch Protection setzen.
- Committen oder pushen ohne ausdrückliche Freigabe.

BUDGET:
Ein Durchgang plus höchstens eine Korrekturrunde. Zwei Dateien, davon eine
substanziell. Richtwert eine Stunde, davon der Großteil die beiden
Build-Läufe.

OUTPUT:
- `src/lib/mongodb.ts`, `src/lib/admin/multisig-proposals.ts`,
  `state/reibung.md` im Arbeitsbaum, unkommittet.
- Kurzbericht mit: Exit-Code des Builds ohne `.env.local`, Exit-Code von
  `npm run check`, Bestätigung dass `.env.local` wiederhergestellt ist, und
  der Liste der Stellen in `mongodb.ts`, die vorher auf Modulebene liefen und
  jetzt nicht mehr.
- Beim Stagen ausschließlich explizite Pfade, nie `-A` oder `.`.
- Kein Commit ohne Freigabe. Für den Commit den Skill `git-flow` nutzen.

ESCALATE:
- `.env.local` lässt sich nach dem Test nicht wiederherstellen: **sofort**
  anhalten und melden, die Sicherung liegt unter `/tmp/env-local-backup`.
- Der Build scheitert nach dem Umbau an einer anderen Stelle mit demselben
  Muster (ein weiteres Modul verbindet oder wirft beim Import): melden, nicht
  gleich mitreparieren — das ist ein eigener Auftrag.
- `npm run check` wird rot: Befunde melden, nicht durch Anpassen der Tests
  oder der Typen grün machen.
- Eine der 38 Dateien mit benannten Importen bricht im Typecheck: dann hat
  sich eine Signatur geändert, die nicht ändern durfte. Melden.

FOLGT:
Nach Freigabe und Push fährt der offene Pull Request den Workflow neu. Ist der
Check grün, setzt der Mensch das Ruleset für `main` (Settings → Rules →
Rulesets, Required Status Check `check`, leere Bypass-Liste), führt den
Gegentest gegen `main` durch und trägt Rot- und Grün-Fall in `state/gates.md`
ein.
