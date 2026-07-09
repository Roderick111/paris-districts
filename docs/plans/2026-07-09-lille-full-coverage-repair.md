# Lille Full-Coverage Repair Handoff

## Summary

Fix Lille first, before touching other cities. Current Lille is not acceptable: it has visible white holes, random detached zones, and selected outlines that jump across unrelated pieces. The user wants **full coverage**, not student-only islands.

Target: a clean full-coverage Lille metro partition that behaves like Paris: every source polygon inside scope belongs to exactly one visible zone; no overlaps; no unassigned internal holes; selected zones are understandable districts.

## Root Cause

Current data technically has 29 features and 211 IRIS assigned, but the partition is visually broken because:

1. Most features are `MultiPolygon` and many are marked `allowMultipart`.
   - Example current Lille output: `lille-centre-core`, `lille-wazemmes-core`, `lille-gares-euralille`, `lille-sud`, context zones, Roubaix zones, etc. are MultiPolygons.
   - This creates scattered pieces under one label and weird selection outlines.

2. Context zones are too broad and disconnected.
   - `lille-context-hellemmes-lomme` mixes two different places.
   - `lille-context-saint-maurice-pellevoisin` spans unrelated east/north pieces.
   - Roubaix and Villeneuve-d'Ascq context zones are large scattered fills.

3. Bad seed names are silently ignored.
   - `scripts/city_coverage_scopes.json` contains Toulouse IRIS names inside Lille config: `Borderouge Nord`, `Les Izards`, `Nègreneys`.
   - Missing seeds do not fail. Builder falls back to arbitrary unassigned IRIS, creating random components.

4. The builder solves "all source units assigned" but not "districts make sense".
   - Full coverage is necessary, but full coverage by scattered multipolygons is still wrong.

## Research Anchors

Use official/recognized district structure before trying to invent micro-areas.

- INSEE IRIS is the official infra-communal statistical partition and should remain the source unit: https://www.insee.fr/fr/metadonnees/definition/c1523
- Lille has 10 recognized administrative districts in the 21st century, and micro-neighborhoods can sit under them. `Quartiers de Lille` also identifies lived sectors like Vieux-Lille, Lille-Centre, Vauban-Esquermes, Wazemmes, Moulins, Fives, Bois-Blancs, Lille-Sud, Saint-Maurice Pellevoisin, and communes associées: https://fr.wikipedia.org/wiki/Quartiers_de_Lille
- Vauban-Esquermes is specifically described as the youngest/student-heavy district with Université catholique de Lille and other schools, so it should remain a primary student zone rather than generic context.
- Villeneuve-d'Ascq should remain in scope because Cité Scientifique, Pont-de-Bois, Triolo, Annappes/Hôtel-de-Ville are real campus/metro areas.

## New Lille Rule

No `allowMultipart` except where source geometry itself is an unavoidable island. If a zone has disconnected components, split it into separate zones or assign the components to adjacent district context zones.

Full coverage means:

- every IRIS in scope assigned once;
- every displayed feature should be contiguous;
- no `MultiPolygon` with disconnected components under one label;
- context zones are real district contexts, not catch-all leftovers.

## Coverage Scope

Use this scope for v1 Lille full coverage:

- Lille `59350`
- Lambersart `59328`
- La Madeleine `59368`
- Mons-en-Barœul `59410`
- Villeneuve-d'Ascq `59009`
- Roubaix `59512` only if keeping EDHEC/Barbieux and Roubaix centre rows

Do not include additional communes yet. If the screenshot still shows outside white areas beyond these communes, that is outside current coverage scope unless the user asks to expand the metro scope.

## Required Data Shape

Replace scattered context zones with district-level full partition zones.

### Lille Commune `59350`

Primary/researched zones:

- `lille-centre-core`
- `lille-gares-euralille`
- `lille-vieux-lille`
- `lille-vauban-catho`
- `lille-esquermes-cormontaigne`
- `lille-wazemmes-core`
- `lille-gambetta-solferino`
- `lille-moulins-campus-edge`
- `lille-fives`
- `lille-bois-blancs-euratechnologies`
- `lille-sud`
- `lille-hellemmes`
- `lille-lomme-chr`

Context zones to add/keep as contiguous districts:

- `lille-context-saint-maurice-pellevoisin`
- `lille-context-lomme`
- `lille-context-hellemmes-fill`
- `lille-context-centre-saint-sauveur`
- `lille-context-vauban-citadelle-edge`
- `lille-context-lille-east-fives-edge`
- `lille-context-lille-south-edge`

Do not use `lille-context-hellemmes-lomme`; split it.

### Lambersart `59328`

Use multiple contiguous zones, not one giant multipart zone:

- `lille-context-lambersart-canteleu`
- `lille-context-lambersart-bourg`
- `lille-context-lambersart-canon-or`

Fallback scoring: use Lambersart district reputation/context. Conservative safety, low student energy, decent calm.

### La Madeleine `59368`

Use contiguous zones:

- `lille-madeleine-romarin` primary if current researched row remains.
- `lille-context-la-madeleine-centre`
- `lille-context-la-madeleine-north`

