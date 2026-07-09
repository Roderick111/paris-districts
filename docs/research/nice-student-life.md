# Nice student life scoring

## Method

Same seven criteria, same weights, same security cap as app.

Recommended target: **20 readable zones**. Nice has many recognized quartiers; the city currently uses broad territory groupings, and common references list roughly **41 quartiers**. It has **no municipal arrondissements**.

Use official Nice quartier polygons where available, grouped into readable coastal, centre, campus, hill, and east-risk districts. Do not use raw IRIS as final geometry.

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Nice quartier context](https://fr.wikipedia.org/wiki/Liste_des_quartiers_de_Nice)
- [Nice Cote d'Azur quartier layer](https://cartes.nicecotedazur.org/heberge/rest/services/Limites_administratives/MapServer/10/query?where=1%3D1&outFields=QUARTIER&outSR=4326&f=geojson)
- [Universite Cote d'Azur](https://univ-cotedazur.fr/)
- [Lignes d'Azur network](https://www.lignesdazur.com/)
- [EDHEC Nice](https://www.edhec.edu/)

## Zone Model

| Code target | Label | Official basis | Role | Notes |
|-------------|-------|----------------|------|-------|
| `nice-vieux-nice-port` | Vieux-Nice / Port / Garibaldi | quartier group | primary | historic centre/east lifestyle, tourist pressure |
| `nice-jean-medecin-massena` | Jean-Médecin / Masséna | quartier group | primary | central services, expensive, strong transit |
| `nice-thiers-musiciens` | Thiers / Musiciens | quartier group | primary | station-west central belt |
| `nice-liberation-valrose` | Libération / Borriglione / Valrose | quartier group | campus | best north-centre student axis |
| `nice-vernier-saint-maurice` | Vernier / Saint-Maurice | quartier group | primary | north-centre practical belt |
| `nice-cimiez` | Cimiez | official quartier | context | high-comfort hill district, weak value |
| `nice-rimiez-gairaut` | Rimiez / Gairaut | quartier group | low_relevance | green hill context, low student utility |
| `nice-riquier-saint-roch` | Riquier / Saint-Roch | quartier group | context | east tram/value belt |
| `nice-saint-jean-angely` | Saint-Jean-d'Angély | official quartier/group | campus | east campus pole |
| `nice-pasteur` | Pasteur | official quartier | risk_cap | east value with visible cap |
| `nice-ariane` | Ariane | official quartier | risk_cap | hard cap, do not merge away |
| `nice-carre-or-rue-france` | Carré d'Or / Rue de France / Promenade | quartier group | primary | central-west coast, expensive |
| `nice-baumettes-magnan` | Baumettes / Magnan | quartier group | primary | west coast student/residential mix |
| `nice-carlone` | Carlone / Fac de Lettres | official quartier/group | campus | west campus anchor |
| `nice-madeleine` | Madeleine | official quartier | context | west valley practical zone |
| `nice-fabron-lanterne` | Fabron / Lanterne | quartier group | context | west residential hill/coast context |
| `nice-arenas-saint-augustin` | Arenas / Saint-Augustin / EDHEC | quartier group | campus | airport-edge EDHEC/transport pole |
| `nice-moulins-caucade` | Moulins / Caucade | quartier group | risk_cap | west value/cap belt |
| `nice-saint-isidore-cremat` | Saint-Isidore / Crémat | quartier group | low_relevance | far-west context, car-oriented |
| `nice-mont-boron-mont-alban` | Mont Boron / Mont Alban | quartier group | context | premium east hill/littoral comfort |

## Geometry Instructions

- Use Nice quartier polygons as primary geometry.
- Group official quartiers into the 20 readable zones above.
- Do not make 30 IRIS-texture zones; Nice looks worse when over-split.
- Keep Ariane, Pasteur, Moulins/Caucade separate as cap zones.
- Keep Valrose, Saint-Jean-d'Angély, Carlone, and Arenas/EDHEC separate as campus poles.
- Exclude sea-only or airport-runway geometry from clickable student areas where possible.

## Verdict

Nice should be a **20-zone corridor map**: west campus, central coast, Valrose, east campus/risk belt, hills, and airport/EDHEC edge. 30 zones is too noisy; 10 zones is too blunt.
