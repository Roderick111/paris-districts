# Marseille student life scoring (granularity upgrade)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: replace the current 11 grouped polygons with **23 student-relevant micro-areas**. Marseille already has an official 111-quartier source; use it first and group only where official quartiers are too tiny for student decision-making.

Boundary confidence: **high** for official 111 quartiers, **medium/high** for grouped contiguous areas, **low** for any non-contiguous grouping. Non-contiguous grouping should be avoided except explicit campus outliers.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Aix-Marseille-Provence official Marseille quartiers](https://data.ampmetropole.fr/explore/dataset/a7104f3c-e487-4af3-82ad-6197cedfaeb1/)
- [Aix-Marseille Universite](https://www.univ-amu.fr/)
- [RTM network](https://www.rtm.fr/)

## Upgrade Rationale

Current map has the worst visual problem:

- Large merged blobs make Marseille look sparse and arbitrary.
- Saint-Charles, Belle de Mai, Noailles, and Belsunce are different cap profiles and should not be one center blob.
- La Plaine/Cours Julien should split from Notre-Dame-du-Mont and Lodi/Baille.
- Timone, Baille, Castellane, Prefecture, Rouet, Perier, and Prado need separate student/rent tradeoffs.
- Luminy should not include broad south districts that do not share student utility.
- North cap zones need precise warning polygons, not one huge "15e north" slab.

## Micro Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Geometry target | Scores | Total |
|------------|--------|-----------------|--------|-------|
| Saint-Charles | 1e | official quartier | 4.1 / 6.0 / 9.4 / 8.0 / 7.6 / 9.2 / 3.3 | 5.2 |
| Belle de Mai | 3e | official quartier | 3.9 / 6.8 / 8.0 / 7.4 / 6.8 / 8.2 / 3.8 | 4.4 |
| Noailles | 1e | official quartier | 3.5 / 6.6 / 9.5 / 9.0 / 8.0 / 8.5 / 2.6 | 4.4 |
| Belsunce | 1e | official quartier | 3.7 / 6.4 / 9.4 / 8.5 / 7.8 / 8.4 / 2.8 | 4.4 |
| Cours Julien | 6e | official/group | 5.3 / 5.4 / 8.9 / 9.8 / 8.5 / 8.2 / 3.7 | 6.2 |
| La Plaine / Notre-Dame-du-Mont | 6e | official/group | 5.1 / 5.6 / 8.8 / 9.4 / 8.3 / 8.1 / 3.8 | 6.2 |
| Lodi | 6e/5e | official quartier | 5.7 / 5.4 / 8.7 / 8.0 / 8.0 / 8.4 / 4.4 | 6.2 |
| Baille | 5e | official quartier | 6.1 / 5.4 / 9.1 / 8.1 / 8.2 / 9.6 / 4.9 | 6.9 |
| La Timone | 5e | official quartier | 6.3 / 5.0 / 9.0 / 8.0 / 8.1 / 10.0 / 5.1 | 7.0 |
| Castellane | 6e | official quartier | 6.7 / 3.8 / 9.3 / 7.7 / 8.9 / 8.5 / 4.8 | 6.9 |
| Prefecture | 6e | official quartier | 6.4 / 3.5 / 9.2 / 7.4 / 8.9 / 8.2 / 4.5 | 6.8 |
| Rouet | 8e | official quartier | 6.8 / 4.0 / 8.8 / 7.1 / 8.4 / 7.9 / 5.6 | 6.9 |
| Perier | 8e | official quartier | 7.5 / 2.8 / 8.9 / 6.6 / 8.8 / 7.4 / 6.1 | 6.8 |
| Prado / Saint-Giniez | 8e | official/group | 7.6 / 2.6 / 8.6 / 6.0 / 8.8 / 7.0 / 6.6 | 6.8 |
| Vieux-Port / Opera | 1e | official/group | 5.2 / 3.2 / 9.5 / 8.6 / 9.2 / 7.8 / 3.8 | 6.2 |
| Panier / Hotel de Ville | 2e | official/group | 5.1 / 3.7 / 9.0 / 8.0 / 8.6 / 7.5 / 4.2 | 6.2 |
| Joliette / Euromed | 2e | official/group | 5.6 / 4.2 / 9.1 / 7.4 / 8.2 / 7.8 / 4.6 | 6.2 |
| Endoume / Catalans | 7e | official/group | 7.2 / 2.6 / 7.6 / 6.8 / 8.0 / 6.8 / 7.8 | 6.6 |
| Sainte-Anne / Mazargues | 8e/9e | official/group | 7.0 / 4.2 / 7.3 / 6.4 / 7.8 / 7.2 / 7.2 | 6.6 |
| Luminy campus | 9e | official/group | 7.9 / 4.4 / 6.3 / 7.7 / 6.6 / 10.0 / 10.0 | 7.3 |
| Saint-Jerome | 13e | official quartier | 5.6 / 6.8 / 7.3 / 7.6 / 7.2 / 9.4 / 6.2 | 6.2 |
| Chateau-Gombert | 13e | official quartier | 6.2 / 6.2 / 6.8 / 7.2 / 7.0 / 9.0 / 7.0 | 6.5 |
| La Castellane / 15e north | 15e | official/group | 2.6 / 7.6 / 6.6 / 4.8 / 6.2 / 5.6 / 4.8 | 3.4 |

## Geometry Instructions

- Stop using broad merged blobs when official 111-quartier polygons exist.
- Each row should be one official quartier or a small contiguous group of official quartiers.
- `allowMultipart` only for explicit campus outliers if a source polygon itself is multipart; do not merge distant unrelated districts.
- Map bounds should include central Marseille, Luminy, Saint-Jerome/Chateau-Gombert, and 15e cap zone without over-zooming to empty hills/sea.

## Verdict

Marseille should look dense in the central student corridor and precise in cap zones. Baille/Timone and Luminy lead. Noailles, Belsunce, Belle de Mai, and La Castellane remain hard-capped. Current broad grouping is too blunt for Marseille risk.
