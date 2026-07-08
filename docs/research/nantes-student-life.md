# Nantes student life scoring (research draft)

## Method

Same seven criteria as Paris, same weights, same security cap:

| Criterion | Weight |
|-----------|--------|
| Security | 3.0 |
| Affordability | 1.6 |
| Transport | 1.4 |
| Student energy | 1.2 |
| Services | 1.0 |
| Campus access | 1.0 |
| Green/calm | 0.8 |

Nantes should start from the 11 administrative quartiers and split only the major student/campus belts. The 97 INSEE micro-quartiers can support later geometry, but v1 should stay readable.

Boundary confidence: **medium** for administrative quartiers, **medium/low** for grouped micro-quartier labels until polygon import is verified.

## Baseline

Nantes is strong for student quality, but not uniformly. Hauts-Pavés/Saint-Félix and the northern university belt are real winners. Centre-ville is lively and useful, but rent and late-night exposure hold it down. Bellevue and Malakoff need caps.

## Sources

Primary:

- [SSMSI crime dataset (data.gouv.fr)](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [geo.api.gouv.fr commune contours](https://geo.api.gouv.fr/decoupage-administratif/communes)
- [Liste des quartiers de Nantes](https://fr.wikipedia.org/wiki/Liste_des_quartiers_de_Nantes)

Context (not used alone for scoring):

- [Nantes Université](https://fr.wikipedia.org/wiki/Nantes_Universit%C3%A9)
- [Nantes tramway](https://en.wikipedia.org/wiki/Nantes_tramway)
- [Nantes urban layout](https://en.wikipedia.org/wiki/Nantes)
- [Quartier Nantes Erdre](https://fr.wikipedia.org/wiki/Quartier_Nantes_Erdre)

## Harsh notes

- Hauts-Pavés/Saint-Félix/Michelet is the cleanest student pick.
- Nantes Nord/Jonelière has strong university access and value, but mixed comfort.
- Centre-ville is not an automatic winner: student energy is high, rent and nightlife friction drag.
- Île de Nantes is improving and practical, but not yet a top student default.
- Bellevue and Breil need safety/comfort caps despite affordability.
- Nantes Erdre/Chantrerie is strong for specific campuses, weaker for central student life.

## Verdict

Hauts-Pavés/Saint-Félix and Nantes Nord/Jonelière lead. Centre-ville and Île de Nantes are good but not best-value defaults. Bellevue/Chantenay and Breil/Barberie require caps. Nantes Erdre/Chantrerie is a campus-specific green option.

## Micro score table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Scores | Total |
|------------|--------|--------|-------|
| Centre-ville / Decré-Commerce-Graslin | Centre-ville | 6.2 / 3.0 / 9.6 / 9.0 / 9.2 / 8.4 / 4.2 | 6.9 |
| Hauts-Pavés / Saint-Félix / Michelet | Hauts-Pavés - Saint-Félix | 7.2 / 4.4 / 8.6 / 8.6 / 8.2 / 9.6 / 7.0 | 7.4 |
| Nantes Nord / Jonelière-Université | Nantes Nord | 6.0 / 6.0 / 8.4 / 8.8 / 7.6 / 10.0 / 7.6 | 7.0 |
| Île de Nantes | Île de Nantes | 6.6 / 4.2 / 8.6 / 7.8 / 8.0 / 8.0 / 6.6 | 6.9 |
| Malakoff / Saint-Donatien | Malakoff - Saint-Donatien | 5.2 / 6.0 / 8.8 / 7.2 / 7.8 / 8.0 / 5.8 | 6.2 |
| Dervallières / Zola | Dervallières - Zola | 5.4 / 5.8 / 8.0 / 6.8 / 7.8 / 7.0 / 6.4 | 6.2 |
| Bellevue / Chantenay / Sainte-Anne | Bellevue - Chantenay - Sainte-Anne | 4.6 / 6.8 / 8.2 / 6.8 / 7.4 / 7.2 / 6.2 | 5.2 |
| Breil / Barberie | Breil - Barberie | 5.0 / 6.2 / 7.6 / 5.8 / 7.0 / 6.6 / 6.8 | 6.2 |
| Nantes Erdre / Chantrerie | Nantes Erdre | 7.0 / 5.4 / 7.4 / 7.2 / 7.4 / 9.4 / 8.4 | 7.2 |
| Doulon / Bottière | Doulon - Bottière | 5.8 / 6.2 / 8.2 / 6.4 / 7.4 / 7.0 / 6.6 | 6.2 |

## Boundary note

For v1, do not expose all 97 micro-quartiers. Use readable grouped areas, then refine only where geometry and scoring evidence justify it.
