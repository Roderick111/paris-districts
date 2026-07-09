import type { PlaceScore } from "@/data/cities";

export const toulouseMicroPlaces: PlaceScore[] = [
  {
    id: "toulouse-capitole", cityId: "toulouse", name: "Capitole", code: "toulouse-capitole", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 5.7,
      affordability: 2.2,
      transport: 9.8,
      studentEnergy: 9.0,
      services: 9.5,
      campusAccess: 8.7,
      greenCalm: 3.8
    },
    rentLevel: "very high", studentFit: "good",
    summary: "High-energy centre streets with strong student social life.", caveat: "Social life is real; comfort and safety are not automatic."
  },
  {
    id: "toulouse-carmes-esquirol", cityId: "toulouse", name: "Carmes / Esquirol", code: "toulouse-carmes-esquirol", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 6.1,
      affordability: 2.3,
      transport: 9.6,
      studentEnergy: 8.8,
      services: 9.4,
      campusAccess: 8.7,
      greenCalm: 4.2
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Balanced centre micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-arnaud-bernard", cityId: "toulouse", name: "Arnaud-Bernard", code: "toulouse-arnaud-bernard", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 4.7,
      affordability: 4.3,
      transport: 9.1,
      studentEnergy: 9.5,
      services: 8.4,
      campusAccess: 9.1,
      greenCalm: 3.6
    },
    rentLevel: "high", studentFit: "mixed",
    summary: "High-energy centre streets with strong student social life.", caveat: "Social life is real; comfort and safety are not automatic."
  },
  {
    id: "toulouse-saint-sernin", cityId: "toulouse", name: "Saint-Sernin", code: "toulouse-saint-sernin", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 5.4,
      affordability: 3.8,
      transport: 8.9,
      studentEnergy: 8.8,
      services: 8.6,
      campusAccess: 9.0,
      greenCalm: 4.0
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced centre micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-compans-caffarelli", cityId: "toulouse", name: "Compans-Caffarelli", code: "toulouse-compans-caffarelli", kind: "quartier",
    area: "Centre north", granularity: "micro", parentName: "Centre north",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 6.7,
      affordability: 3.6,
      transport: 9.0,
      studentEnergy: 7.6,
      services: 8.6,
      campusAccess: 8.2,
      greenCalm: 6.4
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced centre north micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-amidonniers", cityId: "toulouse", name: "Amidonniers", code: "toulouse-amidonniers", kind: "quartier",
    area: "Centre north", granularity: "micro", parentName: "Centre north",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 7.0,
      affordability: 4.1,
      transport: 8.2,
      studentEnergy: 6.8,
      services: 7.8,
      campusAccess: 7.7,
      greenCalm: 7.6
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced centre north micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-chalets", cityId: "toulouse", name: "Chalets", code: "toulouse-chalets", kind: "quartier",
    area: "Centre north-east", granularity: "micro", parentName: "Centre north-east",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 6.6,
      affordability: 3.5,
      transport: 8.9,
      studentEnergy: 8.0,
      services: 8.3,
      campusAccess: 8.1,
      greenCalm: 5.4
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced centre north-east micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-bayard-matabiau", cityId: "toulouse", name: "Bayard / Matabiau edge", code: "toulouse-bayard-matabiau", kind: "quartier",
    area: "Station edge", granularity: "micro", parentName: "Station edge",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 5.0,
      affordability: 4.4,
      transport: 9.4,
      studentEnergy: 8.0,
      services: 8.2,
      campusAccess: 8.4,
      greenCalm: 3.6
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced station edge micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-saint-aubin-dupuy", cityId: "toulouse", name: "Saint-Aubin / Dupuy", code: "toulouse-saint-aubin-dupuy", kind: "quartier",
    area: "Centre east", granularity: "micro", parentName: "Centre east",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 6.0,
      affordability: 3.7,
      transport: 9.0,
      studentEnergy: 8.6,
      services: 8.7,
      campusAccess: 8.2,
      greenCalm: 4.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced centre east micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-saint-cyprien", cityId: "toulouse", name: "Saint-Cyprien", code: "toulouse-saint-cyprien", kind: "quartier",
    area: "Rive gauche", granularity: "micro", parentName: "Rive gauche",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 6.8,
      affordability: 4.8,
      transport: 8.9,
      studentEnergy: 8.7,
      services: 8.4,
      campusAccess: 8.1,
      greenCalm: 6.1
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced rive gauche micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-patte-doie", cityId: "toulouse", name: "Patte-d'Oie", code: "toulouse-patte-doie", kind: "quartier",
    area: "Rive gauche", granularity: "micro", parentName: "Rive gauche",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 6.4,
      affordability: 5.2,
      transport: 8.7,
      studentEnergy: 7.6,
      services: 7.8,
      campusAccess: 7.8,
      greenCalm: 6.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced rive gauche micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-saint-michel", cityId: "toulouse", name: "Saint-Michel", code: "toulouse-saint-michel", kind: "quartier",
    area: "Centre south", granularity: "micro", parentName: "Centre south",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 5.2,
      affordability: 5.4,
      transport: 8.9,
      studentEnergy: 8.6,
      services: 8.1,
      campusAccess: 8.7,
      greenCalm: 4.3
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced centre south micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-saint-agne", cityId: "toulouse", name: "Saint-Agne", code: "toulouse-saint-agne", kind: "quartier",
    area: "Centre south", granularity: "micro", parentName: "Centre south",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 6.0,
      affordability: 5.5,
      transport: 8.6,
      studentEnergy: 7.6,
      services: 7.8,
      campusAccess: 8.8,
      greenCalm: 5.6
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced centre south micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-empalot", cityId: "toulouse", name: "Empalot", code: "toulouse-empalot", kind: "quartier",
    area: "South", granularity: "micro", parentName: "South",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 4.3,
      affordability: 7.0,
      transport: 8.1,
      studentEnergy: 6.0,
      services: 6.8,
      campusAccess: 8.0,
      greenCalm: 5.0
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Balanced south micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-rangueil-campus", cityId: "toulouse", name: "Rangueil campus", code: "toulouse-rangueil-campus", kind: "quartier",
    area: "South-east campus", granularity: "micro", parentName: "South-east campus",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 7.1,
      affordability: 5.5,
      transport: 8.5,
      studentEnergy: 8.7,
      services: 7.7,
      campusAccess: 10.0,
      greenCalm: 7.2
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-first south-east campus pick with structural university access.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "toulouse-sauzelong-jules-julien", cityId: "toulouse", name: "Sauzelong / Jules-Julien", code: "toulouse-sauzelong-jules-julien", kind: "quartier",
    area: "South-east", granularity: "micro", parentName: "South-east",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 6.8,
      affordability: 5.8,
      transport: 8.6,
      studentEnergy: 7.8,
      services: 7.8,
      campusAccess: 9.2,
      greenCalm: 6.7
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Balanced south-east micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-mirail-universite", cityId: "toulouse", name: "Mirail Universite", code: "toulouse-mirail-universite", kind: "quartier",
    area: "South-west campus", granularity: "micro", parentName: "South-west campus",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 4.2,
      affordability: 7.2,
      transport: 8.2,
      studentEnergy: 7.0,
      services: 6.9,
      campusAccess: 9.0,
      greenCalm: 5.8
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Balanced south-west campus micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-reynerie", cityId: "toulouse", name: "Reynerie", code: "toulouse-reynerie", kind: "quartier",
    area: "South-west", granularity: "micro", parentName: "South-west",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 3.5,
      affordability: 7.6,
      transport: 8.0,
      studentEnergy: 6.2,
      services: 6.4,
      campusAccess: 8.4,
      greenCalm: 5.5
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Reynerie stays hard-capped on safety despite useful south-west links.", caveat: "Cheap rent and transport cannot offset the risk profile."
  },
  {
    id: "toulouse-bellefontaine", cityId: "toulouse", name: "Bellefontaine", code: "toulouse-bellefontaine", kind: "quartier",
    area: "South-west", granularity: "micro", parentName: "South-west",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 3.7,
      affordability: 7.4,
      transport: 7.8,
      studentEnergy: 6.0,
      services: 6.5,
      campusAccess: 8.0,
      greenCalm: 5.4
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Bellefontaine stays hard-capped on safety despite useful south-west links.", caveat: "Cheap rent and transport cannot offset the risk profile."
  },
  {
    id: "toulouse-minimes", cityId: "toulouse", name: "Minimes", code: "toulouse-minimes", kind: "quartier",
    area: "North", granularity: "micro", parentName: "North",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 6.1,
      affordability: 5.5,
      transport: 8.5,
      studentEnergy: 7.1,
      services: 7.8,
      campusAccess: 7.2,
      greenCalm: 5.9
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced north micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "toulouse-barriere-paris-la-vache", cityId: "toulouse", name: "Barriere de Paris / La Vache", code: "toulouse-barriere-paris-la-vache", kind: "quartier",
    area: "North", granularity: "micro", parentName: "North",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from toulouse-student-life.md (medium confidence).",
    scores: {
      security: 5.5,
      affordability: 6.0,
      transport: 8.7,
      studentEnergy: 6.8,
      services: 7.4,
      campusAccess: 7.1,
      greenCalm: 5.7
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Practical north belt with tolerable value and metro access.", caveat: "Useful compromise, not a headline comfort pick."
  },
];
