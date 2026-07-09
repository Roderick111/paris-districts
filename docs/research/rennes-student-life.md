# Rennes student life scoring (district-first revision)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **12 readable zones**. Rennes already has a usable official quartier structure, so the map should follow that instead of over-splitting into IRIS fragments.

Boundary confidence: **high** for official quartiers, **medium** for the campus-heavy east and west edges.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Quartiers de Rennes](https://fr.wikipedia.org/wiki/Quartiers_de_Rennes)
- [Universite de Rennes](https://www.univ-rennes.fr/)
- [Rennes 2](https://www.univ-rennes2.fr/)
- [STAR network](https://www.star.fr/)

## Upgrade Rationale

The old draft was too detailed for the actual city structure. Rennes works best when the map stays close to official quartiers:

- Centre, Thabor / Saint-Hélier / Alphonse Guérin, and Bourg-l'Évesque / La Touche / Moulin du Comte are the core city choices.
- Villejean / Beauregard and Beaulieu are separate campus poles.
- Maurepas / Patton and Le Blosne need real caps.
- Cleunay / Arsenal-Redon, Sud-Gare, and La Pommeraie are distinct enough to deserve their own rows.

## Suggested Zone Set

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Zone | Parent | Geometry target | Scores | Total |
|------|--------|-----------------|--------|-------|
| Centre | Centre | official quartier | 6.4 / 3.4 / 9.8 / 9.2 / 9.2 / 8.8 / 4.4 | 7.0 |
| Thabor / Saint-Helier / Alphonse Guérin | East centre | official quartier | 7.8 / 3.2 / 9.0 / 7.8 / 8.8 / 8.6 / 8.0 | 7.4 |
| Bourg-l'Évesque / La Touche / Moulin du Comte | West centre | official quartier | 6.4 / 4.2 / 8.8 / 7.6 / 8.2 / 8.4 / 6.0 | 6.8 |
| Nord / Saint-Martin | North | official quartier | 6.2 / 4.8 / 8.6 / 6.8 / 7.8 / 7.8 / 6.6 | 6.2 |
| Maurepas / Patton | North cap | official quartier | 4.8 / 6.8 / 8.2 / 6.0 / 7.0 / 6.8 / 6.0 | 5.2 |
| Jeanne d'Arc / Longs-Champs / Beaulieu | North-east campus | official quartier | 7.2 / 4.8 / 8.6 / 7.4 / 7.8 / 9.4 / 7.6 | 7.0 |
| La Pommeraie | East-south | official quartier | 7.2 / 4.2 / 7.4 / 6.2 / 7.4 / 7.2 / 7.6 | 6.8 |
| Sud-Gare | South centre | official quartier | 6.0 / 5.0 / 9.2 / 7.6 / 8.2 / 8.0 / 5.8 | 6.2 |
| Cleunay / Arsenal-Redon | West inner | official quartier | 6.2 / 5.2 / 8.6 / 7.2 / 7.8 / 7.4 / 6.4 | 6.2 |
| Villejean / Beauregard | West campus | official quartier | 5.8 / 6.2 / 9.0 / 8.2 / 7.6 / 10.0 / 6.0 | 6.2 |
| Le Blosne | South cap | official quartier | 4.2 / 7.0 / 8.8 / 6.0 / 6.8 / 6.8 / 5.6 | 5.2 |
| Brequigny | South-west | official quartier | 5.0 / 6.4 / 8.4 / 6.4 / 7.2 / 7.0 / 5.8 | 6.2 |

## Geometry Instructions

- Use official quartier boundaries first.
- Keep Villejean / Beauregard, Beaulieu, Maurepas / Patton, and Le Blosne separate.
- If a neighbourhood lacks stronger evidence than its parent quartier, keep the parent quartier score and stop there.
- Do not split Rennes into IRIS shards just because the polygons exist.

## Verdict

Rennes should read as a compact student city with clear campus poles and visible cap zones. Thabor / Saint-Hélier / Alphonse Guérin, Beaulieu, Centre, and Sud-Gare lead. Maurepas / Patton and Le Blosne stay capped. Villejean is useful, but only as a quartier, not as a shredded micro-map.
