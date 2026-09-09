<!--
Ziel-Pfad im Repo: state/reibung.md

Wofür diese Datei da ist: eine Zeile pro Reibungsvorfall — jeder Moment, in
dem etwas den Arbeitsfluss aufgehalten hat (ein Werkzeug, ein Gate, eine
Doku-Stelle, ein Befehl, der nicht griff). Sie liegt im Projekt-Repo statt
in einem fünften, separat gepflegten Repo, weil genau die Person, die
gerade abkürzt, nicht zu einem weiteren Ort wechselt, um die Abkürzung
festzuhalten.

Diese Datei trägt absichtlich KEINEN `Stand dieser Fassung:`-Marker.
`scripts/check-docs.mjs`, Prüfung 3, vergleicht innerhalb einer Datei jedes
Datum gegen diesen Marker und meldet jedes jüngere Datum als Befund. Diese
Datei ist ein Anhänge-Protokoll mit fortlaufend neuen Daten — mit Marker
würde jeder neue Eintrag das Doku-Gate rot färben. Kalibrierter Beleg für
diese Entscheidung: `state/gates.md`, Kalibrierungs-Log.

Ein Eintrag ist eine Zeile, kein Aufsatz.
-->

# Reibungs-Log — nextjs-nft-marketplace-w3i-2.0-harness

| Datum | Was hat aufgehalten | Wo (Datei/Schritt) | Kosten (grob) | Erledigt? |
|---|---|---|---|---|
| [FÜLLUNG] | | | | |
| 2026-09-08 | commit-guard blockt jeden Bash-Befehl, dessen Text `.claude/settings.json` enthält — auch das harmlose `git status` im selben Verbundbefehl; die Datei ist über Claude Code nicht committebar | `.claude/hooks/commit-guard.js`, Zeile 150 | ~20 min | ja, Commit vom Menschen im eigenen Terminal |
| 2026-09-09 | Freigabe für jeden Git-Vorgang von Hand im Editor anlegen, Zeitstempel abtippen, zweimal pro Iteration (commit + push) — funktioniert, ist aber unnötig umständlich | `state/freigabe-commit.md` / `.claude/hooks/commit-guard.js` | ~2 min je Iteration | ja — Shell-Funktion `freigabe()` in `~/.bashrc`: zeigt `git diff --staged --stat`, fragt nach, schreibt dann den Zeitstempel. Das Gate bleibt intakt, weil die Funktion in der eigenen Shell läuft und nicht vom Modell aufgerufen werden kann. Wäre ein guter Vorschlag ans Template |