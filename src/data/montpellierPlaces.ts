import type { PlaceScore } from "@/data/cities";

export const montpellierPlaces: PlaceScore[] = [
  {
    id: "montpellier-ecusson-core", cityId: "montpellier", name: "Ecusson core", code: "montpellier-ecusson-core", kind: "quartier",
    area: "Montpellier Centre", granularity: "micro", parentName: "Montpellier Centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "Historic core with strong student energy and services.", caveat: "Rent-hostile; comfort not automatic."
  },
  {
    id: "montpellier-comedie-gare", cityId: "montpellier", name: "Comedie / Gare", code: "montpellier-comedie-gare", kind: "quartier",
    area: "Montpellier Centre", granularity: "micro", parentName: "Montpellier Centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "Station-core belt with huge transit utility.", caveat: "Connected but not calm or cheap."
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
    id: "montpellier-arceaux-gambetta-figuerolles", cityId: "montpellier", name: "Arceaux / Gambetta / Figuerolles", code: "montpellier-arceaux-gambetta-figuerolles", kind: "quartier",
    area: "West centre", granularity: "micro", parentName: "West centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "Lively west-centre belt with value and energy.", caveat: "Mixed comfort; not a premium-safe default."
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
    id: "montpellier-richter-jacques-coeur", cityId: "montpellier", name: "Richter / Jacques-Coeur", code: "montpellier-richter-jacques-coeur", kind: "quartier",
    area: "East campus", granularity: "micro", parentName: "East campus",
    confidence: "high", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "East-campus belt with strong university access.", caveat: "Campus-first pick with less historic-centre charm."
  },
  {
    id: "montpellier-port-marianne-millenaire-odysseum", cityId: "montpellier", name: "Port Marianne / Millenaire / Odysseum", code: "montpellier-port-marianne-millenaire-odysseum", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "Modern east belt with tram and services.", caveat: "Different bet from historic centre."
  },
  {
    id: "montpellier-hopitaux-facultes-triolet", cityId: "montpellier", name: "Hopitaux-Facultes / Triolet", code: "montpellier-hopitaux-facultes-triolet", kind: "quartier",
    area: "North campus", granularity: "micro", parentName: "North campus",
    confidence: "high", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "Main north-campus belt with structural university access.", caveat: "Campus utility over nightlife."
  },
  {
    id: "montpellier-paul-valery-route-de-mende", cityId: "montpellier", name: "Paul-Valery / Route de Mende", code: "montpellier-paul-valery-route-de-mende", kind: "quartier",
    area: "North campus", granularity: "micro", parentName: "North campus",
    confidence: "high", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "Paul-Valery campus corridor with strong access.", caveat: "Best for campus-first students."
  },
  {
    id: "montpellier-aiguelongue-malbosc", cityId: "montpellier", name: "Aiguelongue / Malbosc", code: "montpellier-aiguelongue-malbosc", kind: "quartier",
    area: "North-east", granularity: "micro", parentName: "North-east",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "Green north-east belt with calmer daily life.", caveat: "Less student-social than Boutonnet."
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
    id: "montpellier-mosson-paillade", cityId: "montpellier", name: "Mosson / Paillade", code: "montpellier-mosson-paillade", kind: "quartier",
    area: "North-west cap", granularity: "micro", parentName: "North-west cap",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "North-west cap with hard safety constraints.", caveat: "Affordability cannot rescue the risk profile."
  },
  {
    id: "montpellier-pres-arenes-gare-sud", cityId: "montpellier", name: "Pres d'Arenes / Gare Sud", code: "montpellier-pres-arenes-gare-sud", kind: "quartier",
    area: "South", granularity: "micro", parentName: "South",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped major district approximation.",
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
    summary: "Southern station belt with mixed student relevance.", caveat: "Useful value belt with cap constraints."
  },
];
