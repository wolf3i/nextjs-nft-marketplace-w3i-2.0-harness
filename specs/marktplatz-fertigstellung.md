# Spec — Marktplatz-Fertigstellung

Stand dieser Fassung: 09.09.2026
Ist-Zustand erhoben gegen `harness/phase1-skelett`, Basis `e717a5d`.
Plattformseite erhoben gegen `NiklasHoffmann/NFT-Data-Platform`, HEAD `7915b52`
(03.09.2026).
Evidenz-Marker: `[Fakt]` belegt · `[Schlussfolgerung]` abgeleitet ·
`[Annahme]` ungeprüft · `[offene Unsicherheit]` ungeklärt.

**Ziel in einem Satz:** Der Marktplatz ist funktional vollständig, bezieht seine
NFT-Daten über die NFT Data Platform und ist betriebsbereit für Mainnet.

---

## Problem & Nutzer

`[Fakt]` Der lesende Datenbezug mischt heute vier Quellen in denselben Pfaden:
TheGraph für Listings, lokale MongoDB-Lesemodelle für angereicherte NFT-Daten,
Alchemy und Moralis für Wallet-Discovery, dazu direkte Chain- und
IPFS-Nachladelogik. Belege:

- `src/app/api/wallet/nfts/route.ts` (1006 Zeilen) — `discoverNFTsViaAlchemy()`
  ab Zeile 491, Moralis-Fallback, `source`-Union `'alchemy' | 'moralis' |
  'blockchain' | 'hybrid'` in Zeile 36
- `src/app/api/user/nfts/sync/route.ts` — Discovery über Alchemy, eigene
  IPFS-Gateway-Umschreibung ab Zeile 133
- `src/app/api/nft/detail/route.ts` (379 Zeilen) — liest `nft_metadata` zuerst,
  importiert `blockchainStateSync` und `ipfsMetadataLazySync` (Zeilen 21–22),
  synchrone Blockchain-Auffrischung bei veralteten Daten
- `src/app/api/collections/route.ts` (580 Zeilen) — aggregiert aus
  `marketplace_items` (Zeile 26) und holt Metadaten aus `nft_metadata`
  (Zeile 148)

`[Schlussfolgerung]` Damit trägt der Marktplatz die Verantwortung für
NFT-Datenqualität selbst, obwohl es dafür ein eigenes System gibt. Jede
Änderung an Metadaten, Medien oder Ownership muss hier nachgebaut werden.

**Nutzer** `[Fakt, aus `docs/architecture/ROLES_AND_PERMISSIONS.md`]` Acht
Akteure: Visitor, User, Admin auf App-Ebene; Seller, Buyer, MultiSig Owner,
Diamond Owner auf Chain-Ebene; Worker als Prozess. Betroffen von diesem
Vorhaben sind vor allem Visitor und User (lesende Ansichten) sowie Admin
(Insights).

**Nicht das Problem** `[Fakt]` Schreibvorgänge. Listen, Kaufen, Stornieren und
Governance laufen direkt gegen den Diamond-Contract und bleiben unverändert.

---

## Entschieden (vor dem Plan geklärt)

Diese Punkte sind festgelegt und nicht mehr offen. Quelle, soweit nicht anders
vermerkt: `docs/api/nft-data-platform-marketplace-migration.md`, Abschnitt
„Repository-Level Decisions", gegen eine laufende Plattform-Instanz verifiziert
am 03.09.2026.

1. **Hybrid, nicht API-only.** TheGraph bleibt alleinige Quelle für Listings.
   Die Plattform übernimmt Token, Collections, Wallet-Inventar, Suche. Die
   lokale MongoDB behält Likes, Ratings, Watchlist, persönliche Notizen,
   Cart-Zustand und Admin-Insights.
2. **Die internen `/api/*`-Routen bleiben als serverseitige Fassade.** Namen
   und Antwortstruktur bleiben stabil, damit der Quellenwechsel für Contexts
   und Komponenten unsichtbar ist.
3. **Kein Browser-Code ruft die Plattform direkt.** Alle Aufrufe sind
   HMAC-signiert und damit serverseitig.
