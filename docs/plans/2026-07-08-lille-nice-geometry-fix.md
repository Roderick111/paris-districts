# Lille and Nice Geometry Fix Handoff

## Summary

Fix Lille and Nice map geometry after the first-batch granularity upgrade produced confusing zoning. The current pipeline technically passes contiguity checks, but the output is visually and semantically wrong: watershed fill assigns too much land to student zones, creating giant areas, enclaves, unclear click targets, and zones that contain or visually swallow other zones.

Desired result: make Lille and Nice look closer to Paris/Bordeaux: clear, meaningful, mostly contiguous official/IRIS-based student areas, with white space outside the student scope allowed. Do not try to tile entire communes.

## Root Cause

Current `scripts/build_city_geometry_specs.py` uses watershed fill across full IRIS pools for Lille and Nice:

- Lille: `watershed_assign(..., fill_unassigned=True)` for all specs grouped by INSEE code.
- Nice: `watershed_assign(..., fill_unassigned=True)` for the full Nice IRIS pool.

That optimizes for "no internal holes" across the commune, not for readable student geography. It makes valid but bad map units.

Passing `validate_city_geojson.py` is not enough because current audits check code parity, coordinates, duplicate geometry, and contiguity, but not whether a zone absorbed unrelated neighborhoods.

## Non-Negotiable Geometry Policy

- No hand-drawn polygons.
- No lat/lon rectangle cuts.
- No full-commune watershed fill.
- White outside student scope is acceptable.
- One feature should be one understandable lived student zone.
- Use official quartier polygons when they already communicate the zone better than IRIS groups.
- Use IRIS groups only where official quartiers are too coarse.
- If a zone cannot be cleanly represented, shrink it to the strongest official/IRIS core instead of expanding it.
- `allowMultipart` only for truly non-contiguous but intentional campus/suburb cases. Prefer splitting the row if both parts matter independently.

## Pipeline Changes

Update `scripts/build_city_geometry_specs.py`:

1. Change default watershed behavior for Lille and Nice to `fill_unassigned=False`.
2. Add optional per-spec bounded fill:
   - `fill_scope_iris_names`: list of IRIS names allowed to be assigned to that row cluster.
   - `fill_scope_quartier`: official quartier name(s) used as parent mask if available.
3. Only run watershed within the union of explicit intended seeds plus explicit scope, never the whole commune.
4. If a spec has no fill scope, use intended polygons only.
5. If intended polygons are disconnected:
   - keep the contiguous component around the first valid seed, or
   - split into separate score rows if both components are meaningful, or
   - mark `allowMultipart` only if the research explicitly says the scattered geometry is one student zone.
6. Add audit warnings/errors:
   - reject any non-`allowMultipart` zone whose bbox area is more than 3x the bbox area of its intended seed group.
   - reject Nice zones that cross more than one major parent group unless explicitly allowed.
   - reject Lille zones that combine Lille proper with Villeneuve-d'Ascq, Roubaix, Lomme, Hellemmes, or La Madeleine in one feature.

Update `docs/guides/city-geometry-pipeline.md`:

- State `fill_unassigned=false` as default.
- State watershed requires explicit bounded scope.
- State Nantes-style full tiling is city-specific and must not be copied to Lille/Nice.
- Add "Paris/Bordeaux clarity" as visual standard: clear official-looking areas, white outside scope allowed.

## Lille Target Geometry

Use curated meaningful polygons. Keep 20 score rows from `src/data/lillePlaces.ts`, but rebuild geometry with these rules.

### Lille Proper

Use official Lille quartier polygons where they are already clear:

- `lille-vieux-lille`: official `Vieux-Lille`.
- `lille-fives`: official `Fives`.
- `lille-bois-blancs-euratechnologies`: official `Bois-Blancs`.
- `lille-sud`: official `Lille-Sud`.

Use bounded IRIS groups inside official quartiers:

