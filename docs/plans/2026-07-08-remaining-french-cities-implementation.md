# Second Batch French Cities District Implementation Handoff

## Summary

Add the next five cities to the student quality map using the revised **district-first** model:

- Strasbourg
- Montpellier
- Rennes
- Toulon
- Grenoble

Do not use the older 20-22 "micro-area" direction. It caused the same failure mode seen in Lille/Nice/Marseille: random IRIS fragments, weak evidence at fake precision, and noisy selected outlines. Use readable official districts, official quartier groups, and only a few campus/commute edges where they are genuinely important.

The updated source reports are already written:

- `docs/research/strasbourg-student-life.md` - 16 zones
- `docs/research/montpellier-student-life.md` - 14 zones
- `docs/research/rennes-student-life.md` - 12 zones
- `docs/research/toulon-student-life.md` - 12 zones
- `docs/research/grenoble-student-life.md` - 14 zones

Read `docs/guides/city-geometry-pipeline.md` before implementation. The invariant is: **geometry, score evidence, and label must use the same granularity**.

## Current App Context

Stack:

- Next.js 15 App Router
- React 19
- Bun only
- MapLibre GL JS + deck.gl `GeoJsonLayer`
- GeoJSON under `public/data/`
- Scores under `src/data/*Places.ts`

Key files:

- `src/data/cities.ts`
- `src/data/*Places.ts`
- `src/components/ParisStudentMap.tsx`
- `scripts/build_new_city_geojson.py`
- `scripts/build_full_coverage_specs.py`
- `scripts/validate_city_geojson.py`
- `scripts/build_city_outlines.ts`
- `scripts/granularity_geometry.json`
- `scripts/granularity_intended.json`
- `public/data/*.geojson`

Commands must use Bun:

```bash
~/.bun/bin/bun run lint
~/.bun/bin/bun run build
~/.bun/bin/bun run geo:build -- <city>
~/.bun/bin/bun run geo:validate -- <city>
~/.bun/bin/bun run geo:outlines -- <city>
```

Do not use `npm`, `npx`, `yarn`, or `pnpm`.

## Product Target

Each new city should behave like the repaired Lille direction:

- readable district map, not shredded source data;
- full coverage inside explicit chosen scope;
- no internal white holes inside that scope;
- no overlapping zones;
- one user-facing `PlaceScore.code` per GeoJSON feature;
- selected outline should be one understandable district shape;
- no `allowMultipart` for `primary`, `campus`, or `risk_cap` zones;
- no `allowMultipart` for `context` / `low_relevance` unless the feature is a documented peripheral source island and has `multipartJustification`;
- context/low-relevance areas must be honestly labelled and conservatively scored.

White outside the declared scope is acceptable. White holes inside the declared scope are failures.

If official district polygons are not available and the city uses IRIS as the source, the implementation must create a **full IRIS partition** for the declared scope. Every source IRIS inside that scope must be assigned to exactly one user-facing zone.

## Source Priority

Use the broadest official source that gives truthful readable zones:

1. Official quartier, sector, arrondissement, or planning-district polygons.
2. Commune boundary for adjacent campus/commute edges.
3. IRIS full partition only when official district polygons are missing or when a parent district must be cleanly split.
4. IRIS fallback only as backend source units grouped into major districts.

Never hand-draw polygons. Never split by lat/lon rectangles. Never expose one IRIS polygon per user-facing zone unless the zone is truly a single recognized district.

Do not mix an official parent quartier polygon with partial IRIS children for the same parent. Valid patterns are: all children are official subdistrict polygons; all children are IRIS groups covering the parent exactly once; or the parent remains unsplit as one official polygon. Invalid pattern: selected IRIS children plus a whole official parent polygon for leftovers.

## Data Model Work

Update `src/data/cities.ts`:

1. Extend `CityId` with:
   - `strasbourg`
   - `montpellier`
   - `rennes`
   - `toulon`
   - `grenoble`
2. Import new place arrays:
   - `strasbourgPlaces`
   - `montpellierPlaces`
   - `rennesPlaces`
   - `toulonPlaces`
   - `grenoblePlaces`
3. Add each city to `cities`.
4. Add each place array to any existing `placesByCity` / `allPlaces` / lookup exports in the file.
5. Use `outlineGeojsonUrl` for each new city. Precomputed outlines avoid client-side Turf dissolve freezes.

Create:

