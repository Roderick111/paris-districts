# Rennes student life scoring (granularity upgrade)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **20 student-relevant micro-areas**. Use Rennes administrative quartiers as parents and IRIS-backed groups for final areas, especially around centre, Villejean, Beaulieu, Cleunay, Maurepas, Blosne, and Baud-Chardonnet.

Boundary confidence: **medium/high** after IRIS mapping, **medium** for lived-area groupings.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Quartiers de Rennes context](https://fr.wikipedia.org/wiki/Quartiers_de_Rennes)
- [Universite de Rennes](https://www.univ-rennes.fr/)
- [Rennes 2](https://www.univ-rennes2.fr/)
- [STAR metro/bus network](https://www.star.fr/)

## Upgrade Rationale

Current 10-area draft is too averaged:

- Centre/Sainte-Anne/Republique and Colombier/Charles de Gaulle need split central profiles.
- Thabor, Saint-Helier, Jeanne d'Arc, Longs-Champs, and Beaulieu are different east-side choices.
- Villejean campus should split from Beauregard and Pontchaillou.
- Maurepas, Patton, Blosne, and Triangle must keep visible caps.
- Cleunay, Arsenal-Redon, La Courrouze, and Baud-Chardonnet are distinct modern/value corridors.

## Micro Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Geometry target | Scores | Total |
|------------|--------|-----------------|--------|-------|
| Sainte-Anne / Centre nord | Centre | IRIS group | 6.2 / 3.5 / 9.6 / 9.4 / 9.2 / 9.0 / 4.4 | 7.0 |
| Republique / Centre sud | Centre | IRIS group | 6.5 / 3.3 / 9.8 / 9.0 / 9.3 / 8.9 / 4.6 | 7.0 |
| Colombier / Charles de Gaulle | Centre south | IRIS group | 6.6 / 4.0 / 9.6 / 8.2 / 9.0 / 8.4 / 4.8 | 7.0 |
| Thabor | East centre | IRIS group | 8.1 / 3.0 / 8.6 / 7.0 / 8.6 / 8.2 / 9.0 | 7.4 |
| Saint-Helier | East centre | IRIS group | 7.5 / 3.5 / 9.0 / 7.4 / 8.7 / 8.5 / 7.8 | 7.3 |
| Jeanne d'Arc | North-east | IRIS group | 7.4 / 4.5 / 8.4 / 7.0 / 7.8 / 8.4 / 7.4 | 7.1 |
| Longs-Champs | North-east | IRIS group | 7.3 / 4.8 / 8.0 / 6.6 / 7.6 / 8.0 / 7.8 | 7.0 |
| Beaulieu campus | East campus | IRIS group | 7.0 / 5.4 / 8.8 / 8.6 / 7.8 / 10.0 / 7.8 | 7.6 |
| Atalante / Cesson edge | East campus | IRIS group | 7.2 / 5.2 / 8.4 / 7.6 / 7.4 / 9.2 / 8.0 | 7.2 |
| Villejean Universite | West campus | IRIS group | 5.8 / 6.2 / 9.2 / 8.4 / 7.8 / 10.0 / 6.0 | 6.2 |
| Pontchaillou | West medical | IRIS group | 6.2 / 5.8 / 9.0 / 7.4 / 7.8 / 9.0 / 6.2 | 6.8 |
| Beauregard | North-west | IRIS group | 6.6 / 5.6 / 8.0 / 6.4 / 7.2 / 7.6 / 7.0 | 6.8 |
| Cleunay | West inner | IRIS group | 6.0 / 5.8 / 8.4 / 7.0 / 7.6 / 7.0 / 6.4 | 6.7 |
| Arsenal-Redon | West inner | IRIS group | 6.4 / 5.0 / 8.5 / 7.0 / 7.8 / 7.2 / 6.8 | 6.8 |
| La Courrouze | South-west | IRIS group | 6.6 / 5.4 / 8.6 / 6.8 / 7.4 / 7.2 / 7.0 | 6.8 |
| Maurepas | North | IRIS group | 4.8 / 6.8 / 8.4 / 6.2 / 7.2 / 7.0 / 6.0 | 5.2 |
| Patton / Gayeulles edge | North | IRIS group | 5.6 / 6.2 / 8.2 / 6.0 / 7.2 / 6.8 / 7.2 | 6.2 |
| Blosne | South | IRIS group | 4.2 / 7.2 / 9.0 / 6.0 / 7.0 / 7.0 / 5.8 | 5.2 |
| Triangle / Italie | South | IRIS group | 4.8 / 6.8 / 9.0 / 6.4 / 7.2 / 7.2 / 5.6 | 5.2 |
| Baud-Chardonnet | East redevelopment | IRIS group | 6.8 / 5.0 / 8.2 / 6.8 / 7.4 / 7.0 / 7.2 | 6.8 |

## Geometry Instructions

- Use IRIS groups for all 20 rows.
- Keep Villejean Universite, Pontchaillou, and Beauregard separate.
- Keep Beaulieu and Atalante/Cesson edge separate.
- Keep Maurepas/Patton and Blosne/Triangle as distinct cap zones.

## Verdict

Rennes should read as a strong compact student city with separate campus and cap-zone logic. Beaulieu, Thabor, Saint-Helier, Sainte-Anne/Republique, and Jeanne d'Arc lead. Villejean is useful but capped. Blosne and Maurepas stay honest.
