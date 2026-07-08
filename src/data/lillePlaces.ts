import type { PlaceScore } from "@/data/cities";

export const lilleMicroPlaces: PlaceScore[] = [
  {
    id: "lille-centre-gares-euralille", cityId: "lille", name: "Lille-Centre / Gares / Euralille", code: "lille-centre-gares-euralille", kind: "quartier",
    area: "Lille Centre", granularity: "micro", parentName: "Lille Centre",
    confidence: "medium",
    evidenceNote: "Official Lille quartier polygon (medium confidence).",
    scores: {
      security: 5.4,
      affordability: 2.8,
      transport: 9.8,
      studentEnergy: 8.0,
      services: 9.2,
      campusAccess: 8.2,
      greenCalm: 3.8
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Connected hub with huge transport and services utility.", caveat: "Central and useful, but not calm and not cheap."
  },
  {
    id: "lille-vauban-esquermes", cityId: "lille", name: "Vauban-Esquermes / Catho", code: "lille-vauban-esquermes", kind: "quartier",
    area: "Vauban-Esquermes", granularity: "micro", parentName: "Vauban-Esquermes",
    confidence: "medium",
    evidenceNote: "Official Lille quartier polygon (medium confidence).",
    scores: {
      security: 7.2,
      affordability: 4.0,
      transport: 8.0,
      studentEnergy: 9.0,
      services: 8.0,
      campusAccess: 9.3,
      greenCalm: 7.2
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Cleanest student-life pick with campus, services, and tolerable risk.", caveat: "Leads Lille on balanced student quality."
  },
  {
    id: "lille-vieux-lille", cityId: "lille", name: "Vieux-Lille", code: "lille-vieux-lille", kind: "quartier",
    area: "Vieux-Lille", granularity: "micro", parentName: "Vieux-Lille",
    confidence: "medium",
    evidenceNote: "Official Lille quartier polygon (medium confidence).",
    scores: {
      security: 7.0,
      affordability: 2.0,
      transport: 8.2,
      studentEnergy: 7.2,
      services: 8.8,
      campusAccess: 7.2,
      greenCalm: 5.4
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Pleasant historic core with premium feel.", caveat: "Comfort and prestige, not best student value."
  },
  {
    id: "lille-wazemmes", cityId: "lille", name: "Wazemmes", code: "lille-wazemmes", kind: "quartier",
    area: "Wazemmes", granularity: "micro", parentName: "Wazemmes",
    confidence: "medium",
    evidenceNote: "Official Lille quartier polygon (medium confidence).",
    scores: {
      security: 5.0,
      affordability: 6.0,
      transport: 8.8,
      studentEnergy: 9.2,
      services: 8.0,
      campusAccess: 8.4,
      greenCalm: 4.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Street-smart student pick with strong energy and value.", caveat: "Cannot be treated as comfort-safe despite the social life."
  },
  {
    id: "lille-moulins", cityId: "lille", name: "Moulins", code: "lille-moulins", kind: "quartier",
    area: "Moulins", granularity: "micro", parentName: "Moulins",
    confidence: "medium",
    evidenceNote: "Official Lille quartier polygon (medium confidence).",
    scores: {
      security: 4.6,
      affordability: 6.6,
      transport: 8.6,
      studentEnergy: 8.0,
      services: 7.4,
      campusAccess: 9.0,
      greenCalm: 4.2
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Strong campus access and value with real student density.", caveat: "Safety caps the total despite campus utility."
  },
  {
    id: "lille-fives", cityId: "lille", name: "Fives", code: "lille-fives", kind: "quartier",
    area: "Fives", granularity: "micro", parentName: "Fives",
    confidence: "medium",
    evidenceNote: "Official Lille quartier polygon (medium confidence).",
    scores: {
      security: 5.2,
      affordability: 6.4,
      transport: 8.6,
      studentEnergy: 7.0,
      services: 7.2,
      campusAccess: 7.0,
      greenCalm: 4.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Affordable inner-east belt with metro access.", caveat: "Value pick, not a comfort default."
  },
  {
    id: "lille-bois-blancs-euratechnologies", cityId: "lille", name: "Bois-Blancs / Euratechnologies", code: "lille-bois-blancs-euratechnologies", kind: "quartier",
    area: "Bois-Blancs", granularity: "micro", parentName: "Bois-Blancs",
    confidence: "medium",
    evidenceNote: "Official Lille quartier polygon (medium confidence).",
    scores: {
      security: 6.4,
      affordability: 5.2,
      transport: 7.8,
      studentEnergy: 6.8,
      services: 7.2,
      campusAccess: 6.4,
      greenCalm: 6.6
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Calmer west-side pocket with improving tech-campus adjacency.", caveat: "Less student-social than Vauban or Wazemmes."
  },
  {
    id: "lille-sud", cityId: "lille", name: "Lille-Sud", code: "lille-sud", kind: "quartier",
    area: "Lille-Sud", granularity: "micro", parentName: "Lille-Sud",
    confidence: "medium",
    evidenceNote: "Official Lille quartier polygon (medium confidence).",
    scores: {
      security: 4.2,
      affordability: 7.0,
      transport: 7.6,
      studentEnergy: 5.8,
      services: 6.8,
      campusAccess: 7.2,
      greenCalm: 5.2
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Cheap southern belt that stays a cap zone.", caveat: "Cheap rent is not enough to offset the safety profile."
  },
  {
    id: "lille-vda-cite-scientifique", cityId: "lille", name: "Villeneuve-d'Ascq Cité Scientifique", code: "lille-vda-cite-scientifique", kind: "quartier",
    area: "Villeneuve-d'Ascq", granularity: "micro", parentName: "Villeneuve-d'Ascq",
    confidence: "medium",
    evidenceNote: "Official Villeneuve-d'Ascq quartier polygon (medium confidence).",
    scores: {
      security: 6.8,
      affordability: 5.8,
      transport: 8.8,
      studentEnergy: 8.6,
      services: 7.6,
      campusAccess: 10.0,
      greenCalm: 7.8
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Campus-first green option with structural university access.", caveat: "Suburban comfort trade-off for calmer campus life."
  },
  {
    id: "lille-vda-pont-de-bois", cityId: "lille", name: "Villeneuve-d'Ascq Pont de Bois", code: "lille-vda-pont-de-bois", kind: "quartier",
    area: "Villeneuve-d'Ascq", granularity: "micro", parentName: "Villeneuve-d'Ascq",
    confidence: "medium",
    evidenceNote: "Official Villeneuve-d'Ascq quartier polygon (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 6.2,
      transport: 8.8,
      studentEnergy: 8.8,
      services: 7.4,
      campusAccess: 9.8,
      greenCalm: 6.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Lively campus suburb with strong metro links and student energy.", caveat: "More mixed comfort than Cité Scientifique."
  },
];
