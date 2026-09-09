<!-- Ziel-Pfad im Repo: state/assumption-ledger.md -->
# Assumption Ledger — nextjs-nft-marketplace-w3i-2.0-harness

Jede Annahme, die getroffen wurde, weil eine sichere Klärung zu teuer oder
nicht verfügbar war (`[Annahme]`-Marker aus einem Bericht) — mit Datum,
Fundstelle und Status. Ziel: eine Annahme verschwindet nicht stillschweigend,
sondern wird entweder bestätigt, widerlegt, oder bleibt sichtbar offen.

| Datum | Annahme | Fundstelle (Bericht/Commit) | Status | Aufgelöst am |
|---|---|---|---|---|
| 08.09.2026 | Die mit Commit `b6e0ca8` (27.08.2026) aus `docs/environment/ENV_VARIABLES.md` und `src/config/wagmi.ts` entfernten Zugangsdaten stehen weiter in der Git-Historie und sind über das öffentliche Ursprungs-Repo exponiert. Angenommen wird, dass sie **noch nicht rotiert** sind — geprüft wurde das nicht, die Rotation liegt beim abgebenden Entwickler. Solange sie offen ist, ersetzt kein Gate sie: `docs/adr/0001-kein-historien-scan.md` verzichtet bewusst auf den Historien-Scan, weil Rotation die einzige wirksame Maßnahme ist. | Phase 2c (`state/tasks/harness-phase2c-gates-scharf.md`), ADR-0001, Commit `b6e0ca8` | offen | |
