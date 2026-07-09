# Strasbourg student life scoring (district-first revision)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **16 readable zones**. Use Strasbourg functional quartiers as the backbone, then keep Illkirch as a separate commuter campus edge. No IRIS-first splitting unless a district has a real internal student divide.

Boundary confidence: **high** for official quartier groupings, **medium** for the Illkirch commuter edge.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Quartiers de Strasbourg](https://fr.wikipedia.org/wiki/Quartiers_de_Strasbourg)
- [Universite de Strasbourg](https://www.unistra.fr/)
- [CTS Strasbourg network](https://www.cts-strasbourg.eu/)

## Upgrade Rationale

Current draft was too fragmented for the real city shape. This revision keeps readable student districts and avoids fake precision:

- Bourse / Esplanade / Krutenau must stay readable as one east-centre student belt.
- Gare / Tribunal and Centre-ville / Petite France need separate centre logic.
- Neustadt, Orangerie, Conseil des XV, and Robertsau/Wacken are premium north-east choices, but not one blob.
- Cronenbourg, Hautepierre, Koenigshoffen, Montagne Verte, Elsau, and Neuhof need clear caps.
- Illkirch belongs as a commuter campus edge, not as a hidden city centre substitute.

## Suggested Zone Set

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Zone | Parent | Geometry target | Scores | Total |
|------|--------|-----------------|--------|-------|
| Bourse / Esplanade / Krutenau | Centre-east | official quartier group | 6.2 / 4.0 / 9.4 / 9.2 / 8.8 / 9.6 / 5.0 | 7.0 |
| Centre-ville / Petite France | Centre | official quartier | 6.0 / 3.0 / 9.6 / 8.4 / 9.0 / 8.6 / 4.8 | 6.5 |
| Gare / Tribunal | Station core | official quartier | 4.8 / 5.0 / 9.8 / 7.8 / 8.2 / 8.0 / 3.8 | 5.2 |
| Orangerie / Conseil des XV | North-east premium | official quartier group | 7.8 / 3.0 / 8.5 / 6.4 / 8.4 / 8.0 / 8.8 | 7.2 |
| Robertsau / Wacken | North-east | official quartier group | 8.0 / 3.6 / 7.4 / 5.8 / 7.8 / 7.0 / 9.0 | 6.8 |
| Cronenbourg campus | West campus | official quartier group | 5.6 / 6.0 / 7.8 / 7.2 / 7.4 / 9.0 / 6.0 | 6.2 |
| Hautepierre / Poteries | West cap | official quartier group | 4.0 / 7.2 / 8.0 / 5.8 / 6.8 / 6.6 / 5.2 | 5.2 |
| Koenigshoffen | West-south | official quartier | 5.0 / 6.6 / 7.8 / 6.2 / 6.8 / 6.6 / 5.8 | 5.2 |
| Montagne Verte | South-west | official quartier | 5.6 / 6.0 / 7.6 / 6.2 / 6.8 / 6.6 / 6.4 | 6.2 |
| Elsau | South-west cap | official quartier | 4.8 / 6.8 / 7.4 / 5.8 / 6.6 / 6.0 / 5.4 | 5.2 |
| Meinau | South | official quartier | 5.4 / 6.2 / 8.0 / 6.6 / 7.0 / 7.0 / 5.8 | 6.2 |
| Neudorf / Musau | South-east | official quartier group | 6.8 / 5.0 / 8.8 / 7.4 / 8.0 / 8.0 / 6.4 | 7.0 |
| Port du Rhin | East edge | official quartier | 5.0 / 6.4 / 7.8 / 6.2 / 6.8 / 7.0 / 5.2 | 5.2 |
| Neuhof 1 | South cap | official quartier | 3.8 / 7.4 / 7.2 / 5.0 / 6.2 / 5.6 / 5.6 | 4.4 |
| Neuhof 2 / Stockfeld / Ganzau | South cap | official quartier group | 4.2 / 7.2 / 7.0 / 5.2 / 6.2 / 5.8 / 6.0 | 4.4 |
| Illkirch campus | Campus suburb | commune / campus edge | 7.6 / 5.8 / 8.2 / 7.6 / 7.6 / 10.0 / 8.4 | 7.7 |

## Geometry Instructions

- Use official quartier groups first.
- Keep Bourse / Esplanade / Krutenau, Gare / Tribunal, and Centre-ville / Petite France separate.
- Keep Neuhof as two cap zones, not one huge south blob.
- Treat Illkirch as a commuter campus edge, not a city-centre proxy.

## Verdict

Strasbourg should read as a compact student core with clear premium, campus, and cap-zone edges. Bourse / Esplanade / Krutenau, Centre-ville / Petite France, Orangerie / Conseil des XV, and Illkirch lead. Hautepierre, Koenigshoffen, Elsau, and Neuhof stay visibly capped.