- `lille-centre-core`: only central Lille-Centre IRIS around hyper-centre, Grand Place, Rihour, République, and pedestrian core. Do not absorb Saint-Maurice-Pellevoisin, Euralille, Moulins, or Wazemmes.
- `lille-gares-euralille`: only station/Euralille IRIS. Must be east/north-east of centre core. Must not contain centre core.
- `lille-vauban-catho`: only Vauban/Catho IRIS around Université catholique and Jardin Vauban.
- `lille-esquermes-cormontaigne`: only Esquermes/Cormontaigne IRIS west/south-west of Vauban.
- `lille-wazemmes-core`: only Wazemmes market/metro core IRIS.
- `lille-gambetta-solferino`: only Gambetta/Solférino corridor IRIS, between Wazemmes and centre.
- `lille-moulins-campus-edge`: only Moulins IRIS around Faculté de droit / Porte de Douai / metro corridor.

Suburbs / satellite student areas:

- `lille-hellemmes`: use Hellemmes official/IRIS core only. Do not absorb Fives or Villeneuve-d'Ascq.
- `lille-lomme-chr`: use Lomme/CHR campus-health corridor IRIS only.
- `lille-la-madeleine-romarin`: use La Madeleine/Romarin tram-adjacent IRIS only.
- `lille-roubaix-edhec-barbieux`: use Barbieux/EDHEC-area IRIS only, not Roubaix centre.
- `lille-roubaix-centre-edge`: use Roubaix centre-edge IRIS only. Keep separate from EDHEC/Barbieux.

Villeneuve-d'Ascq:

- `lille-vda-cite-scientifique`: official/IRIS campus core only.
- `lille-vda-pont-de-bois`: official/IRIS Pont-de-Bois campus core only.
- `lille-vda-triolo`: official/IRIS Triolo only.
- `lille-vda-annappes-hotel-de-ville`: split if necessary. Prefer two rows only if code/data can be changed safely; otherwise keep a documented `allowMultipart` but ensure it is visually small and intentional.

### Lille Acceptance Criteria

- No selected zone should visually contain another selected zone.
- `lille-centre-core` must be smaller than current screenshot and not include Fives/Moulins/Saint-Maurice-Pellevoisin.
- `lille-fives` must remain a clear east-side block, not hidden under a bigger centre layer.
- Villeneuve-d'Ascq polygons must render in the correct location with EPSG:4326.
- White gaps between unrelated student satellites are acceptable.

## Nice Target Geometry

Nice should not tile the whole commune. The current full-IRIS fill makes hills and peripheral spaces look like student areas. Rebuild with a corridor model: centre/station, north-centre Valrose, east campus/risk corridor, west campus/EDHEC corridor, and selected comfort hills.

Keep 22 score rows from `src/data/nicePlaces.ts`, but shrink geometry to meaningful cores.

### Centre and Station

Use bounded IRIS groups:

- `nice-jean-medecin-core`: Jean-Médecin commercial spine only.
- `nice-carabacel`: Carabacel core only.
- `nice-thiers-station-edge`: Thiers/station IRIS only.
- `nice-musiciens`: Musiciens residential core only.
- `nice-vernier`: Vernier north-centre core only.
- `nice-liberation`: Libération market/tram corridor only.
- `nice-borriglione-valrose`: Borriglione/Valrose campus corridor only.

### North and Hills

Use official quartier or bounded IRIS groups, but do not absorb large hill polygons:

- `nice-saint-maurice`: Saint-Maurice core only.
- `nice-cimiez`: Cimiez lived residential core. Avoid large empty hillside extensions if source allows.
- `nice-rimiez`: Rimiez only if it can be shown compactly; otherwise consider score-only or omit from map until better source.

### East Corridor

Use bounded IRIS/official groups:

- `nice-vieux-nice`: historic core only.
- `nice-port`: port district only.
- `nice-riquier`: Riquier core only.
- `nice-saint-roch`: Saint-Roch tram corridor only.
- `nice-saint-jean-angely`: campus core only.
- `nice-pasteur`: Pasteur hospital/east corridor only.
- `nice-ariane`: Ariane cap zone only.

