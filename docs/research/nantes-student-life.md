# Nantes student life scoring

## Method

Same seven criteria, same weights, same security cap as app.

Recommended target: **16 readable zones**. Nantes officially has **11 administrative quartiers**, subdivided into IRIS/micro-quartiers. It has **no municipal arrondissements**.

Use official Nantes quartiers as the base. Split only broad areas where the student decision is genuinely different: centre, Hauts-Paves/Saint-Felix, Nantes Nord, Nantes Erdre, Ile de Nantes, and Malakoff/Saint-Donatien.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Nantes Metropole quartier polygons](https://data.nantesmetropole.fr/explore/dataset/244400404_quartiers-communes-nantes-metropole/)
- [Liste des quartiers de Nantes](https://fr.wikipedia.org/wiki/Liste_des_quartiers_de_Nantes)
- [Nantes Universite](https://www.univ-nantes.fr/)
- [Naolib transport](https://naolib.fr/)

## Zone Model

| Code target | Label | Official basis | Role | Notes |
|-------------|-------|----------------|------|-------|
| `nantes-centre-bouffay-commerce` | Centre-ville / Bouffay / Commerce / Graslin | split from Centre-ville | primary | main centre, highest services and nightlife |
| `nantes-talensac-viarme-hauts-paves` | Talensac / Viarme / Hauts-Pavés | split from Hauts-Pavés - Saint-Félix | primary | best central-north daily-life pick |
| `nantes-saint-felix-michelet` | Saint-Félix / Michelet | split from Hauts-Pavés - Saint-Félix | campus | cleanest university-adjacent pick |
| `nantes-facultes-petit-port` | Facultés / Petit-Port | split from Nantes Nord | campus | main north university zone |
| `nantes-nord-context` | Nantes Nord context | remainder of Nantes Nord | context | northern residential/value context |
| `nantes-chantrerie-gachet` | Chantrerie / Gachet | split from Nantes Erdre | campus | green campus/engineering axis |
| `nantes-erdre-context` | Saint-Joseph / Nantes Erdre context | remainder of Nantes Erdre | context | outer north-east family/context belt |
| `nantes-ile-west-centre` | Ile de Nantes west / centre | split from Ile de Nantes | primary | creative island, good services |
| `nantes-ile-east` | Ile de Nantes east | split from Ile de Nantes | context | redevelopment edge, less central comfort |
| `nantes-malakoff` | Malakoff | split from Malakoff - Saint-Donatien | risk_cap | visible cap, do not hide in Saint-Donatien |
| `nantes-saint-donatien` | Saint-Donatien | split from Malakoff - Saint-Donatien | primary | calmer east-centre residential pick |
| `nantes-dervallieres-zola` | Dervallières / Zola | official quartier | risk_cap | mixed west belt with cap pockets |
| `nantes-bellevue-chantenay-sainte-anne` | Bellevue / Chantenay / Sainte-Anne | official quartier | risk_cap | west value/cap plus river edge |
| `nantes-breil-barberie` | Breil / Barberie | official quartier | context | north-west mixed context |
| `nantes-doulon-bottiere` | Doulon / Bottière | official quartier | context | east tram/value belt |
| `nantes-sud` | Nantes Sud | official quartier | context | south Loire context, lower student relevance |

## Geometry Instructions

- Use 11 Nantes administrative quartiers as coverage base.
- Final map geometry uses official `nantes_quartier` polygons for whole parents: Centre-ville, Dervallières-Zola, Bellevue-Chantenay-Sainte-Anne, Breil-Barberie, Doulon-Bottière, Nantes Sud.
- IRIS splits only inside five broad parents: Hauts-Pavés-Saint-Félix, Nantes Nord, Nantes Erdre, Île de Nantes, Malakoff-Saint-Donatien.
- Do not expose 22+ micro-zones again; it overfits the map and weakens readability.
- Keep Malakoff, Bellevue, Dervallières, and Breil visually distinct enough for safety-cap interpretation.
- Full coverage inside Nantes commune is required.

## Verdict

Nantes should be a **16-zone map**: official quartier coverage with a few student-critical splits. 22 zones is too much for this city; 11 zones is too blunt around the university and island.
