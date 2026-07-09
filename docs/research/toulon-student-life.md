# Toulon student life scoring (granularity upgrade)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **20 student-relevant micro-areas**. Toulon is not a dense student metropolis, so coverage must include city core, La Garde campus, La Valette commute areas, Mourillon, east hospital corridor, west mixed zones, and La Seyne.

Boundary confidence: **medium/high** after IRIS mapping, **medium** for lived-neighbourhood labels, **medium/low** for cross-commune commute areas until polygon sources are verified.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Quartiers de Toulon context](https://fr.wikipedia.org/wiki/Quartiers_de_Toulon)
- [Universite de Toulon](https://www.univ-tln.fr/)
- [Reseau Mistral](https://www.reseaumistral.com/)
- [La Garde context](https://fr.wikipedia.org/wiki/La_Garde_%28Var%29)

## Upgrade Rationale

Current 10-area draft is too generic:

- Centre/Haute Ville should split from Basse Ville, Port, and La Rode/Mayol.
- Mourillon, Cap Brun, La Serinette, and La Mitre are different east-coast choices.
- Saint-Roch/Claret, Sainte-Anne, Pont-du-Las, Bon Rencontre, and Jonquet need separate risk/value profiles.
- Sainte-Musse, La Garde campus, La Valette, and La Seyne are necessary student commute options.
- Toulon needs honest caps because weak student density can make broad scores misleading.

## Micro Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Geometry target | Scores | Total |
|------------|--------|-----------------|--------|-------|
| Haute Ville / Liberte | Toulon centre | IRIS group | 4.8 / 5.4 / 8.6 / 7.4 / 8.4 / 7.8 / 3.8 | 5.2 |
| Basse Ville / Port | Toulon centre | IRIS group | 4.6 / 5.6 / 8.4 / 7.2 / 8.0 / 7.6 / 3.6 | 5.2 |
| Gare / Strasbourg | Centre north | IRIS group | 5.0 / 5.2 / 8.8 / 7.0 / 8.0 / 7.8 / 4.0 | 5.2 |
| La Rode / Mayol | East centre | IRIS group | 6.2 / 4.4 / 8.2 / 6.8 / 8.4 / 7.2 / 6.4 | 6.6 |
| Mourillon core | East coast | IRIS group | 7.4 / 3.0 / 7.4 / 7.2 / 8.2 / 6.8 / 8.8 | 6.8 |
| La Mitre / Fort Saint-Louis | East coast | IRIS group | 7.6 / 2.8 / 7.0 / 6.4 / 7.8 / 6.4 / 9.0 | 6.6 |
| Cap Brun | East hills | IRIS group | 8.1 / 2.6 / 6.2 / 4.6 / 7.4 / 5.8 / 9.2 | 6.4 |
| La Serinette | East hills | IRIS group | 7.8 / 3.2 / 6.8 / 5.2 / 7.4 / 6.2 / 8.8 | 6.5 |
| Sainte-Musse | East | IRIS group | 5.6 / 6.2 / 7.8 / 5.8 / 7.2 / 7.6 / 5.6 | 6.2 |
| Saint-Jean-du-Var | East inner | IRIS group | 5.0 / 6.4 / 7.8 / 6.2 / 7.2 / 7.2 / 5.0 | 5.2 |
| Saint-Roch | North centre | IRIS group | 5.8 / 5.8 / 8.0 / 6.8 / 7.6 / 7.0 / 5.6 | 6.2 |
| Claret / Sainte-Anne | North centre | IRIS group | 6.0 / 5.5 / 7.8 / 6.4 / 7.4 / 7.0 / 5.8 | 6.2 |
| Pont-du-Las | West | IRIS group | 4.8 / 6.8 / 7.6 / 6.4 / 7.2 / 6.4 / 4.8 | 5.2 |
| Bon Rencontre | West | IRIS group | 4.9 / 6.6 / 7.4 / 6.0 / 7.0 / 6.2 / 5.0 | 5.2 |
| Jonquet / La Baume / Guynemer | North-west | IRIS group | 3.8 / 7.4 / 6.8 / 4.8 / 6.2 / 5.6 / 5.2 | 4.4 |
| Valbertrand / Routes | North-west | IRIS group | 5.8 / 5.8 / 6.8 / 5.4 / 6.8 / 5.8 / 7.0 | 6.2 |
| La Garde campus | Campus suburb | IRIS/commune group | 6.8 / 5.8 / 7.4 / 7.8 / 7.2 / 10.0 / 7.6 | 7.0 |
| La Valette / Avenue 83 | East suburb | IRIS/commune group | 6.2 / 5.6 / 7.2 / 6.4 / 7.4 / 8.2 / 6.8 | 6.5 |
| La Seyne centre | West suburb | IRIS/commune group | 4.6 / 7.0 / 6.8 / 5.8 / 6.8 / 6.2 / 5.4 | 5.2 |
| Six-Fours / La Seyne east edge | West suburb | IRIS/commune group | 6.4 / 5.2 / 6.6 / 5.6 / 7.0 / 5.8 / 7.4 | 6.4 |

## Geometry Instructions

- Use IRIS groups where possible; no hand-drawn coastal blobs.
- Include La Garde campus. Omitting it makes the Toulon student map false.
- Include La Seyne and La Valette only as selected student commute options, not as whole-commune filler.

## Verdict

Toulon should be a practical commute/student-value map, not a dense nightlife map. La Garde campus leads. Mourillon, La Rode/Mayol, La Serinette, Sainte-Musse, and La Valette are workable. Centre, Pont-du-Las, Jonquet, and La Seyne centre need clear caps.