### West Corridor

Use bounded IRIS/official groups:

- `nice-rue-france-promenade-edge`: Rue de France / Promenade edge only.
- `nice-baumettes-magnan`: Baumettes/Magnan student-west corridor only.
- `nice-carlone-campus`: Carlone campus core only.
- `nice-madeleine`: Madeleine valley core only. Must not absorb the whole western hills.
- `nice-arenas-saint-augustin-edhec`: Arénas/Saint-Augustin/EDHEC core only. Avoid airport/runway/industrial spillover.

### Nice Acceptance Criteria

- Map must not look like the entire Nice commune is covered.
- Western hills must not be one giant yellow student zone.
- `nice-borriglione-valrose` outline should be compact around Valrose/Borriglione, not a sprawling north-centre blob.
- East-side zones must be readable as separate Riquier, Saint-Roch, Pasteur, Ariane, and Saint-Jean-d'Angely polygons.
- White space in hills, airport, and low-student peripheral areas is expected.

## Implementation Steps

1. Inspect current `scripts/granularity_intended.json` for Lille and Nice and remove unrelated seed names that were used only to force tiling.
2. Add explicit `fill_scope_iris_names` support to `scripts/build_city_geometry_specs.py`.
3. Set `fill_unassigned=False` for Lille and Nice rebuilds.
4. For each Lille/Nice row, keep only intended seed IRIS plus optional bounded scope. Do not assign all remaining IRIS.
5. Regenerate only Lille and Nice geometry specs:

```bash
python3 scripts/build_city_geometry_specs.py lille nice
```

6. Rebuild only Lille and Nice GeoJSON:

```bash
python3 scripts/build_new_city_geojson.py lille nice
```

7. Validate:

```bash
python3 scripts/validate_city_geojson.py lille
python3 scripts/validate_city_geojson.py nice
~/.bun/bin/bun run build
```

8. Browser-check:
   - Lille centre core, Fives, Wazemmes, Vauban, Cité Scientifique.
   - Nice Borriglione/Valrose, Jean-Médecin, Saint-Roch, Ariane, Madeleine, Arénas.
   - Confirm no console `invalid latitude`.
   - Confirm clicked panel matches visible polygon.
   - Confirm selected outline does not include unrelated neighborhoods.

## Visual QA Checklist

Use screenshots as acceptance evidence.

Lille:

- Centre no longer swallows Fives or Moulins.
- Fives outline is independent and easy to read.
- Vauban/Catho and Esquermes/Cormontaigne are compact west-side shapes.
- VdA campus zones appear as intentional satellites.

Nice:

- No giant full-west blob.
- No full-hill coverage unless that row is intentionally a hill comfort zone.
- Centre and north-centre polygons form readable corridor pieces.
- East-side cap zones are separate and clickable.

General:

- White outside student scope is not a bug.
- Internal white holes inside one intended student belt should be investigated.
- Do not chase zero white space if the result hurts readability.

## Files to Touch

- `scripts/build_city_geometry_specs.py`
- `scripts/granularity_intended.json`
- `scripts/granularity_geometry.json`
- `public/data/lille.geojson`
- `public/data/nice.geojson`
- `docs/guides/city-geometry-pipeline.md`

Touch `src/data/lillePlaces.ts` or `src/data/nicePlaces.ts` only if a row must be split or removed because geometry cannot represent it cleanly.

## Guardrails

- Use `python3` for existing scripts.
- Use `~/.bun/bin/bun`, never npm/yarn/pnpm.
- Do not change score weights or security cap.
- Do not change UI layout.
- Do not hand-draw polygons.
- Do not make full-city tiling the target.
- Do not push without user approval.

## Unresolved Questions

None. If implementation reveals a row cannot be represented cleanly with official/IRIS polygons, shrink to the strongest contiguous core first; split the row only when shrinkage would make the label misleading.
