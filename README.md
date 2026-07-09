# Paris Student Life Map

Interactive map of Paris arrondissements and nearby western suburbs, scored for student life quality. Click districts to compare safety, rent pressure, transport, student energy, services, campus access, and calm.

Live: [paris-districts.beautiful-apps.com](https://paris-districts.beautiful-apps.com)

## Features

- **District overlay** — GeoJSON boundaries with color-coded composite scores
- **Overall vs Safety modes** — toggle map coloring between risk-adjusted total and raw security
- **Selected district panel** — summary, caveat, and per-criterion scores
- **Settings drawer** — adjust criterion weights (0–5x) and override district ratings
- **Rankings** — live table sorted by your current weights and overrides
- **Persistence** — custom weights and rating overrides saved in `localStorage`

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Runtime / package manager | Bun |
| Map | MapLibre GL JS + deck.gl GeoJsonLayer |
| Data | Researched district scores + Paris Open Data / geo.api.gouv.fr boundaries |

## Local development

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Validate:

```bash
bun run lint
bun run build
```

## Scoring model

Each district has researched 0–10 scores across seven criteria. Default weights:

| Criterion | Weight |
|-----------|--------|
| Security | 3.0x |
| Affordability | 1.6x |
| Transport | 1.4x |
| Student energy | 1.2x |
| Services | 1.0x |
| Campus access | 1.0x |
| Green/calm | 0.8x |

The weighted total is normalized to 0–10, then capped by a security ceiling so unsafe areas cannot score green regardless of rent or nightlife.

User adjustments are stored under:

- `paris-student-map:weights:v1`
- `paris-student-map:score-overrides:v1`

## Project layout

```
src/
  app/                    # Next.js pages and global styles
  components/             # Map, settings drawer
  data/cities.ts          # City registry, weights, security cap
  data/*Places.ts         # Per-city PlaceScore[] micro-areas
  lib/geometryOutline.ts  # Map selection outline helpers
public/data/
  *.geojson               # City micro-area boundaries
docs/
  research/               # Student-life score reports (source of truth)
  guides/                 # Technical guides (see city geometry pipeline)
scripts/
  build_new_city_geojson.py
  validate_city_geojson.py
  geometry_audit.py
```

## Adding a new city

Do not ship coarse admin quartiers or merged non-adjacent polygons — they cause white holes and broken zones on the map.

Follow the **[city geometry pipeline guide](docs/guides/city-geometry-pipeline.md)** end to end:

1. Write `docs/research/<city>-student-life.md` (18–24 micro-areas with scores)
2. Define **contiguous** geometry specs (IRIS / official quartiers)
3. Add `src/data/<city>Places.ts` and register in `src/data/cities.ts`
4. Build and validate GeoJSON:

```bash
python3 scripts/build_new_city_geojson.py <city>
python3 scripts/validate_city_geojson.py <city>
~/.bun/bin/bun run build
```

Reference implementations: Bordeaux (`scripts/build_bordeaux_micro_geojson.py`), Nantes (`scripts/build_nantes_geometry_specs.py`).

## Deployment

Docker + nginx-proxy on the server:

```bash
./deploy.sh
```

Target: `root@188.34.196.228:/opt/paris-districts`

## Sources

Research citations are listed in the app under **Settings / Data → Sources**. Primary references include SSMSI crime data, Paris Open Data boundaries, geo.api.gouv.fr commune contours, and reporting on north-east Paris safety pockets.