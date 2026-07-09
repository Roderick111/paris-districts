# Grenoble student life scoring (granularity upgrade)

## Method

Same seven criteria, same weights, same security cap as the app.

Upgrade target: implement **22 student-relevant micro-areas** across Grenoble, Saint-Martin-d'Heres, Gieres, La Tronche, Meylan, and Seyssinet/Seyssins edge where useful. Use IRIS-backed groups; whole-commune scoring is too blunt.

Boundary confidence: **medium/high** after IRIS mapping, **medium** for lived-neighbourhood groupings.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Secteurs de Grenoble context](https://fr.wikipedia.org/wiki/Secteurs_de_Grenoble)
- [Universite Grenoble Alpes](https://www.univ-grenoble-alpes.fr/)
- [Domaine universitaire de Grenoble](https://fr.wikipedia.org/wiki/Domaine_universitaire_de_Grenoble)
- [TAG tram/bus network](https://www.tag.fr/)

## Upgrade Rationale

Current 10-area draft hides sharp Grenoble contrasts:

- Hyper-centre, Notre-Dame, Championnet, Bonne, Saint-Bruno, and Berriat need separate profiles.
- Europole, Presqu'ile/GIANT, and Saint-Martin-le-Vinoux edge are different north-west student/engineering zones.
- Ile Verte and La Tronche medical campus should split.
- Saint-Martin-d'Heres and Gieres campus should split into campus core, Gabriel Peri, Condillac/Diderot, and Gieres.
- Villeneuve, Village Olympique, Mistral, and Eaux-Claires need distinct cap zones.

## Micro Score Table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total

| Micro-area | Parent | Geometry target | Scores | Total |
|------------|--------|-----------------|--------|-------|
| Hyper-centre | Centre | IRIS group | 5.7 / 3.0 / 9.7 / 9.2 / 9.4 / 8.8 / 4.0 | 6.2 |
| Notre-Dame / Mutualite | Centre east | IRIS group | 6.0 / 3.2 / 9.4 / 8.8 / 9.0 / 8.8 / 4.8 | 6.5 |
| Championnet | Centre west | IRIS group | 6.8 / 4.0 / 9.0 / 8.8 / 8.8 / 8.6 / 5.6 | 7.0 |
| Caserne de Bonne | Centre west | IRIS group | 7.0 / 3.6 / 9.0 / 8.0 / 8.8 / 8.4 / 6.2 | 7.0 |
| Saint-Bruno | West inner | IRIS group | 5.0 / 6.0 / 9.4 / 8.8 / 8.0 / 8.3 / 4.0 | 6.2 |
| Berriat | West inner | IRIS group | 5.4 / 5.6 / 9.1 / 8.4 / 8.0 / 8.2 / 4.4 | 6.2 |
| Europole | North-west | IRIS group | 6.2 / 4.6 / 9.0 / 7.2 / 8.0 / 9.4 / 5.6 | 6.9 |
| Presqu'ile / GIANT | North-west campus | IRIS group | 6.8 / 4.8 / 8.6 / 7.0 / 7.6 / 9.8 / 6.4 | 7.0 |
| Ile Verte | East medical | IRIS group | 7.4 / 4.2 / 8.8 / 7.4 / 8.4 / 9.4 / 8.4 | 7.4 |
| La Tronche / CHU | Medical campus | IRIS/commune group | 7.8 / 4.0 / 8.6 / 7.0 / 8.2 / 10.0 / 8.8 | 7.6 |
| Saint-Martin-d'Heres campus core | Main campus | IRIS group | 6.8 / 6.0 / 9.2 / 9.4 / 7.8 / 10.0 / 8.4 | 7.0 |
| Gabriel Peri / SMH centre | Campus suburb | IRIS group | 5.8 / 6.8 / 8.8 / 8.0 / 7.4 / 9.0 / 6.4 | 6.2 |
| Condillac / Diderot | Campus east | IRIS group | 6.6 / 6.2 / 9.0 / 8.6 / 7.6 / 10.0 / 8.0 | 7.0 |
| Gieres campus | East campus | IRIS/commune group | 7.6 / 5.8 / 8.6 / 8.0 / 7.4 / 9.6 / 8.6 | 7.8 |
| Meylan | North-east suburb | IRIS/commune group | 8.4 / 3.6 / 7.2 / 5.0 / 7.8 / 7.0 / 8.8 | 6.9 |
| Eaux-Claires | South-west | IRIS group | 4.8 / 6.6 / 8.5 / 6.4 / 7.4 / 7.2 / 5.6 | 5.2 |
| Mistral | South-west cap | IRIS group | 3.8 / 7.0 / 8.2 / 5.8 / 6.8 / 6.8 / 5.2 | 4.4 |
| Villeneuve | South | IRIS group | 3.8 / 7.4 / 8.0 / 6.0 / 6.8 / 7.2 / 5.8 | 4.4 |
| Village Olympique | South | IRIS group | 4.0 / 7.0 / 8.2 / 6.2 / 6.9 / 7.2 / 5.8 | 5.2 |
| Teisseire | South-east | IRIS group | 4.4 / 6.8 / 8.0 / 6.0 / 7.0 / 7.4 / 5.6 | 5.2 |
| Abbaye / Bajatiere | East | IRIS group | 5.8 / 5.8 / 8.4 / 6.8 / 7.4 / 8.2 / 6.2 | 6.2 |
| Seyssinet / Fontaine tram edge | West suburb | IRIS/commune group | 5.8 / 6.4 / 8.2 / 6.4 / 7.2 / 7.2 / 6.6 | 6.2 |

## Geometry Instructions

- Use IRIS groups for all Grenoble city rows.
- Use commune-filtered IRIS groups for Saint-Martin-d'Heres, Gieres, La Tronche, Meylan, and west-suburb edge rows.
- Do not map Grenoble only by commune; student product needs precise campus and cap-zone splits.

## Verdict

Grenoble should show a dense urban/campus map, not a commune overview. Gieres, La Tronche/CHU, Ile Verte, Presqu'ile/GIANT, Championnet, and campus core lead. Mistral, Villeneuve, Eaux-Claires, and Teisseire need visible caps.