- `src/data/strasbourgPlaces.ts`
- `src/data/montpellierPlaces.ts`
- `src/data/rennesPlaces.ts`
- `src/data/toulonPlaces.ts`
- `src/data/grenoblePlaces.ts`

Each `PlaceScore` should include:

- `id`
- `cityId`
- `name`
- `code`
- `kind: "quartier"` or `kind: "commune"` for commute/campus edges
- `area`
- `granularity: "micro"` only if existing UI requires it; conceptually these are district zones
- `parentName`
- `confidence`
- `coverageRole`
- `geometryBasis`
- `evidenceNote`
- `scores`
- `rentLevel`
- `studentFit`
- `summary`
- `caveat`

Do not change scoring weights or `securityCap`.

## City Config Defaults

Use these starting `CityConfig` values:

| City | Center | Zoom | Default selected |
|------|--------|------|------------------|
| Strasbourg | `[7.752, 48.573]` | `12` | `strasbourg-bourse-esplanade-krutenau` |
| Montpellier | `[3.877, 43.611]` | `12` | `montpellier-beaux-arts-boutonnet` |
| Rennes | `[-1.677, 48.117]` | `12` | `rennes-thabor-saint-helier-alphonse-guerin` |
| Toulon | `[5.930, 43.124]` | `11.8` | `toulon-la-garde-campus` |
| Grenoble | `[5.724, 45.188]` | `12` | `grenoble-gieres-campus` |

Use `minZoom: 10.5`, `maxZoom: 15` unless browser review proves a city needs adjustment.

## Zone Slugs

Use stable ASCII slugs. These must match `PlaceScore.code`, geometry spec `code`, GeoJSON `properties.code`, and default selected codes.

### Strasbourg - 16 Zones

Coverage scope:

- Strasbourg commune.
- Illkirch campus edge if geometry source supports it cleanly.

Zones:

- `strasbourg-bourse-esplanade-krutenau` - Bourse / Esplanade / Krutenau
- `strasbourg-centre-ville-petite-france` - Centre-ville / Petite France
- `strasbourg-gare-tribunal` - Gare / Tribunal
- `strasbourg-orangerie-conseil-xv` - Orangerie / Conseil des XV
- `strasbourg-robertsau-wacken` - Robertsau / Wacken
- `strasbourg-cronenbourg-campus` - Cronenbourg campus
- `strasbourg-hautepierre-poteries` - Hautepierre / Poteries
- `strasbourg-koenigshoffen` - Koenigshoffen
- `strasbourg-montagne-verte` - Montagne Verte
- `strasbourg-elsau` - Elsau
- `strasbourg-meinau` - Meinau
- `strasbourg-neudorf-musau` - Neudorf / Musau
- `strasbourg-port-du-rhin` - Port du Rhin
- `strasbourg-neuhof-1` - Neuhof 1
- `strasbourg-neuhof-2-stockfeld-ganzau` - Neuhof 2 / Stockfeld / Ganzau
- `strasbourg-illkirch-campus` - Illkirch campus

Geometry notes:

- Use official functional quartiers where available.
- If only IRIS is available, group IRIS into these 16 zones and validate contiguity.
- Keep Neuhof split into two cap zones.
- Do not split Esplanade and Krutenau again unless there is a clean official source and strong evidence.

### Montpellier - 14 Zones

Coverage scope:

- Montpellier commune.

Zones:

- `montpellier-ecusson-core` - Ecusson core
- `montpellier-comedie-gare` - Comedie / Gare
- `montpellier-beaux-arts-boutonnet` - Beaux-Arts / Boutonnet
- `montpellier-arceaux-gambetta-figuerolles` - Arceaux / Gambetta / Figuerolles
- `montpellier-antigone` - Antigone
- `montpellier-richter-jacques-coeur` - Richter / Jacques-Coeur
- `montpellier-port-marianne-millenaire-odysseum` - Port Marianne / Millenaire / Odysseum
- `montpellier-hopitaux-facultes-triolet` - Hopitaux-Facultes / Triolet
- `montpellier-paul-valery-route-de-mende` - Paul-Valery / Route de Mende
- `montpellier-aiguelongue-malbosc` - Aiguelongue / Malbosc
- `montpellier-croix-argent-ovalie` - Croix d'Argent / Ovalie
- `montpellier-cevennes-celleneuve` - Les Cevennes / Celleneuve
- `montpellier-mosson-paillade` - Mosson / Paillade
- `montpellier-pres-arenes-gare-sud` - Pres d'Arenes / Gare Sud

Geometry notes:

