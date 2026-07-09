import type { PlaceScore } from "@/data/cities";

export const marseilleMicroPlaces: PlaceScore[] = [
  {
    id: "marseille-saint-charles-chapitre", cityId: "marseille", name: "Saint-Charles / Le Chapitre", code: "marseille-saint-charles-chapitre", kind: "quartier",
    area: "1e", granularity: "micro", parentName: "1e",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Saint-Charles, Chapitre, Thiers; rail and metro gateway corridor.",
    scores: { security: 4.2, affordability: 5.8, transport: 9.3, studentEnergy: 8.1, services: 7.5, campusAccess: 9.0, greenCalm: 3.4 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Busy 1e gateway with strong transit and mixed comfort.",
    caveat: "Convenient for arrivals and links; block choice still matters for safety."
  },
  {
    id: "marseille-belsunce-noailles", cityId: "marseille", name: "Belsunce / Noailles", code: "marseille-belsunce-noailles", kind: "quartier",
    area: "1e", granularity: "micro", parentName: "1e",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Belsunce, Noailles; highest-pressure central core with hard safety cap.",
    scores: { security: 3.6, affordability: 6.5, transport: 9.4, studentEnergy: 8.7, services: 7.9, campusAccess: 8.4, greenCalm: 2.7 },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Central energy and value with a hard safety cap.",
    caveat: "Cheap rent and transit cannot offset the risk profile."
  },
  {
    id: "marseille-vieux-port-opera", cityId: "marseille", name: "Vieux-Port / Opera", code: "marseille-vieux-port-opera", kind: "quartier",
    area: "1e", granularity: "micro", parentName: "1e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group around Opera; central waterfront and tourist pressure.",
    scores: { security: 5.2, affordability: 3.2, transport: 9.5, studentEnergy: 8.6, services: 9.2, campusAccess: 7.8, greenCalm: 3.8 },
    rentLevel: "high", studentFit: "good",
    summary: "Iconic central district with premium rent and strong services.",
    caveat: "Lifestyle prestige, not a student value default."
  },
  {
    id: "marseille-panier-hotel-de-ville", cityId: "marseille", name: "Panier / Hotel de Ville", code: "marseille-panier-hotel-de-ville", kind: "quartier",
    area: "2e", granularity: "micro", parentName: "2e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Hotel de Ville, Grands-Carmes; historic 2e core.",
    scores: { security: 5.1, affordability: 3.7, transport: 9.0, studentEnergy: 8.0, services: 8.6, campusAccess: 7.5, greenCalm: 4.2 },
    rentLevel: "high", studentFit: "good",
    summary: "Historic 2e centre with dense services and central access.",
    caveat: "Atmospheric but expensive; comfort varies block to block."
  },
  {
    id: "marseille-joliette-arenc", cityId: "marseille", name: "Joliette / Arenc", code: "marseille-joliette-arenc", kind: "quartier",
    area: "2e", granularity: "micro", parentName: "2e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Joliette, Arenc; regenerated waterfront and Euromed edge.",
    scores: { security: 5.6, affordability: 4.2, transport: 9.1, studentEnergy: 7.4, services: 8.2, campusAccess: 7.8, greenCalm: 4.6 },
    rentLevel: "high", studentFit: "good",
    summary: "Regenerated 2e port belt with strong transit and rising student utility.",
    caveat: "New-build feel; less historic charm than Panier."
  },
  {
    id: "marseille-belle-de-mai", cityId: "marseille", name: "Belle de Mai", code: "marseille-belle-de-mai", kind: "quartier",
    area: "3e", granularity: "micro", parentName: "3e",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Belle de Mai quartier; cheap 3e belt with visible safety cap.",
    scores: { security: 3.9, affordability: 6.8, transport: 8.0, studentEnergy: 7.4, services: 6.8, campusAccess: 8.2, greenCalm: 3.8 },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Affordable 3e pocket capped by safety despite useful links.",
    caveat: "Budget option only if you accept the risk profile."
  },
  {
    id: "marseille-saint-mauront-villette", cityId: "marseille", name: "Saint-Mauront / Villette", code: "marseille-saint-mauront-villette", kind: "quartier",
    area: "3e", granularity: "micro", parentName: "3e",
    confidence: "medium", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Saint-Mauront, Villette, Saint-Lazare; rougher 3e north belt.",
    scores: { security: 3.5, affordability: 7.1, transport: 7.6, studentEnergy: 6.6, services: 6.2, campusAccess: 7.2, greenCalm: 3.4 },
    rentLevel: "lower", studentFit: "weak",
    summary: "Cheapest 3e belt with hard safety cap and weaker comfort.",
    caveat: "Value rent cannot offset reputation and block-level caution."
  },
  {
    id: "marseille-cinq-avenues-chartreux", cityId: "marseille", name: "Cinq-Avenues / Chartreux", code: "marseille-cinq-avenues-chartreux", kind: "quartier",
    area: "4e", granularity: "micro", parentName: "4e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Cinq-Avenues, Chartreux; inner-east tram corridor.",
    scores: { security: 6.0, affordability: 5.2, transport: 8.5, studentEnergy: 7.0, services: 7.8, campusAccess: 7.4, greenCalm: 5.4 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Practical 4e east-side belt with tram access and moderate rent.",
    caveat: "Useful compromise, not a nightlife hub."
  },
  {
    id: "marseille-blancarde-chutes-lavie", cityId: "marseille", name: "Blancarde / Chutes-Lavie", code: "marseille-blancarde-chutes-lavie", kind: "quartier",
    area: "4e", granularity: "micro", parentName: "4e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Blancarde, Chutes-Lavie; residential 4e inner-east.",
    scores: { security: 5.6, affordability: 5.9, transport: 8.3, studentEnergy: 7.1, services: 7.4, campusAccess: 8.0, greenCalm: 4.8 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Residential 4e belt with decent tram value and moderate student presence.",
    caveat: "Calmer than centre; less social energy."
  },
  {
    id: "marseille-baille-timone-conception", cityId: "marseille", name: "Baille / Timone / Conception", code: "marseille-baille-timone-conception", kind: "quartier",
    area: "5e", granularity: "micro", parentName: "5e",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Baille, Timone, Conception; strongest AMU central campus corridor.",
    scores: { security: 6.2, affordability: 5.2, transport: 9.1, studentEnergy: 8.3, services: 8.2, campusAccess: 9.8, greenCalm: 5.1 },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Best central campus corridor with structural university access.",
    caveat: "Campus-first pick, not a historic-centre lifestyle zone."
  },
  {
    id: "marseille-camas-saint-pierre", cityId: "marseille", name: "Camas / Saint-Pierre", code: "marseille-camas-saint-pierre", kind: "quartier",
    area: "5e", granularity: "micro", parentName: "5e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Camas, Saint-Pierre; 5e residential belt near campus south edge.",
    scores: { security: 5.8, affordability: 5.8, transport: 8.5, studentEnergy: 7.5, services: 7.8, campusAccess: 8.4, greenCalm: 4.8 },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced 5e residential belt with campus adjacency and moderate rent.",
    caveat: "Quieter than Baille; still campus-adjacent."
  },
  {
    id: "marseille-cours-julien-plaine", cityId: "marseille", name: "Cours Julien / La Plaine", code: "marseille-cours-julien-plaine", kind: "quartier",
    area: "6e", granularity: "micro", parentName: "6e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Notre-Dame-du-Mont, Lodi; top student-energy 6e corridor.",
    scores: { security: 5.2, affordability: 5.6, transport: 8.9, studentEnergy: 9.8, services: 8.5, campusAccess: 8.2, greenCalm: 3.7 },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Top student social district with dense nightlife and central access.",
    caveat: "Social life is real; calm and safety are not automatic."
  },
  {
    id: "marseille-castellane-prefecture", cityId: "marseille", name: "Castellane / Prefecture", code: "marseille-castellane-prefecture", kind: "quartier",
    area: "6e", granularity: "micro", parentName: "6e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Castellane, Prefecture, Palais de Justice; central premium mixed 6e.",
    scores: { security: 6.5, affordability: 3.6, transport: 9.3, studentEnergy: 7.5, services: 8.9, campusAccess: 8.3, greenCalm: 4.6 },
    rentLevel: "high", studentFit: "good",
    summary: "Connected 6e premium belt with strong services and high rent.",
    caveat: "Comfortable and central, but weak on student value."
  },
  {
    id: "marseille-vauban-roucas", cityId: "marseille", name: "Vauban / Roucas-Blanc", code: "marseille-vauban-roucas", kind: "quartier",
    area: "6e/7e", granularity: "micro", parentName: "6e/7e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Vauban, Roucas-Blanc; lived premium belt across 6e/7e border.",
    scores: { security: 7.0, affordability: 2.9, transport: 7.8, studentEnergy: 6.7, services: 8.2, campusAccess: 6.8, greenCalm: 7.0 },
    rentLevel: "very high", studentFit: "good",
    summary: "Premium hillside belt with safety, sea views, and high rent.",
    caveat: "Quality-of-life pick, not a campus or value default."
  },
  {
    id: "marseille-pharo-bompard-coast", cityId: "marseille", name: "Pharo / Bompard / Coast", code: "marseille-pharo-bompard-coast", kind: "quartier",
    area: "7e", granularity: "micro", parentName: "7e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Pharo, Saint-Victor, Bompard, Saint-Lambert; compact 7e coastal belt.",
    scores: { security: 7.2, affordability: 2.6, transport: 7.7, studentEnergy: 6.8, services: 8.0, campusAccess: 6.7, greenCalm: 7.8 },
    rentLevel: "very high", studentFit: "good",
    summary: "Coastal 7e belt with premium rent, safety, and sea access.",
    caveat: "Lifestyle prestige; weak campus utility."
  },
  {
    id: "marseille-endoume-context", cityId: "marseille", name: "Endoume Context", code: "marseille-endoume-context", kind: "quartier",
    area: "7e", granularity: "micro", parentName: "7e",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Endoume quartier coverage; fragmented tessellation handled as context filler.",
    scores: { security: 7.0, affordability: 2.8, transport: 7.4, studentEnergy: 6.2, services: 7.6, campusAccess: 6.5, greenCalm: 7.6 },
    rentLevel: "very high", studentFit: "mixed",
    summary: "Endoume peninsula context with premium rent and calm coastal pockets.",
    caveat: "Coverage filler across fragmented official geometry, not one compact student pick."
  },
  {
    id: "marseille-rouet-perier", cityId: "marseille", name: "Rouet / Perier", code: "marseille-rouet-perier", kind: "quartier",
    area: "8e", granularity: "micro", parentName: "8e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Rouet, Perier; safer premium 8e south-side belt.",
    scores: { security: 7.1, affordability: 3.5, transport: 8.9, studentEnergy: 6.8, services: 8.6, campusAccess: 7.7, greenCalm: 5.9 },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer 8e premium zone with calmer daily life and high rent.",
    caveat: "Quality-of-life pick, not a value student default."
  },
  {
    id: "marseille-prado-saint-giniez", cityId: "marseille", name: "Prado / Saint-Giniez", code: "marseille-prado-saint-giniez", kind: "quartier",
    area: "8e", granularity: "micro", parentName: "8e",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Saint-Giniez, La Plage; Prado premium 8e corridor.",
    scores: { security: 7.6, affordability: 2.6, transport: 8.6, studentEnergy: 6.0, services: 8.8, campusAccess: 7.0, greenCalm: 6.6 },
    rentLevel: "very high", studentFit: "good",
    summary: "Prado-side premium 8e with strong services and low student energy.",
    caveat: "Comfort suburb-in-the-city, not a student social hub."
  },
  {
    id: "marseille-bonneveine-pointe-rouge", cityId: "marseille", name: "Bonneveine / Pointe-Rouge", code: "marseille-bonneveine-pointe-rouge", kind: "quartier",
    area: "8e", granularity: "micro", parentName: "8e",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier context group across 8e south-coast residential belt.",
    scores: { security: 7.1, affordability: 3.9, transport: 7.6, studentEnergy: 6.0, services: 8.0, campusAccess: 6.8, greenCalm: 7.4 },
    rentLevel: "high", studentFit: "mixed",
    summary: "Calm 8e south-coast context with moderate student relevance.",
    caveat: "Broad district; car-dependent pockets in parts."
  },
  {
    id: "marseille-mazargues-sainte-anne", cityId: "marseille", name: "Mazargues / Sainte-Anne", code: "marseille-mazargues-sainte-anne", kind: "quartier",
    area: "8e/9e", granularity: "micro", parentName: "8e/9e",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier context group across Mazargues and Sainte-Anne south belt.",
    scores: { security: 6.8, affordability: 4.6, transport: 7.4, studentEnergy: 6.4, services: 7.6, campusAccess: 7.4, greenCalm: 7.0 },
    rentLevel: "high", studentFit: "mixed",
    summary: "Residential south context with moderate campus links and calm streets.",
    caveat: "Honest broad context zone, not a precise micro-pick."
  },
  {
    id: "marseille-carpaigne-context", cityId: "marseille", name: "Carpiagne Context", code: "marseille-carpaigne-context", kind: "quartier",
    area: "9e", granularity: "micro", parentName: "9e",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Carpiagne quartier; detached 9e hills context separated from Luminy campus belt.",
    scores: { security: 7.4, affordability: 4.8, transport: 6.0, studentEnergy: 5.0, services: 6.0, campusAccess: 6.8, greenCalm: 9.2 },
    rentLevel: "high", studentFit: "mixed",
    summary: "Detached 9e hills context between campus south and calanques fringe.",
    caveat: "Coverage filler, not a Luminy housing substitute."
  },
  {
    id: "marseille-luminy-redon", cityId: "marseille", name: "Luminy / Redon", code: "marseille-luminy-redon", kind: "quartier",
    area: "9e", granularity: "micro", parentName: "9e",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Redon, Panouse; Luminy campus-access belt without distant Carpiagne fringe.",
    scores: { security: 7.8, affordability: 4.5, transport: 6.4, studentEnergy: 7.6, services: 6.7, campusAccess: 10.0, greenCalm: 9.8 },
    rentLevel: "high", studentFit: "excellent",
    summary: "Campus-first south end with Luminy access and exceptional green calm.",
    caveat: "Best for campus and nature; weak central-city social life."
  },
  {
    id: "marseille-vaufreges-low", cityId: "marseille", name: "Vaufreges", code: "marseille-vaufreges-low", kind: "quartier",
    area: "9e", granularity: "micro", parentName: "9e",
    confidence: "low", coverageRole: "low_relevance", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Vaufreges quartier; peripheral calanques edge with low student utility.",
    scores: { security: 8.2, affordability: 4.0, transport: 5.8, studentEnergy: 4.2, services: 5.8, campusAccess: 6.5, greenCalm: 10.0 },
    rentLevel: "high", studentFit: "weak",
    summary: "Peripheral Vaufreges calanques fringe with nature access and low student utility.",
    caveat: "Scenic fringe belt, not a daily student base."
  },
  {
    id: "marseille-sormiou-low", cityId: "marseille", name: "Sormiou", code: "marseille-sormiou-low", kind: "quartier",
    area: "9e", granularity: "micro", parentName: "9e",
    confidence: "low", coverageRole: "low_relevance", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Sormiou quartier; detached calanques cove with low student utility.",
    scores: { security: 8.2, affordability: 4.0, transport: 5.8, studentEnergy: 4.2, services: 5.8, campusAccess: 6.5, greenCalm: 10.0 },
    rentLevel: "high", studentFit: "weak",
    summary: "Sormiou calanques pocket with exceptional green calm and weak student utility.",
    caveat: "Remote coastal fringe, not a housing search target."
  },
  {
    id: "marseille-les-goudes-low", cityId: "marseille", name: "Les Goudes", code: "marseille-les-goudes-low", kind: "quartier",
    area: "9e", granularity: "micro", parentName: "9e",
    confidence: "low", coverageRole: "low_relevance", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Les Goudes quartier; southern calanques terminus with low student utility.",
    scores: { security: 8.2, affordability: 4.0, transport: 5.8, studentEnergy: 4.2, services: 5.8, campusAccess: 6.5, greenCalm: 10.0 },
    rentLevel: "high", studentFit: "weak",
    summary: "Les Goudes calanques edge with nature access and minimal student relevance.",
    caveat: "Honest peripheral coverage, not a student district."
  },
  {
    id: "marseille-capelette-pont-vivaux", cityId: "marseille", name: "Capelette / Pont-de-Vivaux", code: "marseille-capelette-pont-vivaux", kind: "quartier",
    area: "10e", granularity: "micro", parentName: "10e",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official 10e context group: Capelette, Menpenti, Pont-de-Vivaux.",
    scores: { security: 5.2, affordability: 6.4, transport: 7.8, studentEnergy: 6.6, services: 7.0, campusAccess: 7.0, greenCalm: 5.0 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Practical 10e east context with moderate transport and value.",
    caveat: "Broad arrondissement context, not a headline student pick."
  },
  {
    id: "marseille-saint-loup-saint-tronc", cityId: "marseille", name: "Saint-Loup / Saint-Tronc", code: "marseille-saint-loup-saint-tronc", kind: "quartier",
    area: "10e", granularity: "micro", parentName: "10e",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official 10e context group: Saint-Loup, Saint-Tronc.",
    scores: { security: 5.5, affordability: 6.2, transport: 7.3, studentEnergy: 6.0, services: 6.8, campusAccess: 6.5, greenCalm: 5.4 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Residential 10e context with tolerable value and moderate links.",
    caveat: "Commuter-value belt, limited student scene."
  },
  {
    id: "marseille-valentine-saint-marcel", cityId: "marseille", name: "Valentine / Saint-Marcel", code: "marseille-valentine-saint-marcel", kind: "quartier",
    area: "11e", granularity: "micro", parentName: "11e",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Contiguous 11e Valentine corridor official quartiers.",
    scores: { security: 5.8, affordability: 6.4, transport: 6.9, studentEnergy: 5.8, services: 6.8, campusAccess: 6.0, greenCalm: 5.8 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Practical 11e east belt with moderate transport and mixed student relevance.",
    caveat: "Honest context zone across the Valentine corridor quartiers."
  },
  {
    id: "marseille-11e-hills-context", cityId: "marseille", name: "11e Hills Context", code: "marseille-11e-hills-context", kind: "quartier",
    area: "11e", granularity: "micro", parentName: "11e",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Separated 11e hills official quartiers: Treille, Eoures, Accates, Camoins.",
    scores: { security: 5.6, affordability: 6.6, transport: 6.2, studentEnergy: 5.2, services: 6.2, campusAccess: 5.6, greenCalm: 6.8 },
    rentLevel: "lower", studentFit: "weak",
    summary: "Outer 11e hills context with lower student energy and patchy transport.",
    caveat: "Peripheral hills belt; not a student destination."
  },
  {
    id: "marseille-valbarelle-low", cityId: "marseille", name: "Valbarelle", code: "marseille-valbarelle-low", kind: "quartier",
    area: "11e", granularity: "micro", parentName: "11e",
    confidence: "low", coverageRole: "low_relevance", geometryBasis: "official_quartier_group",
    evidenceNote: "Isolated official LA VALBARELLE quartier on the 11e edge.",
    scores: { security: 5.4, affordability: 6.8, transport: 5.8, studentEnergy: 4.8, services: 5.8, campusAccess: 5.2, greenCalm: 7.0 },
    rentLevel: "lower", studentFit: "weak",
    summary: "Remote 11e edge quartier with low student relevance.",
    caveat: "Coverage honesty zone; not a practical student pick."
  },
  {
    id: "marseille-saint-barnabe-montolivet", cityId: "marseille", name: "Saint-Barnabe / Montolivet", code: "marseille-saint-barnabe-montolivet", kind: "quartier",
    area: "12e", granularity: "micro", parentName: "12e",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Broad 12e east context group across official quartiers.",
    scores: { security: 6.4, affordability: 5.4, transport: 7.8, studentEnergy: 6.0, services: 7.4, campusAccess: 6.2, greenCalm: 6.2 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Residential 12e context with decent transport and calm daily life.",
    caveat: "Outer-east context; limited student social scene."
  },
  {
    id: "marseille-saint-jerome-la-rose", cityId: "marseille", name: "Saint-Jerome / La Rose", code: "marseille-saint-jerome-la-rose", kind: "quartier",
    area: "13e", granularity: "micro", parentName: "13e",
    confidence: "medium", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Saint-Jerome, La Rose, Malpasse, Saint-Just; north-east campus belt.",
    scores: { security: 5.6, affordability: 6.6, transport: 7.3, studentEnergy: 7.6, services: 7.2, campusAccess: 9.2, greenCalm: 6.0 },
    rentLevel: "medium", studentFit: "good",
    summary: "North-east campus belt with university utility and tolerable value.",
    caveat: "Useful campus compromise, not a headline comfort pick."
  },
  {
    id: "marseille-chateau-gombert-saint-mitre", cityId: "marseille", name: "Chateau-Gombert / Saint-Mitre", code: "marseille-chateau-gombert-saint-mitre", kind: "quartier",
    area: "13e", granularity: "micro", parentName: "13e",
    confidence: "medium", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group across Chateau-Gombert campus north-east belt.",
    scores: { security: 6.3, affordability: 6.2, transport: 6.8, studentEnergy: 7.1, services: 7.0, campusAccess: 8.8, greenCalm: 7.0 },
    rentLevel: "medium", studentFit: "good",
    summary: "Chateau-Gombert campus belt with strong university access.",
    caveat: "Campus-adjacent; weaker central-city social life."
  },
  {
    id: "marseille-14e-north-risk", cityId: "marseille", name: "14e North Risk Belt", code: "marseille-14e-north-risk", kind: "quartier",
    area: "14e", granularity: "micro", parentName: "14e",
    confidence: "low", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Broad 14e north risk-cap belt across official quartiers.",
    scores: { security: 3.4, affordability: 7.2, transport: 7.0, studentEnergy: 5.2, services: 6.4, campusAccess: 5.8, greenCalm: 4.4 },
    rentLevel: "lower", studentFit: "weak",
    summary: "14e north belt with visible safety cap despite affordable rent.",
    caveat: "Broad caution zone; cheap rent cannot offset the profile."
  },
  {
    id: "marseille-15e-port-north-risk", cityId: "marseille", name: "15e Port / North Risk Belt", code: "marseille-15e-port-north-risk", kind: "quartier",
    area: "15e", granularity: "micro", parentName: "15e",
    confidence: "low", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Broad 15e port/north risk-cap belt across official quartiers.",
    scores: { security: 2.8, affordability: 7.8, transport: 6.3, studentEnergy: 4.2, services: 5.8, campusAccess: 5.0, greenCalm: 4.6 },
    rentLevel: "lower", studentFit: "weak",
    summary: "Hardest-capped 15e north/port belt with broad caution on safety.",
    caveat: "Broad risk context; not a student default under any framing."
  },
  {
    id: "marseille-estaque-16e", cityId: "marseille", name: "Estaque / 16e", code: "marseille-estaque-16e", kind: "quartier",
    area: "16e", granularity: "micro", parentName: "16e",
    confidence: "low", coverageRole: "low_relevance", geometryBasis: "official_quartier_group",
    evidenceNote: "Broad 16e port-edge context across Estaque and peripheral quartiers.",
    scores: { security: 5.2, affordability: 6.5, transport: 5.8, studentEnergy: 4.5, services: 5.8, campusAccess: 4.6, greenCalm: 5.6 },
    rentLevel: "medium", studentFit: "weak",
    summary: "Peripheral 16e context with low student utility.",
    caveat: "Port-edge belt; weak fit for typical student life."
  },
];