4. **Rohdaten der Plattform werden in einer server-only Client-Schicht
   normalisiert,** bevor Routencode sie auf bestehende Frontend-Verträge
   abbildet.
5. **`/api/collections` bleibt eine Ansicht gelisteter Collections,** kein
   globales Verzeichnis. Die Menge der Contracts kommt weiter aus aktiven
   Listings.
6. **`404` von der Plattform heißt „noch nicht indiziert",** nicht „Token
   existiert nicht".
7. **Rollout über ein Feature-Flag** `NFT_DATA_PLATFORM_ENABLED`.
8. **Der Marktplatz-Client bekommt nur die Scopes, die er braucht.** Die
   Plattform kennt neun (`.env.example:39`); der Marktplatz liest und stößt
   Auffrischungen an, mehr nicht. Also `collections:read`, `tokens:read`,
   `owners:read`, `search:read`, `refresh:token`, `refresh:collection` — nicht
   `reindex:write`, nicht `admin:read`, nicht `refresh:media`.
9. **Integrationstests laufen gegen eine lokale Plattform-Instanz.** Das
   Plattform-Repo bringt `docker-compose.yml` mit Mongo, Redis und MinIO mit
   sowie eine vollständige `.env.example` samt Bootstrap-Client. Die Tests
   hängen damit nicht an der Verfügbarkeit einer fremden Instanz.

---

## Gewünschtes Verhalten

### A — Datenquellen

- **V1** `[neu]` Ist das Flag an, beantwortet `/api/wallet/nfts` eine Anfrage,
  ohne Alchemy oder Moralis aufzurufen. Heute: beide werden aufgerufen.
- **V2** `[Bestand]` `/api/wallet/nfts` liefert weiterhin die Hülle `success`,
  `data`, `total` und dieselben `WalletNFT`-Feldnamen.
- **V3** `[neu]` Liefert die Plattform ein Holding mit `token: null`, gibt die
  Route trotzdem einen Eintrag mit Contract-Adresse und tokenId zurück, und
  `hasMarketplaceData` stammt allein aus dem Listing-Join.
- **V4** `[neu]` `/api/nft/detail` liest den Token aus der Plattform statt aus
  `nft_metadata` und lädt weder Chain noch IPFS synchron nach.
- **V5** `[neu]` Ist ein Token nicht indiziert, antwortet `/api/nft/detail` mit
  HTTP 404 und `code: "TOKEN_NOT_INDEXED"` sowie `refreshQueued`,
  `refreshJobId`, `contractAddress`, `tokenId`, `chainId`.
- **V6** `[neu]` Owner und Balance stammen aus dem Ownership-Endpunkt, nie aus
  der Token-Antwort — die trägt kein Owner-Feld.
- **V7** `[neu]` `/api/collections` bezieht Collection-Metadaten aus der
  Plattform; die Menge der angezeigten Contracts kommt weiter aus aktiven
  Listings.
- **V8** `[Bestand]` Listing-Daten kommen ausschließlich aus TheGraph.
- **V9** `[Bestand]` Likes, Ratings, Watchlist, Notizen, Cart und
  Admin-Insights bleiben in der lokalen MongoDB.

### B — Plattform-Client

- **V10** `[Bestand]` Kein Browser-Code ruft `/api/v1/*` direkt.
- **V11** `[neu]` Ein Wiederholungsversuch signiert mit frischem Zeitstempel neu,
  statt dieselbe Anfrage erneut zu senden. `409 replayed_request` gilt nicht als
  endgültiger Fehler, `429` wird davon unterschieden behandelt.
- **V12** `[neu]` Jede Listen- und Suchabfrage nutzt den Cursor der Plattform.
  Die Zeichenkette `page` kommt als Abfrageparameter im Client nicht vor.
- **V13** `[neu]` Ein Test belegt, dass eine zweite Seite andere Elemente
  liefert als die erste. Grund: die Plattform ignoriert unbekannte Parameter
  still und liefert `200` mit der ersten Seite — ein falsch geschriebener
  Client sieht sonst gesund aus.
