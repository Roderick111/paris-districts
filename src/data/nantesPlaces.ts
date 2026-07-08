import type { PlaceScore } from "@/data/cities";

export const nantesMicroPlaces: PlaceScore[] = [
  {
    id: "nantes-centre-ville-decre", cityId: "nantes", name: "Centre-ville / Decré-Commerce-Graslin", code: "nantes-centre-ville-decre", kind: "quartier",
    area: "Centre-ville", granularity: "micro", parentName: "Centre-ville",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 6.2,
      affordability: 3.0,
      transport: 9.6,
      studentEnergy: 9.0,
      services: 9.2,
      campusAccess: 8.4,
      greenCalm: 4.2
    },
    rentLevel: "high", studentFit: "good",
    summary: "Lively core with strong services and tram access.", caveat: "High student energy, but rent and nightlife friction drag."
  },
  {
    id: "nantes-hauts-paves-saint-felix", cityId: "nantes", name: "Hauts-Pavés / Saint-Félix / Michelet", code: "nantes-hauts-paves-saint-felix", kind: "quartier",
    area: "Hauts-Pavés - Saint-Félix", granularity: "micro", parentName: "Hauts-Pavés - Saint-Félix",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 7.2,
      affordability: 4.4,
      transport: 8.6,
      studentEnergy: 8.6,
      services: 8.2,
      campusAccess: 9.6,
      greenCalm: 7.0
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Cleanest student pick with Michelet campus gravity.", caveat: "Leads Nantes on balanced student quality."
  },
  {
    id: "nantes-nord-joneliere", cityId: "nantes", name: "Nantes Nord / Jonelière-Université", code: "nantes-nord-joneliere", kind: "quartier",
    area: "Nantes Nord", granularity: "micro", parentName: "Nantes Nord",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 6.0,
      affordability: 6.0,
      transport: 8.4,
      studentEnergy: 8.8,
      services: 7.6,
      campusAccess: 10.0,
      greenCalm: 7.6
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Northern university belt with structural campus access and value.", caveat: "Strong access, but mixed comfort outside campus streets."
  },
  {
    id: "nantes-ile-de-nantes", cityId: "nantes", name: "Île de Nantes", code: "nantes-ile-de-nantes", kind: "quartier",
    area: "Île de Nantes", granularity: "micro", parentName: "Île de Nantes",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 6.6,
      affordability: 4.2,
      transport: 8.6,
      studentEnergy: 7.8,
      services: 8.0,
      campusAccess: 8.0,
      greenCalm: 6.6
    },
    rentLevel: "high", studentFit: "good",
    summary: "Improving creative belt with tram links and services.", caveat: "Good but not yet a top student default."
  },
  {
    id: "nantes-malakoff-saint-donatien", cityId: "nantes", name: "Malakoff / Saint-Donatien", code: "nantes-malakoff-saint-donatien", kind: "quartier",
    area: "Malakoff - Saint-Donatien", granularity: "micro", parentName: "Malakoff - Saint-Donatien",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 5.2,
      affordability: 6.0,
      transport: 8.8,
      studentEnergy: 7.2,
      services: 7.8,
      campusAccess: 8.0,
      greenCalm: 5.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Inner-east belt with metro-tram access and tolerable value.", caveat: "Needs safety/comfort caps despite affordability."
  },
  {
    id: "nantes-dervallieres-zola", cityId: "nantes", name: "Dervallières / Zola", code: "nantes-dervallieres-zola", kind: "quartier",
    area: "Dervallières - Zola", granularity: "micro", parentName: "Dervallières - Zola",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 5.4,
      affordability: 5.8,
      transport: 8.0,
      studentEnergy: 6.8,
      services: 7.8,
      campusAccess: 7.0,
      greenCalm: 6.4
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Western residential belt with reasonable value.", caveat: "Mixed comfort; not a premium student default."
  },
  {
    id: "nantes-bellevue-chantenay", cityId: "nantes", name: "Bellevue / Chantenay / Sainte-Anne", code: "nantes-bellevue-chantenay", kind: "quartier",
    area: "Bellevue - Chantenay - Sainte-Anne", granularity: "micro", parentName: "Bellevue - Chantenay - Sainte-Anne",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 4.6,
      affordability: 6.8,
      transport: 8.2,
      studentEnergy: 6.8,
      services: 7.4,
      campusAccess: 7.2,
      greenCalm: 6.2
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Affordable western belt that needs safety caps.", caveat: "Value trade, not a comfort pick."
  },
  {
    id: "nantes-breil-barberie", cityId: "nantes", name: "Breil / Barberie", code: "nantes-breil-barberie", kind: "quartier",
    area: "Breil - Barberie", granularity: "micro", parentName: "Breil - Barberie",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 5.0,
      affordability: 6.2,
      transport: 7.6,
      studentEnergy: 5.8,
      services: 7.0,
      campusAccess: 6.6,
      greenCalm: 6.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Northern residential belt with moderate value.", caveat: "Requires honest safety and comfort caps."
  },
  {
    id: "nantes-erdre-chantrerie", cityId: "nantes", name: "Nantes Erdre / Chantrerie", code: "nantes-erdre-chantrerie", kind: "quartier",
    area: "Nantes Erdre", granularity: "micro", parentName: "Nantes Erdre",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 7.0,
      affordability: 5.4,
      transport: 7.4,
      studentEnergy: 7.2,
      services: 7.4,
      campusAccess: 9.4,
      greenCalm: 8.4
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-specific green option on the Erdre corridor.", caveat: "Strong for specific campuses, weaker for central student life."
  },
  {
    id: "nantes-doulon-bottiere", cityId: "nantes", name: "Doulon / Bottière", code: "nantes-doulon-bottiere", kind: "quartier",
    area: "Doulon - Bottière", granularity: "micro", parentName: "Doulon - Bottière",
    confidence: "medium",
    evidenceNote: "Official Nantes administrative quartier (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 6.2,
      transport: 8.2,
      studentEnergy: 6.4,
      services: 7.4,
      campusAccess: 7.0,
      greenCalm: 6.6
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Eastern residential belt with tram access and moderate value.", caveat: "Practical but not a headline student pick."
  },
];
