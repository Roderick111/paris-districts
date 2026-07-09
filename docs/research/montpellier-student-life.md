# Montpellier student life scoring (district-first revision)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **14 readable zones**. Use Montpellier's official quarter structure as the base, then split the major student belts only where the map would otherwise flatten real choices. No IRIS shredding.

Boundary confidence: **high** for quarter-based groupings, **medium** for the campus and east-side splits.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Montpellier](https://fr.wikipedia.org/wiki/Montpellier)
- [Universite de Montpellier](https://www.umontpellier.fr/)
- [Universite Paul-Valery Montpellier 3](https://www.univ-montp3.fr/)
- [TAM network](https://www.tam-voyages.com/)

## Upgrade Rationale

Current draft over-sliced the city. Montpellier works better when the map follows the real student spine:

- Ecusson, Comedie, and Gare should read as distinct centre choices.
- Beaux-Arts / Boutonnet is a separate north-centre pocket, not just a generic inner ring.
- Hôpitaux-Facultés needs campus splits for Triolet and Paul-Valery / Route de Mende.
- Richter, Port Marianne, and Millenaire / Odysseum are different east-side bets.
- Mosson / Paillade and Croix d'Argent / Prés d'Arènes need honest caps, not rounded-up optimism.

## Suggested Zone Set

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Zone | Parent | Geometry target | Scores | Total |
|------|--------|-----------------|--------|-------|
| Ecusson core | Montpellier Centre | official quartier | 5.4 / 2.8 / 9.6 / 9.2 / 9.2 / 8.8 / 3.6 | 6.2 |
| Comedie / Gare | Montpellier Centre | official quartier group | 5.2 / 3.2 / 9.8 / 8.8 / 9.0 / 8.6 / 3.8 | 6.2 |
| Beaux-Arts / Boutonnet | North centre | official quartier group | 7.0 / 4.2 / 8.8 / 9.0 / 8.4 / 9.2 / 6.4 | 7.3 |
| Arceaux / Gambetta / Figuerolles | West centre | official quartier group | 5.3 / 5.2 / 8.8 / 8.4 / 8.2 / 8.0 / 4.0 | 6.2 |
| Antigone | East centre | official quartier | 6.0 / 3.6 / 9.4 / 7.8 / 9.0 / 8.6 / 4.8 | 6.5 |
| Richter / Jacques-Coeur | East campus | official quartier group | 7.0 / 4.2 / 9.0 / 7.8 / 8.2 / 9.4 / 6.6 | 7.0 |
| Port Marianne / Millenaire / Odysseum | East | official quartier group | 7.0 / 4.0 / 8.8 / 7.0 / 8.4 / 8.8 / 6.6 | 7.0 |
| Hôpitaux-Facultés / Triolet | North campus | official quartier group | 6.8 / 5.0 / 8.8 / 8.8 / 8.0 / 10.0 / 7.0 | 7.0 |
| Paul-Valery / Route de Mende | North campus | official quartier group | 6.6 / 5.2 / 8.6 / 8.4 / 7.8 / 10.0 / 7.0 | 7.0 |
| Aiguelongue / Malbosc | North-east | official quartier group | 7.4 / 4.4 / 7.8 / 6.4 / 7.4 / 8.4 / 8.4 | 7.0 |
| Croix d'Argent / Ovalie | South-west | official quartier group | 5.4 / 6.0 / 8.0 / 6.4 / 7.4 / 7.4 / 5.4 | 6.2 |
| Les Cévennes / Celleneuve | West | official quartier group | 5.2 / 6.6 / 8.0 / 6.2 / 7.0 / 6.8 / 6.0 | 6.2 |
| Mosson / Paillade | North-west cap | official quartier group | 3.6 / 7.6 / 8.2 / 5.8 / 6.6 / 6.4 / 5.4 | 4.4 |
| Prés d'Arènes / Gare Sud | South | official quartier group | 5.0 / 6.2 / 8.4 / 6.4 / 7.2 / 7.2 / 5.0 | 6.2 |

## Geometry Instructions

- Use official quartier groupings first.
- Keep Ecusson, Comedie / Gare, and Antigone distinct.
- Keep Triolet and Paul-Valery split under Hôpitaux-Facultés.
- Keep Mosson / Paillade separate from the west-centre and south zones.
- If a small pocket has weak evidence, fall back to whole-district reputation instead of inventing a micro-zone.

## Verdict

Montpellier should read as a clean centre plus clear campus belts, not a shredded IRIS map. Beaux-Arts / Boutonnet, Richter, Port Marianne, Hôpitaux-Facultés / Triolet, and Paul-Valery lead. Mosson / Paillade and the station / south caps stay honest.
