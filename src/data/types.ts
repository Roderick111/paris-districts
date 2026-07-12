export type CityId =
  | "paris"
  | "bordeaux"
  | "lyon"
  | "toulouse"
  | "lille"
  | "marseille"
  | "nice"
  | "nantes"
  | "strasbourg"
  | "montpellier"
  | "rennes"
  | "toulon"
  | "grenoble";

export type PlaceKind = "arrondissement" | "quartier" | "commune";
export type RentLevel = "lower" | "medium" | "high" | "very high";
export type StudentFit = "excellent" | "good" | "mixed" | "weak";

export type SourceKind = "official" | "human_experience";

export type Source = {
  label: string;
  url: string;
  kind?: SourceKind;
};

export type PlaceGranularity = "micro" | "macro";
export type PlaceConfidence = "high" | "medium" | "low";
export type CoverageRole = "primary" | "context" | "campus" | "risk_cap" | "low_relevance";
export type GeometryBasis =
  | "iris_partition"
  | "iris_district_partition"
  | "iris_fallback_major_zone"
  | "official_quartier"
  | "official_quartier_group"
  | "arrondissement"
  | "commune"
  | "commune_context";

export type CityConfig = {
  id: CityId;
  name: string;
  title: string;
  geojsonUrl: string;
  outlineGeojsonUrl?: string;
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
  defaultSelectedCode: string;
  areaOptions: string[];
  parentFilterOptions?: string[];
  sources: Source[];
};

export type ScoreKey =
  | "security"
  | "affordability"
  | "transport"
  | "studentEnergy"
  | "services"
  | "campusAccess"
  | "greenCalm";

export type Weights = Record<ScoreKey, number>;
export type PlaceScoreOverrides = Partial<Record<ScoreKey, number>>;

export type PlaceScore = {
  id: string;
  cityId: CityId;
  name: string;
  code: string;
  kind: PlaceKind;
  area: string;
  scores: Record<ScoreKey, number>;
  rentLevel: RentLevel;
  studentFit: StudentFit;
  summary: string;
  caveat: string;
  parentCode?: string;
  parentName?: string;
  granularity?: PlaceGranularity;
  confidence?: PlaceConfidence;
  evidenceNote?: string;
  coverageRole?: CoverageRole;
  geometryBasis?: GeometryBasis;
};