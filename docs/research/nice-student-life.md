# Nice student life scoring (granularity upgrade)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: replace the current 10 polygons with **22 student-relevant micro-areas**. Use Nice quartier/IRIS-derived official areas where possible, then group IRIS around campus and tram corridors.

Boundary confidence: **medium/high** after IRIS mapping, **medium** for official quartier groupings. Nice has many recognized quartiers; the map should not collapse west campus, centre, north centre, east, and airport-edge student life into 10 broad shapes.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Nice quartier context](https://fr.wikipedia.org/wiki/Liste_des_quartiers_de_Nice)
- [Universite Cote d'Azur](https://univ-cotedazur.fr/)
- [Lignes d'Azur network](https://www.lignesdazur.com/)
- [EDHEC Nice](https://www.edhec.edu/)

## Upgrade Rationale

Current map hides the real Nice student tradeoff:

- Libération/Valrose is useful, but Borriglione, Vernier, Saint-Maurice, and Valrose should not be one blob.
- Thiers/Musiciens/Jean-Médecin should split because rent, station exposure, and student usefulness differ.
- Riquier, Saint-Roch, Saint-Jean-d'Angély, Pasteur, and Ariane are different east-side risk profiles.
- Carlone, Madeleine, Magnan/Baumettes, Arenas, Saint-Augustin, and Moulins need west-side separation.
- Cimiez and Rimiez are comfort/green areas, not normal student defaults.

## Micro Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Geometry target | Scores | Total |
|------------|--------|-----------------|--------|-------|
| Jean-Medecin core | Centre | IRIS group | 5.6 / 2.3 / 9.6 / 8.0 / 9.4 / 8.0 / 3.4 | 6.2 |
| Carabacel | Centre east | official/IRIS group | 6.2 / 2.6 / 9.1 / 7.4 / 8.8 / 8.0 / 4.4 | 6.5 |
| Thiers / station edge | Centre west | IRIS group | 5.1 / 3.5 / 9.3 / 7.2 / 8.5 / 8.0 / 4.0 | 6.2 |
| Musiciens | Centre west | IRIS group | 6.1 / 3.0 / 8.9 / 6.8 / 8.7 / 7.8 / 4.8 | 6.5 |
| Vernier | North centre | IRIS group | 5.7 / 4.3 / 8.8 / 7.6 / 8.0 / 8.6 / 4.7 | 6.2 |
| Liberation | North centre | IRIS group | 6.6 / 4.6 / 8.9 / 8.3 / 8.5 / 9.3 / 5.8 | 7.0 |
| Borriglione / Valrose | North centre campus | IRIS group | 6.8 / 4.7 / 8.8 / 8.3 / 8.3 / 9.6 / 6.0 | 7.1 |
| Saint-Maurice | North centre | official/IRIS group | 6.5 / 4.8 / 8.0 / 7.0 / 7.6 / 8.6 / 6.0 | 6.8 |
| Cimiez | North-east hills | official/IRIS group | 8.1 / 2.6 / 7.0 / 4.8 / 7.9 / 7.3 / 8.2 | 6.6 |
| Rimiez | North-east hills | official/IRIS group | 8.3 / 2.7 / 6.2 / 4.2 / 7.4 / 6.8 / 8.8 | 6.4 |
| Vieux-Nice | Historic centre | official/IRIS group | 5.4 / 2.8 / 8.9 / 9.0 / 9.1 / 7.5 / 4.0 | 6.2 |
| Port | East centre | official/IRIS group | 5.9 / 3.0 / 8.7 / 8.4 / 8.9 / 7.6 / 5.2 | 6.2 |
| Riquier | East inner city | official/IRIS group | 5.8 / 5.3 / 8.6 / 7.2 / 8.1 / 7.6 / 5.0 | 6.2 |
| Saint-Roch | East | official/IRIS group | 5.7 / 5.8 / 8.3 / 6.8 / 7.7 / 7.6 / 5.2 | 6.2 |
| Saint-Jean-d'Angely | East campus | IRIS group | 5.8 / 5.2 / 8.6 / 7.6 / 7.8 / 9.0 / 5.2 | 6.2 |
| Pasteur | East | official/IRIS group | 4.5 / 6.7 / 7.6 / 5.8 / 7.0 / 8.1 / 5.0 | 5.2 |
| Ariane | North-east edge | official/IRIS group | 3.2 / 7.4 / 6.8 / 4.8 / 6.2 / 5.6 / 5.6 | 4.4 |
| Rue de France / Promenade edge | Centre west coast | IRIS group | 6.1 / 2.8 / 8.7 / 7.2 / 8.8 / 7.4 / 4.8 | 6.5 |
| Baumettes / Magnan | West coast | official/IRIS group | 6.2 / 4.2 / 8.0 / 6.8 / 7.8 / 8.2 / 5.8 | 6.6 |
| Carlone campus | West campus | IRIS group | 6.5 / 4.8 / 7.6 / 7.3 / 7.4 / 9.2 / 6.3 | 6.8 |
| Madeleine | West valley | official/IRIS group | 6.1 / 5.1 / 7.4 / 6.5 / 7.2 / 8.5 / 6.2 | 6.5 |
| Arenas / Saint-Augustin / EDHEC | West airport | official/IRIS group | 5.0 / 5.4 / 8.4 / 6.2 / 7.4 / 8.2 / 5.2 | 6.2 |

## Geometry Instructions

- Prefer IRIS groups for central/west/east splits.
- Do not merge Ariane with Pasteur or Saint-Roch.
- Do not merge Carlone with all Madeleine/Fabron unless IRIS mapping proves exact campus catchment.
- Exclude airport runways/sea-only geometry from clickable student areas where source polygons include them.

## Verdict

Nice should become a corridor map: west campus, centre/station, Valrose, east campus/risk zones, and airport-edge EDHEC. Borriglione/Valrose and Carlone lead practical student choice. Ariane and Pasteur stay capped. Cimiez/Rimiez are comfort areas, not first student defaults.
