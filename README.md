# District Quality Map

Interactive map for comparing district quality across French cities.

Live: [urbanqualitymap.com](https://urbanqualitymap.com) (also served at [paris-districts.beautiful-apps.com](https://paris-districts.beautiful-apps.com))

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
| Geo processing | Python city compiler (`scripts/city_compiler/`) |
| Data | Researched district scores + official boundary sources |

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
bun run geo:validate:all
```

## Scoring model

Each district has researched 0–10 scores across seven criteria. Default weights:

| Criterion | Weight |
|-----------|--------|
| Security | 3.0x |
| Affordability | 1.6x |
| Transport | 1.4x |
| Local energy | 1.2x |
| Services | 1.0x |
| Access | 1.0x |
| Green/calm | 0.8x |

The weighted total is normalized to 0–10, then capped by a security ceiling so unsafe areas cannot score green regardless of rent or nightlife.

User adjustments are stored under:

- `district-quality-map:weights:v1`
- `district-quality-map:score-overrides:v1`

Legacy keys (`paris-student-map:*`, `student-city-map:*`) migrate automatically on first load.

## Project layout

```
src/
  app/                    # Next.js pages and global styles
  components/             # DistrictQualityMap, settings drawer
  data/cities.ts          # City registry, weights, security cap
  data/*Places.ts         # Per-city PlaceScore[] micro-areas
  lib/geometryOutline.ts  # Map selection outline helpers
public/data/
  *.geojson               # City micro-area boundaries
docs/
  research/               # District score reports (source of truth)
  guides/                 # Technical guides (see city geometry pipeline)
scripts/
  city_compiler/          # Common geometry compiler
  city_configs/           # Per-city declarative build configs
  geometry_audit.py       # Shared audits
  legacy/                 # Deprecated one-off builders
```

## Adding or upgrading a city

See [docs/guides/city-geometry-pipeline.md](docs/guides/city-geometry-pipeline.md).

Short version:

1. Research report → `docs/research/<city>-student-life.md`
2. City config → `scripts/city_configs/<city>.json`
3. Scores → `src/data/<city>Places.ts` + register in `src/data/cities.ts`
4. Build + validate:

```bash
python3 scripts/city_compiler/cli.py build <city>
python3 scripts/city_compiler/cli.py validate <city>
bun run geo:outlines -- <city>
```

5. `bun run build` + browser check

## Geo commands

| Command | Purpose |
|---------|---------|
| `bun run geo:build -- <city>` | Build GeoJSON via compiler |
| `bun run geo:validate -- <city>` | Validate GeoJSON + audits |
| `bun run geo:outlines -- <city>` | Regenerate selection outlines |
| `bun run geo:validate:all` | Full CI-like validation |