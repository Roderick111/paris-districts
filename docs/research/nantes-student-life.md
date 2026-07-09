# Nantes student life scoring (granularity upgrade)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: replace the current 10 broad administrative quartiers with **22 student-relevant micro-areas**. Use Nantes quartier polygons as parents and IRIS/micro-quartier groups for actual map areas.

Boundary confidence: **medium/high** after IRIS mapping, **medium** for official quartier parents. Nantes has broad administrative quartiers; a student map needs centre, Hauts-Paves/Saint-Felix, university north, island, east, and west cap zones separated.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Nantes Metropole quartier polygons](https://data.nantesmetropole.fr/explore/dataset/244400404_quartiers-communes-nantes-metropole/)
- [Nantes Universite](https://www.univ-nantes.fr/)
- [Naolib transport](https://naolib.fr/)

## Upgrade Rationale

Current map is too coarse:

- Centre-ville should split Decre/Bouffay, Commerce/Graslin, and Talensac.
- Hauts-Paves/Saint-Felix should split Saint-Felix/Michelet from Hauts-Paves/Talensac edge.
- Nantes Nord should split Facultes/Petit-Port, Joneliere, and Bout des Landes/North cap edge.
- Ile de Nantes west/east should be separate because student usefulness and comfort differ.
- Bellevue, Dervallieres, Breil, Chantenay, and Sainte-Anne need separate caps/comfort profiles.
- Chantrerie/Erdre is a specific campus-green option, not all Nantes Erdre.

## Micro Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Geometry target | Scores | Total |
|------------|--------|-----------------|--------|-------|
| Decre / Bouffay | Centre-ville | IRIS group | 5.8 / 3.1 / 9.7 / 9.4 / 9.2 / 8.4 / 3.8 | 6.2 |
| Commerce / Graslin | Centre-ville | IRIS group | 6.4 / 2.7 / 9.7 / 9.0 / 9.4 / 8.3 / 4.2 | 6.9 |
| Talensac / Viarme | Centre north | IRIS group | 6.7 / 3.8 / 9.0 / 8.4 / 8.7 / 8.6 / 5.6 | 7.0 |
| Hauts-Paves | Hauts-Paves - Saint-Felix | IRIS group | 7.1 / 4.2 / 8.6 / 8.1 / 8.1 / 9.0 / 6.6 | 7.2 |
| Saint-Felix / Michelet | Hauts-Paves - Saint-Felix | IRIS group | 7.3 / 4.4 / 8.6 / 8.6 / 8.2 / 9.6 / 7.0 | 7.4 |
| Facultes / Petit-Port | Nantes Nord | IRIS group | 6.5 / 5.6 / 8.6 / 8.8 / 7.8 / 10.0 / 7.6 | 7.2 |
| Joneliere | Nantes Nord | IRIS group | 6.8 / 5.8 / 8.2 / 8.2 / 7.4 / 9.8 / 8.2 | 7.2 |
| Bout des Landes / Boissiere | Nantes Nord | IRIS group | 5.2 / 6.7 / 7.8 / 6.2 / 6.8 / 8.2 / 6.8 | 6.2 |
| Chantrerie / Gachet | Nantes Erdre | IRIS group | 7.2 / 5.2 / 7.2 / 7.3 / 7.3 / 9.5 / 8.8 | 7.2 |
| Saint-Joseph de Porterie | Nantes Erdre | IRIS group | 7.0 / 5.6 / 7.4 / 6.6 / 7.2 / 8.2 / 8.0 | 6.9 |
| Ile de Nantes west | Ile de Nantes | IRIS group | 6.8 / 4.0 / 8.7 / 8.1 / 8.1 / 8.2 / 6.7 | 7.0 |
| Ile de Nantes east | Ile de Nantes | IRIS group | 6.4 / 4.5 / 8.5 / 7.5 / 7.8 / 7.8 / 6.6 | 6.8 |
| Malakoff | Malakoff - Saint-Donatien | IRIS group | 4.8 / 6.4 / 8.8 / 6.8 / 7.4 / 8.0 / 5.4 | 5.2 |
| Saint-Donatien | Malakoff - Saint-Donatien | IRIS group | 6.8 / 4.8 / 8.6 / 7.2 / 8.2 / 7.8 / 6.2 | 6.9 |
| Dervallieres | Dervallieres - Zola | IRIS group | 4.8 / 6.6 / 7.8 / 6.0 / 7.0 / 6.8 / 6.2 | 5.2 |
| Zola | Dervallieres - Zola | IRIS group | 6.0 / 5.2 / 8.2 / 7.2 / 8.0 / 7.2 / 6.6 | 6.5 |
| Chantenay / Sainte-Anne | Bellevue - Chantenay - Sainte-Anne | IRIS group | 6.0 / 5.4 / 8.0 / 7.1 / 7.7 / 7.0 / 7.2 | 6.5 |
| Bellevue | Bellevue - Chantenay - Sainte-Anne | IRIS group | 4.3 / 7.0 / 8.1 / 6.3 / 7.0 / 7.1 / 6.0 | 5.2 |
| Breil | Breil - Barberie | IRIS group | 4.9 / 6.3 / 7.6 / 5.8 / 7.0 / 6.6 / 6.8 | 5.2 |
| Barberie | Breil - Barberie | IRIS group | 6.2 / 5.4 / 7.7 / 6.4 / 7.4 / 6.8 / 7.0 | 6.5 |
| Doulon | Doulon - Bottiere | IRIS group | 6.0 / 5.8 / 8.0 / 6.6 / 7.5 / 7.0 / 6.8 | 6.5 |
| Bottiere | Doulon - Bottiere | IRIS group | 5.2 / 6.6 / 8.3 / 6.2 / 7.1 / 7.0 / 6.4 | 6.2 |

## Geometry Instructions

- Use Nantes quartier polygons only as parent coverage, not final granularity.
- Prefer IRIS groups for all 22 rows.
- Keep Nantes Nord split into university-good and north-edge mixed zones.
- Keep Bellevue, Breil, and Malakoff capped separately; do not hide them in broad parent quartiers.

## Verdict

Nantes should show a strong north/university axis plus centre and island choices. Saint-Felix/Michelet, Facultes/Petit-Port, Joneliere, Talensac, and Chantrerie should lead. Bellevue, Dervallieres, Breil, and Malakoff need visible caps.
