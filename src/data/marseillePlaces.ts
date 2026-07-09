import type { PlaceScore } from "@/data/cities";

export const marseilleMicroPlaces: PlaceScore[] = [
  {
    id: "marseille-saint-charles", cityId: "marseille", name: "Saint-Charles", code: "marseille-saint-charles", kind: "quartier",
    area: "1e", granularity: "micro", parentName: "1e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 4.1,
      affordability: 6.0,
      transport: 9.4,
      studentEnergy: 8.0,
      services: 7.6,
      campusAccess: 9.2,
      greenCalm: 3.3
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Balanced 1e micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "marseille-belle-de-mai", cityId: "marseille", name: "Belle de Mai", code: "marseille-belle-de-mai", kind: "quartier",
    area: "3e", granularity: "micro", parentName: "3e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 3.9,
      affordability: 6.8,
      transport: 8.0,
      studentEnergy: 7.4,
      services: 6.8,
      campusAccess: 8.2,
      greenCalm: 3.8
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Belle de Mai stays hard-capped on safety despite useful 3e links.", caveat: "Cheap rent and transport cannot offset the risk profile."
  },
  {
    id: "marseille-noailles", cityId: "marseille", name: "Noailles", code: "marseille-noailles", kind: "quartier",
    area: "1e", granularity: "micro", parentName: "1e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 3.5,
      affordability: 6.6,
      transport: 9.5,
      studentEnergy: 9.0,
      services: 8.0,
      campusAccess: 8.5,
      greenCalm: 2.6
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Noailles stays hard-capped on safety despite useful 1e links.", caveat: "Cheap rent and transport cannot offset the risk profile."
  },
  {
    id: "marseille-belsunce", cityId: "marseille", name: "Belsunce", code: "marseille-belsunce", kind: "quartier",
    area: "1e", granularity: "micro", parentName: "1e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 3.7,
      affordability: 6.4,
      transport: 9.4,
      studentEnergy: 8.5,
      services: 7.8,
      campusAccess: 8.4,
      greenCalm: 2.8
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Belsunce stays hard-capped on safety despite useful 1e links.", caveat: "Cheap rent and transport cannot offset the risk profile."
  },
  {
    id: "marseille-cours-julien", cityId: "marseille", name: "Cours Julien", code: "marseille-cours-julien", kind: "quartier",
    area: "6e", granularity: "micro", parentName: "6e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 5.3,
      affordability: 5.4,
      transport: 8.9,
      studentEnergy: 9.8,
      services: 8.5,
      campusAccess: 8.2,
      greenCalm: 3.7
    },
    rentLevel: "medium", studentFit: "good",
    summary: "High-energy 6e streets with strong student social life.", caveat: "Social life is real; comfort and safety are not automatic."
  },
  {
    id: "marseille-la-plaine-notre-dame-du-mont", cityId: "marseille", name: "La Plaine / Notre-Dame-du-Mont", code: "marseille-la-plaine-notre-dame-du-mont", kind: "quartier",
    area: "6e", granularity: "micro", parentName: "6e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 5.1,
      affordability: 5.6,
      transport: 8.8,
      studentEnergy: 9.4,
      services: 8.3,
      campusAccess: 8.1,
      greenCalm: 3.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "High-energy 6e streets with strong student social life.", caveat: "Social life is real; comfort and safety are not automatic."
  },
  {
    id: "marseille-lodi", cityId: "marseille", name: "Lodi", code: "marseille-lodi", kind: "quartier",
    area: "6e/5e", granularity: "micro", parentName: "6e/5e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 5.7,
      affordability: 5.4,
      transport: 8.7,
      studentEnergy: 8.0,
      services: 8.0,
      campusAccess: 8.4,
      greenCalm: 4.4
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced 6e/5e micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "marseille-baille", cityId: "marseille", name: "Baille", code: "marseille-baille", kind: "quartier",
    area: "5e", granularity: "micro", parentName: "5e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 6.1,
      affordability: 5.4,
      transport: 9.1,
      studentEnergy: 8.1,
      services: 8.2,
      campusAccess: 9.6,
      greenCalm: 4.9
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-first 5e pick with structural university access.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "marseille-la-timone", cityId: "marseille", name: "La Timone", code: "marseille-la-timone", kind: "quartier",
    area: "5e", granularity: "micro", parentName: "5e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 6.3,
      affordability: 5.0,
      transport: 9.0,
      studentEnergy: 8.0,
      services: 8.1,
      campusAccess: 10.0,
      greenCalm: 5.1
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-first 5e pick with structural university access.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "marseille-castellane", cityId: "marseille", name: "Castellane", code: "marseille-castellane", kind: "quartier",
    area: "6e", granularity: "micro", parentName: "6e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 6.7,
      affordability: 3.8,
      transport: 9.3,
      studentEnergy: 7.7,
      services: 8.9,
      campusAccess: 8.5,
      greenCalm: 4.8
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced 6e micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "marseille-prefecture", cityId: "marseille", name: "Prefecture", code: "marseille-prefecture", kind: "quartier",
    area: "6e", granularity: "micro", parentName: "6e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 6.4,
      affordability: 3.5,
      transport: 9.2,
      studentEnergy: 7.4,
      services: 8.9,
      campusAccess: 8.2,
      greenCalm: 4.5
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced 6e micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "marseille-rouet", cityId: "marseille", name: "Rouet", code: "marseille-rouet", kind: "quartier",
    area: "8e", granularity: "micro", parentName: "8e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 6.8,
      affordability: 4.0,
      transport: 8.8,
      studentEnergy: 7.1,
      services: 8.4,
      campusAccess: 7.9,
      greenCalm: 5.6
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced 8e micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "marseille-perier", cityId: "marseille", name: "Perier", code: "marseille-perier", kind: "quartier",
    area: "8e", granularity: "micro", parentName: "8e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 7.5,
      affordability: 2.8,
      transport: 8.9,
      studentEnergy: 6.6,
      services: 8.8,
      campusAccess: 7.4,
      greenCalm: 6.1
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer 8e pocket with premium rent and calmer daily life.", caveat: "Quality-of-life pick, not a value student default."
  },
  {
    id: "marseille-prado-saint-giniez", cityId: "marseille", name: "Prado / Saint-Giniez", code: "marseille-prado-saint-giniez", kind: "quartier",
    area: "8e", granularity: "micro", parentName: "8e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 7.6,
      affordability: 2.6,
      transport: 8.6,
      studentEnergy: 6.0,
      services: 8.8,
      campusAccess: 7.0,
      greenCalm: 6.6
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer 8e pocket with premium rent and calmer daily life.", caveat: "Quality-of-life pick, not a value student default."
  },
  {
    id: "marseille-vieux-port-opera", cityId: "marseille", name: "Vieux-Port / Opera", code: "marseille-vieux-port-opera", kind: "quartier",
    area: "1e", granularity: "micro", parentName: "1e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 5.2,
      affordability: 3.2,
      transport: 9.5,
      studentEnergy: 8.6,
      services: 9.2,
      campusAccess: 7.8,
      greenCalm: 3.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced 1e micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "marseille-panier-hotel-de-ville", cityId: "marseille", name: "Panier / Hotel de Ville", code: "marseille-panier-hotel-de-ville", kind: "quartier",
    area: "2e", granularity: "micro", parentName: "2e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 5.1,
      affordability: 3.7,
      transport: 9.0,
      studentEnergy: 8.0,
      services: 8.6,
      campusAccess: 7.5,
      greenCalm: 4.2
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced 2e micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "marseille-joliette-euromed", cityId: "marseille", name: "Joliette / Euromed", code: "marseille-joliette-euromed", kind: "quartier",
    area: "2e", granularity: "micro", parentName: "2e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 5.6,
      affordability: 4.2,
      transport: 9.1,
      studentEnergy: 7.4,
      services: 8.2,
      campusAccess: 7.8,
      greenCalm: 4.6
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced 2e micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "marseille-endoume-catalans", cityId: "marseille", name: "Endoume / Catalans", code: "marseille-endoume-catalans", kind: "quartier",
    area: "7e", granularity: "micro", parentName: "7e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 7.2,
      affordability: 2.6,
      transport: 7.6,
      studentEnergy: 6.8,
      services: 8.0,
      campusAccess: 6.8,
      greenCalm: 7.8
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer 7e pocket with premium rent and calmer daily life.", caveat: "Quality-of-life pick, not a value student default."
  },
  {
    id: "marseille-sainte-anne-mazargues", cityId: "marseille", name: "Sainte-Anne / Mazargues", code: "marseille-sainte-anne-mazargues", kind: "quartier",
    area: "8e/9e", granularity: "micro", parentName: "8e/9e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 7.0,
      affordability: 4.2,
      transport: 7.3,
      studentEnergy: 6.4,
      services: 7.8,
      campusAccess: 7.2,
      greenCalm: 7.2
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced 8e/9e micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "marseille-luminy-campus", cityId: "marseille", name: "Luminy campus", code: "marseille-luminy-campus", kind: "quartier",
    area: "9e", granularity: "micro", parentName: "9e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 7.9,
      affordability: 4.4,
      transport: 6.3,
      studentEnergy: 7.7,
      services: 6.6,
      campusAccess: 10.0,
      greenCalm: 10.0
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Campus-first 9e pick with structural university access.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "marseille-saint-jerome", cityId: "marseille", name: "Saint-Jerome", code: "marseille-saint-jerome", kind: "quartier",
    area: "13e", granularity: "micro", parentName: "13e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 5.6,
      affordability: 6.8,
      transport: 7.3,
      studentEnergy: 7.6,
      services: 7.2,
      campusAccess: 9.4,
      greenCalm: 6.2
    },
    rentLevel: "lower", studentFit: "good",
    summary: "Practical 13e belt with tolerable value and metro access.", caveat: "Useful compromise, not a headline comfort pick."
  },
  {
    id: "marseille-chateau-gombert", cityId: "marseille", name: "Chateau-Gombert", code: "marseille-chateau-gombert", kind: "quartier",
    area: "13e", granularity: "micro", parentName: "13e",
    confidence: "high",
    evidenceNote: "official quartier geometry from marseille-student-life.md (high confidence).",
    scores: {
      security: 6.2,
      affordability: 6.2,
      transport: 6.8,
      studentEnergy: 7.2,
      services: 7.0,
      campusAccess: 9.0,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Practical 13e belt with tolerable value and metro access.", caveat: "Useful compromise, not a headline comfort pick."
  },
  {
    id: "marseille-la-castellane-15e-north", cityId: "marseille", name: "La Castellane / 15e north", code: "marseille-la-castellane-15e-north", kind: "quartier",
    area: "15e", granularity: "micro", parentName: "15e",
    confidence: "medium",
    evidenceNote: "official/group geometry from marseille-student-life.md (medium confidence).",
    scores: {
      security: 2.6,
      affordability: 7.6,
      transport: 6.6,
      studentEnergy: 4.8,
      services: 6.2,
      campusAccess: 5.6,
      greenCalm: 4.8
    },
    rentLevel: "lower", studentFit: "weak",
    summary: "La Castellane / 15e north stays hard-capped on safety despite useful 15e links.", caveat: "Cheap rent and transport cannot offset the risk profile."
  },
];
