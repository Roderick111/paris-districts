# Toulouse student life scoring

## Method

Same seven criteria, same weights, same security cap as app.

Recommended target: **22 readable zones**. Toulouse officially has **20 quartiers de démocratie locale**, formerly grouped into **6 sectors**. It has **no municipal arrondissements**.

Use official quartier geometry as the default. Split only where one official quartier hides a major student decision: the historic centre and the Saint-Michel/Saint-Agne/Empalot belt.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Toulouse Metropole quartiers de democratie locale](https://data.toulouse-metropole.fr/explore/dataset/quartiers-de-democratie-locale/)
- [Quartiers de Toulouse](https://fr.wikipedia.org/wiki/Quartiers_de_Toulouse)
- [Secteurs de Toulouse](https://fr.wikipedia.org/wiki/Secteurs_de_Toulouse)
- [Tisseo network context](https://www.tisseo.fr/)
- [Universite Toulouse Capitole](https://www.ut-capitole.fr/)
- [Universite Toulouse III Paul Sabatier](https://www.univ-tlse3.fr/)
- [Universite Toulouse Jean Jaures](https://www.univ-tlse2.fr/)

## Zone Model

| Code target | Label | Official basis | Role | Notes |
|-------------|-------|----------------|------|-------|
| `toulouse-capitole-carmes` | Capitole / Carmes / Esquirol | split from official centre quartier | primary | expensive, central, strongest services |
| `toulouse-arnaud-bernard-saint-sernin` | Arnaud-Bernard / Saint-Sernin | split from official centre quartier | risk_cap | student energy, central cap |
| `toulouse-amidonniers-compans` | Amidonniers / Compans-Caffarelli | official quartier | primary | calmer central north, good transport |
| `toulouse-chalets-bayard-saint-aubin` | Chalets / Bayard / Saint-Aubin / Dupuy | official quartier | primary | central east residential/student mix |
| `toulouse-bonnefoy-marengo` | Bonnefoy / Marengo / Lapujade | official quartier | context | station-east practical belt |
| `toulouse-saint-cyprien` | Saint-Cyprien | official quartier | primary | strong left-bank student pick |
| `toulouse-croix-pierre-route-espagne` | Croix-de-Pierre / Route d'Espagne | official quartier | context | south-west value corridor |
| `toulouse-arenes-bagatelle-papus` | Arènes / Bagatelle / Papus / Fontaine-Lestang | official quartier | risk_cap | value and metro, visible cap |
| `toulouse-casselardit-cartoucherie` | Casselardit / Cartoucherie | official quartier | context | west redevelopment, mixed student utility |
| `toulouse-minimes-barriere-paris` | Minimes / Barrière de Paris / Ponts-Jumeaux | official quartier | primary | practical north value |
| `toulouse-sept-deniers-lalande` | Sept-Deniers / Lalande | official quartier | context | northern residential edge |
| `toulouse-borderouge-croix-daurade` | Borderouge / Croix-Daurade / Trois Cocus | official quartier | context | north-east residential, mixed cap |
| `toulouse-jolimont-roseraie-soupetard` | Jolimont / Roseraie / Soupetard / Gramont | official quartier | context | east metro/value belt |
| `toulouse-guilhemery-cote-pavee` | Guilheméry / Côte Pavée / Château de l'Hers | official quartier | context | calmer, higher comfort, less student energy |
| `toulouse-demoiselles-montaudran` | Pont des Demoiselles / Montaudran | official quartier | context | south-east connector, aerospace/work edge |
| `toulouse-rangueil-sauzelong` | Rangueil / Sauzelong / Pech-David / Pouvourville | official quartier | campus | main Paul-Sabatier campus axis |
| `toulouse-saint-michel-saint-agne` | Saint-Michel / Saint-Agne / Busca | split from official south-centre quartier | primary | central-south student belt |
| `toulouse-empalot-ramier` | Empalot / Ile du Ramier | split from official south-centre quartier | risk_cap | south cap/value zone |
| `toulouse-purpan-saint-martin` | Purpan / Saint-Martin-du-Touch | official quartier | campus | Purpan/aerospace campus-work belt |
| `toulouse-lardenne-pradettes-basso-cambo` | Lardenne / Pradettes / Basso-Cambo | official quartier | context | west residential and metro terminus |
| `toulouse-mirail-reynerie-bellefontaine` | Mirail-Université / Reynerie / Bellefontaine | official quartier | risk_cap | university access plus hard cap |
| `toulouse-saint-simon-lafourguette-oncopole` | Saint-Simon / Lafourguette / Oncopole | official quartier | low_relevance | peripheral south-west context |

## Geometry Instructions

- Use official Toulouse quartier polygons for 20 base areas.
- Split only `Capitole / Arnaud Bernard / Carmes` and `Saint-Michel / Saint-Agne / Empalot / Le Busca / Ile du Ramier / Monplaisir`.
- If splitting requires IRIS, group IRIS into the named readable districts; do not expose IRIS as final user-facing zones.
- Full coverage inside Toulouse commune is required.
- No watershed fill, hand-drawn polygons, or rectangle cuts.

## Verdict

Toulouse should be a **22-zone official-quartier map with two student-critical splits**. Current count is close, but final geometry should look like official district coverage, not scattered micro-polygons.