- **V14** `[neu]` `NFT_API_BASE_URL`, `NFT_API_CLIENT_ID`, `NFT_API_KEY` und
  `NFT_API_SECRET` existieren nur serverseitig, ohne `NEXT_PUBLIC_`-Spiegel.
  `npm run env:check` schlägt fehl, wenn das Flag an ist und eine davon fehlt.
- **V15** `[neu]` Der verwendete API-Client trägt genau die sechs Scopes aus
  Entscheidung 8. Ein Aufruf, der `reindex:write` oder `admin:read` bräuchte,
  scheitert und wird nicht durch eine Erweiterung der Scopes gelöst.
- **V16** `[neu]` Die Systemuhr des Marktplatz-Hosts läuft synchron. Die
  Plattform weist Anfragen ab, deren Zeitstempel mehr als 300 Sekunden abweicht
  (`AUTH_MAX_TIMESTAMP_SKEW_SEC`); ein Monitoring-Alarm auf Uhrdrift existiert.

### C — Betriebsreife

Quelle: die offenen Punkte in `docs/development/PROJECT_CHECKLIST.md`.

- **V17** `[neu]` Backup- und Restore-Plan ist dokumentiert und einmal
  durchgespielt.
- **V18** `[neu]` Background-Jobs haben Retry mit Backoff und melden dauerhaftes
  Scheitern an das Monitoring.
- **V19** `[neu]` Die MongoDB-Index-Strategie ist dokumentiert und angewandt.
- **V20** `[neu]` Die Migrations-Strategie ist dokumentiert und einmal getestet.
- **V21** `[neu]` Für jede externe Abhängigkeit ist dokumentiert, was bei Ausfall
  passiert.
- **V22** `[neu]` Je Route existiert ein Performance-Budget, und
  `npm run bench:api` prüft dagegen.
- **V23** `[neu]` Der Release- und Versionierungs-Workflow ist dokumentiert.

### D — Qualität

- **V24** `[Bestand seit 08.09.2026]` `npm run check` endet mit Exit 0.
- **V25** `[neu]` `vitest.config.ts` trägt eine Coverage-Schwelle, und die CI
  wird rot, wenn sie unterschritten wird.
- **V26** `[neu]` Geänderter Code enthält kein neues `any`. Der Altbestand von
  206 Vorkommen ist davon ausgenommen.
- **V27** `[neu]` Für jede migrierte Route existiert ein Integrationstest, für
  jeden Mapper ein Vertragstest.

### E — Mainnet

- **V28** `[neu]` `NETWORK_CONFIG["1"].NftMarketplace` in
  `src/config/networks.ts` trägt eine echte Adresse statt des Nullplatzhalters.
- **V29** `[neu]` Die in Commit `b6e0ca8` entfernten Zugangsdaten sind rotiert,
  bevor echte Daten fließen.

---

## Nicht-Ziele

| Nicht-Ziel | Begründung |
|---|---|
| Redesign der Oberfläche | Das bestehende GUI inklusive Wallet-Ansicht soll erhalten bleiben. Änderungen nur als gezielte Korrektur. |
| Änderungen an Contracts oder Subgraph | Eigene Repos, beide final. Andere Vertrauensgrenze, eigener Freigabeweg. |
| Likes, Ratings, Watchlist in die Plattform migrieren | Marktplatz-eigene Daten. Eine Migration wäre ein eigenes Vorhaben ohne Nutzen für dieses Ziel. |
| `nft_metadata` löschen | Solange die Plattform nicht alle Fälle abdeckt, ist die Collection der Rückfallweg. Abbau ist ein eigener Schritt nach dem Cutover. |
| Die 206 bestehenden `any` sanieren | Altbestand, kein Fehler dieses Vorhabens. Ein Gate, das ab Tag eins rot ist, wird ignoriert. |
| Tests für `src/app/history-towers/` | Eigenes Modul, hängt nicht am Datenpfad. Steht in `task-notes.md` als eigener Rückstand. |
| Schreibpfade gegen den Diamond ändern | Der Contract bleibt alleinige Autorität über Eigentum, Preise und Gebühren. |

