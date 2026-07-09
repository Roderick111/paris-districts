import type { PlaceScore } from "@/data/cities";

export const grenoblePlaces: PlaceScore[] = [
  {
    id: "grenoble-hyper-centre", cityId: "grenoble", name: "Hyper-centre", code: "grenoble-hyper-centre", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 5.8,
      affordability: 3.2,
      transport: 9.7,
      studentEnergy: 9.0,
      services: 9.2,
      campusAccess: 8.8,
      greenCalm: 4.2
    },
    rentLevel: "high", studentFit: "good",
    summary: "Dense centre with strong services and student energy.", caveat: "Rent pressure and nightlife friction are real."
  },
  {
    id: "grenoble-notre-dame-mutualite", cityId: "grenoble", name: "Notre-Dame / Mutualite", code: "grenoble-notre-dame-mutualite", kind: "quartier",
    area: "Centre-east", granularity: "micro", parentName: "Centre-east",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 6.0,
      affordability: 3.4,
      transport: 9.4,
      studentEnergy: 8.8,
      services: 9.0,
      campusAccess: 8.8,
      greenCalm: 4.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Centre-east belt with strong services and tram.", caveat: "Still expensive compared with outer belts."
  },
  {
    id: "grenoble-championnet-aigle", cityId: "grenoble", name: "Championnet / Aigle", code: "grenoble-championnet-aigle", kind: "quartier",
    area: "Centre-west", granularity: "micro", parentName: "Centre-west",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 6.8,
      affordability: 4.0,
      transport: 9.0,
      studentEnergy: 8.6,
      services: 8.8,
      campusAccess: 8.6,
      greenCalm: 5.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced centre-west pick with good transit.", caveat: "Less campus-default than Europole or Gières."
  },
  {
    id: "grenoble-europole-presquile", cityId: "grenoble", name: "Europole / Presqu'ile", code: "grenoble-europole-presquile", kind: "quartier",
    area: "North-west campus", granularity: "micro", parentName: "North-west campus",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 6.4,
      affordability: 4.8,
      transport: 9.0,
      studentEnergy: 7.4,
      services: 8.2,
      campusAccess: 9.6,
      greenCalm: 5.8
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Campus-adjacent north-west belt with tram utility.", caveat: "Strong campus access; less social than hyper-centre."
  },
  {
    id: "grenoble-chorier-berriat-saint-bruno", cityId: "grenoble", name: "Chorier-Berriat / Saint-Bruno", code: "grenoble-chorier-berriat-saint-bruno", kind: "quartier",
    area: "West inner", granularity: "micro", parentName: "West inner",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 5.2,
      affordability: 5.8,
      transport: 9.2,
      studentEnergy: 8.4,
      services: 8.0,
      campusAccess: 8.2,
      greenCalm: 4.4
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Inner-west student belt with good tram links.", caveat: "Mixed comfort; block choice matters."
  },
  {
    id: "grenoble-saint-laurent-ile-verte", cityId: "grenoble", name: "Saint-Laurent / Ile Verte", code: "grenoble-saint-laurent-ile-verte", kind: "quartier",
    area: "East river", granularity: "micro", parentName: "East river",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 7.4,
      affordability: 4.2,
      transport: 8.8,
      studentEnergy: 7.4,
      services: 8.4,
      campusAccess: 9.4,
      greenCalm: 8.4
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "East-river campus belt with green calm.", caveat: "Leads Grenoble on balanced campus-centre mix."
  },
  {
    id: "grenoble-mistral-eaux-claires", cityId: "grenoble", name: "Mistral / Eaux-Claires", code: "grenoble-mistral-eaux-claires", kind: "quartier",
    area: "West cap", granularity: "micro", parentName: "West cap",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 4.0,
      affordability: 6.8,
      transport: 8.4,
      studentEnergy: 6.0,
      services: 6.8,
      campusAccess: 6.6,
      greenCalm: 5.4
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "West belt capped by safety and mixed reputation.", caveat: "Affordability does not fully compensate."
  },
  {
    id: "grenoble-capuche-allies-alpins", cityId: "grenoble", name: "Capuche / Allies-Alpins", code: "grenoble-capuche-allies-alpins", kind: "quartier",
    area: "East inner", granularity: "micro", parentName: "East inner",
    confidence: "high", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 5.8,
      affordability: 5.6,
      transport: 8.2,
      studentEnergy: 6.8,
      services: 7.4,
      campusAccess: 8.0,
      greenCalm: 6.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "East-inner belt with moderate student relevance.", caveat: "Useful but not a headline pick."
  },
  {
    id: "grenoble-beauvert-cite-abbaye", cityId: "grenoble", name: "Beauvert / Cite de l'Abbaye", code: "grenoble-beauvert-cite-abbaye", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 6.2,
      affordability: 5.4,
      transport: 8.0,
      studentEnergy: 6.8,
      services: 7.4,
      campusAccess: 8.0,
      greenCalm: 6.4
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Eastern residential belt with tolerable value.", caveat: "Context belt with limited student nightlife."
  },
  {
    id: "grenoble-jouhaux-exposition-bajatiere", cityId: "grenoble", name: "Jouhaux / Exposition-Bajatiere", code: "grenoble-jouhaux-exposition-bajatiere", kind: "quartier",
    area: "South-east", granularity: "micro", parentName: "South-east",
    confidence: "high", coverageRole: "context", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 5.4,
      affordability: 6.0,
      transport: 8.2,
      studentEnergy: 6.4,
      services: 7.2,
      campusAccess: 7.4,
      greenCalm: 5.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "South-east context with tram access.", caveat: "Honest peripheral belt coverage."
  },
  {
    id: "grenoble-teisseire-malherbe", cityId: "grenoble", name: "Teisseire / Malherbe", code: "grenoble-teisseire-malherbe", kind: "quartier",
    area: "South-east cap", granularity: "micro", parentName: "South-east cap",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 4.8,
      affordability: 6.6,
      transport: 8.0,
      studentEnergy: 6.0,
      services: 6.8,
      campusAccess: 7.0,
      greenCalm: 5.6
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "South-east cap with value and mixed comfort.", caveat: "Safety cap stays visible."
  },
  {
    id: "grenoble-arlequin-village-olympique-vigny-musset", cityId: "grenoble", name: "Arlequin / Village Olympique / Vigny Musset", code: "grenoble-arlequin-village-olympique-vigny-musset", kind: "quartier",
    area: "South cap", granularity: "micro", parentName: "South cap",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier_group",
    evidenceNote: "Official Grenoble union de quartier group.",
    scores: {
      security: 4.0,
      affordability: 7.4,
      transport: 8.0,
      studentEnergy: 6.0,
      services: 6.8,
      campusAccess: 7.0,
      greenCalm: 5.6
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Southern cap belt with affordability and weak security.", caveat: "Hard cap zone despite rent advantage."
  },
  {
    id: "grenoble-saint-martin-dheres-campus-core", cityId: "grenoble", name: "Saint-Martin-d'Heres campus core", code: "grenoble-saint-martin-dheres-campus-core", kind: "commune",
    area: "Campus suburb", granularity: "micro", parentName: "Campus suburb",
    confidence: "medium", coverageRole: "campus", geometryBasis: "commune",
    evidenceNote: "Saint-Martin-d'Hères commune campus edge.",
    scores: {
      security: 6.8,
      affordability: 6.0,
      transport: 9.2,
      studentEnergy: 9.2,
      services: 7.8,
      campusAccess: 10.0,
      greenCalm: 8.4
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Major campus commune with structural university access.", caveat: "Suburban commute trade-off for campus life."
  },
  {
    id: "grenoble-gieres-campus", cityId: "grenoble", name: "Gieres campus", code: "grenoble-gieres-campus", kind: "commune",
    area: "Campus suburb", granularity: "micro", parentName: "Campus suburb",
    confidence: "medium", coverageRole: "campus", geometryBasis: "commune",
    evidenceNote: "Gières commune campus edge.",
    scores: {
      security: 7.6,
      affordability: 5.8,
      transport: 8.6,
      studentEnergy: 8.0,
      services: 7.4,
      campusAccess: 9.6,
      greenCalm: 8.6
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Gières campus edge with strong university access.", caveat: "Leads Grenoble metro area on campus score."
  },
];
