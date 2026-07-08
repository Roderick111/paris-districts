# Nice student life scoring (research draft)

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

Nice should start from the 41 mairie/INSEE quartier structure, with student-focused grouping around Valrose, Carlone, Saint-Jean d'Angély, Pasteur, and Arénas.

Boundary confidence: **medium** until official quartier or IRIS polygon import is verified.

## Baseline

Nice is attractive but rent-hostile. The map must separate postcard Nice from student Nice: Vieux-Nice/Port is energetic but expensive and tourist-exposed; Libération/Valrose is more useful; Pasteur/Ariane need caps; Cimiez is safe but not a normal student default.

## Sources

Primary:

- [SSMSI crime dataset (data.gouv.fr)](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [geo.api.gouv.fr commune contours](https://geo.api.gouv.fr/decoupage-administratif/communes)
- [Liste des quartiers de Nice](https://fr.wikipedia.org/wiki/Liste_des_quartiers_de_Nice)

Context (not used alone for scoring):

- [Université Côte d'Azur](https://en.wikipedia.org/wiki/C%C3%B4te_d%27Azur_University)
- [Métropole Nice Côte d'Azur](https://en.wikipedia.org/wiki/M%C3%A9tropole_Nice_C%C3%B4te_d%27Azur)

## Harsh notes

- Libération/Borriglione/Valrose is the most credible first student pick.
- Vieux-Nice and Jean-Médecin should not get postcard inflation; tourist exposure and rent matter.
- Cimiez/Rimiez is safe and green, but weak on affordability and student energy.
- Carlone/Madeleine is underrated because campus access is real and rent is less brutal than the core.
- Pasteur/Roquebillière and Ariane need hard safety caps.
- Arénas/Saint-Augustin has EDHEC/airport-business utility, not broad student life.

## Verdict

Libération/Valrose leads. Carlone/Madeleine is the practical west-side campus option. Vieux-Nice/Port and Jean-Médecin are useful but rent/tourism limited. Ariane and Pasteur/Roquebillière stay capped.

## Micro score table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Scores | Total |
|------------|--------|--------|-------|
| Jean-Médecin / Carabacel | Centre | 5.8 / 2.4 / 9.4 / 7.8 / 9.2 / 8.0 / 3.8 | 6.2 |
| Vieux-Nice / Port | Centre east | 5.6 / 2.8 / 8.8 / 8.8 / 9.0 / 7.6 / 4.6 | 6.2 |
| Libération / Borriglione / Valrose | North centre | 6.6 / 4.6 / 8.8 / 8.2 / 8.4 / 9.4 / 5.8 | 7.0 |
| Thiers / Musiciens | Centre west | 5.4 / 3.4 / 9.0 / 7.0 / 8.6 / 8.0 / 4.4 | 6.2 |
| Riquier / Saint-Roch | East inner city | 5.8 / 5.4 / 8.4 / 7.0 / 8.0 / 7.6 / 5.0 | 6.2 |
| Carlone / Madeleine | West campus | 6.4 / 4.8 / 7.6 / 7.2 / 7.4 / 9.0 / 6.2 | 6.8 |
| Cimiez / Rimiez | North-east hills | 8.2 / 2.6 / 6.8 / 4.6 / 7.8 / 7.2 / 8.4 | 6.6 |
| Pasteur / Roquebillière | East | 4.4 / 6.8 / 7.6 / 5.8 / 7.0 / 8.0 / 5.0 | 5.2 |
| Ariane | North-east edge | 3.2 / 7.4 / 6.8 / 4.8 / 6.2 / 5.6 / 5.6 | 4.4 |
| Arénas / Saint-Augustin / EDHEC | West airport | 5.0 / 5.4 / 8.4 / 6.2 / 7.4 / 8.2 / 5.2 | 6.2 |

## Boundary note

Do not combine eastern Nice into one score. Riquier/Saint-Roch, Pasteur/Roquebillière, and Ariane have different risk profiles.
