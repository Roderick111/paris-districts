# Marseille student life scoring

## Method

Same seven criteria, same weights, same security cap as app.

Upgrade target: **30 readable official-quartier zones**, not 18 overbroad blobs and not 111 raw quartiers. Marseille has 111 official quartiers, but the map needs human-readable coverage: enough zones to avoid giant misleading areas, still coarse enough to avoid IRIS-style visual noise.

Rule:

> Geometry, score evidence, and label must use same granularity.

Boundary confidence:

- **high** for one official quartier or a small contiguous quartier group
- **medium** for central mixed districts and campus/context belts
- **low** for outer-city context or risk-cap belts

## Source Notes

Primary:

- [SSMSI crime dataset](https://www.data.gouv.fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales)
- [INSEE IRIS definition](https://www.insee.fr/fr/metadonnees/definition/c1523)
- [Aix-Marseille-Provence official Marseille quartiers](https://data.ampmetropole.fr/explore/dataset/a7104f3c-e487-4af3-82ad-6197cedfaeb1/)
- [Quartiers de Marseille](https://fr.wikipedia.org/wiki/Quartiers_de_Marseille)
- [Secteurs et arrondissements de Marseille](https://fr.wikipedia.org/wiki/Secteurs_et_arrondissements_de_Marseille)
- [Aix-Marseille University](https://www.univ-amu.fr/)
- [RTM network](https://www.rtm.fr/)

## Upgrade Rationale

Marseille needs official quartier grouping, not fake micro-precision.

- Current 18-zone implementation overcompresses Marseille: some features span many quartiers or several arrondissements.
- The 18-zone geometry creates a screenshot problem: tiny central zones next to huge outer blobs, with large white gaps and unclear city logic.
- Raw 111 official quartiers would cover the city but would be too noisy for a student quality map.
- IRIS is the wrong default here: it produces fragment texture, not meaningful neighborhoods.
- Official quartiers are the correct source units because Marseille has a stable official quartier system and recognizable arrondissement structure.

Better shape:

- dense but readable central corridor
- separate campus axes for Timone, Luminy, Saint-Jerome, and Chateau-Gombert
- official-arrondissement context for east, south, and north belts
- no IRIS fallback unless an official quartier polygon is missing
- no hand-drawn or rectangular polygons

## 30-Zone Model

Order: security / affordability / transport / studentEnergy / services / campusAccess / greenCalm -> total.

Totals are computed with existing app weights and security cap (`<5 -> 5.2`, `<6 -> 6.2`, `<7 -> 7.0`, `<8 -> 7.8`). Scores are evidence-aligned planning values for implementation, not block-level claims.

| Code | Label | Arr. | Role | Official quartier grouping | Scores -> total |
|------|-------|------|------|----------------------------|-----------------|
| `marseille-saint-charles-chapitre` | Saint-Charles / Le Chapitre | 1e | primary | Saint-Charles, Chapitre, Thiers | 4.2 / 5.8 / 9.3 / 8.1 / 7.5 / 9.0 / 3.4 -> **5.2** |
| `marseille-belsunce-noailles` | Belsunce / Noailles | 1e | risk_cap | Belsunce, Noailles | 3.6 / 6.5 / 9.4 / 8.7 / 7.9 / 8.4 / 2.7 -> **4.4** |
| `marseille-vieux-port-opera` | Vieux-Port / Opera | 1e | primary | Opera | 5.2 / 3.2 / 9.5 / 8.6 / 9.2 / 7.8 / 3.8 -> **6.2** |
| `marseille-panier-hotel-de-ville` | Panier / Hotel de Ville | 2e | primary | Hotel de Ville, Grands Carmes | 5.1 / 3.7 / 9.0 / 8.0 / 8.6 / 7.5 / 4.2 -> **6.2** |
| `marseille-joliette-arenc` | Joliette / Arenc | 2e | primary | La Joliette, Arenc | 5.6 / 4.2 / 9.1 / 7.4 / 8.2 / 7.8 / 4.6 -> **6.2** |
| `marseille-belle-de-mai` | Belle de Mai | 3e | risk_cap | Belle de Mai | 3.9 / 6.8 / 8.0 / 7.4 / 6.8 / 8.2 / 3.8 -> **4.4** |
| `marseille-saint-mauront-villette` | Saint-Mauront / Villette | 3e | risk_cap | Saint-Mauront, La Villette, Saint-Lazare | 3.5 / 7.1 / 7.6 / 6.6 / 6.2 / 7.2 / 3.4 -> **4.4** |
| `marseille-cinq-avenues-chartreux` | Cinq-Avenues / Chartreux | 4e | primary | Cinq-Avenues, Les Chartreux | 6.0 / 5.2 / 8.5 / 7.0 / 7.8 / 7.4 / 5.4 -> **6.6** |
| `marseille-blancarde-chutes-lavie` | Blancarde / Chutes-Lavie | 4e | primary | La Blancarde, Chutes-Lavie | 5.6 / 5.9 / 8.3 / 7.1 / 7.4 / 8.0 / 4.8 -> **6.2** |
| `marseille-baille-timone-conception` | Baille / Timone / Conception | 5e | campus | Baille, La Timone, La Conception | 6.2 / 5.2 / 9.1 / 8.3 / 8.2 / 9.8 / 5.1 -> **7.0** |
| `marseille-camas-saint-pierre` | Camas / Saint-Pierre | 5e | primary | Le Camas, Saint-Pierre | 5.8 / 5.8 / 8.5 / 7.5 / 7.8 / 8.4 / 4.8 -> **6.2** |
| `marseille-cours-julien-plaine` | Cours Julien / La Plaine | 6e | primary | Notre-Dame-du-Mont, Lodi | 5.2 / 5.6 / 8.9 / 9.8 / 8.5 / 8.2 / 3.7 -> **6.2** |
| `marseille-castellane-prefecture` | Castellane / Prefecture | 6e | primary | Castellane, Prefecture, Palais de Justice | 6.5 / 3.6 / 9.3 / 7.5 / 8.9 / 8.3 / 4.6 -> **6.8** |
| `marseille-vauban-roucas` | Vauban / Roucas-Blanc | 6e/7e | primary | Vauban, Roucas-Blanc | 7.0 / 2.9 / 7.8 / 6.7 / 8.2 / 6.8 / 7.0 -> **6.5** |
| `marseille-endoume-catalans-pharo` | Endoume / Catalans / Pharo | 7e | primary | Endoume, Le Pharo, Saint-Victor, Bompard, Saint-Lambert | 7.2 / 2.6 / 7.7 / 6.8 / 8.0 / 6.7 / 7.8 -> **6.6** |
| `marseille-rouet-perier` | Rouet / Perier | 8e | primary | Le Rouet, Perier | 7.1 / 3.5 / 8.9 / 6.8 / 8.6 / 7.7 / 5.9 -> **6.9** |
| `marseille-prado-saint-giniez` | Prado / Saint-Giniez | 8e | primary | Saint-Giniez, La Plage | 7.6 / 2.6 / 8.6 / 6.0 / 8.8 / 7.0 / 6.6 -> **6.7** |
| `marseille-bonneveine-pointe-rouge` | Bonneveine / Pointe-Rouge | 8e | context | Bonneveine, Pointe-Rouge, Vieille Chapelle, Montredon | 7.1 / 3.9 / 7.6 / 6.0 / 8.0 / 6.8 / 7.4 -> **6.6** |
| `marseille-mazargues-sainte-anne` | Mazargues / Sainte-Anne | 8e/9e | context | Mazargues, Sainte-Anne, Les Baumettes, Le Cabot | 6.8 / 4.6 / 7.4 / 6.4 / 7.6 / 7.4 / 7.0 -> **6.6** |
| `marseille-luminy-redon` | Luminy / Redon | 9e | campus | Le Redon, La Panouse, Carpiagne | 7.8 / 4.5 / 6.4 / 7.6 / 6.7 / 10.0 / 9.8 -> **7.3** |
| `marseille-calanques-hills-context` | Calanques / Hills Context | 9e | low_relevance | Vaufreges, Sormiou, Les Goudes, Les Borels | 8.2 / 4.0 / 5.8 / 4.2 / 5.8 / 6.5 / 10.0 -> **6.4** |
| `marseille-capelette-pont-vivaux` | Capelette / Pont-de-Vivaux | 10e | context | La Capelette, Menpenti, Pont-de-Vivaux | 5.2 / 6.4 / 7.8 / 6.6 / 7.0 / 7.0 / 5.0 -> **6.2** |
| `marseille-saint-loup-saint-tronc` | Saint-Loup / Saint-Tronc | 10e | context | Saint-Loup, Saint-Tronc | 5.5 / 6.2 / 7.3 / 6.0 / 6.8 / 6.5 / 5.4 -> **6.1** |
| `marseille-valentine-saint-marcel` | Valentine / Saint-Marcel | 11e | context | La Valentine, Saint-Marcel, Saint-Menet, La Barasse, La Milliere, La Pomme | 5.8 / 6.4 / 6.9 / 5.8 / 6.8 / 6.0 / 5.8 -> **6.2** |
| `marseille-11e-hills-context` | 11e Hills Context | 11e | context | La Treille, Eoures, Les Accates, Les Camoins | 5.6 / 6.6 / 6.2 / 5.2 / 6.2 / 5.6 / 6.8 -> **5.8** |
| `marseille-valbarelle-low` | Valbarelle | 11e | low_relevance | La Valbarelle | 5.4 / 6.8 / 5.8 / 4.8 / 5.8 / 5.2 / 7.0 -> **5.6** |
| `marseille-saint-barnabe-montolivet` | Saint-Barnabe / Montolivet | 12e | context | Saint-Barnabe, Montolivet, Saint-Julien, Les Caillols, La Fourragere, Les Trois-Lucs, Saint-Jean-du-Desert | 6.4 / 5.4 / 7.8 / 6.0 / 7.4 / 6.2 / 6.2 -> **6.5** |
| `marseille-saint-jerome-la-rose` | Saint-Jerome / La Rose | 13e | campus | Saint-Jerome, La Rose, Malpasse, Saint-Just | 5.6 / 6.6 / 7.3 / 7.6 / 7.2 / 9.2 / 6.0 -> **6.2** |
| `marseille-chateau-gombert-saint-mitre` | Chateau-Gombert / Saint-Mitre | 13e | campus | Chateau-Gombert, Saint-Mitre, Les Olives, Les Medecins, Les Mourets, La Croix Rouge, Palama | 6.3 / 6.2 / 6.8 / 7.1 / 7.0 / 8.8 / 7.0 -> **6.8** |
| `marseille-14e-north-risk` | 14e North Risk Belt | 14e | risk_cap | Bon Secours, Le Canet, Le Merlan, Les Arnavaux, Saint-Barthelemy, Saint-Joseph, Sainte-Marthe | 3.4 / 7.2 / 7.0 / 5.2 / 6.4 / 5.8 / 4.4 -> **4.4** |
| `marseille-15e-port-north-risk` | 15e Port / North Risk Belt | 15e | risk_cap | La Cabucelle, La Calade, La Delorme, La Viste, Les Aygalades, Les Crottes, Saint-Antoine, Saint-Louis, Verduron, Notre-Dame-Limite | 2.8 / 7.8 / 6.3 / 4.2 / 5.8 / 5.0 / 4.6 -> **3.4** |
| `marseille-estaque-16e` | Estaque / 16e | 16e | low_relevance | L'Estaque, Saint-Henri, Saint-Andre, Les Riaux | 5.2 / 6.5 / 5.8 / 4.5 / 5.8 / 4.6 / 5.6 -> **5.4** |

## Geometry Instructions

- Use **official Marseille quartier polygons** as the only default geometry source.
- Build every feature by dissolving whole official quartiers.
- Do not use IRIS for Marseille unless one official quartier polygon is missing and there is no official replacement.
- Do not create hand-drawn polygons, lat/lon rectangles, centroid buffers, or watershed fills.
- Do not merge across multiple arrondissements unless the label explicitly says so and the grouping is visually meaningful.
- Keep central zones smaller and outer zones broader, but do not let an outer context zone span a visually confusing chunk of the city.
- `allowMultipart` is acceptable only when the official source quartier is multipart or when the zone is a documented peripheral context group.
- White gaps inside the target commune are a bug unless they are water, parks with no source polygon, or outside official Marseille quartier coverage.

## Implementation Notes

- Replace current 18 Marseille rows in `src/data/marseillePlaces.ts` with these 30 rows.
- Replace current Marseille geometry specs in `scripts/granularity_geometry.json` and `scripts/granularity_intended.json` with the 30 official-quartier groups above.
- Rebuild `public/data/marseille.geojson`.
- Validate with:

```bash
python3 scripts/build_new_city_geojson.py marseille
python3 scripts/validate_city_geojson.py marseille
~/.bun/bin/bun run build
```

Browser acceptance:

- City title: `Marseille official quartiers + campus belts`
- Map should show readable near-full Marseille coverage at default zoom.
- Center should not be swallowed by huge blobs.
- 14e/15e should be visibly caution-colored because security cap dominates.
- Luminy / Redon should be a distinct high-scoring campus zone.
- No random IRIS shard texture.

## Verdict

Best Marseille map is **30 official-quartier zones**.

18 zones are too blunt. 111 quartiers are too noisy. IRIS is the wrong source for this city. Use official quartiers, group them into readable district-scale features, and score fallback context at the district/arrondissement reputation level when granular evidence is weak.
