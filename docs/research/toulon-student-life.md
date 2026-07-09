# Toulon student life scoring (district-first revision)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **12 readable zones**. Toulon is not dense enough for tiny student shards, so the map should lean on the city's broad quarter structure and only add campus or commute edges where they matter.

Boundary confidence: **medium/high** for city quarters, **medium** for the campus and outer-commute edges.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Quartiers de Toulon](https://fr.wikipedia.org/wiki/Quartiers_de_Toulon)
- [Universite de Toulon](https://www.univ-tln.fr/)
- [Reseau Mistral](https://www.reseaumistral.com/)

## Upgrade Rationale

The old draft was too generic in the centre and too granular in the outskirts. Toulon should stay coarse:

- Ville-haute, Ville-basse, and La Rode / Mayol need separate centre logic.
- Mourillon and La Mitre are not the same east-coast choice.
- Saint-Jean-du-Var / Font-Pré, Sainte-Musse / Brunet, and Pont-du-Las / Bon Rencontre should remain distinct.
- La Garde and La Valette are commuter campuses, not hidden city-centre substitutes.

## Suggested Zone Set

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Zone | Parent | Geometry target | Scores | Total |
|------|--------|-----------------|--------|-------|
| Haute Ville / Liberté | Centre | grand quartier | 4.8 / 5.2 / 8.6 / 7.4 / 8.4 / 7.8 / 3.8 | 5.2 |
| Basse Ville / Port | Centre | grand quartier | 4.6 / 5.6 / 8.4 / 7.2 / 8.0 / 7.4 / 3.6 | 5.2 |
| La Rode / Mayol | East centre | grand quartier | 6.2 / 4.4 / 8.2 / 6.8 / 8.4 / 7.2 / 6.4 | 6.6 |
| Mourillon core | East coast | grand quartier | 7.4 / 3.2 / 7.4 / 7.0 / 8.2 / 6.8 / 8.8 | 6.8 |
| La Mitre / Fort Saint-Louis | East coast | grand quartier | 7.6 / 3.0 / 7.0 / 6.4 / 7.8 / 6.4 / 9.0 | 6.6 |
| Saint-Jean-du-Var / Font-Pré | East inner | grand quartier | 5.2 / 6.0 / 8.0 / 6.2 / 7.2 / 7.0 / 5.2 | 5.2 |
| Sainte-Musse / Brunet | East | grand quartier | 5.6 / 6.2 / 7.8 / 5.8 / 7.2 / 7.2 / 5.6 | 6.2 |
| Pont-du-Las / Bon Rencontre | West | grand quartier | 4.8 / 6.8 / 7.6 / 6.4 / 7.2 / 6.4 / 4.8 | 5.2 |
| Nord-Ouest / Routes / Valbertrand | North-west | grand quartier | 5.8 / 5.8 / 6.8 / 5.4 / 6.8 / 5.8 / 7.0 | 6.2 |
| Beaucaire / Pont-Neuf / Lagoubran | West edge | grand quartier | 4.6 / 6.6 / 6.8 / 5.8 / 6.8 / 6.2 / 5.2 | 5.2 |
| La Garde campus | Campus suburb | commune / campus edge | 6.8 / 5.8 / 7.4 / 7.8 / 7.2 / 10.0 / 7.6 | 7.0 |
| La Valette / Avenue 83 / La Seyne edge | Commute edge | commune / campus edge | 6.2 / 5.8 / 7.0 / 6.2 / 7.2 / 8.4 / 6.6 | 6.5 |

## Geometry Instructions

- Use Toulon grand quartiers first.
- Keep Mourillon, La Mitre, La Rode / Mayol, and the port core separate.
- Treat La Garde and La Valette as commuter nodes, not city-core districts.
- If the outer edge lacks district evidence, fall back to the whole commune reputation instead of inventing a small shard.

## Verdict

Toulon should read as a practical commuter/student-value map, not a nightlife map. La Garde campus leads. Mourillon, La Rode / Mayol, and Sainte-Musse are the useful city choices. Centre and west cap zones stay visibly constrained.
