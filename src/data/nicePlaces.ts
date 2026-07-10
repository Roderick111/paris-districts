import type { PlaceScore } from "@/data/cities";

export const niceMicroPlaces: PlaceScore[] = [
  {
    id: "nice-vieux-nice-port", cityId: "nice", name: "Vieux-Nice / Port", code: "nice-vieux-nice-port", kind: "quartier",
    area: "Historic centre", granularity: "micro", parentName: "Historic centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier group: Vieille Ville, Le Port.",
    scores: { security: 5.7, affordability: 2.9, transport: 8.8, studentEnergy: 8.7, services: 9.0, campusAccess: 7.5, greenCalm: 4.6 },
    rentLevel: "very high", studentFit: "good",
    summary: "High-energy historic centre streets with strong student social life.",
    caveat: "Social life is real; comfort and safety are not automatic."
  },
  {
    id: "nice-carabacel-garibaldi", cityId: "nice", name: "Carabacel / Garibaldi", code: "nice-carabacel-garibaldi", kind: "quartier",
    area: "Centre east", granularity: "micro", parentName: "Centre east",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Carabacel; Garibaldi reputation label.",
    scores: { security: 6.2, affordability: 2.6, transport: 9.1, studentEnergy: 7.4, services: 8.8, campusAccess: 8.0, greenCalm: 4.4 },
    rentLevel: "very high", studentFit: "good",
    summary: "Balanced centre east micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-jean-medecin-massena", cityId: "nice", name: "Jean-Médecin / Masséna", code: "nice-jean-medecin-massena", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Centre Ville.",
    scores: { security: 5.6, affordability: 2.3, transport: 9.6, studentEnergy: 8.0, services: 9.4, campusAccess: 8.0, greenCalm: 3.4 },
    rentLevel: "very high", studentFit: "good",
    summary: "Balanced centre micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-thiers-musiciens", cityId: "nice", name: "Thiers / Musiciens", code: "nice-thiers-musiciens", kind: "quartier",
    area: "Centre west", granularity: "micro", parentName: "Centre west",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Thiers.",
    scores: { security: 5.6, affordability: 3.2, transport: 9.1, studentEnergy: 7.0, services: 8.6, campusAccess: 7.9, greenCalm: 4.4 },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced centre west micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-gambetta-rue-france", cityId: "nice", name: "Gambetta / Rue de France", code: "nice-gambetta-rue-france", kind: "quartier",
    area: "Centre west", granularity: "micro", parentName: "Centre west",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Gambetta, Rue de France.",
    scores: { security: 6.1, affordability: 2.8, transport: 8.7, studentEnergy: 7.2, services: 8.8, campusAccess: 7.4, greenCalm: 4.8 },
    rentLevel: "very high", studentFit: "good",
    summary: "Balanced centre west coast micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-liberation-valrose", cityId: "nice", name: "Libération / Valrose", code: "nice-liberation-valrose", kind: "quartier",
    area: "North centre campus", granularity: "micro", parentName: "North centre campus",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Libération; Valrose campus reputation.",
    scores: { security: 6.7, affordability: 4.7, transport: 8.9, studentEnergy: 8.3, services: 8.4, campusAccess: 9.4, greenCalm: 5.9 },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced north centre micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-gare-tzanck-valrose", cityId: "nice", name: "Gare / Tzanck / Valrose belt", code: "nice-gare-tzanck-valrose", kind: "quartier",
    area: "Station campus", granularity: "micro", parentName: "Station campus",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: La Gare, Jaquons-Ravet, Tzanck, Point du Jour.",
    scores: { security: 5.8, affordability: 4.0, transport: 9.1, studentEnergy: 7.8, services: 8.5, campusAccess: 8.7, greenCalm: 4.9 },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced centre west micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-vernier", cityId: "nice", name: "Vernier", code: "nice-vernier", kind: "quartier",
    area: "North centre", granularity: "micro", parentName: "North centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Vernier.",
    scores: { security: 5.7, affordability: 4.3, transport: 8.8, studentEnergy: 7.6, services: 8.0, campusAccess: 8.6, greenCalm: 4.7 },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced north centre micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-mantega-piol", cityId: "nice", name: "Mantega / Piol", code: "nice-mantega-piol", kind: "quartier",
    area: "East inner city", granularity: "micro", parentName: "East inner city",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Mantega, Le Piol.",
    scores: { security: 6.2, affordability: 5.0, transport: 8.3, studentEnergy: 7.3, services: 7.7, campusAccess: 8.8, greenCalm: 5.6 },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced east campus micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-saint-maurice-ray", cityId: "nice", name: "Saint-Maurice / Le Ray", code: "nice-saint-maurice-ray", kind: "quartier",
    area: "North centre", granularity: "micro", parentName: "North centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Saint Maurice, Le Ray.",
    scores: { security: 6.5, affordability: 4.7, transport: 8.4, studentEnergy: 7.7, services: 8.1, campusAccess: 8.9, greenCalm: 5.9 },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced north centre micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-saint-sylvestre", cityId: "nice", name: "Saint-Sylvestre", code: "nice-saint-sylvestre", kind: "quartier",
    area: "North-east hills", granularity: "micro", parentName: "North-east hills",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Saint Sylvestre.",
    scores: { security: 8.3, affordability: 2.7, transport: 6.2, studentEnergy: 4.2, services: 7.4, campusAccess: 6.8, greenCalm: 8.8 },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer north-east hills pocket with premium rent and calmer daily life.",
    caveat: "Quality-of-life pick, not a value student default."
  },
  {
    id: "nice-cimiez", cityId: "nice", name: "Cimiez", code: "nice-cimiez", kind: "quartier",
    area: "North-east hills", granularity: "micro", parentName: "North-east hills",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Cimiez.",
    scores: { security: 8.1, affordability: 2.6, transport: 7.0, studentEnergy: 4.8, services: 7.9, campusAccess: 7.3, greenCalm: 8.2 },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer north-east hills pocket with premium rent and calmer daily life.",
    caveat: "Quality-of-life pick, not a value student default."
  },
  {
    id: "nice-rimiez-gairaut", cityId: "nice", name: "Rimiez / Gairaut", code: "nice-rimiez-gairaut", kind: "quartier",
    area: "North-east hills", granularity: "micro", parentName: "North-east hills",
    confidence: "low", coverageRole: "low_relevance", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Rimiez, Gairaut.",
    scores: { security: 8.3, affordability: 2.7, transport: 6.2, studentEnergy: 4.2, services: 7.4, campusAccess: 6.8, greenCalm: 8.8 },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer north-east hills pocket with premium rent and calmer daily life.",
    caveat: "Quality-of-life pick, not a value student default."
  },
  {
    id: "nice-pessicart-saint-pancrace", cityId: "nice", name: "Pessicart / Saint-Pancrace", code: "nice-pessicart-saint-pancrace", kind: "quartier",
    area: "North-west hills", granularity: "micro", parentName: "North-west hills",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Pessicart, Saint Pancrace.",
    scores: { security: 6.2, affordability: 4.2, transport: 8.0, studentEnergy: 6.8, services: 7.8, campusAccess: 8.2, greenCalm: 5.8 },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced west coast micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-madeleine-saint-pierre", cityId: "nice", name: "Madeleine / Saint-Pierre-de-Féric", code: "nice-madeleine-saint-pierre", kind: "quartier",
    area: "West valley", granularity: "micro", parentName: "West valley",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Madeleine, Saint Pierre de Féric.",
    scores: { security: 6.1, affordability: 5.1, transport: 7.4, studentEnergy: 6.5, services: 7.2, campusAccess: 8.5, greenCalm: 6.2 },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced west valley micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-baumettes-magnan", cityId: "nice", name: "Baumettes / Magnan", code: "nice-baumettes-magnan", kind: "quartier",
    area: "West coast", granularity: "micro", parentName: "West coast",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Baumettes.",
    scores: { security: 6.2, affordability: 4.2, transport: 8.0, studentEnergy: 6.8, services: 7.8, campusAccess: 8.2, greenCalm: 5.8 },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced west coast micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-carlone-medecin", cityId: "nice", name: "Carlone / Médecin", code: "nice-carlone-medecin", kind: "quartier",
    area: "West campus", granularity: "micro", parentName: "West campus",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Médecin (Carlone campus belt).",
    scores: { security: 6.5, affordability: 4.8, transport: 7.6, studentEnergy: 7.3, services: 7.4, campusAccess: 9.2, greenCalm: 6.3 },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced west campus micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-saint-philippe", cityId: "nice", name: "Saint-Philippe", code: "nice-saint-philippe", kind: "quartier",
    area: "West coast", granularity: "micro", parentName: "West coast",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Saint Philippe.",
    scores: { security: 6.5, affordability: 4.8, transport: 7.6, studentEnergy: 7.3, services: 7.4, campusAccess: 9.2, greenCalm: 6.3 },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced west campus micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-fabron-saint-antoine", cityId: "nice", name: "Fabron / Saint-Antoine", code: "nice-fabron-saint-antoine", kind: "quartier",
    area: "West hills", granularity: "micro", parentName: "West hills",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Fabron, Saint Antoine.",
    scores: { security: 6.1, affordability: 5.1, transport: 7.4, studentEnergy: 6.5, services: 7.2, campusAccess: 8.5, greenCalm: 6.2 },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced west valley micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-caucade", cityId: "nice", name: "Caucade", code: "nice-caucade", kind: "quartier",
    area: "West", granularity: "micro", parentName: "West",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Caucade.",
    scores: { security: 6.0, affordability: 5.5, transport: 7.0, studentEnergy: 4.5, services: 6.5, campusAccess: 5.5, greenCalm: 6.5 },
    rentLevel: "medium", studentFit: "weak",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.",
    caveat: "Broad zone; block-level choice still matters."
  },
  {
    id: "nice-saint-augustin-moulins", cityId: "nice", name: "Saint-Augustin / Moulins", code: "nice-saint-augustin-moulins", kind: "quartier",
    area: "West airport", granularity: "micro", parentName: "West airport",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Saint Augustin; Moulins reputation label.",
    scores: { security: 5.0, affordability: 5.4, transport: 8.2, studentEnergy: 6.0, services: 7.2, campusAccess: 8.0, greenCalm: 5.2 },
    rentLevel: "medium", studentFit: "good",
    summary: "Saint-Augustin belt with tram links and Moulins reputation as a value pocket.",
    caveat: "Airport-edge comfort; weaker social scene than central campus poles."
  },
  {
    id: "nice-arenas-sainte-marguerite", cityId: "nice", name: "Arénas / Sainte-Marguerite / EDHEC", code: "nice-arenas-sainte-marguerite", kind: "quartier",
    area: "West airport", granularity: "micro", parentName: "West airport",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Arénas, Sainte Marguerite.",
    scores: { security: 5.0, affordability: 5.4, transport: 8.6, studentEnergy: 6.4, services: 7.6, campusAccess: 8.6, greenCalm: 5.0 },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced west airport micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-saint-isidore-lingostiere", cityId: "nice", name: "Saint-Isidore / Lingostière", code: "nice-saint-isidore-lingostiere", kind: "quartier",
    area: "Far west", granularity: "micro", parentName: "Far west",
    confidence: "low", coverageRole: "low_relevance", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Saint Isidore, Lingostière, Iscles.",
    scores: { security: 6.0, affordability: 5.6, transport: 6.6, studentEnergy: 4.8, services: 6.2, campusAccess: 5.4, greenCalm: 6.4 },
    rentLevel: "medium", studentFit: "weak",
    summary: "Far-west airport fringe with weak student relevance.",
    caveat: "Car-oriented periphery, not a housing search target."
  },
  {
    id: "nice-cremat-bellet", cityId: "nice", name: "Crémat / Saint-Roman / Ventabrun", code: "nice-cremat-bellet", kind: "quartier",
    area: "Far west hills", granularity: "micro", parentName: "Far west hills",
    confidence: "low", coverageRole: "low_relevance", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Crémat, Saint Roman, Ventabrun.",
    scores: { security: 6.4, affordability: 5.4, transport: 6.8, studentEnergy: 4.6, services: 6.4, campusAccess: 5.6, greenCalm: 7.4 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.",
    caveat: "Broad zone; block-level choice still matters."
  },
  {
    id: "nice-riquier-saint-roch", cityId: "nice", name: "Riquier / Saint-Roch", code: "nice-riquier-saint-roch", kind: "quartier",
    area: "East inner city", granularity: "micro", parentName: "East inner city",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Riquier, Saint Roch, Roquebillière.",
    scores: { security: 5.8, affordability: 5.5, transport: 8.4, studentEnergy: 7.0, services: 7.9, campusAccess: 7.6, greenCalm: 5.1 },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced east inner city micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-pasteur", cityId: "nice", name: "Pasteur", code: "nice-pasteur", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Pasteur.",
    scores: { security: 4.5, affordability: 6.7, transport: 7.6, studentEnergy: 5.8, services: 7.0, campusAccess: 8.1, greenCalm: 5.0 },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Balanced east micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-ariane", cityId: "nice", name: "Ariane", code: "nice-ariane", kind: "quartier",
    area: "North-east edge", granularity: "micro", parentName: "North-east edge",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Ariane.",
    scores: { security: 3.2, affordability: 7.4, transport: 6.8, studentEnergy: 4.8, services: 6.2, campusAccess: 5.6, greenCalm: 5.6 },
    rentLevel: "lower", studentFit: "weak",
    summary: "Ariane stays hard-capped on safety despite useful north-east edge links.",
    caveat: "Cheap rent and transport cannot offset the risk profile."
  },
  {
    id: "nice-mont-boron-vinaigrier", cityId: "nice", name: "Mont Boron / Vinaigrier", code: "nice-mont-boron-vinaigrier", kind: "quartier",
    area: "East hills", granularity: "micro", parentName: "East hills",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Mont Boron, Vinaigrier.",
    scores: { security: 7.6, affordability: 3.4, transport: 6.6, studentEnergy: 4.6, services: 7.0, campusAccess: 6.0, greenCalm: 8.4 },
    rentLevel: "very high", studentFit: "good",
    summary: "Premium east hill context with exceptional green calm and weak value.",
    caveat: "Quality-of-life filler, not a student value default."
  },
  {
    id: "nice-vespins-littoral", cityId: "nice", name: "Vespins / Littoral", code: "nice-vespins-littoral", kind: "quartier",
    area: "East littoral", granularity: "micro", parentName: "East littoral",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartier: Vespins - Littoral.",
    scores: { security: 6.8, affordability: 4.2, transport: 7.2, studentEnergy: 5.0, services: 6.8, campusAccess: 5.8, greenCalm: 7.2 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.",
    caveat: "Broad zone; block-level choice still matters."
  },
  {
    id: "nice-corniche-promenade", cityId: "nice", name: "Corniche / Promenade", code: "nice-corniche-promenade", kind: "quartier",
    area: "West corniche", granularity: "micro", parentName: "West corniche",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official quartiers: Les Pugets, Corniche Sud, Rascas.",
    scores: { security: 6.1, affordability: 2.8, transport: 8.7, studentEnergy: 7.2, services: 8.8, campusAccess: 7.4, greenCalm: 4.8 },
    rentLevel: "very high", studentFit: "good",
    summary: "Balanced centre west coast micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
];
