# AGENTS.md

## Project values

- **Flexible & reliable** — geometry and scoring must not fail silently; build audits reject bad GeoJSON
- **Elegant & logical** — YAGNI; scoring logic must be explainable (weights, security cap, evidence notes)
- **Performance** — geospatial work in Python batch scripts; map serves precomputed GeoJSON, not live fetches per pan

## Stack

| Layer | Tech |
|-------|------|
| App | Next.js 15 (App Router), React 19 |
| Package manager | **Bun only** — never npm/yarn/pnpm |
| Map | MapLibre GL JS + deck.gl GeoJsonLayer |
| Geo processing | Python 3 (stdlib + `scripts/geometry_audit.py`) |
| Data | `PlaceScore[]` in `src/data/`, GeoJSON in `public/data/` |

## Run & validate

```bash
~/.bun/bin/bun install
~/.bun/bin/bun run dev          # http://localhost:3000

~/.bun/bin/bun run lint
~/.bun/bin/bun run build
```

GeoJSON (city data changes):

```bash
python3 scripts/city_compiler/cli.py build <city>
python3 scripts/city_compiler/cli.py validate <city>
```

Or: `~/.bun/bin/bun run geo:build -- <city>` / `geo:validate -- <city>`

Per-city configs live in `scripts/city_configs/<city>.json`. Full CI-like check: `~/.bun/bin/bun run geo:validate:all`

## Adding or upgrading a city

**Read first:** [docs/guides/city-geometry-pipeline.md](docs/guides/city-geometry-pipeline.md)

Short version:

1. Research report → `docs/research/<city>-student-life.md`
2. Contiguous geometry specs → `scripts/granularity_geometry.json` (or `scripts/build_<city>_geometry_specs.py`)
3. Scores → `src/data/<city>Places.ts` + register in `src/data/cities.ts`
4. Build + validate GeoJSON (contiguity audits are mandatory)
5. Build outlines when merged/multipart zones exist: `~/.bun/bin/bun run geo:outlines -- <city>`
6. `bun run build` + browser/screenshot check

**Never:** hand-drawn polygons, lat/lon rectangle splits, merge without adjacency check.

Reference builders: `scripts/build_bordeaux_micro_geojson.py`, `scripts/build_nantes_geometry_specs.py`, `scripts/geometry_audit.py`.

## Geometry gotchas

- Final user-facing geometry should use official quartiers/arrondissements/sectors where available. IRIS is fallback or split source, not default display geometry.
- If IRIS is the only source, start with 2-4 broad zones per commune. Collapse zones if selection outlines show strips, claws, islands, or random fragments.
- Validation passing is not enough. Screenshot review can fail a city when contiguity passes but the map looks fake or unreadable.
- `allowMultipart` is rare; do not use it to hide broken geography. Split primary/campus/risk zones instead.
- Same-score context floods mean weak modeling/data. Research broader district reputation or collapse zones.
- Fix existing city geometry before adding new batches. Batch 3-5 cities max.
- Dirty tree is normal here. Inspect before editing; never revert unrelated generated/data changes from other agents.

## Key paths

```
src/data/cities.ts              # CityConfig, weights, security cap
src/data/*Places.ts             # PlaceScore[] per city
src/components/DistrictQualityMap.tsx
src/lib/geometryOutline.ts      # selection border / dissolveGeometry
public/data/*.geojson           # map polygons (properties.code = PlaceScore.code)
scripts/city_compiler/
scripts/city_configs/
scripts/granularity_geometry.json
scripts/build_new_city_geojson.py
scripts/validate_city_geojson.py
scripts/geometry_audit.py
scripts/legacy/
docs/research/*-student-life.md
docs/guides/city-geometry-pipeline.md
```

## Git

- Ask before pushing
- Commits: `<type>(<scope>): <subject>`

## Plans

Implementation handoffs live in `docs/plans/`. At end of each plan: list unresolved questions for the user.

## Critical rules

1. Verify file paths before use
2. New city geometry must pass `validate_city_geojson.py` **including contiguity**
3. `bun add` for deps — no hand-editing lockfiles
4. `~/.bun/bin/bun run build` before commit on data/UI changes
5. Do not change score weights or security cap without user ask
