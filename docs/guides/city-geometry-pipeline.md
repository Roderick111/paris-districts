# City geometry pipeline

How to add or upgrade city coverage for the student quality map.

Core rule:

> Geometry, score evidence, and label must use the same granularity.

If evidence is district-level, build district-level geometry. Do not turn broad district research into fake IRIS-level precision.

Reference implementations:

- **Paris** - reference for readable major coverage.
- **Bordeaux** - detailed student-zone reference; useful, but not default for every city.
- **Lille revised model** - official quartiers + commune context + IRIS fallback.
- **Shared audits** - `scripts/geometry_audit.py`
- **Generic builder** - `scripts/build_new_city_geojson.py`
- **Validator** - `scripts/validate_city_geojson.py`

## Good City Coverage

- Target **10-25 readable major zones** per city.
- Full coverage inside the chosen scope; white outside scope is fine.
- White holes inside scope are failures.
- One `PlaceScore.code` maps to one user-facing GeoJSON feature.
- Zone labels must be honest about geometry scale.
- Every score must be explainable from evidence at that same scale.
- Browser view must read like a district map, not shredded source data.

Use these roles consistently:

| Role | Meaning |
|------|---------|
| `primary` | Normal student-relevant district |
| `campus` | Campus plus nearby housing/service belt |
| `risk_cap` | Area capped by safety/reputation risk |
| `context` | Full-coverage filler with honest broad score |
| `low_relevance` | Peripheral coverage with weak student relevance |

Never label a whole commune as a campus or micro-area. If geometry is commune-wide, label it as commune/context.

## What Breaks Maps

| Anti-pattern | Symptom | Fix |
|--------------|---------|-----|
| Fake IRIS precision | Tiny/random zones with weak evidence | Use major districts |
| Watershed fill by adjacency only | Semantically random zones | Use explicit district scopes |
| Silent missing seed skip | Bad specs still build | Fail build on missing seed |
| `allowMultipart` abuse | Islands pass audit | Split zone or relabel as context |
| Same-score context flood | Map looks filled but fake | Research broad district reputation |
| Whole commune labeled as campus | Misleading click/panel result | Split campus belt or label commune |
| Raw source outlines | Internal white seams | Dissolve displayed outlines |
| Lat/lon rectangle splits | Thin strips, unnatural cuts | Use official boundaries |
| Duplicate geometry across features | Oversaturated areas, missing neighbors | Fail build |
| IRIS fallback over-splitting | Strips, claws, islands, random shards | Collapse to fewer major zones |

## Source Hierarchy

Pick the broadest official source that gives readable, truthful zones.

1. Official quartier, arrondissement, sector, or planning-district polygons.
2. Commune boundary for adjacent suburbs or broad context.
3. IRIS groups only when they form a contiguous, meaningful district.
4. IRIS watershed only inside a named, explicit scope.
5. Never use hand-drawn polygons or lat/lon rectangle splits.

IRIS is a fallback, not a default. It is useful when official districts are missing, but it can create fake precision fast.

### IRIS Readability Ceiling

Use IRIS as backend tiles, not front-end districts.

- Start coarse: **2-4 zones per commune** when IRIS is the only source.
- Increase granularity only when shapes stay readable and evidence is strong.
- If selected outline looks like strips, claws, islands, or random shards, collapse zones.
- Contiguity passing is not enough; visual legibility is required.
- Broad reputation evidence means broad zone.
- Never split a commune just because IRIS polygons exist.

IRIS WFS template:

```text
https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature
  &TYPENAME=STATISTICALUNITS.IRIS:contours_iris
  &CQL_FILTER=code_insee='{INSEE}'
  &outputFormat=application/json&srsName=EPSG:4326
```

Cache responses under `scripts/cache/iris_{INSEE}.geojson`.

Lille WFS layers must include `srsName=EPSG:4326`; otherwise deck.gl can crash with projected-meter coordinates.

## Visual Geometry

Source geometry and display geometry are not always same thing.

- Source geometry may contain IRIS/quartier pieces.
- User-facing feature must read as one zone.
- Fill layer can use merged feature geometry.
- Outline layer must draw dissolved user-facing boundaries.
- Selection outline must not show internal source seams.

UI invariant:

> User sees zone boundaries, not data-source boundaries.

Implementation:

- Use `dissolveGeometry()` for selection outlines.
- Use dissolved geometry for base outline layer too.
- Do not draw raw `MultiPolygon` rings as user-facing outlines.

## Per-City Workflow

```text
Coverage brief
        -> exact scope + source availability + proposed zones
Research report
        -> evidence at zone granularity
Geometry specs
        -> one user-facing feature per code
PlaceScore[]
        -> scores + evidenceNote + confidence
Build GeoJSON
        -> audits run at build time
Validate GeoJSON
        -> code parity + geometry quality + contiguity
Browser check
        -> visual acceptance, no console/map artifacts
```

### 1. Define Coverage Scope

Before scoring or geometry:

- List exact communes/arrondissements included.
- Decide whether nearby suburbs are included.
- Decide which areas are context, campus, or risk-cap.
- Document why scope ends where it ends.

Full coverage means every official source polygon inside this scope is assigned exactly once.

### 2. Choose Major Zones

Pick **10-25 zones**:

- Use real district names people recognize.
- Prefer official quartiers/arrondissements.
- Use commune-level rows for adjacent suburbs when district-level evidence is weak.
- Use context rows for coverage continuity.
- Split a zone only when evidence and geography both support it.

