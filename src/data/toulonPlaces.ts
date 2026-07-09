import type { PlaceScore } from "@/data/cities";

export const toulonPlaces: PlaceScore[] = [
  {
    id: "toulon-haute-ville-liberte", cityId: "toulon", name: "Haute Ville / Liberte", code: "toulon-haute-ville-liberte", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium", coverageRole: "risk_cap", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 4.8,
      affordability: 5.2,
      transport: 8.6,
      studentEnergy: 7.4,
      services: 8.4,
      campusAccess: 7.8,
      greenCalm: 3.8
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Upper centre with services but mixed comfort.", caveat: "Safety cap dominates despite central access."
  },
  {
    id: "toulon-basse-ville-port", cityId: "toulon", name: "Basse Ville / Port", code: "toulon-basse-ville-port", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium", coverageRole: "risk_cap", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 4.6,
      affordability: 5.6,
      transport: 8.4,
      studentEnergy: 7.2,
      services: 8.0,
      campusAccess: 7.4,
      greenCalm: 3.6
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Port-centre belt with transit and mixed profile.", caveat: "Hard-capped centre zone, not a comfort default."
  },
  {
    id: "toulon-la-rode-mayol", cityId: "toulon", name: "La Rode / Mayol", code: "toulon-la-rode-mayol", kind: "quartier",
    area: "East centre", granularity: "micro", parentName: "East centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 6.2,
      affordability: 4.4,
      transport: 8.2,
      studentEnergy: 6.8,
      services: 8.4,
      campusAccess: 7.2,
      greenCalm: 6.4
    },
    rentLevel: "high", studentFit: "good",
    summary: "Useful east-centre belt with sea access.", caveat: "Best in-city compromise outside campus communes."
  },
  {
    id: "toulon-mourillon-core", cityId: "toulon", name: "Mourillon core", code: "toulon-mourillon-core", kind: "quartier",
    area: "East coast", granularity: "micro", parentName: "East coast",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 7.4,
      affordability: 3.2,
      transport: 7.4,
      studentEnergy: 7.0,
      services: 8.2,
      campusAccess: 6.8,
      greenCalm: 8.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Coastal east belt with village feel and calm.", caveat: "Quality-of-life pick with moderate student energy."
  },
  {
    id: "toulon-la-mitre-fort-saint-louis", cityId: "toulon", name: "La Mitre / Fort Saint-Louis", code: "toulon-la-mitre-fort-saint-louis", kind: "quartier",
    area: "East coast", granularity: "micro", parentName: "East coast",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 7.6,
      affordability: 3.0,
      transport: 7.0,
      studentEnergy: 6.4,
      services: 7.8,
      campusAccess: 6.4,
      greenCalm: 9.0
    },
    rentLevel: "high", studentFit: "good",
    summary: "Premium east-coast belt with green calm.", caveat: "Low student density despite coastal appeal."
  },
  {
    id: "toulon-cap-brun-serinette", cityId: "toulon", name: "Cap Brun / Serinette", code: "toulon-cap-brun-serinette", kind: "quartier",
    area: "East coast", granularity: "micro", parentName: "East coast",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped east-coast residential belt split from overbroad La Mitre grouping.",
    scores: {
      security: 7.2,
      affordability: 3.6,
      transport: 7.2,
      studentEnergy: 6.2,
      services: 7.4,
      campusAccess: 6.8,
      greenCalm: 8.2
    },
    rentLevel: "high", studentFit: "good",
    summary: "Calmer east-coast residential belt.", caveat: "Comfort pick more than student-density pick."
  },
  {
    id: "toulon-saint-jean-du-var-font-pre", cityId: "toulon", name: "Saint-Jean-du-Var / Font-Pre", code: "toulon-saint-jean-du-var-font-pre", kind: "quartier",
    area: "East inner", granularity: "micro", parentName: "East inner",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 5.2,
      affordability: 6.0,
      transport: 8.0,
      studentEnergy: 6.2,
      services: 7.2,
      campusAccess: 7.0,
      greenCalm: 5.2
    },
    rentLevel: "medium", studentFit: "good",
    summary: "East-inner belt with moderate value.", caveat: "Honest context zone with mixed comfort."
  },
  {
    id: "toulon-sainte-musse-brunet", cityId: "toulon", name: "Sainte-Musse / Brunet", code: "toulon-sainte-musse-brunet", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 5.6,
      affordability: 6.2,
      transport: 7.8,
      studentEnergy: 5.8,
      services: 7.2,
      campusAccess: 7.2,
      greenCalm: 5.6
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Eastern belt with tolerable value and transit.", caveat: "Useful but not a headline student pick."
  },
  {
    id: "toulon-pont-du-las-bon-rencontre", cityId: "toulon", name: "Pont-du-Las / Bon Rencontre", code: "toulon-pont-du-las-bon-rencontre", kind: "quartier",
    area: "West", granularity: "micro", parentName: "West",
    confidence: "medium", coverageRole: "risk_cap", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 4.8,
      affordability: 6.8,
      transport: 7.6,
      studentEnergy: 6.4,
      services: 7.2,
      campusAccess: 6.4,
      greenCalm: 4.8
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Western belt capped by safety and distance.", caveat: "Value trade with visible cap constraints."
  },
  {
    id: "toulon-nord-ouest-routes-valbertrand", cityId: "toulon", name: "Nord-Ouest / Routes / Valbertrand", code: "toulon-nord-ouest-routes-valbertrand", kind: "quartier",
    area: "North-west", granularity: "micro", parentName: "North-west",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 5.8,
      affordability: 5.8,
      transport: 6.8,
      studentEnergy: 5.4,
      services: 6.8,
      campusAccess: 5.8,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "North-west context with green edges.", caveat: "Peripheral belt with limited student scene."
  },
  {
    id: "toulon-faron-claret-siblas", cityId: "toulon", name: "Faron / Claret / Siblas", code: "toulon-faron-claret-siblas", kind: "quartier",
    area: "North-west", granularity: "micro", parentName: "North-west",
    confidence: "medium", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped north-centre hill/context belt split from overbroad centre/east-coast zones.",
    scores: {
      security: 6.2,
      affordability: 5.2,
      transport: 7.0,
      studentEnergy: 5.8,
      services: 7.0,
      campusAccess: 6.0,
      greenCalm: 7.6
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "North-centre hill and residential context.", caveat: "Useful for coverage continuity, not a student default."
  },
  {
    id: "toulon-beaucaire-pont-neuf-lagoubran", cityId: "toulon", name: "Beaucaire / Pont-Neuf / Lagoubran", code: "toulon-beaucaire-pont-neuf-lagoubran", kind: "quartier",
    area: "West edge", granularity: "micro", parentName: "West edge",
    confidence: "medium", coverageRole: "risk_cap", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "IRIS-grouped grand quartier approximation.",
    scores: {
      security: 4.6,
      affordability: 6.6,
      transport: 6.8,
      studentEnergy: 5.8,
      services: 6.8,
      campusAccess: 6.2,
      greenCalm: 5.2
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "West-edge cap with affordability and weak comfort.", caveat: "Safety cap stays visible."
  },
  {
    id: "toulon-la-garde-campus", cityId: "toulon", name: "La Garde campus", code: "toulon-la-garde-campus", kind: "commune",
    area: "Campus suburb", granularity: "micro", parentName: "Campus suburb",
    confidence: "medium", coverageRole: "campus", geometryBasis: "commune",
    evidenceNote: "La Garde commune campus edge.",
    scores: {
      security: 6.8,
      affordability: 5.8,
      transport: 7.4,
      studentEnergy: 7.8,
      services: 7.2,
      campusAccess: 10.0,
      greenCalm: 7.6
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Main university campus commune with structural access.", caveat: "Commuter campus, not a city-centre lifestyle."
  },
  {
    id: "toulon-la-valette-avenue-83-la-seyne-edge", cityId: "toulon", name: "La Valette / Avenue 83 edge", code: "toulon-la-valette-avenue-83-la-seyne-edge", kind: "commune",
    area: "Commute edge", granularity: "micro", parentName: "Commute edge",
    confidence: "low", coverageRole: "campus", geometryBasis: "commune_context",
    evidenceNote: "La Valette-du-Var commune context edge.",
    scores: {
      security: 6.2,
      affordability: 5.8,
      transport: 7.0,
      studentEnergy: 6.2,
      services: 7.2,
      campusAccess: 8.4,
      greenCalm: 6.6
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Commute edge for Avenue 83 and eastern access.", caveat: "Honest peripheral campus commute node."
  },
];
