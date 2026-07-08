# Bordeaux student life scoring (micro-areas)

## Method

Same seven criteria as Paris, same weights, same security cap:

| Criterion | Weight |
|-----------|--------|
| Security | 3.0 |
| Affordability | 1.6 |
| Transport | 1.4 |
| Student energy | 1.2 |
| Services | 1.0 |
| Campus access | 1.0 |
| Green/calm | 0.8 |

Bordeaux now uses **micro-areas** as primary map units. Macro quartier/commune rows are parent groupings only — not selectable on the map.

Boundary confidence: **high** for Talence/Pessac official sub-quartier polygons; **medium** for curated splits inside parent quartiers and Gradignan commune.

## Baseline

Paris scoring punishes cheap-but-rough areas and refuses to let safe wealthy districts auto-win on student fit. Bordeaux micro-scoring applies the same logic: Victoire ≠ Saint-Michel, Aubiers ≠ Ginko, Benauge ≠ Bastide-Niel, Saige ≠ Pessac centre.

## Sources

Primary:

- [SSMSI crime dataset (data.gouv.fr)](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [Bordeaux Metropole quartier boundaries (`se_quart_s`)](https://datahub.bordeaux-metropole.fr/explore/dataset/se_quart_s/)
- [geo.api.gouv.fr commune contours](https://geo.api.gouv.fr/decoupage-administratif/communes)

Context (not used alone for scoring):

- [Quartiers de Bordeaux (Wikipedia)](https://fr.wikipedia.org/wiki/Quartiers_de_Bordeaux)
- [Saint-Michel (Bordeaux)](https://fr.wikipedia.org/wiki/Saint-Michel_%28Bordeaux%29)
- [Saint-Jean Belcier](https://fr.wikipedia.org/wiki/Saint-Jean_Belcier)
- [Les Aubiers](https://fr.wikipedia.org/wiki/Les_Aubiers)
- [Grand Parc](https://fr.wikipedia.org/wiki/Grand_Parc)
- [La Benauge](https://fr.wikipedia.org/wiki/La_Benauge)
- [La Bastide (Bordeaux)](https://fr.wikipedia.org/wiki/La_Bastide_%28Bordeaux%29)
- [Domaine universitaire de Talence Pessac Gradignan](https://fr.wikipedia.org/wiki/Domaine_universitaire_de_Talence_Pessac_Gradignan)

## Harsh notes

- Saint-Michel/Capucins must be capped. Student energy is real; street risk is also real.
- Aubiers/Le Lac must not be averaged with Ginko — that would be dishonest.
- Grand Parc is not Chartrons. Good transport and value, but QPV context caps comfort.
- Benauge is not Bastide-Niel. Tram helps; safety still drags score.
- Pessac campus/Saige has huge campus value, but safety cap blocks top score. Pessac centre is better balanced.
- Caudéran is safe but weak for normal student life.
- Gradignan is green and safe, but transport friction stays real.

## Verdict

Talence centre and Pessac centre are the best-balanced campus-metro picks. Saint-Michel and Aubiers stay capped despite energy. Gradignan campus edges centre Gradignan on student fit but not on transport.

## Micro score table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm → total

| Micro-area | Parent | Scores | Total |
|------------|--------|--------|-------|
| Saint-Pierre / Saint-Paul | Bordeaux Centre | 5.4 / 2.6 / 9.4 / 8.4 / 9.2 / 8.2 / 3.8 | 6.2 |
| Hôtel de Ville / Pey-Berland / Mériadeck | Bordeaux Centre | 6.2 / 3.0 / 9.0 / 8.0 / 9.0 / 8.8 / 4.6 | 6.7 |
| Quinconces / Tourny / Triangle d'Or | Bordeaux Centre | 6.8 / 1.8 / 8.8 / 5.8 / 8.8 / 7.2 / 5.8 | 6.3 |
| Victoire / Sainte-Eulalie | Bordeaux Sud | 5.2 / 4.8 / 9.2 / 9.8 / 8.5 / 9.6 / 3.8 | 6.2 |
| Saint-Michel / Capucins | Bordeaux Sud | 4.4 / 6.0 / 9.0 / 9.2 / 8.0 / 8.8 / 3.8 | 5.2 |
| Sainte-Croix / Saint-Jean | Bordeaux Sud | 5.0 / 5.4 / 9.3 / 8.5 / 7.8 / 8.5 / 4.0 | 6.2 |
| Belcier / Euratlantique / Paludate | Bordeaux Sud | 5.3 / 5.0 / 8.8 / 7.5 / 7.0 / 7.5 / 4.8 | 6.2 |
| Chartrons | Chartrons-Grand Parc | 7.0 / 3.5 / 8.4 / 7.6 / 8.4 / 7.2 / 6.2 | 6.8 |
| Jardin Public / Fondaudège | Chartrons-Grand Parc | 7.4 / 2.8 / 8.2 / 6.5 / 8.5 / 6.8 / 8.0 | 6.8 |
| Grand Parc / Ravezies | Chartrons-Grand Parc | 5.3 / 6.2 / 8.2 / 6.8 / 7.4 / 6.8 / 7.0 | 6.2 |
| Bassins à flot / Bacalan | Bordeaux Maritime | 5.5 / 5.2 / 7.8 / 7.2 / 7.2 / 6.4 / 6.0 | 6.2 |
| Aubiers / Le Lac | Bordeaux Maritime | 3.8 / 7.2 / 7.2 / 5.4 / 6.4 / 5.3 / 6.8 | 4.4 |
| Ginko / Bordeaux-Lac | Bordeaux Maritime | 6.4 / 5.6 / 7.2 / 5.6 / 7.0 / 5.2 / 8.0 | 6.4 |
| Bastide-Stalingrad / Jardin Botanique | La Bastide | 6.4 / 5.2 / 8.8 / 7.0 / 7.6 / 7.5 / 7.4 | 6.9 |
| Bastide-Niel / Brazza / Darwin | La Bastide | 6.0 / 5.0 / 7.8 / 7.4 / 7.0 / 6.8 / 7.0 | 6.5 |
| Benauge / Galin | La Bastide | 4.8 / 6.5 / 8.0 / 6.0 / 6.8 / 6.8 / 5.8 | 5.2 |
| Nansouty / Barrière de Toulouse | Nansouty-Saint-Genès | 7.0 / 5.0 / 7.8 / 7.5 / 8.0 / 8.0 / 6.2 | 7.0 |
| Saint-Genès / Roustaing | Nansouty-Saint-Genès | 7.8 / 3.8 / 8.0 / 7.2 / 8.2 / 8.5 / 7.0 | 7.2 |
| Saint-Augustin / Pellegrin | Saint-Augustin-Tauzin | 7.4 / 4.2 / 8.0 / 7.8 / 8.0 / 9.0 / 6.8 | 7.2 |
| Tauzin / Alphonse-Dupeux | Saint-Augustin-Tauzin | 7.2 / 4.6 / 7.8 / 7.5 / 7.6 / 9.4 / 6.5 | 7.1 |
| Caudéran centre / Primerose | Caudéran | 8.4 / 3.0 / 6.8 / 4.8 / 8.0 / 5.8 / 7.8 | 6.5 |
| Parc Bordelais / Monséjour | Caudéran | 8.6 / 2.6 / 6.4 / 4.0 / 7.6 / 5.0 / 9.4 | 6.4 |
| Stéhélin / Pins-Francs | Caudéran | 8.0 / 4.0 / 5.8 / 4.2 / 7.0 / 4.8 / 8.6 | 6.2 |
| Talence centre / Forum / Peixotto | Talence | 7.2 / 5.0 / 8.6 / 8.4 / 8.0 / 9.4 / 6.5 | 7.4 |
| Talence campus / Arts-et-Métiers / Thouars | Talence | 6.8 / 5.8 / 8.4 / 9.2 / 7.4 / 10.0 / 7.0 | 7.0 |
| Talence Médoquine / Roustaing | Talence | 7.6 / 4.8 / 8.0 / 6.8 / 7.6 / 8.2 / 7.4 | 7.2 |
| Pessac campus / Saige / Compostelle | Pessac | 5.6 / 6.4 / 8.6 / 9.2 / 7.6 / 10.0 / 6.4 | 6.2 |
| Pessac centre / Camponac | Pessac | 7.8 / 5.2 / 8.0 / 7.2 / 8.0 / 8.5 / 7.8 | 7.4 |
| Pessac Alouette / Haut-Lévêque / Bourgailh | Pessac | 8.0 / 5.6 / 7.4 / 6.2 / 7.6 / 7.2 / 8.8 | 7.3 |
| Gradignan centre / Mandavit | Gradignan | 8.2 / 5.6 / 6.8 / 6.4 / 7.6 / 8.0 / 8.8 | 7.3 |
| Gradignan campus / Beausoleil | Gradignan | 7.8 / 6.0 / 6.8 / 7.6 / 7.2 / 9.0 / 8.4 | 7.5 |
| Gradignan Malartic / Barthez | Gradignan | 7.6 / 6.0 / 5.8 / 5.4 / 6.8 / 7.2 / 8.8 | 6.8 |

## Boundary note

Neighborhood polygons are lower-certainty than commune contours unless sourced from official open data. Curated splits inside parent quartiers are marked confidence: medium.