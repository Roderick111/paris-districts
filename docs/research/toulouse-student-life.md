# Toulouse student life scoring (research draft)

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

Toulouse should start from the 20 administrative quartiers, then split only where student life would be misrepresented by a single score.

Boundary confidence: **medium** until official polygon import is verified. Names below are usable research labels, not final geometry names.

## Baseline

Toulouse is a strong student city, but the map must not flatten the core into one "good centre" or let cheap southern/western sectors hide safety caps. Rangueil is a real campus winner. Mirail/Reynerie is a real cap. Arnaud-Bernard has energy but cannot be scored like Carmes.

## Sources

Primary:

- [SSMSI crime dataset (data.gouv.fr)](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [geo.api.gouv.fr commune contours](https://geo.api.gouv.fr/decoupage-administratif/communes)
- [Quartiers de Toulouse](https://fr.wikipedia.org/wiki/Quartiers_de_Toulouse)

Context (not used alone for scoring):

- [Tisseo network context](https://www.tisseo.fr/en)
- [University of Toulouse](https://en.wikipedia.org/wiki/University_of_Toulouse)
- [Toulouse Capitole University](https://en.wikipedia.org/wiki/Toulouse_Capitole_University)
- [Trois Cocus district context](https://fr.wikipedia.org/wiki/Trois_Cocus_%28quartier_de_Toulouse%29)

## Harsh notes

- Rangueil/Sauzelong deserves the top student score because campus access is structural, not vibes.
- Capitole/Carmes is useful and beautiful, but rent and nightlife/tourist exposure hold it down.
- Arnaud-Bernard/Saint-Sernin gets capped: energy is real; disorder and late-night friction are also real.
- Empalot and Mirail/Reynerie must not be rescued by affordability or metro access.
- Saint-Cyprien is probably the best centre-adjacent compromise.
- Minimes/Barrière de Paris/La Vache is practical, not premium-safe.

## Verdict

Rangueil and Saint-Cyprien are the strongest first-pass student picks. Compans/Amidonniers is the calmer central option. Mirail/Reynerie stays capped hard. Arnaud-Bernard should remain a high-energy, high-friction area, not a generic centre score.

## Micro score table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Scores | Total |
|------------|--------|--------|-------|
| Capitole / Carmes / Esquirol | Centre | 5.8 / 2.4 / 9.6 / 8.8 / 9.3 / 8.8 / 4.2 | 6.2 |
| Arnaud-Bernard / Saint-Sernin | Centre | 4.9 / 4.2 / 9.0 / 9.4 / 8.4 / 9.0 / 3.8 | 5.2 |
| Compans / Amidonniers | Centre | 6.8 / 3.8 / 8.8 / 7.2 / 8.4 / 8.0 / 7.0 | 6.9 |
| Chalets / Bayard / Saint-Aubin | Centre | 6.2 / 3.6 / 9.0 / 8.4 / 8.4 / 8.2 / 4.8 | 6.7 |
| Saint-Cyprien / Patte-d'Oie | Rive gauche | 6.7 / 4.8 / 8.8 / 8.5 / 8.2 / 8.0 / 6.0 | 7.0 |
| Saint-Michel / Saint-Agne | Centre south | 5.4 / 5.4 / 8.8 / 8.4 / 8.0 / 8.8 / 4.5 | 6.2 |
| Empalot | Centre south | 4.4 / 7.0 / 8.0 / 6.0 / 6.8 / 8.0 / 5.0 | 5.2 |
| Rangueil / Sauzelong / Jules-Julien | South-east campus | 7.0 / 5.6 / 8.6 / 8.8 / 7.8 / 10.0 / 7.0 | 7.6 |
| Mirail / Reynerie / Bellefontaine | South-west campus | 3.8 / 7.4 / 8.0 / 6.8 / 6.8 / 8.8 / 5.6 | 4.4 |
| Minimes / Barrière de Paris / La Vache | North | 5.8 / 5.8 / 8.6 / 7.0 / 7.6 / 7.2 / 5.8 | 6.2 |

## Boundary note

Use Toulouse administrative quartiers where possible. Split centre, Saint-Michel/Empalot, and campus belts only where the combined district would hide a materially different student-risk profile.
