# Full Coverage City Zoning Handoff

## Summary

Change the product goal from "student zones only" to **full map coverage for every city**.

Every configured city must render a complete, non-overlapping coverage partition inside its chosen city/metro scope. White space is only allowed outside the explicit coverage scope, not inside the visible urban area for that city.

This replaces the previous "curated student polygons with white gaps allowed" direction. Keep the scoring model and UI, but expand data so all coverage zones are clickable and scored.

Primary geometry base: INSEE IRIS. INSEE defines IRIS as the base infra-communal unit for local statistics and a commune partition, which makes it the right full-coverage unit. Source: https://www.insee.fr/fr/metadonnees/definition/c1523

## Product Rules

- Full coverage beats student-only selectivity.
- Every polygon inside a city coverage scope must belong to exactly one displayed zone.
- No overlapping zones.
- No internal blank holes.
- No hand-drawn polygons.
- No lat/lon rectangle cuts.
- Use official polygons only: IRIS, official quartiers, arrondissements, communes.
- Small official holes caused by parks, water, rail, airport, or uninhabited land are acceptable only if the base source omits them. Do not create holes by leaving IRIS unassigned.
- Keep map readable: group IRIS into meaningful zones, not one feature per IRIS.

## Data Model Changes

Extend `PlaceScore` in `src/data/cities.ts` with optional fields:

```ts
coverageRole?: "primary" | "context" | "campus" | "risk_cap" | "low_relevance";
geometryBasis?: "iris_partition" | "official_quartier" | "arrondissement" | "commune";
```

Meanings:

- `primary`: normal researched city/student-quality zone.
- `context`: surrounding urban coverage needed to avoid blanks.
- `campus`: campus-specific zone.
- `risk_cap`: lower-score zone that must stay visible.
- `low_relevance`: peripheral full-coverage zone with limited student usefulness.

All zones still use normal `scores`, `rentLevel`, `studentFit`, `summary`, `caveat`, `confidence`, and `evidenceNote`.

For lower-researched context zones:

- `confidence: "low"` or `"medium"`.
- `evidenceNote`: explain that it is a full-coverage context zone based on official IRIS/commune/quartier geometry.
- Scores may be broad, but must be plausible and conservative. Do not over-rank context zones above researched primary zones unless evidence supports it.

## Coverage Architecture

Add a new canonical file:

- `scripts/city_coverage_scopes.json`

Each city entry defines:

```json
{
  "city": "lille",
  "coverageMode": "full_partition",
  "inseeCodes": ["59350", "59009", "..."],
  "preferredBase": "iris",
  "zones": [
    {
      "code": "lille-centre-core",
      "label": "Lille-Centre core",
      "role": "primary",
      "seedIrisNames": ["..."],
      "scopeIrisNames": ["..."]
    }
  ]
}
```

Rules:

- `inseeCodes` defines the exact commune scope to cover.
- `seedIrisNames` starts assignment.
- `scopeIrisNames` is optional. If present, the zone can only absorb IRIS inside this scope.
- If no `scopeIrisNames`, the zone can receive adjacent unassigned IRIS only inside same commune and same broad sector.
- Every IRIS loaded from `inseeCodes` must be assigned to exactly one zone.
- If a city uses official quartier polygons instead of IRIS, the same partition rule applies to official quartier units.

## Full Partition Algorithm

Create/replace builder flow:

1. Load all source units for a city coverage scope:
   - IRIS for each `inseeCodes`, via cached GeoPlateforme WFS.
   - official quartiers/arrondissements/communes only when configured.
2. Normalize source names and validate all seeds exist.
3. Assign explicit `seedIrisNames` and explicit `scopeIrisNames`.
4. Build adjacency graph across all source units in the coverage scope.
5. Multi-source watershed fill unassigned units to nearest valid zone.
6. Respect hard boundaries:
   - no cross-commune assignment unless zone explicitly lists both communes.
   - no crossing into a `scopeIrisNames` owned by another zone.
   - no merging disconnected islands unless `allowMultipart` is explicit.
7. Emit one GeoJSON feature per zone.
8. Validate:
   - source unit count equals assigned unit count.
   - no duplicate assigned source unit.
   - no unassigned source unit.
   - feature code parity with `PlaceScore`.
   - valid lon/lat.
   - no duplicate geometry hash.
   - no undocumented disconnected MultiPolygon.

This is not the old blind watershed. This is **bounded full partition**.

## City Coverage Scopes