Bad:

- `Villeneuve-d'Ascq campus` covering nearly all Villeneuve-d'Ascq.
- 80 IRIS rows with broad district-level evidence.
- Disconnected islands under one primary zone.
- 7 Roubaix or Tourcoing IRIS fallback zones when 3 readable zones would tell the truth better.

Good:

- `Cite Scientifique / Triolo`
- `Pont-de-Bois / Hotel-de-Ville`
- `La Madeleine`
- `Roubaix Centre`

### 3. Research At Matching Granularity

Research must support each zone's scale:

- safety/reputation
- rent pressure
- transport
- campus access
- student energy
- services
- green/calm

Broad evidence gets broad confidence. Do not overfit decimals. If several context zones share the exact same score tuple, treat that as placeholder failure unless there is real reason.

### 4. Write Geometry Specs

Shared files:

- `scripts/granularity_intended.json` - research-aligned source of truth.
- `scripts/granularity_geometry.json` - builder output consumed by `build_new_city_geojson.py`.
- `scripts/city_coverage_scopes.json` - full-coverage scope and context seed definitions.

Common spec shapes:

```json
{
  "code": "lille-vieux-lille",
  "lille_quartier": ["Vieux-Lille"],
  "geometryBasis": "official_quartier",
  "coverageRole": "primary"
}
```

```json
{
  "code": "lille-roubaix-centre",
  "iris_insee": "59512",
  "iris_names": ["Justice", "Edouard Vaillant", "Grand-Place"],
  "geometryBasis": "iris_partition",
  "coverageRole": "primary"
}
```

Optional keys include `fill_scope_iris_names`, `marseille_quartiers`, `nice_quartier`, `lille_quartier`, `vda_quartier`, `hellemmes_quartier`, and `allowMultipart`.

`allowMultipart` is rare. Do not use it to hide broken geography. Split primary zones instead.

### 5. Build GeoJSON

```bash
python3 scripts/build_new_city_geojson.py <city>
```

For full-coverage partition builders:

```bash
python3 scripts/build_full_coverage_specs.py <city>
python3 scripts/append_context_places.py <city>
python3 scripts/build_new_city_geojson.py <city>
```

Build-time audits must reject:

- missing source polygon or missing seed
- duplicate feature code
- score row without geometry
- geometry without score row
- invalid lon/lat coordinate
- disconnected primary/campus/risk_cap zone
- full-coverage scope hole
- duplicate geometry hash

Build-time audits should warn on:

- more than 25 zones for one city
- more than 40% context zones
- more than 5 zones sharing exact same score tuple
- one campus zone covering most of a commune
- merged `MultiPolygon` with many parts
- IRIS fallback commune with more than 4 front-end zones and no strong evidence

### 6. Validate

```bash
python3 scripts/validate_city_geojson.py <city>
~/.bun/bin/bun run build
```

Validation must include contiguity and code parity. Passing feature count alone is not enough.

### 7. Browser Acceptance

Check each city in browser:

- City loads with no console errors.
- No `invalid latitude`.
- Click best, middle, and worst zones.
- Panel code/name matches clicked polygon.
- Selection outline does not jump to unrelated islands.
- Internal white seams are not visible inside one user-facing district.
- Full scope has no holes.
- Map reads clearly at normal zoom.

Screenshot review is mandatory. Scripts passed but screenshot failed is still failed.

## Scaling City Batches

Batch size: **3-5 cities max**.

Do not add next batch until current batch passes visual review.

For each city, create a short coverage brief before implementation:

- scope communes/arrondissements
- available official polygon sources
- proposed 10-25 zones
- weak-data context areas
- likely risk caps
- campus belts

Batch acceptance:

- all cities build
- all cities validate
- screenshot per city reviewed
- no shredded IRIS look
- no broad zone mislabeled as micro/campus
- no same-score filler wall
- no disconnected primary zones

## City Status

| City | Model | Status |
|------|-------|--------|
| Paris | Districts + western suburbs | Reference for readable major coverage |
| Bordeaux | Detailed student zones | Good detailed case, not default for every city |
| Lille | Official quartiers + commune context + IRIS fallback | Revised model; use as metro-area pattern |
| Lyon | Legacy mixed model | Avoid lat/lon splits; needs review before expansion |
| Nantes | IRIS full partition | Needs major-zone cleanup before scaling |
| Toulouse | IRIS full partition | Needs major-zone cleanup before scaling |
| Nice | IRIS full partition | Needs major-zone cleanup before scaling |
| Marseille | Quartier partition | Needs coverage/readability review |
| Next batches | TBD | Blocked until coverage brief exists |

## Merge Checklist

- [ ] Coverage scope documented.
- [ ] 10-25 readable zones unless city has justified exception.
- [ ] Every zone label matches geometry scale.
- [ ] Every score has evidence at matching granularity.
- [ ] No disconnected primary/campus/risk_cap zone.
- [ ] Context rows are honest and not all same-score placeholders.
- [ ] `python3 scripts/build_new_city_geojson.py <city>` passes.
- [ ] `python3 scripts/validate_city_geojson.py <city>` passes.
- [ ] `~/.bun/bin/bun run build` passes.
- [ ] Browser screenshot reviewed.
- [ ] No visible internal source seams in user-facing outlines.

## Unresolved questions

None for this guide. Per-city briefs must still decide exact scope and official source availability before implementation.