---

## Constraints

- `[Fakt]` Stack unverändert: Next.js 15 App Router, React 18.3.1,
  TypeScript 5.4.5, MongoDB, wagmi/viem, Node ≥ 20.19.
- `[Fakt]` Jede Route läuft weiter über `apiHandler()`; kein handgeschriebenes
  try/catch mit `NextResponse`.
- `[Fakt]` Keine relativen Imports, keine Imports aus `archive/` oder
  `*.deprecated` — von ESLint durchgesetzt.
- `[Fakt]` Jede Änderung läuft über einen eigenen Branch, einen PR und ein
  grünes `npm run check`.
- `[Fakt]` Die Plattform begrenzt pro API-Client, nicht pro Route. Das Limit
  steht je Client in der Datenbank (`rateLimitPerMinute`,
  `packages/db/src/index.ts:206`); der Bootstrap-Standard ist **300 Anfragen
  pro Minute** (`.env.example:40`), für öffentliche Reads gilt getrennt 180.
- `[Schlussfolgerung]` Eine Detailseite löst drei Aufrufe aus (Token, Owner,
  Collection). Bei 300/min sind das rund 100 Detailaufrufe pro Minute. Für den
  erwarteten Traffic ausreichend; die Marktplatz-Übersicht kommt mit ein bis
  zwei Aufrufen aus, nicht mit einem je Karte.
- `[Fakt]` Die Uhr des Marktplatz-Hosts muss synchron sein; die Plattform weist
  Anfragen außerhalb von 300 Sekunden Abweichung ab
  (`AUTH_MAX_TIMESTAMP_SKEW_SEC`, `.env.example:42`).
- `[Fakt]` Eine vollständige Plattform-Instanz läuft lokal per
  `docker compose` (Mongo, Redis, MinIO). Integrationstests hängen damit nicht
  an einer fremden Instanz.

---

## Offene Fragen

1. `[offene Unsicherheit]` Weitere Aufgabenpunkte, die Wolfgang parallel
   zusammenstellt, sind hier noch nicht enthalten. Die Spec wird ergänzt, nicht
   ersetzt.
2. `[offene Unsicherheit]` **Teilweise aufgelöst am 09.09.2026** durch Erhebung
   im Plattform-Repo (siehe Constraints): Standard 300/min je Client,
   konfigurierbar. Offen bleibt allein, was auf der **laufenden** Instanz
   tatsächlich eingestellt ist und ob der Marktplatz dort einen eigenen Client
   mit eigenem Limit bekommt. Frage liegt bei Niklas.
3. `[offene Unsicherheit]` Ob `nft_metadata` nach dem Cutover ganz entfällt oder
   als Rückfallweg bleibt, ist nicht entschieden.
4. `[offene Unsicherheit]` Zeitpunkt des Mainnet-Deploys und wer ihn auslöst.
5. `[offene Unsicherheit]` Wann die NFT Data Platform produktiv nutzbar ist und
   was dafür noch fehlt. Das Repo (HEAD `7915b52`, 69 Commits) führt keine
   Lückenliste und keinen Abschnitt zu offenen Punkten — die Antwort ist aus dem
   Code nicht ableitbar. Frage liegt bei Niklas.
6. `[offene Unsicherheit]` Ob es neben der lokalen Instanz eine geteilte
   Staging-Instanz gibt. Für die Tests aus V27 nicht nötig, für einen realen
   Vorab-Durchlauf schon.

## Änderungsnachweis

- 09.09.2026 — Entscheidungen 8 und 9, V15, V16 sowie vier Constraint-Zeilen
  ergänzt nach Erhebung im Plattform-Repo `NiklasHoffmann/NFT-Data-Platform`,
  HEAD `7915b52`. Offene Frage 2 dadurch weitgehend aufgelöst, Frage 5
  präzisiert, Frage 6 neu. V-Nummern der Gruppen C bis E um zwei verschoben.
