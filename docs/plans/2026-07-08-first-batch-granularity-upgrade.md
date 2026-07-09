# First-Batch City Granularity Upgrade Handoff

## Summary

Upgrade Toulouse, Lille, Marseille, Nice, and Nantes from coarse first-pass coverage to decision-useful student micro-areas. Current implementation has 10-11 polygons per city and visibly under-covers lived student geography. New target is 18-24 scored areas per city, backed by official quartier polygons and/or IRIS groupings.

Do not change UI behavior, score weights, or security cap. This is a data/geometry quality pass.

## Inputs

Updated reports:

- `docs/research/toulouse-student-life.md`
- `docs/research/lille-student-life.md`
- `docs/research/marseille-student-life.md`
- `docs/research/nice-student-life.md`
- `docs/research/nantes-student-life.md`

Current implementation touchpoints:

- `src/data/cities.ts`
- `src/data/toulousePlaces.ts`
- `src/data/lillePlaces.ts`
- `src/data/marseillePlaces.ts`
- `src/data/nicePlaces.ts`
- `src/data/nantesPlaces.ts`
- `scripts/build_new_city_geojson.py`
- `public/data/toulouse.geojson`
- `public/data/lille.geojson`
- `public/data/marseille.geojson`
- `public/data/nice.geojson`
- `public/data/nantes.geojson`

## Implementation Changes

1. Replace each city `PlaceScore[]` with exact rows from its updated report.
2. Keep existing `PlaceScore` shape. No schema/API change.
3. Add `evidenceNote` for every changed/new row with one short source-backed reason.
4. Keep `granularity: "micro"` and set `confidence`:
   - `high` for official whole quartier polygons
   - `medium` for IRIS groups or official quartier splits
   - `low` only if a row must ship with weaker geometry; avoid this where possible
5. Extend `scripts/build_new_city_geojson.py` to support IRIS-backed groups:
   - Load official city quartier sources already used by the script.
   - Add an IRIS loader from a checked-in/downloaded official IRIS GeoJSON source.
   - Map report rows to either official source names or explicit IRIS codes.
   - Merge only contiguous polygons unless a row has explicit `allowMultipart`.
6. Keep existing builder audits and add/keep:
   - invalid lon/lat rejection
   - duplicate code rejection
   - duplicate geometry hash rejection
   - missing score row rejection
   - extra GeoJSON feature rejection
7. Lille WFS requests must include `srsName=EPSG:4326`; this prevents Villeneuve-d'Ascq projected meter coordinates from crashing deck.gl.

## City-Specific Requirements

Toulouse:

- Target 21 rows.
- Split centre, Saint-Cyprien/Patte-d'Oie, Saint-Michel/Saint-Agne/Empalot, Rangueil/Sauzelong, Mirail/Reynerie/Bellefontaine, and Minimes/Barriere de Paris/La Vache.
- Do not keep one giant Rangueil/Sauzelong/Pouvourville blob.

Lille:

- Target 20 rows.
- Include core Lille plus Hellemmes, Lomme/CHR, Villeneuve-d'Ascq, Roubaix EDHEC/Barbieux, and La Madeleine/Romarin.
- Fix/verify Villeneuve-d'Ascq coordinates before browser validation.

Marseille:

- Target 23 rows.
- Use official 111 quartiers as primary geometry.
- Stop broad merging in the centre and north. Saint-Charles, Belle de Mai, Noailles, Belsunce, Cours Julien, Baille, Timone, Castellane, Prefecture, Rouet, Perier, Luminy, Saint-Jerome, Chateau-Gombert, and La Castellane need distinct rows.

Nice:

- Target 22 rows.
- Split centre/station, Libération/Valrose, Cimiez/Rimiez, east campus/risk zones, west campus, Madeleine, and Arenas/Saint-Augustin.
- Exclude sea/airport-only geometry from clickable student areas when source polygons include it.

Nantes:

- Target 22 rows.
- Split centre, Hauts-Paves/Saint-Felix, university north, Chantrerie, Ile de Nantes, Malakoff/Saint-Donatien, Dervallieres/Zola, Chantenay/Bellevue, Breil/Barberie, Doulon/Bottiere.
- Do not use broad 11 administrative quartiers as final student polygons.

## Validation

Run:

```bash
~/.bun/bin/bun run build
```

Run or add a GeoJSON validation command/script that confirms for all five files:

- every coordinate is valid lon/lat
- every feature has matching `PlaceScore.code`
- every score row has exactly one feature
- no empty geometries
- no duplicate geometry hashes
- feature count matches report target

Manual browser checks:

- Select every upgraded city from dropdown.
- Confirm map recenters and all polygons render.
- Click at least five polygons per city, including best area and worst cap zone.
- Confirm selected outline does not jump off map.
- Confirm console has no deck.gl `invalid latitude` error.
- Compare against prior screenshots: visible improvement means more local polygons, fewer giant blobs, and clear campus/cap-zone separation.

## Guardrails

- Use `~/.bun/bin/bun`, never npm/yarn/pnpm.
- Do not change score weights, security cap, UI layout, city dropdown, or source/settings panel.
- Do not hand-draw polygons.
- Do not execute SQL.
- Do not push without user approval.
- Ignore unrelated untracked files unless they directly block this work.

## Unresolved Questions

None.
