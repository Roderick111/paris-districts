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
python3 scripts/build_new_city_geojson.py <city>
python3 scripts/validate_city_geojson.py <city>
```

Or: `~/.bun/bin/bun run geo:build -- <city>` / `geo:validate -- <city>`

## Adding or upgrading a city

**Read first:** [docs/guides/city-geometry-pipeline.md](docs/guides/city-geometry-pipeline.md)

Short version:

1. Research report → `docs/research/<city>-student-life.md`
2. Contiguous geometry specs → `scripts/granularity_geometry.json` (or `scripts/build_<city>_geometry_specs.py`)
3. Scores → `src/data/<city>Places.ts` + register in `src/data/cities.ts`
4. Build + validate GeoJSON (contiguity audits are mandatory)
5. `bun run build` + browser check

**Never:** hand-drawn polygons, lat/lon rectangle splits, merge without adjacency check.

Reference builders: `scripts/build_bordeaux_micro_geojson.py`, `scripts/build_nantes_geometry_specs.py`, `scripts/geometry_audit.py`.

## Key paths

```
src/data/cities.ts              # CityConfig, weights, security cap
src/data/*Places.ts             # PlaceScore[] per city
src/components/ParisStudentMap.tsx
src/lib/geometryOutline.ts      # selection border / dissolveGeometry
public/data/*.geojson           # map polygons (properties.code = PlaceScore.code)
scripts/granularity_geometry.json
scripts/build_new_city_geojson.py
scripts/validate_city_geojson.py
scripts/geometry_audit.py
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