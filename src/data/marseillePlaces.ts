import type { PlaceScore } from "@/data/cities";

export const marseilleMicroPlaces: PlaceScore[] = [
  {
    id: "marseille-saint-charles-belle-de-mai", cityId: "marseille", name: "Saint-Charles / Belle de Mai edge", code: "marseille-saint-charles-belle-de-mai", kind: "quartier",
    area: "Marseille 1/3", granularity: "micro", parentName: "Marseille 1/3",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
    scores: {
      security: 4.0,
      affordability: 6.2,
      transport: 9.0,
      studentEnergy: 8.2,
      services: 7.4,
      campusAccess: 9.0,
      greenCalm: 3.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Huge campus and transport utility beside the main station.", caveat: "Bad edge effects keep the safety cap dominant."
  },
  {
    id: "marseille-noailles-belsunce", cityId: "marseille", name: "Noailles / Belsunce", code: "marseille-noailles-belsunce", kind: "quartier",
    area: "Marseille 1", granularity: "micro", parentName: "Marseille 1",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
    scores: {
      security: 3.6,
      affordability: 6.6,
      transport: 9.4,
      studentEnergy: 8.8,
      services: 8.0,
      campusAccess: 8.5,
      greenCalm: 2.8
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Central and alive, but the safety cap must dominate.", caveat: "Do not outrank safer campus zones just because it is connected."
  },
  {
    id: "marseille-la-plaine-cours-julien", cityId: "marseille", name: "La Plaine / Cours Julien", code: "marseille-la-plaine-cours-julien", kind: "quartier",
    area: "Marseille 5/6", granularity: "micro", parentName: "Marseille 5/6",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
    scores: {
      security: 5.0,
      affordability: 5.6,
      transport: 8.8,
      studentEnergy: 9.8,
      services: 8.4,
      campusAccess: 8.2,
      greenCalm: 3.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Student/social pick with the strongest nightlife energy in town.", caveat: "The social pick, not the safe pick."
  },
  {
    id: "marseille-baille-timone", cityId: "marseille", name: "Baille / La Timone", code: "marseille-baille-timone", kind: "quartier",
    area: "Marseille 5", granularity: "micro", parentName: "Marseille 5",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
    scores: {
      security: 6.2,
      affordability: 5.2,
      transport: 9.0,
      studentEnergy: 8.2,
      services: 8.2,
      campusAccess: 10.0,
      greenCalm: 5.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Best balanced in-city student zone with hospital-university gravity.", caveat: "Strong first-pass pick for campus-first students."
  },
  {
    id: "marseille-castellane-prefecture", cityId: "marseille", name: "Castellane / Préfecture", code: "marseille-castellane-prefecture", kind: "quartier",
    area: "Marseille 6", granularity: "micro", parentName: "Marseille 6",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
    scores: {
      security: 6.6,
      affordability: 3.8,
      transport: 9.2,
      studentEnergy: 7.6,
      services: 8.8,
      campusAccess: 8.4,
      greenCalm: 4.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Safer east-centre belt with strong services and metro.", caveat: "Safer but expensive compared with Baille."
  },
  {
    id: "marseille-prado-perier-rouet", cityId: "marseille", name: "Prado / Périer / Rouet", code: "marseille-prado-perier-rouet", kind: "quartier",
    area: "Marseille 8", granularity: "micro", parentName: "Marseille 8",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
    scores: {
      security: 7.4,
      affordability: 2.8,
      transport: 8.8,
      studentEnergy: 6.4,
      services: 8.8,
      campusAccess: 7.2,
      greenCalm: 6.4
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer south-east residential belt with sea access.", caveat: "Safer but expensive with modest student energy."
  },
  {
    id: "marseille-vieux-port-panier", cityId: "marseille", name: "Vieux-Port / Panier", code: "marseille-vieux-port-panier", kind: "quartier",
    area: "Marseille 1/2", granularity: "micro", parentName: "Marseille 1/2",
    confidence: "low",
    evidenceNote: "Grouped official Marseille quartiers (low confidence).",
    scores: {
      security: 5.0,
      affordability: 3.4,
      transport: 9.2,
      studentEnergy: 8.2,
      services: 9.0,
      campusAccess: 7.6,
      greenCalm: 4.0
    },
    rentLevel: "high", studentFit: "good",
    summary: "Iconic waterfront core with services and tourist energy.", caveat: "Postcard access with rent and exposure limits."
  },
  {
    id: "marseille-endoume-catalans", cityId: "marseille", name: "Endoume / Catalans", code: "marseille-endoume-catalans", kind: "quartier",
    area: "Marseille 7", granularity: "micro", parentName: "Marseille 7",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
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
    summary: "Calmer sea-facing south-west pocket with village feel.", caveat: "Quality of life pick, not a student-default."
  },
  {
    id: "marseille-luminy-redon", cityId: "marseille", name: "Luminy / Redon campus", code: "marseille-luminy-redon", kind: "quartier",
    area: "Marseille 9", granularity: "micro", parentName: "Marseille 9",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
    scores: {
      security: 7.8,
      affordability: 4.4,
      transport: 6.4,
      studentEnergy: 7.6,
      services: 6.6,
      campusAccess: 10.0,
      greenCalm: 10.0
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Green campus enclave with top campus access and calm.", caveat: "Transport friction is the main daily-life limiter."
  },
  {
    id: "marseille-saint-jerome-chateau-gombert", cityId: "marseille", name: "Saint-Jérôme / Château-Gombert", code: "marseille-saint-jerome-chateau-gombert", kind: "quartier",
    area: "Marseille 13", granularity: "micro", parentName: "Marseille 13",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 6.6,
      transport: 7.2,
      studentEnergy: 7.6,
      services: 7.2,
      campusAccess: 9.4,
      greenCalm: 6.4
    },
    rentLevel: "lower", studentFit: "good",
    summary: "Northern campus belt with strong university access and value.", caveat: "Less central student life than Baille or Luminy."
  },
  {
    id: "marseille-castellane-15e-north", cityId: "marseille", name: "La Castellane / 15e north", code: "marseille-castellane-15e-north", kind: "quartier",
    area: "Marseille 15", granularity: "micro", parentName: "Marseille 15",
    confidence: "medium",
    evidenceNote: "Grouped official Marseille quartiers (medium confidence).",
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
    summary: "Northern districts that need brutal caps despite cheap rent.", caveat: "Avoid averaging rough northern pockets into a soft score."
  },
];
