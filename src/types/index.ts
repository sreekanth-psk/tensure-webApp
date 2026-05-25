export type CloudProvider = "gcp" | "aws" | "azure" | "hybrid";

export type PipelineState =
  | "manual"
  | "partial-cicd"
  | "mature"
  | "legacy";

export interface PipelineFormData {
  cloudProvider: CloudProvider;
  pipelineState: PipelineState;
  teamSize: number;
  deployFrequency: string;
  compliance: string[];
  bottlenecks: string;
  securityConcerns: string;
  currentTooling: string;
  budget: number;
  desiredVelocity: string;
}

export interface ROIMetrics {
  annualSavings: number;
  deployTimeReduction: number;
  complianceScore: number;
  readinessScore: number;
  confidenceScore: number;
  paybackMonths: number;
}

export interface BlueprintNode {
  id: string;
  label: string;
  type: "compute" | "storage" | "network" | "security" | "ci" | "ai";
  x: number;
  y: number;
}

export interface BlueprintEdge {
  from: string;
  to: string;
}

export interface AIBlueprint {
  summary: string;
  architecture: BlueprintNode[];
  edges: BlueprintEdge[];
  roadmap: RoadmapPhase[];
  recommendations: string[];
  roi: ROIMetrics;
  cicdPlan: string[];
}

export interface RoadmapPhase {
  day: number;
  /** Uppercase phase label, e.g. "DISCOVERY & BLUEPRINT" */
  phase: string;
  /** Card heading shown opposite the day label */
  cardTitle: string;
  items: string[];
  maturity?: number;
  compliance?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AIScenario {
  id: string;
  name: string;
  description: string;
  preset: Partial<PipelineFormData>;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
}