- Use official Montpellier quartiers as parents.
- Split only the centre, north-campus, and east-side belts listed above.
- Keep Mosson / Paillade as a visible cap zone.
- Avoid many tiny west/north-west IRIS zones.

### Rennes - 12 Zones

Coverage scope:

- Rennes commune.

Zones:

- `rennes-centre` - Centre
- `rennes-thabor-saint-helier-alphonse-guerin` - Thabor / Saint-Helier / Alphonse Guerin
- `rennes-bourg-levesque-la-touche-moulin-du-comte` - Bourg-l'Evesque / La Touche / Moulin du Comte
- `rennes-nord-saint-martin` - Nord / Saint-Martin
- `rennes-maurepas-patton` - Maurepas / Patton
- `rennes-jeanne-darc-longs-champs-beaulieu` - Jeanne d'Arc / Longs-Champs / Beaulieu
- `rennes-la-pommeraie` - La Pommeraie
- `rennes-sud-gare` - Sud-Gare
- `rennes-cleunay-arsenal-redon` - Cleunay / Arsenal-Redon
- `rennes-villejean-beauregard` - Villejean / Beauregard
- `rennes-le-blosne` - Le Blosne
- `rennes-brequigny` - Brequigny

Geometry notes:

- Rennes should mostly follow its 12 official administrative quartiers.
- Do not split into 20 IRIS micro-areas.
- Keep Villejean / Beauregard and Beaulieu separated because they are different student poles.
- Keep Le Blosne and Maurepas / Patton capped.

### Toulon - 12 Zones

Coverage scope:

- Toulon commune.
- La Garde campus as required campus edge.
- La Valette / Avenue 83 / La Seyne edge only if it can be represented without wide random blobs.

Zones:

- `toulon-haute-ville-liberte` - Haute Ville / Liberte
- `toulon-basse-ville-port` - Basse Ville / Port
- `toulon-la-rode-mayol` - La Rode / Mayol
- `toulon-mourillon-core` - Mourillon core
- `toulon-la-mitre-fort-saint-louis` - La Mitre / Fort Saint-Louis
- `toulon-saint-jean-du-var-font-pre` - Saint-Jean-du-Var / Font-Pre
- `toulon-sainte-musse-brunet` - Sainte-Musse / Brunet
- `toulon-pont-du-las-bon-rencontre` - Pont-du-Las / Bon Rencontre
- `toulon-nord-ouest-routes-valbertrand` - Nord-Ouest / Routes / Valbertrand
- `toulon-beaucaire-pont-neuf-lagoubran` - Beaucaire / Pont-Neuf / Lagoubran
- `toulon-la-garde-campus` - La Garde campus
- `toulon-la-valette-avenue-83-la-seyne-edge` - La Valette / Avenue 83 / La Seyne edge

Geometry notes:

- Toulon is a practical commute map, not a dense student micro-map.
- Use broad quartiers and commute nodes.
- If La Seyne makes the scope too wide or fragmented, keep it out of v1 and document the deferral.
- Do not make one "La Seyne edge" feature from disconnected pieces.

### Grenoble - 14 Zones

Coverage scope:

- Grenoble commune.
- Saint-Martin-d'Heres campus edge.
- Gieres campus edge.
- Add La Tronche / Meylan / west-suburb edges only in later pass unless clean official sources are already available.

Zones:

- `grenoble-hyper-centre` - Hyper-centre
- `grenoble-notre-dame-mutualite` - Notre-Dame / Mutualite
- `grenoble-championnet-aigle` - Championnet / Aigle
- `grenoble-europole-presquile` - Europole / Presqu'ile
- `grenoble-chorier-berriat-saint-bruno` - Chorier-Berriat / Saint-Bruno
- `grenoble-saint-laurent-ile-verte` - Saint-Laurent / Ile Verte
- `grenoble-mistral-eaux-claires` - Mistral / Eaux-Claires
- `grenoble-capuche-allies-alpins` - Capuche / Allies-Alpins
- `grenoble-beauvert-cite-abbaye` - Beauvert / Cite de l'Abbaye
- `grenoble-jouhaux-exposition-bajatiere` - Jouhaux / Exposition-Bajatiere
- `grenoble-teisseire-malherbe` - Teisseire / Malherbe
- `grenoble-arlequin-village-olympique-vigny-musset` - Arlequin / Village Olympique / Vigny Musset
- `grenoble-saint-martin-dheres-campus-core` - Saint-Martin-d'Heres campus core
- `grenoble-gieres-campus` - Gieres campus

