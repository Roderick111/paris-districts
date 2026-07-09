# Lille student life scoring (major districts)

## Method

Same seven criteria, same weights, same security cap as the app.

Rebuild target: **16 major districts** across Lille and core campus suburbs. Use official Lille quartier polygons for Lille proper; use full-commune IRIS groups for associated suburbs; scope Roubaix to Barbieux/EDHEC only.

Boundary confidence: **high** for official Lille quartiers, **high** for Villeneuve-d'Ascq commune grouping, **medium/low** for suburb commune fallbacks.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Quartiers de Lille](https://fr.wikipedia.org/wiki/Quartiers_de_Lille) — 10 recognized 21st-century districts
- [Lille Metropole WFS](https://data.lillemetropole.fr/geoserver/wfs) — official quartier polygons (`ville_lille:limite_des_quartiers_de_lille_et_de_ses_communes_associees`)
- [Université de Lille](https://www.univ-lille.fr/)
- [Université catholique de Lille](https://www.univ-catholique.fr/)
- [Ilévia network](https://www.ilevia.fr/)

## Major District Rationale

Previous micro/context partition created 40+ IRIS fragments with identical placeholder scores. Students choose by **district reputation** first: Vauban, Wazemmes, Centre, VdA campus, not 26 context slivers.

## Major Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm

| District | Geometry | Confidence | Scores | Role |
|----------|----------|------------|--------|------|
| Lille-Centre | official quartier | medium | 5.6 / 2.6 / 9.9 / 8.0 / 9.4 / 8.0 / 3.6 | primary |
| Vieux-Lille | official quartier | high | 7.4 / 2.0 / 8.3 / 6.8 / 8.9 / 7.0 / 5.8 | primary |
| Vauban-Esquermes | official quartier | high | 7.5 / 3.8 / 8.2 / 9.4 / 8.3 / 9.7 / 7.6 | primary |
| Wazemmes (+ Faubourg de Béthune) | official quartier | high | 4.9 / 6.4 / 8.8 / 9.4 / 8.2 / 8.4 / 3.9 | primary |
| Moulins | official quartier | medium | 4.5 / 6.8 / 8.5 / 8.2 / 7.4 / 9.1 / 4.1 | primary / risk_cap |
| Fives | official quartier | medium | 5.4 / 6.5 / 8.7 / 7.1 / 7.3 / 7.1 / 4.9 | primary |
| Bois-Blancs | official quartier | medium | 6.5 / 5.4 / 7.9 / 6.9 / 7.3 / 6.5 / 6.8 | primary |
| Lille-Sud | official quartier | medium | 4.2 / 7.1 / 7.7 / 5.6 / 6.7 / 7.1 / 5.3 | primary / risk_cap |
| Saint-Maurice Pellevoisin | official quartier | medium | 6.3 / 5.8 / 8.1 / 5.2 / 7.5 / 6.8 / 6.1 | context |
| Hellemmes | official quartier | medium | 5.9 / 6.2 / 8.6 / 7.0 / 7.2 / 7.7 / 5.5 | context |
| Lomme / CHR | official quartier | medium | 6.2 / 6.1 / 8.3 / 6.6 / 7.5 / 8.4 / 6.3 | campus |
| Lambersart | commune IRIS group | low | 6.8 / 4.2 / 8.0 / 5.0 / 7.8 / 6.2 / 6.9 | context |
| La Madeleine | commune IRIS group | medium | 7.1 / 3.6 / 8.6 / 6.3 / 8.1 / 7.1 / 6.4 | context |
| Mons-en-Barœul | commune IRIS group | low | 6.0 / 6.0 / 8.4 / 6.2 / 7.0 / 7.3 / 5.8 | context |
| Villeneuve-d'Ascq campus | commune IRIS group | high | 6.7 / 5.9 / 8.9 / 8.8 / 7.7 / 9.9 / 7.6 | campus |
| Roubaix / Barbieux | IRIS group (4 units) | medium | 6.1 / 5.7 / 8.1 / 7.5 / 7.5 / 9.3 / 7.1 | campus |

## Geometry Instructions

- Lille WFS requests must include `srsName=EPSG:4326`.
- Lille commune (`59350`): one feature per official quartier; merge Wazemmes + Faubourg de Béthune for student corridor continuity.
- Lambersart, La Madeleine, Mons, Villeneuve-d'Ascq: all commune IRIS merged per district.
- Roubaix: Barbieux/EDHEC IRIS only (`Barbieux Sud`, `Barbieux-Vauban`, `Alma Nord`, `Alma Sud`).
- No context filler zones; no identical placeholder score tuples.

## Verdict

Lille should read as a small set of honest districts. Vauban-Esquermes and Villeneuve-d'Ascq campus lead. Wazemmes and Fives offer value. Centre and Vieux-Lille are premium convenience. Moulins and Lille-Sud carry visible safety caps.
## Croix, Roubaix, Tourcoing — Major-Zone Fallback

East/north-east communes use **eight broad user-facing zones** (Croix 2, Roubaix 3, Tourcoing 3). IRIS polygons are a backend building block only — no official Roubaix/Tourcoing quartier WFS is in scope. Fewer zones are intentional for map readability and evidence honesty; scores are district-reputation fallback, not fake micro precision.

Sources:

- [Croix (Nord)](https://fr.wikipedia.org/wiki/Croix_(Nord)) — EDHEC/Barbieux band vs rest-of-commune context
- [Roubaix](https://fr.wikipedia.org/wiki/Roubaix) — Barbieux comfort band, centre-west hub, east/north risk context
- [Tourcoing](https://fr.wikipedia.org/wiki/Tourcoing) — centre/gare hub, south-west connector, north-east risk context
- [EDHEC Nord](https://fr.wikipedia.org/wiki/%C3%89cole_des_hautes_%C3%A9tudes_commerciales_du_Nord) — campus across Croix/Roubaix Barbieux

### Croix (59163) — 2 zones

| District | Confidence | Scores (S/A/T/SE/Sv/C/G) | Role |
|----------|------------|--------------------------|------|
| Barbieux / EDHEC | medium | 7.0 / 5.0 / 8.0 / 7.6 / 7.5 / 9.4 / 7.6 | campus |
| Rest of commune | low | 6.4 / 6.1 / 8.2 / 6.0 / 7.2 / 6.4 / 6.0 | context |

### Roubaix (59512) — 3 zones

| District | Confidence | Scores | Role |
|----------|------------|--------|------|
| Barbieux / EDHEC | medium | 6.8 / 5.4 / 8.2 / 7.4 / 7.5 / 9.2 / 7.2 | campus |
| Centre-west | medium | 5.5 / 5.8 / 8.7 / 6.6 / 8.2 / 7.0 / 4.3 | primary |
| East / north | low | 4.8 / 6.8 / 7.8 / 5.6 / 6.6 / 6.0 / 4.0 | context |

### Tourcoing (59599) — 3 zones

| District | Confidence | Scores | Role |
|----------|------------|--------|------|
| Centre / Gare | medium | 5.9 / 5.9 / 8.6 / 6.5 / 8.0 / 6.7 / 4.5 | primary |
| South-west | medium | 6.0 / 6.1 / 8.3 / 6.1 / 7.4 / 6.4 / 5.4 | primary |
| North-east | low | 4.7 / 6.8 / 7.5 / 5.0 / 6.3 / 5.4 / 4.0 | context |

Geometry: `iris_fallback_major_zone` — IRIS BFS partition from major-district seeds; full commune coverage; outline layer dissolved in UI.

## Geometry Repair (2026-07)

Lille now uses three geometry classes:

| Class | Use | Examples |
|-------|-----|----------|
| `official_quartier` | Best quality; Lille WFS + VDA quartier layer | Lille-Centre, Cité Scientifique/Triolo |
| `commune_context` | Whole adjacent commune, one honest broad score | La Madeleine, Lambersart, Mons-en-Barœul |
| `iris_fallback_major_zone` | IRIS backend only; few broad user-facing zones | Croix, Roubaix, Tourcoing (8 zones) |

**Visual seam fix:** Map outline layer dissolves MultiPolygon rings before drawing (`dissolveGeometry` in `ParisStudentMap.tsx`), so merged IRIS/commune zones no longer show internal white borders. Fill layer still uses raw geometry for accurate click targets.

**Villeneuve-d'Ascq:** Replaced whole-commune `lille-villeneuve-dascq-campus` blob with five official VDA quartier zones partitioned by adjacency.

**Roubaix/Tourcoing limitations:** No official quartier WFS in scope; eight major zones replace granular IRIS labels. Scores are district-reputation fallback, not micro-precision.