Use these scopes. If a code is missing or stale, resolve by commune name through `geo.api.gouv.fr`, but keep the commune list unchanged unless user approves.

### Paris

Status: already closest to target.

Coverage scope:

- Paris arrondissements.
- Existing western/southern/eastern suburbs already present in `districtScores.ts`.

Implementation:

- Keep current Paris/Bordeaux-style clarity.
- Do not split Paris into IRIS for this pass.
- Ensure no regression.

### Bordeaux

Status: acceptable reference pattern.

Coverage scope:

- Bordeaux.
- Talence, Pessac, Gradignan, Mérignac, Bègles, Cenon, Lormont, Le Bouscat, Floirac if already represented by existing source data.

Implementation:

- Keep current Bordeaux geometry as reference.
- Only add coverage context zones if internal holes appear after validation.

### Lyon

Coverage scope:

- Lyon.
- Villeurbanne.
- Bron.
- Écully.
- Oullins-Pierre-Bénite.
- Saint-Priest / Vénissieux only if already within current intended student/metro scope.

Implementation:

- Keep arrondissement/quartier clarity where existing works.
- Prefer official quartier or IRIS groups over lat/lon splits.

### Toulouse

Coverage scope:

- Toulouse `31555`.
- Optional near-campus suburbs for later only: Ramonville-Saint-Agne, Auzeville-Tolosane, Labège, Balma, Blagnac.

Implementation for first full-coverage pass:

- Cover full Toulouse commune with IRIS partition.
- Keep 21 researched zones as primary/campus/risk zones.
- Add context zones for all unassigned IRIS:
  - Toulouse north context.
  - Toulouse east context.
  - Toulouse west context.
  - Toulouse south-east context.
  - Toulouse south-west context.
  - Green/peripheral context where needed.
- No blank holes inside Toulouse commune.

### Lille

Coverage scope:

- Lille `59350`.
- Villeneuve-d'Ascq `59009`.
- Lambersart `59328`.
- La Madeleine `59368`.
- Mons-en-Barœul `59410`.
- Hellemmes and Lomme are part of Lille administrative code/source handling; include their IRIS under Lille scope.
- Roubaix for EDHEC/Barbieux only if currently displayed.

Implementation:

- Cover all listed communes/associated areas that appear in the Lille viewport.
- Keep primary zones from `lillePlaces.ts`.
- Add context zones to fill blanks:
  - Lambersart context.
  - La Madeleine context.
  - Saint-Maurice / Pellevoisin context.
  - Mons-en-Barœul context.
  - Hellemmes context.
  - Lomme context.
  - Villeneuve-d'Ascq north/east context.
  - Roubaix context if Roubaix remains in scope.
- Existing issue to fix: no zone may visually contain another zone. Full partition means every source unit assigned once, so overlap must be impossible.

### Marseille

Coverage scope:

- Marseille `13055`.

Implementation:

- Use official 111 quartiers as the partition base where possible.
- Every official quartier must map to exactly one displayed zone.
- Keep 23 researched zones.
- Add context/risk zones for unassigned official quartiers:
  - North-east context.
  - North-west context.
  - East hills context.
  - South-east residential context.
  - Coastal/south context.
  - Industrial/port context.
- No full-commune IRIS required unless quartier source leaves holes.

### Nice

Coverage scope:

- Nice `06088`.

Implementation:

- Cover full Nice commune with IRIS partition.
- Keep 22 researched zones.
- Add context zones for all unassigned IRIS:
  - North-west hills context.
  - Saint-Sylvestre / Las Planas context.
  - Rimiez / Gairaut context.
  - East hills context.
  - West hills context.
  - Airport / Var plain context.
  - Peripheral low-relevance context.
- Existing issue to fix: western hills and north hills must be assigned, but grouped as context zones, not absorbed into Madeleine or Libération.
- The map should be full, but large hill zones must have context labels and lower confidence.

### Nantes

Coverage scope:

- Nantes `44109`.

Implementation:

- Current Nantes-style full partition is closest to new target.
- Keep bounded city partition.
- Add context roles and validate no unassigned IRIS inside Nantes.

### Strasbourg

Coverage scope:

- Strasbourg `67482`.
- Illkirch-Graffenstaden if campus row remains.

Implementation:

- Full Strasbourg IRIS partition.
- Keep researched rows.
- Add context zones for Robertsau, western suburbs/edges, south-west, port/east, and low-relevance peripheral sectors.
- If Illkirch is included, cover the displayed campus/commune scope with context zone(s), not just campus polygon.

### Montpellier

