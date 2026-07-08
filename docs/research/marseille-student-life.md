# Marseille student life scoring (research draft)

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

Marseille has 111 official quartiers, so v1 should group them into student-relevant areas rather than expose every official unit. Campus outliers like Luminy and Saint-Jérôme/Château-Gombert need their own rows.

Boundary confidence: **medium** for grouped official quartiers; **low/medium** where common names cut across official quartier lines.

## Baseline

Marseille needs the harshest cap discipline of the new cities. Central access and student energy are real, but Noailles/Belsunce/Saint-Charles cannot be allowed to outrank safer campus or south/east options just because they are connected and cheap.

## Sources

Primary:

- [SSMSI crime dataset (data.gouv.fr)](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [geo.api.gouv.fr commune contours](https://geo.api.gouv.fr/decoupage-administratif/communes)
- [Quartiers de Marseille](https://fr.wikipedia.org/wiki/Quartiers_de_Marseille)

Context (not used alone for scoring):

- [Aix-Marseille University](https://en.wikipedia.org/wiki/Aix-Marseille_University)
- [Aix-Marseille University Faculty of Sciences](https://en.wikipedia.org/wiki/Aix-Marseille_University_Faculty_of_Sciences)
- [Luminy](https://fr.wikipedia.org/wiki/Luminy)
- [15e arrondissement de Marseille](https://fr.wikipedia.org/wiki/15e_arrondissement_de_Marseille)

## Harsh notes

- Noailles/Belsunce is central and alive, but safety cap must dominate.
- Saint-Charles has huge campus/transport utility but bad edge effects.
- La Plaine/Cours Julien is the student/social pick, not the safe pick.
- Baille/Timone is probably the best balanced in-city student zone.
- Luminy is green and campus-strong but transport-friction heavy.
- Northern districts need brutal caps; avoid averaging them into "Marseille north".

## Verdict

Baille/Timone and Luminy are the strongest first-pass picks for different students. Castellane/Préfecture and Prado/Périer are safer but expensive. Noailles/Belsunce, Saint-Charles, and the 15e north must remain capped even when transport and affordability look good.

## Micro score table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Scores | Total |
|------------|--------|--------|-------|
| Saint-Charles / Belle de Mai edge | Marseille 1/3 | 4.0 / 6.2 / 9.0 / 8.2 / 7.4 / 9.0 / 3.5 | 5.2 |
| Noailles / Belsunce | Marseille 1 | 3.6 / 6.6 / 9.4 / 8.8 / 8.0 / 8.5 / 2.8 | 4.4 |
| La Plaine / Cours Julien | Marseille 5/6 | 5.0 / 5.6 / 8.8 / 9.8 / 8.4 / 8.2 / 3.8 | 6.2 |
| Baille / La Timone | Marseille 5 | 6.2 / 5.2 / 9.0 / 8.2 / 8.2 / 10.0 / 5.0 | 7.0 |
| Castellane / Préfecture | Marseille 6 | 6.6 / 3.8 / 9.2 / 7.6 / 8.8 / 8.4 / 4.8 | 6.9 |
| Prado / Périer / Rouet | Marseille 8 | 7.4 / 2.8 / 8.8 / 6.4 / 8.8 / 7.2 / 6.4 | 6.8 |
| Vieux-Port / Panier | Marseille 1/2 | 5.0 / 3.4 / 9.2 / 8.2 / 9.0 / 7.6 / 4.0 | 6.2 |
| Endoume / Catalans | Marseille 7 | 7.2 / 2.6 / 7.6 / 6.8 / 8.0 / 6.8 / 7.8 | 6.6 |
| Luminy / Redon campus | Marseille 9 | 7.8 / 4.4 / 6.4 / 7.6 / 6.6 / 10.0 / 10.0 | 7.3 |
| Saint-Jérôme / Château-Gombert | Marseille 13 | 5.8 / 6.6 / 7.2 / 7.6 / 7.2 / 9.4 / 6.4 | 6.2 |
| La Castellane / 15e north | Marseille 15 | 2.6 / 7.6 / 6.6 / 4.8 / 6.2 / 5.6 / 4.8 | 3.4 |

## Boundary note

Do not use arrondissement averages as final map units. Marseille needs grouped micro-areas around lived student zones and explicit cap zones.
