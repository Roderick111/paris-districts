import type { PlaceScore } from "@/data/cities";

export const nantesMicroPlaces: PlaceScore[] = [
  {
    id: "nantes-decre-bouffay", cityId: "nantes", name: "Decre / Bouffay", code: "nantes-decre-bouffay", kind: "quartier",
    area: "Centre-ville", granularity: "micro", parentName: "Centre-ville",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 3.1,
      transport: 9.7,
      studentEnergy: 9.4,
      services: 9.2,
      campusAccess: 8.4,
      greenCalm: 3.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "High-energy centre-ville streets with strong student social life.", caveat: "Social life is real; comfort and safety are not automatic."
  },
  {
    id: "nantes-commerce-graslin", cityId: "nantes", name: "Commerce / Graslin", code: "nantes-commerce-graslin", kind: "quartier",
    area: "Centre-ville", granularity: "micro", parentName: "Centre-ville",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.4,
      affordability: 2.7,
      transport: 9.7,
      studentEnergy: 9.0,
      services: 9.4,
      campusAccess: 8.3,
      greenCalm: 4.2
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Balanced centre-ville micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-talensac-viarme", cityId: "nantes", name: "Talensac / Viarme", code: "nantes-talensac-viarme", kind: "quartier",
    area: "Centre north", granularity: "micro", parentName: "Centre north",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.7,
      affordability: 3.8,
      transport: 9.0,
      studentEnergy: 8.4,
      services: 8.7,
      campusAccess: 8.6,
      greenCalm: 5.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced centre north micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-hauts-paves", cityId: "nantes", name: "Hauts-Paves", code: "nantes-hauts-paves", kind: "quartier",
    area: "Hauts-Paves - Saint-Felix", granularity: "micro", parentName: "Hauts-Paves - Saint-Felix",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 7.1,
      affordability: 4.2,
      transport: 8.6,
      studentEnergy: 8.1,
      services: 8.1,
      campusAccess: 9.0,
      greenCalm: 6.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced hauts-paves - saint-felix micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-saint-felix-michelet", cityId: "nantes", name: "Saint-Felix / Michelet", code: "nantes-saint-felix-michelet", kind: "quartier",
    area: "Hauts-Paves - Saint-Felix", granularity: "micro", parentName: "Hauts-Paves - Saint-Felix",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 7.3,
      affordability: 4.4,
      transport: 8.6,
      studentEnergy: 8.6,
      services: 8.2,
      campusAccess: 9.6,
      greenCalm: 7.0
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Campus-first hauts-paves - saint-felix pick with structural university access.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "nantes-facultes-petit-port", cityId: "nantes", name: "Facultes / Petit-Port", code: "nantes-facultes-petit-port", kind: "quartier",
    area: "Nantes Nord", granularity: "micro", parentName: "Nantes Nord",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.5,
      affordability: 5.6,
      transport: 8.6,
      studentEnergy: 8.8,
      services: 7.8,
      campusAccess: 10.0,
      greenCalm: 7.6
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-first nantes nord pick with structural university access.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "nantes-joneliere", cityId: "nantes", name: "Joneliere", code: "nantes-joneliere", kind: "quartier",
    area: "Nantes Nord", granularity: "micro", parentName: "Nantes Nord",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.8,
      affordability: 5.8,
      transport: 8.2,
      studentEnergy: 8.2,
      services: 7.4,
      campusAccess: 9.8,
      greenCalm: 8.2
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-first nantes nord pick with structural university access.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "nantes-bout-des-landes-boissiere", cityId: "nantes", name: "Bout des Landes / Boissiere", code: "nantes-bout-des-landes-boissiere", kind: "quartier",
    area: "Nantes Nord", granularity: "micro", parentName: "Nantes Nord",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 5.2,
      affordability: 6.7,
      transport: 7.8,
      studentEnergy: 6.2,
      services: 6.8,
      campusAccess: 8.2,
      greenCalm: 6.8
    },
    rentLevel: "lower", studentFit: "good",
    summary: "Practical nantes nord belt with tolerable value and metro access.", caveat: "Useful compromise, not a headline comfort pick."
  },
  {
    id: "nantes-chantrerie-gachet", cityId: "nantes", name: "Chantrerie / Gachet", code: "nantes-chantrerie-gachet", kind: "quartier",
    area: "Nantes Erdre", granularity: "micro", parentName: "Nantes Erdre",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 7.2,
      affordability: 5.2,
      transport: 7.2,
      studentEnergy: 7.3,
      services: 7.3,
      campusAccess: 9.5,
      greenCalm: 8.8
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-first nantes erdre pick with structural university access.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "nantes-saint-joseph-porterie", cityId: "nantes", name: "Saint-Joseph de Porterie", code: "nantes-saint-joseph-porterie", kind: "quartier",
    area: "Nantes Erdre", granularity: "micro", parentName: "Nantes Erdre",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 7.0,
      affordability: 5.6,
      transport: 7.4,
      studentEnergy: 6.6,
      services: 7.2,
      campusAccess: 8.2,
      greenCalm: 8.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Balanced nantes erdre micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-ile-de-nantes-west", cityId: "nantes", name: "Ile de Nantes west", code: "nantes-ile-de-nantes-west", kind: "quartier",
    area: "Ile de Nantes", granularity: "micro", parentName: "Ile de Nantes",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.8,
      affordability: 4.0,
      transport: 8.7,
      studentEnergy: 8.1,
      services: 8.1,
      campusAccess: 8.2,
      greenCalm: 6.7
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced ile de nantes micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-ile-de-nantes-east", cityId: "nantes", name: "Ile de Nantes east", code: "nantes-ile-de-nantes-east", kind: "quartier",
    area: "Ile de Nantes", granularity: "micro", parentName: "Ile de Nantes",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.4,
      affordability: 4.5,
      transport: 8.5,
      studentEnergy: 7.5,
      services: 7.8,
      campusAccess: 7.8,
      greenCalm: 6.6
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced ile de nantes micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-malakoff", cityId: "nantes", name: "Malakoff", code: "nantes-malakoff", kind: "quartier",
    area: "Malakoff - Saint-Donatien", granularity: "micro", parentName: "Malakoff - Saint-Donatien",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 4.8,
      affordability: 6.4,
      transport: 8.8,
      studentEnergy: 6.8,
      services: 7.4,
      campusAccess: 8.0,
      greenCalm: 5.4
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Balanced malakoff - saint-donatien micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-saint-donatien", cityId: "nantes", name: "Saint-Donatien", code: "nantes-saint-donatien", kind: "quartier",
    area: "Malakoff - Saint-Donatien", granularity: "micro", parentName: "Malakoff - Saint-Donatien",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.8,
      affordability: 4.8,
      transport: 8.6,
      studentEnergy: 7.2,
      services: 8.2,
      campusAccess: 7.8,
      greenCalm: 6.2
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced malakoff - saint-donatien micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-dervallieres", cityId: "nantes", name: "Dervallieres", code: "nantes-dervallieres", kind: "quartier",
    area: "Dervallieres - Zola", granularity: "micro", parentName: "Dervallieres - Zola",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 4.8,
      affordability: 6.6,
      transport: 7.8,
      studentEnergy: 6.0,
      services: 7.0,
      campusAccess: 6.8,
      greenCalm: 6.2
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Balanced dervallieres - zola micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-zola", cityId: "nantes", name: "Zola", code: "nantes-zola", kind: "quartier",
    area: "Dervallieres - Zola", granularity: "micro", parentName: "Dervallieres - Zola",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.0,
      affordability: 5.2,
      transport: 8.2,
      studentEnergy: 7.2,
      services: 8.0,
      campusAccess: 7.2,
      greenCalm: 6.6
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced dervallieres - zola micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-chantenay-sainte-anne", cityId: "nantes", name: "Chantenay / Sainte-Anne", code: "nantes-chantenay-sainte-anne", kind: "quartier",
    area: "Bellevue - Chantenay - Sainte-Anne", granularity: "micro", parentName: "Bellevue - Chantenay - Sainte-Anne",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.0,
      affordability: 5.4,
      transport: 8.0,
      studentEnergy: 7.1,
      services: 7.7,
      campusAccess: 7.0,
      greenCalm: 7.2
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced bellevue - chantenay - sainte-anne micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-bellevue", cityId: "nantes", name: "Bellevue", code: "nantes-bellevue", kind: "quartier",
    area: "Bellevue - Chantenay - Sainte-Anne", granularity: "micro", parentName: "Bellevue - Chantenay - Sainte-Anne",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 4.3,
      affordability: 7.0,
      transport: 8.1,
      studentEnergy: 6.3,
      services: 7.0,
      campusAccess: 7.1,
      greenCalm: 6.0
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Balanced bellevue - chantenay - sainte-anne micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-breil", cityId: "nantes", name: "Breil", code: "nantes-breil", kind: "quartier",
    area: "Breil - Barberie", granularity: "micro", parentName: "Breil - Barberie",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 4.9,
      affordability: 6.3,
      transport: 7.6,
      studentEnergy: 5.8,
      services: 7.0,
      campusAccess: 6.6,
      greenCalm: 6.8
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Balanced breil - barberie micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-barberie", cityId: "nantes", name: "Barberie", code: "nantes-barberie", kind: "quartier",
    area: "Breil - Barberie", granularity: "micro", parentName: "Breil - Barberie",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.2,
      affordability: 5.4,
      transport: 7.7,
      studentEnergy: 6.4,
      services: 7.4,
      campusAccess: 6.8,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced breil - barberie micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-doulon", cityId: "nantes", name: "Doulon", code: "nantes-doulon", kind: "quartier",
    area: "Doulon - Bottiere", granularity: "micro", parentName: "Doulon - Bottiere",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 6.0,
      affordability: 5.8,
      transport: 8.0,
      studentEnergy: 6.6,
      services: 7.5,
      campusAccess: 7.0,
      greenCalm: 6.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced doulon - bottiere micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nantes-bottiere", cityId: "nantes", name: "Bottiere", code: "nantes-bottiere", kind: "quartier",
    area: "Doulon - Bottiere", granularity: "micro", parentName: "Doulon - Bottiere",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nantes-student-life.md (medium confidence).",
    scores: {
      security: 5.2,
      affordability: 6.6,
      transport: 8.3,
      studentEnergy: 6.2,
      services: 7.1,
      campusAccess: 7.0,
      greenCalm: 6.4
    },
    rentLevel: "lower", studentFit: "good",
    summary: "Practical doulon - bottiere belt with tolerable value and metro access.", caveat: "Useful compromise, not a headline comfort pick."
  },
];
