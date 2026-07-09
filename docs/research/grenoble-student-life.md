# Grenoble student life scoring (district-first revision)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **14 readable zones**. Grenoble has enough structure for a clean sector-based map, so the report should stay on official neighbourhood logic plus a few campus edges. No IRIS shards.

Boundary confidence: **high** for Grenoble proper sectors, **medium** for the suburb campus nodes.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Secteurs de Grenoble](https://fr.wikipedia.org/wiki/Secteurs_de_Grenoble)
- [Universite Grenoble Alpes](https://www.univ-grenoble-alpes.fr/)
- [Domaine universitaire de Grenoble](https://fr.wikipedia.org/wiki/Domaine_universitaire_de_Grenoble)
- [TAG network](https://www.tag.fr/)

## Upgrade Rationale

The old draft had too many tiny inner-city pockets and too many outer caps. Grenoble should follow the way students actually move:

- Hyper-centre, Notre-Dame / Mutualité, Championnet / Aigle, and Saint-Laurent / Île Verte are separate centre choices.
- Europole / Presqu'île and Chorier-Berriat / Saint-Bruno are different north-west student poles.
- Mistral / Eaux-Claires needs a real cap.
- Capuche / Alliés-Alpins, Beauvert, Jouhaux / Exposition-Bajatière, and Teisseire / Malherbe should stay distinct enough to read cleanly.
- Saint-Martin-d'Hères, Gières, La Tronche, Meylan, and Seyssinet / Fontaine are commuter edges, not hidden parts of the core city.

## Suggested Zone Set

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Zone | Parent | Geometry target | Scores | Total |
|------|--------|-----------------|--------|-------|
| Hyper-centre | Centre | official quartier | 5.8 / 3.2 / 9.7 / 9.0 / 9.2 / 8.8 / 4.2 | 6.2 |
| Notre-Dame / Mutualite | Centre-east | official quartier | 6.0 / 3.4 / 9.4 / 8.8 / 9.0 / 8.8 / 4.8 | 6.5 |
| Championnet / Aigle | Centre-west | official quartier group | 6.8 / 4.0 / 9.0 / 8.6 / 8.8 / 8.6 / 5.6 | 7.0 |
| Europole / Presqu'île | North-west campus | official quartier group | 6.4 / 4.8 / 9.0 / 7.4 / 8.2 / 9.6 / 5.8 | 6.8 |
| Chorier-Berriat / Saint-Bruno | West inner | official quartier group | 5.2 / 5.8 / 9.2 / 8.4 / 8.0 / 8.2 / 4.4 | 6.2 |
| Saint-Laurent / Île Verte | East river | official quartier group | 7.4 / 4.2 / 8.8 / 7.4 / 8.4 / 9.4 / 8.4 | 7.4 |
| Mistral / Eaux-Claires | West cap | official quartier group | 4.0 / 6.8 / 8.4 / 6.0 / 6.8 / 6.6 / 5.4 | 5.2 |
| Capuche / Alliés-Alpins | East inner | official quartier group | 5.8 / 5.6 / 8.2 / 6.8 / 7.4 / 8.0 / 6.0 | 6.2 |
| Beauvert / Cité de l'Abbaye | East | official quartier group | 6.2 / 5.4 / 8.0 / 6.8 / 7.4 / 8.0 / 6.4 | 6.2 |
| Jouhaux / Exposition-Bajatiere | South-east | official quartier group | 5.4 / 6.0 / 8.2 / 6.4 / 7.2 / 7.4 / 5.8 | 6.2 |
| Teisseire / Malherbe | South-east cap | official quartier group | 4.8 / 6.6 / 8.0 / 6.0 / 6.8 / 7.0 / 5.6 | 5.2 |
| Arlequin / Village Olympique / Vigny Musset | South | official quartier group | 4.0 / 7.4 / 8.0 / 6.0 / 6.8 / 7.0 / 5.6 | 4.4 |
| Saint-Martin-d'Heres campus core | Campus suburb | commune / campus edge | 6.8 / 6.0 / 9.2 / 9.2 / 7.8 / 10.0 / 8.4 | 7.0 |
| Gières campus | Campus suburb | commune / campus edge | 7.6 / 5.8 / 8.6 / 8.0 / 7.4 / 9.6 / 8.6 | 7.8 |

## Geometry Instructions

- Use official Grenoble sector logic first.
- Keep Saint-Laurent / Île Verte, Europole / Presqu'île, and Chorier-Berriat / Saint-Bruno separate.
- Keep Mistral / Eaux-Claires, Teisseire / Malherbe, and the south campus belt as visible caps.
- Use commune-edge nodes only for student commuter places that clearly matter.

## Verdict

Grenoble should read as a dense urban/campus map with strong centre-to-campus structure. Gières, Saint-Martin-d'Hères, La Tronche, Île Verte, and Europole lead. Mistral, Eaux-Claires, Teisseire, and the south cap zones stay honest.
