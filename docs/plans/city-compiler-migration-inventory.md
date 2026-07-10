# City Compiler Migration Inventory

Phase 1 inventory of current geometry builders, sources, zone counts, coverage, special cases, and migration risk.

## Summary

| City | Zones | Builder | Source type | Full coverage | Risk |
|------|------:|---------|-------------|---------------|------|
| paris | 48 | Manual / `districts.geojson` | arrondissement + commune (geo.api.gouv.fr) | No (curated subset) | High — no Python builder; INSEE-based config needed |
| bordeaux | 35 map | `build_bordeaux_micro_geojson.py` | IRIS + official quartiers (Bordeaux Metropole) | Partial (campus communes) | Medium — inline MICRO_SPECS; macro places excluded from map |
| lyon | 37 map | `build_lyon_micro_geojson.py` | Official quartiers + metro scope + Écully commune | Partial | Medium — split polygons, Villeurbanne metro scope |
| toulouse | 22 | `build_new_city_geojson.py` | Official quartiers + IRIS fallback | Yes (`full_partition`) | Low |
| lille | 27 | `build_new_city_geojson.py` | Lille WFS quartiers + VDA WFS + IRIS (metro communes) | Partial (`major_district`) | Medium — mixed sources, east IRIS clusters |
| marseille | 36 | `build_new_city_geojson.py` + `marseille_quartier_groups.json` | Official quartiers (AMP Metropole) | Yes (`full_partition`) | Low — groups file is canonical |
| nice | 30 | `build_new_city_geojson.py` | Official quartiers + IRIS partition | Yes (`full_partition`) | Medium — IRIS + official mix |
| nantes | 16 | `build_new_city_geojson.py` | Official quartiers + IRIS | Yes (`full_partition`) | Low |
| strasbourg | 16 | `build_batch_cities.py` | Functional quartiers + extra dataset + commune | No | Medium — extra source URL per zone |
| montpellier | 14 | `build_batch_cities.py` | IRIS watershed partition (34172) | Yes (IRIS partition) | Medium — seed-based watershed |
| rennes | 12 | `build_batch_cities.py` | 27 sub-perimeters → 12 zones (touch partition) | No | High — dynamic partition algorithm |
| toulon | 14 | `build_batch_cities.py` | IRIS watershed + commune (La Garde) | Yes (IRIS partition) | Medium |
| grenoble | 14 | `build_batch_cities.py` | Unions de quartier CSV + communes | No | Medium — CSV geo_shape parsing |

## Per-city detail

### paris
- **Builder path:** No script; `public/data/districts.geojson` served directly.
- **Places:** Inline in `src/data/cities.ts` (48 arrondissements + inner/outer communes).
- **Source type:** geo.api.gouv.fr commune contours (arrondissement INSEE 75101–75120).
- **Full coverage:** No — curated student-relevant subset, not full Île-de-France partition.
- **Special cases:** Scores live in `cities.ts`, not `*Places.ts`; macro N/A.
- **Migration risk:** High — needs new config from PlaceScore codes → INSEE mapping.

### bordeaux
- **Builder path:** `scripts/build_bordeaux_micro_geojson.py`
- **Places:** `src/data/bordeauxPlaces.ts` (49 total, 35 on map — macro excluded).
- **Source type:** Bordeaux Metropole `se_quart_s` + `se_iri24_s` + geo.api communes (Talence, Pessac, Gradignan).
- **Full coverage:** Partial — campus suburbs as communes, Bordeaux IRIS/quartier micro zones.
- **Special cases:** `MAP_EXCLUDED_SCORE_CODES`; macro/micro dual granularity.
- **Migration risk:** Medium — MICRO_SPECS extraction to JSON zones.

### lyon
- **Builder path:** `scripts/build_lyon_micro_geojson.py`
- **Places:** `src/data/lyonPlaces.ts` (48 total, 37 on map).
- **Source type:** Lyon official quartiers OGC API + Grand Lyon metro quartiers + Écully commune.
- **Full coverage:** Partial — Villeurbanne metro scope whitelist, polygon splits (`lyon_split`).
- **Special cases:** Latitude splits for Confluence/Perrache; macro places excluded from map.
- **Migration risk:** Medium — split geometry needs compiler support or pre-merged local units.

### toulouse
- **Builder path:** `scripts/build_new_city_geojson.py` ← `granularity_geometry.json`
- **Source type:** Toulouse Metropole official quartiers; IRIS fallback where needed.
- **Full coverage:** Yes (`city_coverage_scopes.json`: `full_partition`).
- **Special cases:** Two exempt merged official quartiers; obsolete code guards in validator.
- **Migration risk:** Low.

