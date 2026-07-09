# Remaining French Cities Implementation Plan

## Summary

Add the second city batch after Toulouse/Lille/Marseille/Nice/Nantes with micro-area coverage from the updated reports:

- Strasbourg
- Montpellier
- Rennes
- Toulon
- Grenoble

Use the same app architecture as the first batch: `CityConfig`, `PlaceScore[]`, generated GeoJSON under `public/data/`, and dropdown-driven city selection. Do not ship coarse 10-area drafts; each city now has 20-22 target micro-areas.

## Inputs

Research reports:

- `docs/research/strasbourg-student-life.md`
- `docs/research/montpellier-student-life.md`
- `docs/research/rennes-student-life.md`
- `docs/research/toulon-student-life.md`
- `docs/research/grenoble-student-life.md`

Existing implementation references:

- `src/data/cities.ts`
- `src/data/bordeauxPlaces.ts`
- `src/data/lyonPlaces.ts`
- **`docs/guides/city-geometry-pipeline.md`** — mandatory geometry playbook (contiguity audits)
- `scripts/geometry_audit.py`
- `scripts/build_new_city_geojson.py`
- `scripts/validate_city_geojson.py`
- `scripts/build_bordeaux_micro_geojson.py`
- `scripts/build_nantes_geometry_specs.py` (intended IRIS + watershed template)

## Data Changes

1. Extend `CityId` in `src/data/cities.ts` with:
   `strasbourg`, `montpellier`, `rennes`, `toulon`, `grenoble`.
2. Create one `PlaceScore[]` file per city:
   - `src/data/strasbourgPlaces.ts`
   - `src/data/montpellierPlaces.ts`
   - `src/data/rennesPlaces.ts`
   - `src/data/toulonPlaces.ts`
   - `src/data/grenoblePlaces.ts`
3. Use exact score rows from the updated reports:
   - Strasbourg: 20 rows
   - Montpellier: 21 rows
   - Rennes: 20 rows
   - Toulon: 20 rows
   - Grenoble: 22 rows
4. Use ASCII slugs for `id` and `code`, e.g.:
   - `strasbourg-esplanade-campus`
   - `montpellier-triolet-fac-sciences`
   - `rennes-beaulieu-campus`
   - `toulon-la-garde-campus`
   - `grenoble-saint-martin-dheres-campus-core`
5. Add source arrays and `CityConfig` entries in `src/data/cities.ts`.
6. Add all new place arrays to `placesByCity`, `allPlaces`, and `placeByCode`.
7. Set `granularity: "micro"` for every row.
8. Set `confidence` by geometry basis:
   - `high` for official whole quartier polygons
   - `medium` for IRIS groups or quartier splits
   - `low` only if a row is kept despite weaker boundary evidence
9. Add one short `evidenceNote` per row, grounded in the corresponding research report.

Suggested defaults:

| City | Center | Zoom | Default selected |
|------|--------|------|------------------|
| Strasbourg | `[7.752, 48.573]` | `12` | `strasbourg-esplanade-campus` |
| Montpellier | `[3.877, 43.611]` | `12` | `montpellier-beaux-arts` |
| Rennes | `[-1.677, 48.117]` | `12` | `rennes-beaulieu-campus` |
| Toulon | `[5.930, 43.124]` | `11.8` | `toulon-la-garde-campus` |
| Grenoble | `[5.724, 45.188]` | `12` | `grenoble-gieres-campus` |

## GeoJSON Changes

Create or extend a generic builder script for these five cities:

- output `public/data/strasbourg.geojson`
- output `public/data/montpellier.geojson`
- output `public/data/rennes.geojson`
- output `public/data/toulon.geojson`
- output `public/data/grenoble.geojson`

Source priority:

1. Official city/metropole quartier polygons where they match the report row.
2. Official or INSEE IRIS polygons for micro-area grouping.
3. Stop with clear error. Do not hand-draw polygons.

GeoJSON requirements (see `docs/guides/city-geometry-pipeline.md`):

- Each feature has `properties.code` matching one `PlaceScore.code`.
- Each feature has `properties.name` and `properties.kind`.
- **Source groups must be edge-adjacent before merge** (`audit_source_contiguity`).
- **Output MultiPolygons must be contiguous** unless `allowMultipart: true` is documented.
- Duplicate code, duplicate geometry, empty geometry, missing score row, and extra geometry row fail the script.
- Invalid lon/lat coordinates fail the script.
- Feature count must match the report target for each city.
- Prefer intended-IRIS reservation + watershed fill to tile commune without internal holes (Nantes pattern).

City-specific geometry targets:

- Strasbourg: IRIS groups for 20 rows; include Illkirch campus; keep Esplanade, Krutenau, Grande Ile, Gare, Hautepierre, Neuhof separate.
- Montpellier: IRIS groups for 21 rows; split north campus into Triolet, Paul-Valery, Occitanie; keep Mosson and Paillade separate.
- Rennes: IRIS groups for 20 rows; split Centre, Villejean, Beaulieu, Maurepas, Blosne, Cleunay/La Courrouze.
- Toulon: IRIS groups for 20 rows; include La Garde, La Valette, and La Seyne as selected commute areas; do not fill whole communes.
- Grenoble: IRIS groups for 22 rows; include Grenoble, Saint-Martin-d'Heres, Gieres, La Tronche, Meylan, and west-suburb tram edge.

## UI Changes

If not already done by the first-batch agent:

- Remove hardcoded `CITY_OPTIONS` in `src/components/ParisStudentMap.tsx`.
- Render city dropdown from exported `cities`.
- Confirm sidebar title wrapping still works for long names.
- Do not reintroduce right-panel city tabs.

## Validation

Run:

```bash
~/.bun/bin/bun run lint
~/.bun/bin/bun run build
```

Manual checks:

- All five cities appear in city dropdown.
- Map recenters for each city.
- Polygons render and are clickable.
- Detail panel, score badge, source tab, ranking filters work.
- Long titles do not overflow.
- No city loads empty or mismatched GeoJSON.
- Each city visibly improves over a 10-area map: more local polygons, fewer giant blobs, clear campus and cap-zone separation.

## Guardrails

- No `npm`, `npx`, `yarn`, or `pnpm`.
- Do not change scoring weights or security cap.
- Do not commit unrelated untracked files.
- Do not push without user approval.
- Do not silently change report scores during implementation; if a score changes, update the report in the same change.

## Unresolved Questions

None.