### Mons-en-Barœul `59410`

Use contiguous zones:

- `lille-context-mons-west`
- `lille-context-mons-centre`
- `lille-context-mons-east`

Fallback scoring: context score, medium affordability, decent transport, weak student energy.

### Villeneuve-d'Ascq `59009`

Primary/campus zones:

- `lille-vda-cite-scientifique`
- `lille-vda-pont-de-bois`
- `lille-vda-triolo`
- `lille-vda-annappes-hotel-de-ville`

Context zones:

- `lille-context-vda-flers-breucq`
- `lille-context-vda-annappes`
- `lille-context-vda-ascq`
- `lille-context-vda-cousinerie-brigode`

No large `lille-context-vda-north-east` catch-all if it is disconnected.

### Roubaix `59512`

If Roubaix stays in Lille city view:

Primary rows:

- `lille-roubaix-edhec-barbieux`
- `lille-roubaix-centre-edge`

Context zones:

- `lille-context-roubaix-barbieux-fill`
- `lille-context-roubaix-centre`
- `lille-context-roubaix-east`

If Roubaix causes the map to feel too wide, defer Roubaix entirely for v2. Do not keep partial random Roubaix islands.

## Builder Changes

Update `scripts/build_full_coverage_specs.py`:

1. Fail on missing seeds.
   - Do not silently skip missing `seedIrisNames`.
   - Error message must show city, zone code, INSEE, missing names.

2. Remove automatic `allowMultipart=True` from `spec_from_assignment`.
   - If `is_connected_source_group()` fails, fail by default.
   - Only allow multipart when a spec has explicit `allowMultipart: true`.

3. Split disconnected context components automatically.
   - If a context definition receives disconnected components, emit one context zone per component:
     - `lille-context-lambersart-1`
     - `lille-context-lambersart-2`
   - Better: define real district labels in `city_coverage_scopes.json` so automatic numeric labels are rare.

4. Enforce one commune per context zone unless explicitly allowed.
   - No zone like `Hellemmes / Lomme context`.
   - No cross-commune catch-all.

5. Add Lille-specific validation:
   - no generated Lille feature may have disconnected components unless in allowlist;
   - no feature bbox wider than expected for a district unless context role is `commune_context`;
   - no selected primary zone may include more than one recognized district parent.

## Config Changes

Update `scripts/city_coverage_scopes.json`:

- Remove invalid Lille seeds:
  - `Borderouge Nord`
  - `Les Izards`
  - `Nègreneys`
- Replace broad context zones with the district-specific list above.
- Add seed names only after confirming they exist in cached IRIS files.
- For any unknown granular zone, use a full district fallback:
  - assign all unclaimed adjacent IRIS to a district context zone;
  - use district-level reputation and low/medium confidence scores.

## Score/Data Changes

Update `src/data/lillePlaces.ts` after context specs are final:

- Add rows for every new context zone.
- Remove rows for deleted catch-all zones.
- Keep `coverageRole: "context"` or `"low_relevance"` for district fallback zones.
- Use conservative fallback scores:
  - security: district/commune reputation if known, otherwise 5.8-6.4
  - affordability: 5.0-6.5 for ordinary context, lower for premium suburbs
  - transport: 6.5-8.2 depending metro/tram proximity
  - studentEnergy: 4.0-5.8 for context
  - services: 6.0-7.4
  - campusAccess: 5.0-7.5 unless near campus
  - greenCalm: 5.5-7.8

Context summary:

`Full-coverage district context; useful for map continuity, not a primary student pick.`

Context caveat:

`Broad district fallback; block-level choice still matters.`

## Commands

Run:

```bash
PYTHONPATH=scripts python3 scripts/build_full_coverage_specs.py lille
python3 scripts/build_new_city_geojson.py lille
python3 scripts/validate_city_geojson.py lille
~/.bun/bin/bun run build
```

If script fetches remote IRIS and sandbox blocks network, rerun with approval. Do not hand-edit generated GeoJSON.

## Acceptance Criteria

Data:

- All IRIS in Lille scope assigned exactly once.
- No missing seed names.
- No deleted/extra score rows.
- No invalid lon/lat.
- No duplicate geometry hashes.
- No disconnected features except explicit allowlist, preferably none.

Visual:

- No white holes inside Lille/Lambersart/La Madeleine/Mons/VdA/Roubaix coverage scope.
- No random island zone under same selected outline.
- Wazemmes selected outline is one compact Wazemmes shape.
- Gares/Euralille selected outline is one compact station/Euralille shape.
- Fives selected outline is one clear east-side district shape.
- Lambersart displays as contiguous district zones, not a scattered single blob.
- Lomme and Hellemmes are separate.
- Primary zones are not swallowed by context zones.

## Why This Fix Works

Full coverage needs a partition, but the partition must be district-based. Current code assigns every IRIS, but then groups disconnected leftovers into broad context labels and hides the damage behind `allowMultipart`. The repair makes missing seeds fatal, makes disconnected grouping fatal, and uses district fallback when granular research is missing.

## Unresolved Questions

None.
