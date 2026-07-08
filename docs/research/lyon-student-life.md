# Lyon student life scoring (micro-areas)

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

Lyon now uses **micro-areas** as primary map units. Macro arrondissement/commune rows are parent groupings only — not selectable on the map.

Boundary confidence: **high** where Lyon city council quartier perimeters exist; **medium** for curated splits (Perrache/Confluence, Terreaux clip, Villeurbanne Buers/La Doua split).

## Baseline

Paris scoring refuses to let prestige districts auto-win and hard-caps rough pockets inside otherwise desirable areas. Lyon micro-scoring applies the same discipline: Guillotière ≠ Gerland, Bellecour ≠ Confluence, Mermoz ≠ Monplaisir, La Doua ≠ Buers.

## Sources

Primary:

- [SSMSI crime dataset (data.gouv.fr)](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [Lyon city council quartier perimeters](https://data.grandlyon.com/geoserver/ogc/features/v1/collections/ville-de-lyon:vdl_vie_citoyenne.perimetre_de_quartier/items)
- [geo.api.gouv.fr commune contours (Écully)](https://geo.api.gouv.fr/decoupage-administratif/communes)

Context (not used alone for scoring):

- [Arrondissements de Lyon](https://fr.wikipedia.org/wiki/Arrondissements_de_Lyon)
- [Liste des quartiers de Lyon](https://fr.wikipedia.org/wiki/Liste_des_quartiers_de_Lyon)
- [La Guillotière](https://fr.wikipedia.org/wiki/La_Guilloti%C3%A8re)
- [Gerland](https://fr.wikipedia.org/wiki/Gerland)
- [La Doua](https://fr.wikipedia.org/wiki/La_Doua)
- [Mermoz (Lyon)](https://fr.wikipedia.org/wiki/Mermoz_%28Lyon%29)
- [La Duchère](https://fr.wikipedia.org/wiki/La_Duch%C3%A8re)
- [Buers](https://fr.wikipedia.org/wiki/Buers)
- [Saint-Jean (Villeurbanne)](https://fr.wikipedia.org/wiki/Saint-Jean_%28Villeurbanne%29)

## Harsh notes

- Guillotière, Moncey north, Mermoz, La Duchère, Buers/Saint-Jean get safety caps. Cheap or studenty does not save them.
- Gerland deserves upgrade versus old Lyon 7 average — different world from Guillotière.
- Confluence has better safety/calm than Bellecour, but rent kills student value.
- Lyon 6 (Tête d'Or, Brotteaux) stays comfort-heavy, not student-heavy.
- Saint-Rambert/Rochecardon is safe and green, but transport/student energy are weak — no fake top score.
- Villeurbanne must split: La Doua strong; Buers/Saint-Jean risk; Charpennes/Tonkin useful but not comfort-safe.

## Verdict

Gerland and Jean Macé are the strongest inside-Lyon student picks. La Doua remains first-class. Guillotière and Buers stay capped despite energy. Lyon 6 and Écully are comfort/school picks, not student-default picks.

## Micro score table

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm → total

| Micro-area | Parent | Scores | Total |
|------------|--------|--------|-------|
| Terreaux / Saint-Vincent | Lyon 1 | 5.0 / 3.5 / 9.0 / 8.8 / 8.8 / 8.0 / 3.8 | 6.2 |
| Pentes / Chartreux | Lyon 1 | 6.2 / 4.4 / 8.0 / 8.7 / 8.0 / 7.6 / 5.5 | 6.7 |
| Bellecour / Cordeliers | Lyon 2 | 5.6 / 2.0 / 9.8 / 7.0 / 9.5 / 7.8 / 3.8 | 6.2 |
| Ainay | Lyon 2 | 7.8 / 1.8 / 8.7 / 5.3 / 8.6 / 7.2 / 5.7 | 6.5 |
| Perrache / Sainte-Blandine | Lyon 2 | 5.8 / 3.2 / 9.0 / 6.8 / 8.0 / 7.8 / 4.8 | 6.2 |
| Confluence | Lyon 2 | 7.0 / 2.4 / 8.5 / 6.0 / 8.2 / 7.2 / 6.9 | 6.5 |
| Préfecture / Moncey / Guillotière Nord | Lyon 3 | 4.8 / 4.5 / 9.4 / 8.0 / 8.5 / 8.5 / 3.8 | 5.2 |
| Part-Dieu / Villette | Lyon 3 | 5.5 / 4.0 / 10.0 / 6.8 / 9.0 / 8.0 / 4.2 | 6.2 |
| Sans Souci / Dauphiné / Grange Blanche | Lyon 3 | 6.8 / 5.2 / 8.5 / 7.0 / 8.0 / 8.8 / 6.0 | 7.0 |
| Montchat | Lyon 3 | 7.9 / 4.3 / 7.5 / 5.2 / 7.8 / 7.0 / 7.9 | 6.8 |
| Croix-Rousse plateau / Gros Caillou | Lyon 4 | 7.2 / 3.8 / 7.6 / 8.0 / 8.0 / 6.7 / 7.5 | 6.9 |
| Serin / Saône | Lyon 4 | 6.6 / 4.4 / 6.8 / 5.8 / 6.8 / 5.8 / 7.0 | 6.2 |
| Croix-Rousse west / Chazière | Lyon 4 | 7.8 / 4.0 / 6.8 / 5.8 / 7.0 / 5.8 / 8.3 | 6.6 |
| Vieux Lyon | Lyon 5 | 5.8 / 2.8 / 8.0 / 8.0 / 8.4 / 7.0 / 4.8 | 6.2 |
| Fourvière / Saint-Just | Lyon 5 | 7.4 / 3.8 / 6.8 / 6.4 / 7.0 / 6.2 / 7.8 | 6.5 |
| Saint-Irénée / Point-du-Jour / Champvert-Ménival | Lyon 5 | 8.0 / 4.6 / 5.8 / 4.8 / 7.2 / 5.5 / 8.8 | 6.5 |
| Brotteaux / Foch-Masséna | Lyon 6 | 7.8 / 1.8 / 9.0 / 6.0 / 8.8 / 6.8 / 6.5 | 6.7 |
| Tête d'Or / Cité Internationale | Lyon 6 | 8.8 / 1.8 / 8.0 / 4.8 / 7.6 / 6.2 / 9.6 | 6.8 |
| Bellecombe | Lyon 6 | 7.4 / 3.6 / 8.4 / 5.8 / 7.8 / 7.2 / 6.8 | 6.7 |
| Guillotière Saint-Louis / Universités | Lyon 7 | 4.6 / 5.4 / 9.4 / 9.5 / 8.5 / 9.8 / 3.8 | 5.2 |
| Jean Macé / Blandan | Lyon 7 | 6.7 / 5.1 / 9.2 / 8.6 / 8.4 / 9.0 / 6.8 | 7.0 |
| Gerland / Girondins-Debourg | Lyon 7 | 7.0 / 5.0 / 8.5 / 8.0 / 8.0 / 9.2 / 7.2 | 7.3 |
| Monplaisir / Lumière | Lyon 8 | 7.2 / 5.0 / 8.6 / 7.2 / 8.2 / 8.4 / 6.6 | 7.2 |
| Bachut / Transvaal-Laënnec | Lyon 8 | 6.4 / 5.8 / 8.2 / 6.8 / 7.8 / 8.8 / 6.4 | 7.0 |
| Mermoz | Lyon 8 | 4.9 / 6.8 / 8.0 / 6.0 / 7.0 / 7.4 / 5.2 | 5.2 |
| États-Unis / Santy / Grand Trou | Lyon 8 | 5.0 / 6.7 / 7.7 / 6.0 / 7.2 / 7.2 / 5.6 | 6.2 |
| Vaise / Industrie / Valmy | Lyon 9 | 6.0 / 5.4 / 8.5 / 6.5 / 7.8 / 6.8 / 6.0 | 6.6 |
| Gorge de Loup / Champvert-Nord | Lyon 9 | 6.6 / 5.0 / 8.2 / 5.6 / 7.2 / 6.4 / 7.0 | 6.5 |
| La Duchère | Lyon 9 | 4.4 / 7.0 / 6.5 / 5.6 / 6.8 / 5.8 / 6.8 | 5.2 |
| Saint-Rambert / Rochecardon / Île Barbe | Lyon 9 | 8.2 / 4.5 / 5.6 / 4.0 / 6.8 / 4.8 / 9.2 | 6.3 |
| Charpennes / Tonkin | Villeurbanne | 5.8 / 5.2 / 9.4 / 9.0 / 8.4 / 9.5 / 5.7 | 6.2 |
| La Doua / Croix-Luizet | Villeurbanne | 6.8 / 5.5 / 8.7 / 9.5 / 7.8 / 10.0 / 7.2 | 7.0 |
| Gratte-Ciel / République | Villeurbanne | 6.9 / 5.0 / 9.0 / 7.6 / 8.8 / 8.8 / 6.0 | 7.0 |
| Cusset / Bonnevay | Villeurbanne | 6.0 / 6.0 / 8.4 / 6.2 / 7.5 / 7.4 / 6.6 | 6.7 |
| Grandclément / Maisons-Neuves / Perralière | Villeurbanne | 6.2 / 5.9 / 7.8 / 6.8 / 7.6 / 7.2 / 6.0 | 6.7 |
| Buers / Saint-Jean / Brosses | Villeurbanne | 4.6 / 7.0 / 6.6 / 5.6 / 6.6 / 6.2 / 6.4 | 5.2 |
| Écully | Écully | 8.5 / 2.8 / 5.8 / 5.5 / 7.0 / 7.6 / 8.8 | 6.6 |

## Boundary note

Neighborhood polygons are lower-certainty than commune/arrondissement contours unless sourced from official council boundaries. IRIS labels are not used as user-facing names.