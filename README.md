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
  app/                  # Next.js pages and global styles
  components/           # Map, settings drawer
  data/districtScores.ts  # District data, defaults, scoring
  lib/userSettings.ts   # localStorage helpers
public/data/
  districts.geojson     # District boundaries
```

## Deployment

Docker + nginx-proxy on the server:

```bash
./deploy.sh
```

Target: `root@188.34.196.228:/opt/paris-districts`

## Sources

Research citations are listed in the app under **Settings / Data → Sources**. Primary references include SSMSI crime data, Paris Open Data boundaries, geo.api.gouv.fr commune contours, and reporting on north-east Paris safety pockets.