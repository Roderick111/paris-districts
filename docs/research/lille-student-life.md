# Lille student life scoring (research draft)

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

Lille should use city quartiers plus selected metro-area campus nodes. Villeneuve-d'Ascq must be included because Cité Scientifique and Pont de Bois are too important for student life to omit.

Boundary confidence: **medium** for Lille city quartiers, **low/medium** for cross-commune campus labels until geometry source is chosen.

## Baseline

Lille is compact, transit-rich, and student-heavy. That makes over-scoring easy. Vauban is a genuine student winner; Wazemmes and Moulins have energy but need caps. Villeneuve-d'Ascq campus zones are not "suburban filler"; they are core student infrastructure.

## Sources

Primary:

- [SSMSI crime dataset (data.gouv.fr)](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [geo.api.gouv.fr commune contours](https://geo.api.gouv.fr/decoupage-administratif/communes)
- [Quartiers de Lille](https://fr.wikipedia.org/wiki/Quartiers_de_Lille)

Context (not used alone for scoring):

- [University of Lille](https://en.wikipedia.org/wiki/University_of_Lille)
- [Ilévia transport network](https://en.wikipedia.org/wiki/Il%C3%A9via)
- [Lille Metro](https://en.wikipedia.org/wiki/Lille_Metro)
- [Lille tramway](https://en.wikipedia.org/wiki/Lille_tramway)
- [Université catholique de Lille](https://fr.wikipedia.org/wiki/Universit%C3%A9_catholique_de_Lille)

## Harsh notes

- Vauban-Esquermes is the cleanest student-life pick: campus, services, social life, and tolerable risk.
- Wazemmes must not be punished into uselessness, but it cannot be treated as comfort-safe.
- Moulins gets strong campus access and value, but safety caps total score.
- Vieux-Lille is pleasant but expensive and less student-practical than reputation suggests.
- Lille-Sud is a cap zone. Cheap rent is not enough.
- Villeneuve-d'Ascq has two different student profiles: Cité Scientifique stronger and calmer; Pont de Bois more mixed.

## Verdict

Vauban-Esquermes and Cité Scientifique lead. Wazemmes is a good street-smart pick but capped. Moulins and Lille-Sud need honest safety penalties. Vieux-Lille is comfort/prestige, not best student value.

## Micro score table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Scores | Total |
|------------|--------|--------|-------|
| Lille-Centre / Gares / Euralille | Lille Centre | 5.4 / 2.8 / 9.8 / 8.0 / 9.2 / 8.2 / 3.8 | 6.2 |
| Vieux-Lille | Vieux-Lille | 7.0 / 2.0 / 8.2 / 7.2 / 8.8 / 7.2 / 5.4 | 6.5 |
| Vauban-Esquermes / Catho | Vauban-Esquermes | 7.2 / 4.0 / 8.0 / 9.0 / 8.0 / 9.3 / 7.2 | 7.3 |
| Wazemmes | Wazemmes | 5.0 / 6.0 / 8.8 / 9.2 / 8.0 / 8.4 / 4.0 | 6.2 |
| Moulins | Moulins | 4.6 / 6.6 / 8.6 / 8.0 / 7.4 / 9.0 / 4.2 | 5.2 |
| Fives | Fives | 5.2 / 6.4 / 8.6 / 7.0 / 7.2 / 7.0 / 4.8 | 6.2 |
| Bois-Blancs / Euratechnologies | Bois-Blancs | 6.4 / 5.2 / 7.8 / 6.8 / 7.2 / 6.4 / 6.6 | 6.5 |
| Lille-Sud | Lille-Sud | 4.2 / 7.0 / 7.6 / 5.8 / 6.8 / 7.2 / 5.2 | 5.2 |
| Villeneuve-d'Ascq Cité Scientifique | Villeneuve-d'Ascq | 6.8 / 5.8 / 8.8 / 8.6 / 7.6 / 10.0 / 7.8 | 7.0 |
| Villeneuve-d'Ascq Pont de Bois | Villeneuve-d'Ascq | 5.8 / 6.2 / 8.8 / 8.8 / 7.4 / 9.8 / 6.8 | 6.2 |

## Boundary note

Do not force all of Villeneuve-d'Ascq into one score. Cité Scientifique and Pont de Bois are both student-relevant but have different comfort profiles.