### lille
- **Builder path:** `scripts/build_new_city_geojson.py` ← `granularity_geometry.json`
- **Source type:** Lille WFS quartiers + VDA WFS quartiers + IRIS (Croix, Roubaix, Tourcoing, Lambersart, etc.).
- **Full coverage:** Partial (`major_district`, 8 INSEE communes in scope).
- **Special cases:** Mixed official + IRIS; east-zone obsolete codes; Lille-specific geometry audits; `hellemmes_quartier` alias.
- **Migration risk:** Medium — reference city #1 for compiler.

### marseille
- **Builder path:** `build_new_city_geojson.py` prefers `marseille_quartier_groups.json` over `granularity_geometry.json`
- **Source type:** AMP Metropole official quartiers (110 polygons → 36 groups).
- **Full coverage:** Yes — all official quartiers assigned.
- **Special cases:** Cross-arrondissement areas (6e/7e, 8e/9e); `allowMultipart` on context zones; obsolete code list.
- **Migration risk:** Low — reference city #2.

### nice
- **Builder path:** `build_new_city_geojson.py`
- **Source type:** Nice ArcGIS quartiers + IRIS partition for gaps.
- **Full coverage:** Yes with context zones from `city_coverage_scopes.json`.
- **Special cases:** IRIS + official mix; context zone seeds; score tuple duplicate guard.
- **Migration risk:** Medium.

### nantes
- **Builder path:** `build_new_city_geojson.py`
- **Source type:** Nantes Metropole official quartiers + IRIS.
- **Full coverage:** Yes.
- **Special cases:** `NANTES_SPLIT_PARENT_EXEMPT` for parent quartiers split across zones.
- **Migration risk:** Low.

### strasbourg
- **Builder path:** `build_batch_cities.py` ← `batch_city_groups.json`
- **Source type:** Strasbourg 23 quartiers + 15-quartiers extra dataset + Illkirch commune.
- **Full coverage:** No — functional quartiers, not full commune IRIS.
- **Special cases:** Per-zone `extraSourceUrl` for Neuhof2.
- **Migration risk:** Medium.

### montpellier
- **Builder path:** `build_batch_cities.py`
- **Source type:** IRIS watershed partition with `MONTPELLIER_ZONE_SEEDS`.
- **Full coverage:** Yes (IRIS partition of 34172).
- **Special cases:** Seed names are IRIS labels, not official quartiers.
- **Migration risk:** Medium — watershed computed at build time; store resolved partition in config.

### rennes
- **Builder path:** `build_batch_cities.py`
- **Source type:** 27 official sub-perimeters assigned to 12 zones via touch-based partition.
- **Full coverage:** No.
- **Special cases:** `resolve_rennes_partition` algorithm; parent zone mapping.
- **Migration risk:** High — must snapshot resolved `rennes_quartier` lists in config.

### toulon
- **Builder path:** `build_batch_cities.py`
- **Source type:** IRIS watershed (83137) + La Garde commune.
- **Full coverage:** Yes (IRIS partition).
- **Special cases:** `TOULON_ZONE_SEEDS` hardcoded.
- **Migration risk:** Medium.

### grenoble
- **Builder path:** `build_batch_cities.py`
- **Source type:** Grenoble unions de quartier CSV + Saint-Martin-d'Hères / Gières communes.
- **Full coverage:** No.
- **Special cases:** CSV `geo_shape` column parsing.
- **Migration risk:** Medium — needs `grenoble_quartiers` adapter (CSV).

## Shared infrastructure

| File | Role |
|------|------|
| `scripts/granularity_geometry.json` | Zone specs for 10 cities (legacy format) |
| `scripts/marseille_quartier_groups.json` | Canonical Marseille zone groups |
| `scripts/batch_city_groups.json` | Batch city group definitions + seeds |
| `scripts/city_coverage_scopes.json` | Full-coverage mode + context zone seeds (lille, nice, toulouse, marseille, nantes) |
| `scripts/geometry_audit.py` | Contiguity, sliver, hash, quality audits |
| `scripts/validate_city_geojson.py` | PlaceScore parity + city-specific guards |

## Legacy one-off scripts (Phase 7 candidates)

- `build_city_geometry_specs.py`
- `build_lille_major_geometry_specs.py`
- `build_nantes_geometry_specs.py`
- `build_full_coverage_specs.py`
- `build_batch_cities.py`
- `generate_*places.py`
- `parse_granularity_reports.py`

## Keep (mark legacy until compiler owns)

- `build_bordeaux_micro_geojson.py`
- `build_lyon_micro_geojson.py`
- `build_new_city_geojson.py` (until all cities migrated)
- `geometry_audit.py` (shared lib — compiler imports)

## Unresolved questions

1. Config format: **JSON** (confirmed).
2. PlaceScore generation: keep TS human-written; compiler reads codes/names only. Recommend keeping scoring in TS indefinitely — scores need evidence notes and research context poorly suited to JSON.
3. Legacy scripts: **move to `scripts/legacy/`** for one release after full migration.