Geometry notes:

- Follow Grenoble sector/neighbourhood logic first.
- Keep Europole / Presqu'ile and Chorier-Berriat / Saint-Bruno separate.
- Keep Mistral / Eaux-Claires, Teisseire / Malherbe, and Arlequin / Village Olympique / Vigny Musset visibly capped.
- Do not turn Saint-Martin-d'Heres or Gieres into many small IRIS shards.

## Geometry Implementation

Preferred flow:

1. Add city entries to `scripts/granularity_intended.json`.
2. Use a district-first spec builder to produce `scripts/granularity_geometry.json`.
3. Run `scripts/build_new_city_geojson.py <city>`.
4. Run `scripts/build_city_outlines.ts <city>` or `~/.bun/bin/bun run geo:outlines -- <city>`.
5. Run validation.

Generated outputs:

- `public/data/strasbourg.geojson`
- `public/data/strasbourg-outlines.geojson`
- `public/data/montpellier.geojson`
- `public/data/montpellier-outlines.geojson`
- `public/data/rennes.geojson`
- `public/data/rennes-outlines.geojson`
- `public/data/toulon.geojson`
- `public/data/toulon-outlines.geojson`
- `public/data/grenoble.geojson`
- `public/data/grenoble-outlines.geojson`

Required builder behavior:

- Fail on missing source district/IRIS names.
- Fail on score row without geometry.
- Fail on geometry without score row.
- Fail on duplicate `code`.
- Fail on duplicate source polygon assignment.
- Fail on invalid lon/lat coordinates.
- Fail on disconnected primary/campus/risk zones even if `allowMultipart` is present.
- Fail on `allowMultipart` for primary/campus/risk zones.
- Fail when an IRIS-backed scope has unassigned source IRIS.
- Fail when one official parent is partly represented by IRIS child zones and partly by an official parent polygon.
- Warn when a city exceeds 25 zones.
- Warn when more than 5 zones share the exact same score tuple.
- Warn when a campus zone covers most of a commune.

Do not silently skip missing seeds. That caused random Lille shapes.

Do not treat contiguity alone as success. A zone can be technically contiguous and still semantically wrong if it crosses unrelated districts or absorbs leftover source units from a different parent.

## PlaceScore Generation

It is acceptable to write new `src/data/<city>Places.ts` manually if faster. Keep the reports as source of truth.

Recommended values:

- `confidence: "high"` for official district/quartier geometry.
- `confidence: "medium"` for IRIS-grouped district approximations.
- `confidence: "low"` only for broad context/commute fallback.
- `coverageRole: "primary"` for normal districts.
- `coverageRole: "campus"` for compact campus nodes.
- `coverageRole: "risk_cap"` for areas capped mostly by safety/reputation.
- `coverageRole: "context"` or `"low_relevance"` for broad coverage fillers.
- `geometryBasis: "official_quartier"`, `"official_quartier_group"`, `"iris_fallback_major_zone"`, `"commune"`, or `"commune_context"` as appropriate.

Summary and caveat should be specific, not generated filler. Examples:

- `Strong campus-adjacent district with structural university access and good transit.`
- `Useful full-coverage district, but not a primary student pick.`
- `Safety cap dominates; cheaper rent does not fully compensate.`

Do not overfit decimals. If the report has a score row, use it.

## UI Integration

Expected existing behavior:

- City dropdown is rendered from `cities`.
- Right-panel city tabs are removed.
- Sidebar title wraps.
- Detail panel reads from selected `PlaceScore`.

Implementation checks:

- New cities appear in dropdown.
- Selecting each city recenters map and resets selected feature to `defaultSelectedCode`.
- Title does not overflow:
  - `Lille + Roubaix-Tourcoing student quality map`
  - `Saint-Martin-d'Heres campus core`
  - `Port Marianne / Millenaire / Odysseum`
- Ranking/filter controls use `areaOptions` / `parentFilterOptions` correctly.

## Performance Requirement

Do not reintroduce client-side geometry dissolve for these cities.

Each city should have `outlineGeojsonUrl`. The browser should load precomputed outlines. The Marseille investigation showed client-side Turf dissolve can freeze for seconds on large MultiPolygons.

Acceptance:

- No large `@turf/union` work runs in React render/effects for city load.
- Switching city should feel immediate after network fetch.
- `public/data/*-outlines.geojson` exists for every new city.

## Validation Commands

Run per city:

