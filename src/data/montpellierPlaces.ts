import type { PlaceScore } from "@/data/cities";

export const montpellierPlaces: PlaceScore[] = [
  {
    id: "montpellier-ecusson-north", cityId: "montpellier", name: "Ecusson north", code: "montpellier-ecusson-north", kind: "quartier",
    area: "Montpellier Centre", granularity: "micro", parentName: "Montpellier Centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.4,
      affordability: 2.8,
      transport: 9.6,
      studentEnergy: 9.2,
      services: 9.2,
      campusAccess: 8.8,
      greenCalm: 3.6
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Northern ecusson cluster around Peyrou approaches.", caveat: "Rent-hostile; comfort not automatic."
  },
  {
    id: "montpellier-ecusson-south", cityId: "montpellier", name: "Ecusson south", code: "montpellier-ecusson-south", kind: "quartier",
    area: "Montpellier Centre", granularity: "micro", parentName: "Montpellier Centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.4,
      affordability: 2.8,
      transport: 9.6,
      studentEnergy: 9.2,
      services: 9.2,
      campusAccess: 8.8,
      greenCalm: 3.6
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Southern historic core around Peyrou and Prefecture.", caveat: "Rent-hostile; comfort not automatic."
  },
  {
    id: "montpellier-comedie-station", cityId: "montpellier", name: "Comedie station", code: "montpellier-comedie-station", kind: "quartier",
    area: "Montpellier Centre", granularity: "micro", parentName: "Montpellier Centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.2,
      affordability: 3.2,
      transport: 9.8,
      studentEnergy: 8.8,
      services: 9.0,
      campusAccess: 8.6,
      greenCalm: 3.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Station-core belt around Place de la Comedie.", caveat: "Connected but not calm or cheap."
  },
  {
    id: "montpellier-comedie-west", cityId: "montpellier", name: "Comedie west", code: "montpellier-comedie-west", kind: "quartier",
    area: "Montpellier Centre", granularity: "micro", parentName: "Montpellier Centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.2,
      affordability: 3.2,
      transport: 9.8,
      studentEnergy: 8.8,
      services: 9.0,
      campusAccess: 8.6,
      greenCalm: 3.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "West-centre belt west of the station axis.", caveat: "Connected but not calm or cheap."
  },
  {
    id: "montpellier-republique-rauze", cityId: "montpellier", name: "Republique / Rauze", code: "montpellier-republique-rauze", kind: "quartier",
    area: "Montpellier Centre", granularity: "micro", parentName: "Montpellier Centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.2,
      affordability: 3.2,
      transport: 9.8,
      studentEnergy: 8.8,
      services: 9.0,
      campusAccess: 8.6,
      greenCalm: 3.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "South-centre belt around Republique.", caveat: "Connected but not calm or cheap."
  },
  {
    id: "montpellier-beaux-arts-boutonnet", cityId: "montpellier", name: "Beaux-Arts / Boutonnet", code: "montpellier-beaux-arts-boutonnet", kind: "quartier",
    area: "North centre", granularity: "micro", parentName: "North centre",
    confidence: "high", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
    scores: {
      security: 7.0,
      affordability: 4.2,
      transport: 8.8,
      studentEnergy: 9.0,
      services: 8.4,
      campusAccess: 9.2,
      greenCalm: 6.4
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Best north-centre student pick with campus adjacency.", caveat: "Leads Montpellier on balanced student quality."
  },
  {
    id: "montpellier-arceaux-agriculture", cityId: "montpellier", name: "Arceaux / Agriculture", code: "montpellier-arceaux-agriculture", kind: "quartier",
    area: "West centre", granularity: "micro", parentName: "West centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.3,
      affordability: 5.2,
      transport: 8.8,
      studentEnergy: 8.4,
      services: 8.2,
      campusAccess: 8.0,
      greenCalm: 4.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "West-centre Arceaux and hospital belt.", caveat: "Mixed comfort; not a premium-safe default."
  },
  {
    id: "montpellier-gambetta", cityId: "montpellier", name: "Gambetta", code: "montpellier-gambetta", kind: "quartier",
    area: "West centre", granularity: "micro", parentName: "West centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.3,
      affordability: 5.2,
      transport: 8.8,
      studentEnergy: 8.4,
      services: 8.2,
      campusAccess: 8.0,
      greenCalm: 4.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Compact Gambetta west-centre cluster.", caveat: "Mixed comfort; not a premium-safe default."
  },
  {
    id: "montpellier-aubes-salaison", cityId: "montpellier", name: "Aubes / Salaison", code: "montpellier-aubes-salaison", kind: "quartier",
    area: "West centre", granularity: "micro", parentName: "West centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.3,
      affordability: 5.2,
      transport: 8.8,
      studentEnergy: 8.4,
      services: 8.2,
      campusAccess: 8.0,
      greenCalm: 4.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Figuerolles-adjacent Aubes and Salaison belt.", caveat: "Mixed comfort; not a premium-safe default."
  },
  {
    id: "montpellier-antigone", cityId: "montpellier", name: "Antigone", code: "montpellier-antigone", kind: "quartier",
    area: "East centre", granularity: "micro", parentName: "East centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
    scores: {
      security: 6.0,
      affordability: 3.6,
      transport: 9.4,
      studentEnergy: 7.8,
      services: 9.0,
      campusAccess: 8.6,
      greenCalm: 4.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Planned east-centre belt with tram and services.", caveat: "Less social than Ecusson or Boutonnet."
  },
  {
    id: "montpellier-jacques-coeur", cityId: "montpellier", name: "Jacques-Coeur", code: "montpellier-jacques-coeur", kind: "quartier",
    area: "East campus", granularity: "micro", parentName: "East campus",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 7.0,
      affordability: 4.2,
      transport: 9.0,
      studentEnergy: 7.8,
      services: 8.2,
      campusAccess: 9.4,
      greenCalm: 6.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "East-campus Jacques-Coeur basin cluster.", caveat: "Campus-first pick with less historic-centre charm."
  },
  {
    id: "montpellier-richter", cityId: "montpellier", name: "Richter", code: "montpellier-richter", kind: "quartier",
    area: "East campus", granularity: "micro", parentName: "East campus",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 7.0,
      affordability: 4.2,
      transport: 9.0,
      studentEnergy: 7.8,
      services: 8.2,
      campusAccess: 9.4,
      greenCalm: 6.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Richter and Mail campus belt.", caveat: "Campus-first pick with less historic-centre charm."
  },
  {
    id: "montpellier-port-marianne", cityId: "montpellier", name: "Port Marianne", code: "montpellier-port-marianne", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 7.0,
      affordability: 4.0,
      transport: 8.8,
      studentEnergy: 7.0,
      services: 8.4,
      campusAccess: 8.8,
      greenCalm: 6.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Port Marianne core with Odysseum.", caveat: "Different bet from historic centre."
  },
  {
    id: "montpellier-port-marianne-lez", cityId: "montpellier", name: "Port Marianne Lez", code: "montpellier-port-marianne-lez", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 7.0,
      affordability: 4.0,
      transport: 8.8,
      studentEnergy: 7.0,
      services: 8.4,
      campusAccess: 8.8,
      greenCalm: 6.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Lez-side Port Marianne belt.", caveat: "Different bet from historic centre."
  },
  {
    id: "montpellier-occitanie", cityId: "montpellier", name: "Occitanie", code: "montpellier-occitanie", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 7.0,
      affordability: 4.0,
      transport: 8.8,
      studentEnergy: 7.0,
      services: 8.4,
      campusAccess: 8.8,
      greenCalm: 6.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Eastern Occitanie extension.", caveat: "Different bet from historic centre."
  },
  {
    id: "montpellier-assas-pharmacie", cityId: "montpellier", name: "Assas / Pharmacie", code: "montpellier-assas-pharmacie", kind: "quartier",
    area: "North campus", granularity: "micro", parentName: "North campus",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 6.8,
      affordability: 5.0,
      transport: 8.8,
      studentEnergy: 8.8,
      services: 8.0,
      campusAccess: 10.0,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "North-campus Assas and pharmacy cluster.", caveat: "Campus utility over nightlife."
  },
  {
    id: "montpellier-euromedecine", cityId: "montpellier", name: "Euromedecine", code: "montpellier-euromedecine", kind: "quartier",
    area: "North campus", granularity: "micro", parentName: "North campus",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 6.8,
      affordability: 5.0,
      transport: 8.8,
      studentEnergy: 8.8,
      services: 8.0,
      campusAccess: 10.0,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Euromedecine hospital campus belt.", caveat: "Campus utility over nightlife."
  },
  {
    id: "montpellier-triolet-vert-bois", cityId: "montpellier", name: "Triolet / Vert-Bois", code: "montpellier-triolet-vert-bois", kind: "quartier",
    area: "North campus", granularity: "micro", parentName: "North campus",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 6.8,
      affordability: 5.0,
      transport: 8.8,
      studentEnergy: 8.8,
      services: 8.0,
      campusAccess: 10.0,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Triolet architecture and Vert-Bois cluster.", caveat: "Campus utility over nightlife."
  },
  {
    id: "montpellier-agropolis", cityId: "montpellier", name: "Agropolis", code: "montpellier-agropolis", kind: "quartier",
    area: "North campus", granularity: "micro", parentName: "North campus",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 6.6,
      affordability: 5.2,
      transport: 8.6,
      studentEnergy: 8.4,
      services: 7.8,
      campusAccess: 10.0,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Agropolis research campus cluster.", caveat: "Best for campus-first students."
  },
  {
    id: "montpellier-ecole-normale", cityId: "montpellier", name: "Ecole Normale", code: "montpellier-ecole-normale", kind: "quartier",
    area: "North campus", granularity: "micro", parentName: "North campus",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 6.6,
      affordability: 5.2,
      transport: 8.6,
      studentEnergy: 8.4,
      services: 7.8,
      campusAccess: 10.0,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Ecole Normale and archives belt.", caveat: "Best for campus-first students."
  },
  {
    id: "montpellier-avenue-lodeve", cityId: "montpellier", name: "Avenue de Lodeve", code: "montpellier-avenue-lodeve", kind: "quartier",
    area: "North campus", granularity: "micro", parentName: "North campus",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 6.6,
      affordability: 5.2,
      transport: 8.6,
      studentEnergy: 8.4,
      services: 7.8,
      campusAccess: 10.0,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Avenue de Lodeve campus corridor.", caveat: "Best for campus-first students."
  },
  {
    id: "montpellier-aiguelongue-lunaret", cityId: "montpellier", name: "Aiguelongue / Lunaret", code: "montpellier-aiguelongue-lunaret", kind: "quartier",
    area: "North-east", granularity: "micro", parentName: "North-east",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 7.4,
      affordability: 4.4,
      transport: 7.8,
      studentEnergy: 6.4,
      services: 7.4,
      campusAccess: 8.4,
      greenCalm: 8.4
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Aiguelongue and Lunaret green belt.", caveat: "Less student-social than Boutonnet."
  },
  {
    id: "montpellier-colline", cityId: "montpellier", name: "La Colline", code: "montpellier-colline", kind: "quartier",
    area: "North-east", granularity: "micro", parentName: "North-east",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 7.4,
      affordability: 4.4,
      transport: 7.8,
      studentEnergy: 6.4,
      services: 7.4,
      campusAccess: 8.4,
      greenCalm: 8.4
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Isolated Colline north-east cluster.", caveat: "Less student-social than Boutonnet."
  },
  {
    id: "montpellier-malbosc-garrigues", cityId: "montpellier", name: "Malbosc / Garrigues", code: "montpellier-malbosc-garrigues", kind: "quartier",
    area: "North-east", granularity: "micro", parentName: "North-east",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 7.4,
      affordability: 4.4,
      transport: 7.8,
      studentEnergy: 6.4,
      services: 7.4,
      campusAccess: 8.4,
      greenCalm: 8.4
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Malbosc and Garrigues residential belt.", caveat: "Less student-social than Boutonnet."
  },
  {
    id: "montpellier-croix-argent-ovalie", cityId: "montpellier", name: "Croix d'Argent / Ovalie", code: "montpellier-croix-argent-ovalie", kind: "quartier",
    area: "South-west", granularity: "micro", parentName: "South-west",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
    scores: {
      security: 5.4,
      affordability: 6.0,
      transport: 8.0,
      studentEnergy: 6.4,
      services: 7.4,
      campusAccess: 7.4,
      greenCalm: 5.4
    },
    rentLevel: "medium", studentFit: "good",
    summary: "South-west context with tolerable value.", caveat: "Honest peripheral belt."
  },
  {
    id: "montpellier-cevennes-celleneuve", cityId: "montpellier", name: "Les Cevennes / Celleneuve", code: "montpellier-cevennes-celleneuve", kind: "quartier",
    area: "West", granularity: "micro", parentName: "West",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
    scores: {
      security: 5.2,
      affordability: 6.6,
      transport: 8.0,
      studentEnergy: 6.2,
      services: 7.0,
      campusAccess: 6.8,
      greenCalm: 6.0
    },
    rentLevel: "lower", studentFit: "good",
    summary: "Western context belt with moderate value.", caveat: "Coverage continuity zone, not a headline pick."
  },
  {
    id: "montpellier-lironde", cityId: "montpellier", name: "La Lironde", code: "montpellier-lironde", kind: "quartier",
    area: "West", granularity: "micro", parentName: "West",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.2,
      affordability: 6.6,
      transport: 8.0,
      studentEnergy: 6.2,
      services: 7.0,
      campusAccess: 6.8,
      greenCalm: 6.0
    },
    rentLevel: "lower", studentFit: "good",
    summary: "Detached La Lironde western context belt.", caveat: "Coverage continuity zone, not a headline pick."
  },
  {
    id: "montpellier-mosson-core", cityId: "montpellier", name: "Mosson core", code: "montpellier-mosson-core", kind: "quartier",
    area: "North-west cap", granularity: "micro", parentName: "North-west cap",
    confidence: "medium", coverageRole: "risk_cap", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 3.6,
      affordability: 7.6,
      transport: 8.2,
      studentEnergy: 5.8,
      services: 6.6,
      campusAccess: 6.4,
      greenCalm: 5.4
    },
    rentLevel: "lower", studentFit: "weak",
    summary: "Main Mosson / Paillade risk cluster.", caveat: "Affordability cannot rescue the risk profile."
  },
  {
    id: "montpellier-pas-du-loup", cityId: "montpellier", name: "Pas du Loup", code: "montpellier-pas-du-loup", kind: "quartier",
    area: "North-west cap", granularity: "micro", parentName: "North-west cap",
    confidence: "medium", coverageRole: "risk_cap", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 3.6,
      affordability: 7.6,
      transport: 8.2,
      studentEnergy: 5.8,
      services: 6.6,
      campusAccess: 6.4,
      greenCalm: 5.4
    },
    rentLevel: "lower", studentFit: "weak",
    summary: "Detached Pas du Loup north-west cap.", caveat: "Affordability cannot rescue the risk profile."
  },
  {
    id: "montpellier-bouisses", cityId: "montpellier", name: "Bouisses", code: "montpellier-bouisses", kind: "quartier",
    area: "South", granularity: "micro", parentName: "South",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.0,
      affordability: 6.2,
      transport: 8.4,
      studentEnergy: 6.4,
      services: 7.2,
      campusAccess: 7.2,
      greenCalm: 5.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Southern Bouisses context cluster.", caveat: "Useful value belt with cap constraints."
  },
  {
    id: "montpellier-estanove-lepic", cityId: "montpellier", name: "Estanove / Lepic", code: "montpellier-estanove-lepic", kind: "quartier",
    area: "South", granularity: "micro", parentName: "South",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.0,
      affordability: 6.2,
      transport: 8.4,
      studentEnergy: 6.4,
      services: 7.2,
      campusAccess: 7.2,
      greenCalm: 5.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Estanove and Lepic south belt.", caveat: "Useful value belt with cap constraints."
  },
  {
    id: "montpellier-saint-denis-sud", cityId: "montpellier", name: "Saint-Denis sud", code: "montpellier-saint-denis-sud", kind: "quartier",
    area: "South", granularity: "micro", parentName: "South",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Split from previous broad zone to preserve contiguous display geometry; score inherited from district-level evidence.",
    scores: {
      security: 5.0,
      affordability: 6.2,
      transport: 8.4,
      studentEnergy: 6.4,
      services: 7.2,
      campusAccess: 7.2,
      greenCalm: 5.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Detached Saint-Denis southern context.", caveat: "Useful value belt with cap constraints."
  }
];
