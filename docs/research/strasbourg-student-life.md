# Strasbourg student life scoring (granularity upgrade)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **20 student-relevant micro-areas**. Use Strasbourg functional quartiers as parents and IRIS-backed groups for final map areas. Esplanade, Krutenau, Gare, Neustadt, Cronenbourg, Hautepierre, Neuhof, and Illkirch must stay separate.

Boundary confidence: **medium/high** after IRIS mapping, **medium** for official/functional quartier groupings.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Quartiers de Strasbourg context](https://fr.wikipedia.org/wiki/Quartiers_de_Strasbourg)
- [Strasbourg quartier/IRIS correspondence context](https://fr.wikipedia.org/wiki/Liste_des_voies_de_Strasbourg)
- [Universite de Strasbourg](https://www.unistra.fr/)
- [CTS tram/bus network](https://www.cts-strasbourg.eu/)

## Upgrade Rationale

Current 10-area draft is readable but too blunt:

- Grande Ile, Petite France, Gare/Kleber, and Faubourg National have different late-night and rent profiles.
- Krutenau and Esplanade are adjacent but materially different student choices.
- Neustadt, Contades, Orangerie, and Conseil des XV should not be one premium-safe block.
- Cronenbourg campus, Hautepierre, Koenigshoffen/Elsau, Meinau, and Neuhof need separate cap/comfort handling.
- Illkirch campus is essential and should not be treated as an optional suburb.

## Micro Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Geometry target | Scores | Total |
|------------|--------|-----------------|--------|-------|
| Grande Ile core | Centre | IRIS group | 5.8 / 2.6 / 9.7 / 8.8 / 9.4 / 8.8 / 4.4 | 6.2 |
| Petite France / Finkwiller | Centre west | IRIS group | 6.2 / 2.8 / 9.3 / 8.0 / 8.8 / 8.4 / 5.4 | 6.5 |
| Gare / Kleber | Station core | IRIS group | 4.8 / 5.2 / 9.7 / 8.0 / 8.3 / 8.3 / 3.7 | 5.2 |
| Faubourg National | Station edge | IRIS group | 4.6 / 5.8 / 9.3 / 8.2 / 8.0 / 8.2 / 3.6 | 5.2 |
| Krutenau | Centre east | IRIS group | 6.0 / 4.2 / 9.0 / 9.4 / 8.4 / 9.6 / 4.6 | 7.0 |
| Esplanade campus | Campus central | IRIS group | 6.4 / 5.0 / 9.2 / 9.2 / 8.2 / 10.0 / 6.2 | 7.0 |
| Orangerie / Conseil des XV | East premium | IRIS group | 7.8 / 2.8 / 8.4 / 6.2 / 8.4 / 8.0 / 8.8 | 7.0 |
| Neustadt | North centre | IRIS group | 7.4 / 3.2 / 8.8 / 6.9 / 8.8 / 8.3 / 7.8 | 7.2 |
| Contades / Wacken | North centre | IRIS group | 7.6 / 3.1 / 8.8 / 6.5 / 8.6 / 8.0 / 8.0 | 7.1 |
| Robertsau | North-east | IRIS group | 8.0 / 3.4 / 7.4 / 5.8 / 7.8 / 6.8 / 9.0 | 6.8 |
| Neudorf / Etoile | South-east | IRIS group | 6.8 / 5.2 / 8.8 / 7.4 / 8.0 / 8.2 / 6.6 | 7.0 |
| Musau / Port du Rhin | East edge | IRIS group | 5.0 / 6.4 / 7.8 / 6.1 / 6.8 / 7.0 / 5.4 | 5.2 |
| Meinau | South | IRIS group | 5.2 / 6.3 / 8.0 / 6.2 / 7.0 / 7.0 / 5.8 | 6.2 |
| Neuhof | South | IRIS group | 3.6 / 7.4 / 7.4 / 5.2 / 6.4 / 5.8 / 5.8 | 4.4 |
| Cronenbourg campus | West campus | IRIS group | 5.6 / 6.2 / 7.8 / 7.0 / 7.2 / 9.0 / 6.0 | 6.2 |
| Hautepierre | West | IRIS group | 4.0 / 7.2 / 8.2 / 5.8 / 6.8 / 6.8 / 5.2 | 5.2 |
| Poteries / Hohberg | West | IRIS group | 5.0 / 6.8 / 7.6 / 5.8 / 6.8 / 6.4 / 5.8 | 5.2 |
| Koenigshoffen / Elsau | West-south | IRIS group | 4.9 / 6.8 / 7.8 / 6.0 / 6.9 / 6.6 / 5.6 | 5.2 |
| Montagne Verte | South-west | IRIS group | 5.8 / 6.0 / 7.8 / 6.2 / 7.0 / 6.8 / 6.8 | 6.2 |
| Illkirch campus | South campus | IRIS/commune group | 7.6 / 5.8 / 8.0 / 7.6 / 7.4 / 10.0 / 8.4 | 7.7 |

## Geometry Instructions

- Preferred: IRIS groups for all 20 rows, using Strasbourg quartier correspondence as parent labels.
- Include Illkirch campus as a required campus suburb.
- Do not combine Esplanade, Krutenau, Grande Ile, and Gare. They are adjacent but not interchangeable student choices.

## Verdict

Strasbourg should read as a compact student core plus precise west/south cap zones. Illkirch, Neustadt/Contades, Esplanade, Krutenau, and Neudorf lead. Gare/Faubourg National, Hautepierre, Koenigshoffen/Elsau, and Neuhof need visible caps.
