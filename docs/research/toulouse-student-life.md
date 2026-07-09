# Toulouse student life scoring (granularity upgrade)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: replace the current 10 broad polygons with **21 student-relevant micro-areas**. Use official Toulouse quartier polygons only as parent context. Final map geometry should be IRIS-backed or official quartier-split where IRIS import is not available.

Boundary confidence: **medium/high** after IRIS mapping, **medium** for manual quartier splits. INSEE IRIS is the preferred unit because it is the stable infra-communal base for local statistics and usually represents a small, homogeneous area.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Toulouse Metropole quartiers de democratie locale](https://data.toulouse-metropole.fr/explore/dataset/quartiers-de-democratie-locale/)
- [Tisseo network context](https://www.tisseo.fr/)
- [Universite Toulouse Capitole](https://www.ut-capitole.fr/)
- [Universite Toulouse III Paul Sabatier](https://www.univ-tlse3.fr/)
- [Universite Toulouse Jean Jaures](https://www.univ-tlse2.fr/)

## Upgrade Rationale

Current map hides useful distinctions:

- Capitole/Carmes/Esquirol is too broad: Carmes is a different student choice from hyper-centre shopping/nightlife.
- Arnaud-Bernard/Saint-Sernin should stay capped separately from calmer Compans and Chalets.
- Saint-Michel, Saint-Agne, Empalot, and Rangueil need separate polygons; current south split is too blunt.
- Mirail, Reynerie, and Bellefontaine should not be one undifferentiated orange blob.
- Minimes, Barriere de Paris, and La Vache need separate practical-rent profiles.

## Micro Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Geometry target | Scores | Total |
|------------|--------|-----------------|--------|-------|
| Capitole | Centre | IRIS group | 5.7 / 2.2 / 9.8 / 9.0 / 9.5 / 8.7 / 3.8 | 6.2 |
| Carmes / Esquirol | Centre | IRIS group | 6.1 / 2.3 / 9.6 / 8.8 / 9.4 / 8.7 / 4.2 | 6.5 |
| Arnaud-Bernard | Centre | IRIS group | 4.7 / 4.3 / 9.1 / 9.5 / 8.4 / 9.1 / 3.6 | 5.2 |
| Saint-Sernin | Centre | IRIS group | 5.4 / 3.8 / 8.9 / 8.8 / 8.6 / 9.0 / 4.0 | 6.2 |
| Compans-Caffarelli | Centre north | IRIS group | 6.7 / 3.6 / 9.0 / 7.6 / 8.6 / 8.2 / 6.4 | 6.8 |
| Amidonniers | Centre north | IRIS group | 7.0 / 4.1 / 8.2 / 6.8 / 7.8 / 7.7 / 7.6 | 6.9 |
| Chalets | Centre north-east | IRIS group | 6.6 / 3.5 / 8.9 / 8.0 / 8.3 / 8.1 / 5.4 | 6.8 |
| Bayard / Matabiau edge | Station edge | IRIS group | 5.0 / 4.4 / 9.4 / 8.0 / 8.2 / 8.4 / 3.6 | 5.2 |
| Saint-Aubin / Dupuy | Centre east | IRIS group | 6.0 / 3.7 / 9.0 / 8.6 / 8.7 / 8.2 / 4.8 | 6.6 |
| Saint-Cyprien | Rive gauche | IRIS group | 6.8 / 4.8 / 8.9 / 8.7 / 8.4 / 8.1 / 6.1 | 7.1 |
| Patte-d'Oie | Rive gauche | IRIS group | 6.4 / 5.2 / 8.7 / 7.6 / 7.8 / 7.8 / 6.0 | 6.8 |
| Saint-Michel | Centre south | IRIS group | 5.2 / 5.4 / 8.9 / 8.6 / 8.1 / 8.7 / 4.3 | 6.2 |
| Saint-Agne | Centre south | IRIS group | 6.0 / 5.5 / 8.6 / 7.6 / 7.8 / 8.8 / 5.6 | 6.7 |
| Empalot | South | IRIS group | 4.3 / 7.0 / 8.1 / 6.0 / 6.8 / 8.0 / 5.0 | 5.2 |
| Rangueil campus | South-east campus | IRIS group | 7.1 / 5.5 / 8.5 / 8.7 / 7.7 / 10.0 / 7.2 | 7.6 |
| Sauzelong / Jules-Julien | South-east | IRIS group | 6.8 / 5.8 / 8.6 / 7.8 / 7.8 / 9.2 / 6.7 | 7.2 |
| Mirail Universite | South-west campus | IRIS group | 4.2 / 7.2 / 8.2 / 7.0 / 6.9 / 9.0 / 5.8 | 5.2 |
| Reynerie | South-west | IRIS group | 3.5 / 7.6 / 8.0 / 6.2 / 6.4 / 8.4 / 5.5 | 4.4 |
| Bellefontaine | South-west | IRIS group | 3.7 / 7.4 / 7.8 / 6.0 / 6.5 / 8.0 / 5.4 | 4.4 |
| Minimes | North | IRIS group | 6.1 / 5.5 / 8.5 / 7.1 / 7.8 / 7.2 / 5.9 | 6.5 |
| Barriere de Paris / La Vache | North | IRIS group | 5.5 / 6.0 / 8.7 / 6.8 / 7.4 / 7.1 / 5.7 | 6.2 |

## Geometry Instructions

- Preferred: load Toulouse IRIS polygons, then group listed IRIS into each micro-area.
- Fallback: split official quartier polygons only for centre and south areas where the split follows clear roads/metro corridors.
- Reject any geometry that merges non-adjacent student choices, especially Mirail/Reynerie/Bellefontaine and Saint-Michel/Saint-Agne/Empalot.

## Verdict

Toulouse should become a south-east campus plus centre-neighbourhood map, not a 10-zone administrative overlay. Rangueil, Saint-Cyprien, Carmes, Compans, and Saint-Agne should read as credible student picks. Arnaud-Bernard, Matabiau edge, Empalot, Reynerie, and Bellefontaine need visible caps.
