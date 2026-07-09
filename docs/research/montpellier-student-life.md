# Montpellier student life scoring (granularity upgrade)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **21 student-relevant micro-areas**. Use IRIS-backed groups around centre, north campus, Richter/Port Marianne, west cap zones, and south-west commute zones.

Boundary confidence: **medium/high** after IRIS mapping, **medium** for lived-neighbourhood labels.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Universite de Montpellier](https://www.umontpellier.fr/)
- [Universite Paul-Valery Montpellier 3](https://www.univ-montp3.fr/)
- [TAM tram/bus network](https://www.tam-voyages.com/)
- [Montpellier quartier context](https://fr.wikipedia.org/wiki/Montpellier)

## Upgrade Rationale

Current 10-area draft hides the strongest student geography:

- Ecusson, Comedie, Gare, Antigone, and Figuerolles/Gambetta need separate centre profiles.
- Beaux-Arts and Boutonnet are both strong but not identical.
- Hôpitaux-Facultés must split into Triolet/Fac des Sciences, Paul-Valery/Route de Mende, Occitanie, and Aiguelongue.
- Richter, Port Marianne, and Millenaire/Odysseum are different east-side choices.
- Mosson, Paillade, Celleneuve, Croix d'Argent, and Pres d'Arenes need distinct caps.

## Micro Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Geometry target | Scores | Total |
|------------|--------|-----------------|--------|-------|
| Ecusson core | Centre | IRIS group | 5.3 / 2.7 / 9.5 / 9.2 / 9.3 / 8.8 / 3.6 | 6.2 |
| Comedie / Polygone | Centre east | IRIS group | 5.4 / 2.8 / 9.7 / 8.6 / 9.2 / 8.6 / 3.8 | 6.2 |
| Gare Saint-Roch | Station core | IRIS group | 5.0 / 3.8 / 9.8 / 8.2 / 8.8 / 8.4 / 3.6 | 5.2 |
| Antigone | Centre east | IRIS group | 6.0 / 3.4 / 9.4 / 7.8 / 9.0 / 8.6 / 4.8 | 6.5 |
| Beaux-Arts | North centre | IRIS group | 7.0 / 4.4 / 8.8 / 9.3 / 8.5 / 9.2 / 6.3 | 7.4 |
| Boutonnet | North centre | IRIS group | 7.1 / 4.3 / 8.7 / 8.8 / 8.3 / 9.1 / 6.7 | 7.3 |
| Les Aubes / Pompignane | East inner | IRIS group | 6.6 / 4.8 / 8.2 / 7.0 / 7.8 / 8.0 / 6.4 | 6.8 |
| Triolet / Fac des Sciences | North campus | IRIS group | 6.7 / 5.0 / 8.9 / 9.0 / 8.0 / 10.0 / 7.0 | 7.0 |
| Paul-Valery / Route de Mende | North campus | IRIS group | 6.6 / 5.2 / 8.8 / 8.8 / 7.8 / 10.0 / 7.0 | 7.0 |
| Occitanie / Hopitaux | North campus | IRIS group | 6.8 / 5.0 / 8.8 / 8.3 / 8.0 / 9.6 / 7.0 | 7.0 |
| Aiguelongue | North-east | IRIS group | 7.6 / 4.0 / 7.8 / 6.4 / 7.4 / 8.4 / 8.6 | 7.0 |
| Richter | East campus | IRIS group | 7.0 / 4.2 / 9.0 / 7.8 / 8.2 / 9.4 / 6.6 | 7.3 |
| Port Marianne | East | IRIS group | 7.2 / 3.7 / 8.8 / 7.1 / 8.3 / 8.8 / 6.8 | 7.0 |
| Millenaire / Odysseum | East edge | IRIS group | 6.4 / 4.6 / 8.2 / 6.8 / 8.0 / 8.0 / 6.2 | 6.6 |
| Figuerolles | West centre | IRIS group | 4.8 / 5.8 / 8.7 / 8.8 / 7.8 / 8.0 / 3.8 | 5.2 |
| Gambetta / Clemenceau | West centre | IRIS group | 5.2 / 5.4 / 9.0 / 8.6 / 8.2 / 8.2 / 4.0 | 6.2 |
| Celleneuve | West | IRIS group | 5.2 / 6.8 / 8.0 / 6.2 / 7.0 / 6.8 / 6.0 | 6.2 |
| Mosson | North-west | IRIS group | 3.6 / 7.6 / 8.4 / 6.0 / 6.8 / 6.8 / 5.6 | 4.4 |
| Paillade | North-west | IRIS group | 3.4 / 7.8 / 8.2 / 5.6 / 6.4 / 6.4 / 5.4 | 4.4 |
| Croix d'Argent | South-west | IRIS group | 5.5 / 6.1 / 8.1 / 6.5 / 7.5 / 7.4 / 5.5 | 6.2 |
| Pres d'Arenes | South | IRIS group | 5.1 / 6.5 / 8.5 / 6.4 / 7.2 / 7.3 / 5.0 | 6.2 |

## Geometry Instructions

- Use IRIS groups for all 21 rows.
- Keep Mosson and Paillade separate.
- Keep Beaux-Arts, Boutonnet, Triolet, Paul-Valery, and Occitanie separate; one north-campus blob is not acceptable.

## Verdict

Montpellier should show a strong north-campus arc, a split centre, and explicit west/north-west caps. Beaux-Arts, Boutonnet, Triolet, Paul-Valery, Richter, and Port Marianne lead. Mosson/Paillade and station/west-centre friction remain capped.