Coverage scope:

- Montpellier `34172`.
- Castelnau-le-Lez only if shown as coverage context.

Implementation:

- Full Montpellier IRIS partition.
- Keep researched rows.
- Add context zones for north-east residential, east fringe, south/south-west, west/north-west, and peripheral low-relevance areas.

### Rennes

Coverage scope:

- Rennes `35238`.
- Cesson-Sévigné only if Atalante/Cesson edge remains displayed.

Implementation:

- Full Rennes IRIS partition.
- Keep researched rows.
- Add context zones for north-west, north-east, south-west, south-east, and peripheral low-relevance areas.

### Toulon

Coverage scope:

- Toulon `83137`.
- La Garde.
- La Valette-du-Var.
- La Seyne-sur-Mer only if currently displayed.

Implementation:

- Full Toulon commune partition.
- If La Garde/La Valette/La Seyne are included, cover the displayed commune areas with context zones, not isolated campus polygons.
- Add context zones for west, north hills, east hills, port/naval areas, and low-relevance periphery.

### Grenoble

Coverage scope:

- Grenoble `38185`.
- Saint-Martin-d'Hères.
- Gières.
- La Tronche.
- Meylan if displayed.
- Seyssinet-Pariset / Fontaine edge only if displayed.

Implementation:

- Full Grenoble commune partition plus selected campus/medical suburbs.
- Keep researched rows.
- Add context zones for north-west, east, south-east, west-suburb edge, and low-relevance periphery.

## Scoring Context Zones

Do not leave context zones unscored. They remain clickable.

Default scoring approach:

- Start from nearest researched parent/sector average.
- Apply conservative adjustments:
  - lower `campusAccess` unless near known campus/transit.
  - lower `studentEnergy` for low-relevance peripheral zones.
  - keep `greenCalm` higher for hills/parks/residential edges.
  - do not let context zones outrank strongest researched primary zones unless evidence supports it.
- Mark `confidence: "low"` for broad context zones.
- Set `studentFit: "weak"` or `"mixed"` for low-relevance zones.
- Summary template: `"Full-coverage context zone; useful for map continuity, not a primary student pick."`
- Caveat template: `"Broad official geometry; block-level choice still matters."`

## Required Builder Files

Create or update:

- `scripts/city_coverage_scopes.json`
- `scripts/build_full_coverage_specs.py`
- `scripts/build_new_city_geojson.py`
- `scripts/validate_city_geojson.py`
- `scripts/geometry_audit.py`
- `docs/guides/city-geometry-pipeline.md`

Deprecate for full-coverage cities:

- blind `granularity_intended.json` watershed without coverage scope.
- any city-specific "student-only" output that leaves internal blank areas.

## Validation

For each city:

```bash
python3 scripts/build_full_coverage_specs.py <city>
python3 scripts/build_new_city_geojson.py <city>
python3 scripts/validate_city_geojson.py <city>
```

Then run:

```bash
~/.bun/bin/bun run build
```

Validation must fail if:

- any source unit in coverage scope is unassigned.
- any source unit is assigned to more than one zone.
- any GeoJSON feature has no `PlaceScore`.
- any `PlaceScore` has no GeoJSON feature.
- invalid lon/lat appears.
- undocumented disconnected geometry appears.
- feature count is unexpectedly lower than previous city count.

## Browser QA

For every city:

- Open city from dropdown.
- Confirm no blank holes inside coverage scope.
- Click 5 primary zones and 3 context zones.
- Confirm selected outline matches visible polygon.
- Confirm panel data matches clicked zone.
- Confirm no console `invalid latitude`.
- Capture screenshots for desktop width.

Specific visual standard:

- Paris remains the visual reference.
- Full city/metro partitions should look intentional.
- Context zones are allowed to be larger than primary zones, but must be labeled as context and must not swallow primary zones.

## Rollout Order

1. Lille + Nice first.
2. Toulouse + Marseille.
3. Nantes cleanup, if needed.
4. Second batch: Strasbourg, Montpellier, Rennes, Toulon, Grenoble.
5. Audit Bordeaux/Lyon/Paris only for consistency, not redesign.

## Guardrails

- Use `python3` for existing scripts.
- Use `~/.bun/bin/bun`, never npm/yarn/pnpm.
- Do not execute SQL.
- Do not hand-draw polygons.
- Do not change score weights or security cap.
- Do not change UI layout unless coverage roles need small labels in the panel.
- Do not push without user approval.

## Unresolved Questions

None. Full coverage is now the target.
