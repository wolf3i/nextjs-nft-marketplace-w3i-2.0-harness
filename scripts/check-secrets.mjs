/**
 * Datei: scripts/check-secrets.mjs
 *
 * Zweck: Secret-Gate. Prüft, ob eine lokale Umgebungsdatei versehentlich
 * unter Versionskontrolle steht. Getrackt werden dürfen nur Team-Defaults
 * (`.env`) und die Vorlagen (`.env*.template`) — jede Datei, die auf
 * `.env.local` oder `.env.<irgendwas>.local` passt, enthält
 * maschinenspezifische Zugangsdaten und gehört nie ins Repo.
 *
 * Bewusst eine reine Dateinamensprüfung über `git ls-files`, kein
 * Inhaltsscan: Muster im Dateiinhalt sind Sache von gitleaks (CI-Schritt),
 * die Frage „ist diese Datei überhaupt getrackt" ist deterministisch und
 * braucht keine Heuristik.
 *
 * Wird aufgerufen von:
 * - package.json (Skript `check`, direkt nach scripts/check-contract.mjs)
 * - .github/workflows/ci.yml (indirekt über `npm run check`)
 *
 * Wichtig: Das Muster darf nicht auf `.env` oder `.env.local.template`
 * passen — beide sind absichtlich committet. Wird das Muster gelockert,
 * verliert das Gate seinen Zweck; wird es verbreitert, wird die Kette
 * grundlos rot.
 *
 * Aufruf: node scripts/check-secrets.mjs
 * Exit 0 = sauber, Exit 1 = Befund gefunden
 */

import { execFileSync } from 'node:child_process'

console.log('\n=== Secret-Check ===\n')

/**
 * Listet alle von Git getrackten Dateien des Repos auf.
 * @returns Array der Repo-relativen Pfade, leere Einträge entfernt
 */
function getrackteDateien() {
  const ausgabe = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf-8' })
  return ausgabe.split('\0').filter((pfad) => pfad.length > 0)
}

// Trifft `.env.local` und `.env.<irgendwas>.local`, in jedem Verzeichnis.
// Nicht `.env`, nicht `.env.local.template`: das `.local` muss das Ende sein.
const lokaleEnvDatei = /(^|\/)\.env(\.[^/]+)?\.local$/

let dateien
try {
  dateien = getrackteDateien()
} catch (fehler) {
  console.log('✗ `git ls-files` fehlgeschlagen — kein Git-Repo oder Git fehlt.')
  console.log(`  ${fehler.message}\n`)
  process.exit(1)
}

const befunde = dateien.filter((pfad) => lokaleEnvDatei.test(pfad))

// ─── Ergebnis ───────────────────────────────────────────────────────────────
if (befunde.length === 0) {
  console.log(`✓ ${dateien.length} getrackte Dateien geprüft, keine lokale Umgebungsdatei getrackt.\n`)
  process.exit(0)
}

console.log(`✗ ${befunde.length} Befund(e) — lokale Umgebungsdatei(en) unter Versionskontrolle:\n`)
for (const pfad of befunde) {
  console.log(`  - ${pfad}  (entfernen mit: git rm --cached ${pfad})`)
}
console.log('')
process.exit(1)
