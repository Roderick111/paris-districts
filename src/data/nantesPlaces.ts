import type { PlaceScore } from "@/data/cities";

export const nantesMicroPlaces: PlaceScore[] = [
  {
    id: "nantes-centre-bouffay-commerce", cityId: "nantes", name: "Centre-ville / Bouffay / Commerce / Graslin", code: "nantes-centre-bouffay-commerce", kind: "quartier",
    area: "Centre-ville", granularity: "micro", parentName: "Centre-ville",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Centre-ville quartier polygon; whole administrative parent.",
    scores: { security: 6.1, affordability: 2.9, transport: 9.7, studentEnergy: 9.2, services: 9.3, campusAccess: 8.4, greenCalm: 4.0 },
    rentLevel: "high", studentFit: "good",
    summary: "High-energy centre-ville streets with strong student social life.",
    caveat: "Social life is real; comfort and safety are not automatic."
  },
  {
    id: "nantes-talensac-viarme-hauts-paves", cityId: "nantes", name: "Talensac / Viarme / Hauts-Pavés", code: "nantes-talensac-viarme-hauts-paves", kind: "quartier",
    area: "Hauts-Pavés - Saint-Félix", granularity: "micro", parentName: "Hauts-Pavés - Saint-Félix",
    confidence: "high", coverageRole: "primary", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 2 micro rows.",
    scores: { security: 6.9, affordability: 4.0, transport: 8.8, studentEnergy: 8.2, services: 8.4, campusAccess: 8.8, greenCalm: 6.1 },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced centre north micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-saint-felix-michelet", cityId: "nantes", name: "Saint-Félix / Michelet", code: "nantes-saint-felix-michelet", kind: "quartier",
    area: "Hauts-Pavés - Saint-Félix", granularity: "micro", parentName: "Hauts-Pavés - Saint-Félix",
    confidence: "high", coverageRole: "campus", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 1 micro rows.",
    scores: { security: 7.3, affordability: 4.4, transport: 8.6, studentEnergy: 8.6, services: 8.2, campusAccess: 9.6, greenCalm: 7.0 },
    rentLevel: "high", studentFit: "excellent",
    summary: "Campus-first hauts-paves - saint-felix pick with structural university access.",
    caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "nantes-facultes-petit-port", cityId: "nantes", name: "Facultés / Petit-Port", code: "nantes-facultes-petit-port", kind: "quartier",
    area: "Nantes Nord", granularity: "micro", parentName: "Nantes Nord",
    confidence: "high", coverageRole: "campus", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 2 micro rows.",
    scores: { security: 6.7, affordability: 5.7, transport: 8.4, studentEnergy: 8.5, services: 7.6, campusAccess: 9.9, greenCalm: 7.9 },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-first nantes nord pick with structural university access.",
    caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "nantes-nord-context", cityId: "nantes", name: "Nantes Nord context", code: "nantes-nord-context", kind: "quartier",
    area: "Nantes Nord", granularity: "micro", parentName: "Nantes Nord",
    confidence: "low", coverageRole: "context", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 1 micro rows.",
    scores: { security: 5.2, affordability: 6.7, transport: 7.8, studentEnergy: 6.2, services: 6.8, campusAccess: 8.2, greenCalm: 6.8 },
    rentLevel: "lower", studentFit: "good",
    summary: "Practical nantes nord belt with tolerable value and metro access.",
    caveat: "Useful compromise, not a headline comfort pick."
  },
  {
    id: "nantes-chantrerie-gachet", cityId: "nantes", name: "Chantrerie / Gachet", code: "nantes-chantrerie-gachet", kind: "quartier",
    area: "Nantes Erdre", granularity: "micro", parentName: "Nantes Erdre",
    confidence: "high", coverageRole: "campus", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 1 micro rows.",
    scores: { security: 7.2, affordability: 5.2, transport: 7.2, studentEnergy: 7.3, services: 7.3, campusAccess: 9.5, greenCalm: 8.8 },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-first nantes erdre pick with structural university access.",
    caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "nantes-erdre-context", cityId: "nantes", name: "Saint-Joseph / Nantes Erdre context", code: "nantes-erdre-context", kind: "quartier",
    area: "Nantes Erdre", granularity: "micro", parentName: "Nantes Erdre",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 1 micro rows.",
    scores: { security: 7.0, affordability: 5.6, transport: 7.4, studentEnergy: 6.6, services: 7.2, campusAccess: 8.2, greenCalm: 8.0 },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Balanced nantes erdre micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-ile-west-centre", cityId: "nantes", name: "Ile de Nantes west / centre", code: "nantes-ile-west-centre", kind: "quartier",
    area: "Ile de Nantes", granularity: "micro", parentName: "Ile de Nantes",
    confidence: "high", coverageRole: "primary", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 1 micro rows.",
    scores: { security: 6.8, affordability: 4.0, transport: 8.7, studentEnergy: 8.1, services: 8.1, campusAccess: 8.2, greenCalm: 6.7 },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced ile de nantes micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-ile-east", cityId: "nantes", name: "Ile de Nantes east", code: "nantes-ile-east", kind: "quartier",
    area: "Ile de Nantes", granularity: "micro", parentName: "Ile de Nantes",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 1 micro rows.",
    scores: { security: 6.4, affordability: 4.5, transport: 8.5, studentEnergy: 7.5, services: 7.8, campusAccess: 7.8, greenCalm: 6.6 },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced ile de nantes micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-malakoff", cityId: "nantes", name: "Malakoff", code: "nantes-malakoff", kind: "quartier",
    area: "Malakoff - Saint-Donatien", granularity: "micro", parentName: "Malakoff - Saint-Donatien",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 1 micro rows.",
    scores: { security: 4.8, affordability: 6.4, transport: 8.8, studentEnergy: 6.8, services: 7.4, campusAccess: 8.0, greenCalm: 5.4 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Balanced malakoff - saint-donatien micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-saint-donatien", cityId: "nantes", name: "Saint-Donatien", code: "nantes-saint-donatien", kind: "quartier",
    area: "Malakoff - Saint-Donatien", granularity: "micro", parentName: "Malakoff - Saint-Donatien",
    confidence: "high", coverageRole: "primary", geometryBasis: "iris_district_partition",
    evidenceNote: "Nantes IRIS district from nantes-student-life.md; merged from 1 micro rows.",
    scores: { security: 6.8, affordability: 4.8, transport: 8.6, studentEnergy: 7.2, services: 8.2, campusAccess: 7.8, greenCalm: 6.2 },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced malakoff - saint-donatien micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-dervallieres-zola", cityId: "nantes", name: "Dervallières / Zola", code: "nantes-dervallieres-zola", kind: "quartier",
    area: "Dervallières - Zola", granularity: "micro", parentName: "Dervallières - Zola",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier",
    evidenceNote: "Official Dervallières - Zola quartier polygon; whole administrative parent.",
    scores: { security: 5.4, affordability: 5.9, transport: 8.0, studentEnergy: 6.6, services: 7.5, campusAccess: 7.0, greenCalm: 6.4 },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Balanced dervallieres - zola micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-bellevue-chantenay-sainte-anne", cityId: "nantes", name: "Bellevue / Chantenay / Sainte-Anne", code: "nantes-bellevue-chantenay-sainte-anne", kind: "quartier",
    area: "Bellevue - Chantenay - Sainte-Anne", granularity: "micro", parentName: "Bellevue - Chantenay - Sainte-Anne",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier",
    evidenceNote: "Official Bellevue - Chantenay - Sainte-Anne quartier polygon.",
    scores: { security: 5.2, affordability: 6.2, transport: 8.1, studentEnergy: 6.7, services: 7.3, campusAccess: 7.0, greenCalm: 6.6 },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Balanced bellevue - chantenay - sainte-anne micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-breil-barberie", cityId: "nantes", name: "Breil / Barberie", code: "nantes-breil-barberie", kind: "quartier",
    area: "Breil - Barberie", granularity: "micro", parentName: "Breil - Barberie",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier",
    evidenceNote: "Official Breil - Barberie quartier polygon; whole administrative parent.",
    scores: { security: 5.6, affordability: 5.8, transport: 7.7, studentEnergy: 6.1, services: 7.2, campusAccess: 6.7, greenCalm: 6.9 },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Balanced breil - barberie micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-doulon-bottiere", cityId: "nantes", name: "Doulon / Bottière", code: "nantes-doulon-bottiere", kind: "quartier",
    area: "Doulon - Bottière", granularity: "micro", parentName: "Doulon - Bottière",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier",
    evidenceNote: "Official Doulon - Bottière quartier polygon; whole administrative parent.",
    scores: { security: 5.6, affordability: 6.2, transport: 8.2, studentEnergy: 6.4, services: 7.3, campusAccess: 7.0, greenCalm: 6.6 },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced doulon - bottiere micro-area with mixed student trade-offs.",
    caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-sud", cityId: "nantes", name: "Nantes Sud", code: "nantes-sud", kind: "quartier",
    area: "Nantes Sud", granularity: "micro", parentName: "Nantes Sud",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier",
    evidenceNote: "Official Nantes Sud quartier polygon; south Loire context coverage.",
    scores: { security: 6.0, affordability: 5.8, transport: 7.2, studentEnergy: 5.8, services: 6.8, campusAccess: 6.2, greenCalm: 6.2 },
    rentLevel: "medium", studentFit: "weak",
    summary: "South Loire context with lower student relevance.",
    caveat: "Honest broad district score; not a campus or nightlife pick."
  },
];
