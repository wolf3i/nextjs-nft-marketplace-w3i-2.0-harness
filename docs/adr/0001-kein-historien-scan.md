# ADR-0001 — Kein Secret-Scan über die Git-Historie

**Datum:** 2026-09-08
**Status:** Entschieden

## Kontext

Commit `b6e0ca8` (27.08.2026) hat echte Zugangsdaten aus
`docs/environment/ENV_VARIABLES.md` und `src/config/wagmi.ts` entfernt. Ein
Commit entfernt Inhalt aber nur aus dem Arbeitsbaum, nicht aus der Historie:
die Daten stehen weiter in den Objekten davor und sind über `git log -p`
jederzeit lesbar.

Mit Phase 2c kommt gitleaks als CI-Schritt dazu. gitleaks kann den Arbeitsbaum
scannen (`--no-git`) oder die gesamte Historie. Ein Historien-Scan würde bei
diesem Repo ab dem ersten Lauf rot melden — und zwar dauerhaft, denn die
Fundstelle liegt in einem unveränderlichen Commit. Ein Gate, das aus einem
nicht behebbaren Grund immer rot ist, wird nach kurzer Zeit ignoriert oder
abgeschaltet; damit verliert auch der nützliche Teil des Scans seine Wirkung.

## Optionen

1. **Historie umschreiben** (`git filter-repo` o. ä.) — entfernt die Daten aus
   den Objekten und macht einen Historien-Scan grün. Ändert dabei jeden
   Commit-Hash ab dem betroffenen Commit, entwertet alle bestehenden Klone,
   Verweise und Review-Links. Macht die Exposition nicht rückgängig: das
   öffentliche Ursprungs-Repo und jeder vorhandene Klon behalten die alten
   Objekte.
2. **Historien-Scan mit Allowlist** — scannt die Historie, aber mit einem
   Eintrag, der genau die bekannten Fundstellen aus `b6e0ca8` ausnimmt. Hält
   das Gate grün, verlangt aber eine Allowlist, die exakt die Zeilen
   abdeckt, um die es geht — also eine gepflegte Ausnahme für ein bekanntes
   echtes Secret. Eine solche Ausnahme ist schwer von einer versehentlichen
   Lockerung zu unterscheiden.
3. **Kein Historien-Scan** — gitleaks läuft nur über den Arbeitsbaum
   (`--no-git`). Neue Secrets werden gefunden, bevor sie in die Historie
   geraten; alte bleiben unentdeckt, sind aber ohnehin bekannt.

## Entscheidung

Option 3: kein Historien-Scan. Der CI-Schritt ruft gitleaks mit
`detect --source /repo --no-git` auf.

## Begründung

Die Zugangsdaten aus `b6e0ca8` sind über das öffentliche Ursprungs-Repo bereits
exponiert. Kein Scan und keine Historien-Umschreibung nimmt diese Exposition
zurück — sobald ein Secret öffentlich war, ist die einzige wirksame Maßnahme
die **Rotation**, und die liegt beim abgebenden Entwickler. Sie ist in
`state/assumption-ledger.md` als offener Punkt geführt.

Ein Historien-Scan würde damit Aufwand und dauerhaftes Rot erzeugen, ohne das
eigentliche Risiko zu senken. Ein Scan des Arbeitsbaums dagegen deckt genau
den Fall ab, der noch verhinderbar ist: das *nächste* Secret, das jemand
versehentlich einzucheckt. Dieser Teil ist es, der die Kalibrierung wert ist.

Die Umschreibung der Historie (Option 1) wäre der teuerste Weg zum kleinsten
Gewinn: alle Commit-Hashes ändern sich, jeder Klon muss neu gezogen werden,
und die Daten bleiben trotzdem draußen.

Ergänzend deckt `scripts/check-secrets.mjs` den häufigsten Unfallweg
deterministisch ab — eine getrackte `.env*.local` — und braucht dafür keine
Mustererkennung.

**Revidieren, wenn:** die Zugangsdaten aus `b6e0ca8` rotiert sind *und* das
Repo aus dem öffentlichen Ursprungs-Repo herausgelöst wurde. Dann ist ein
Historien-Scan ohne Allowlist möglich und diese Entscheidung neu zu bewerten.