```bash
~/.bun/bin/bun run geo:build -- strasbourg
~/.bun/bin/bun run geo:validate -- strasbourg
~/.bun/bin/bun run geo:outlines -- strasbourg
```

Repeat for:

```bash
montpellier
rennes
toulon
grenoble
```

Then run app validation:

```bash
~/.bun/bin/bun run lint
~/.bun/bin/bun run build
```

If GeoJSON generation requires network fetches and sandbox blocks it, request approval. Do not hand-edit generated GeoJSON.

## Browser Acceptance Checklist

For each city:

- City appears in dropdown.
- Map loads without console errors.
- No `invalid latitude`.
- No blank map.
- No large white holes inside declared coverage scope.
- No selected outline jumping across random disconnected pieces.
- No primary/campus/risk selected outline has detached pieces.
- No campus zone covers most of a commune unless the label is explicitly commune/context, not campus.
- No zone visibly contains another clickable zone.
- Clicked polygon opens matching detail panel.
- Score badge matches app-computed score for the row.
- Overall and Safety tabs still work.
- Legend still reads correctly.
- Long titles and long district names wrap inside containers.

Visual target by city:

- Strasbourg: compact core plus west/south caps; Illkirch visible but not dominant.
- Montpellier: clear centre/north-campus/east-side structure; Mosson / Paillade capped.
- Rennes: clean 12-zone official-district feel; Villejean and Beaulieu separate.
- Toulon: broad readable commute map; La Garde clear; no random La Seyne fragments.
- Grenoble: dense centre-to-campus structure; south cap zones visible and readable.

## Suggested Implementation Order

1. Add data types/imports/config entries in `src/data/cities.ts`.
2. Add `PlaceScore[]` files from the five reports.
3. Add district geometry specs for Rennes first.
   - Rennes is the smallest and cleanest official-district test.
4. Build/validate Rennes end to end.
5. Add Montpellier and Strasbourg.
6. Add Grenoble.
7. Add Toulon last because commute edges may need scope adjustment.
8. Generate outlines for all five cities.
9. Run lint/build.
10. Browser-check all five cities.

Do not batch all five before validating one. One broken geometry assumption copied five times is expensive.

## Files Expected To Change

Likely:

- `src/data/cities.ts`
- `src/data/strasbourgPlaces.ts`
- `src/data/montpellierPlaces.ts`
- `src/data/rennesPlaces.ts`
- `src/data/toulonPlaces.ts`
- `src/data/grenoblePlaces.ts`
- `scripts/granularity_intended.json`
- `scripts/granularity_geometry.json`
- `scripts/build_new_city_geojson.py`
- `scripts/validate_city_geojson.py`
- `public/data/strasbourg.geojson`
- `public/data/strasbourg-outlines.geojson`
- `public/data/montpellier.geojson`
- `public/data/montpellier-outlines.geojson`
- `public/data/rennes.geojson`
- `public/data/rennes-outlines.geojson`
- `public/data/toulon.geojson`
- `public/data/toulon-outlines.geojson`
- `public/data/grenoble.geojson`
- `public/data/grenoble-outlines.geojson`

Possibly:

- `scripts/build_city_geometry_specs.py`
- `scripts/build_full_coverage_specs.py`
- `scripts/city_coverage_scopes.json`
- `scripts/generate_district_places.py`

Do not change unrelated city outputs unless the builder refactor requires regeneration and validation.

## Common Failure Modes To Avoid

- Reusing old 20-22 micro-area reports.
- IRIS watershed fill without official district constraints.
- Partial IRIS splits mixed with whole official parent polygons.
- Declaring full coverage while assigning only a subset of source IRIS.
- Missing seeds silently skipped.
- `allowMultipart` used to hide disconnected features.
- `allowMultipart` on primary/campus/risk zones.
- Commune-wide campus labels.
- Many zones with identical fallback scores.
- Random context zones that cross communes.
- Generated GeoJSON with raw internal outlines instead of dissolved user-facing outlines.
- Updating score files without updating reports.
- Updating reports without matching `PlaceScore.code` and GeoJSON `properties.code`.

## Done Definition

Implementation is complete when:

- All five cities are available in dropdown.
- Each city has matching `PlaceScore[]`, GeoJSON, and outline GeoJSON.
- `validate_city_geojson.py` passes for all five.
- `~/.bun/bin/bun run lint` passes.
- `~/.bun/bin/bun run build` passes.
- Browser check passes for all five.
- No new city uses old shredded micro-area geometry.
- No city loads with visible internal holes inside declared scope.

## Unresolved Questions

None.
