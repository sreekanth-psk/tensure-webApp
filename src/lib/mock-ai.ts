import type {
  AIBlueprint,
  AIScenario,
  PipelineFormData,
  ROIMetrics,
} from "@/types";

export const AI_SCENARIOS: AIScenario[] = [
  {
    id: "fintech",
    name: "FinTech Compliance",
    description: "PCI-DSS, SOC2, and audit-ready pipelines",
    preset: {
      compliance: ["SOC2", "PCI-DSS"],
      securityConcerns: "Financial data encryption, audit trails",
      desiredVelocity: "controlled",
    },
  },
  {
    id: "gitops",
    name: "GitOps Acceleration",
    description: "ArgoCD + Flux declarative delivery",
    preset: {
      currentTooling: "ArgoCD, Helm, Terraform",
      bottlenecks: "Manual promotion gates, drift detection",
      desiredVelocity: "high",
    },
  },
  {
    id: "migration",
    name: "Cloud Migration",
    description: "Lift-and-shift to cloud-native modernization",
    preset: {
      pipelineState: "legacy",
      cloudProvider: "aws",
      bottlenecks: "On-prem dependencies, monolithic deploys",
    },
  },
  {
    id: "ai-infra",
    name: "AI Infrastructure Modernization",
    description: "GPU clusters, model serving, MLOps pipelines",
    preset: {
      currentTooling: "Kubeflow, MLflow, Kubernetes",
      desiredVelocity: "experimental",
    },
  },
  {
    id: "soc2",
    name: "SOC2 Automation",
    description: "Continuous compliance evidence collection",
    preset: {
      compliance: ["SOC2", "ISO27001"],
      securityConcerns: "Access controls, vulnerability scanning",
    },
  },
  {
    id: "k8s",
    name: "Kubernetes Scaling",
    description: "Multi-cluster, autoscaling, service mesh",
    preset: {
      currentTooling: "Kubernetes, Istio, Prometheus",
      teamSize: 25,
      deployFrequency: "daily",
    },
  },
];

const ARCH_NODES = [
  { id: "ingress", label: "API Gateway", type: "network" as const, x: 50, y: 20 },
  { id: "ci", label: "CI/CD Hub", type: "ci" as const, x: 25, y: 45 },
  { id: "k8s", label: "K8s Cluster", type: "compute" as const, x: 50, y: 50 },
  { id: "ai", label: "AI Agents", type: "ai" as const, x: 75, y: 45 },
  { id: "vault", label: "Secrets Vault", type: "security" as const, x: 20, y: 70 },
  { id: "obs", label: "Observability", type: "storage" as const, x: 80, y: 70 },
];

function calculateROI(data: PipelineFormData): ROIMetrics {
  const teamMultiplier = Math.min(data.teamSize / 10, 3);
  const budgetFactor = data.budget / 100000;
  const velocityBoost =
    data.desiredVelocity === "high"
      ? 1.4
      : data.desiredVelocity === "controlled"
        ? 1.1
        : 1.2;

  return {
    annualSavings: Math.round(
      (180000 + data.teamSize * 8500) * teamMultiplier * velocityBoost
    ),
    deployTimeReduction: Math.min(
      75,
      35 + data.teamSize * 0.8 + (data.pipelineState === "legacy" ? 20 : 10)
    ),
    complianceScore: Math.min(
      98,
      60 + (data.compliance.length || 1) * 12
    ),
    readinessScore: Math.min(
      95,
      50 + budgetFactor * 15 + teamMultiplier * 8
    ),
    confidenceScore: Math.min(99, 82 + Math.random() * 12),
    paybackMonths: Math.max(3, Math.round(12 - teamMultiplier * 2)),
  };
}

export async function generateBlueprint(
  data: PipelineFormData
): Promise<AIBlueprint> {
  await new Promise((r) => setTimeout(r, 2200));

  const roi = calculateROI(data);
  const providerLabel = data.cloudProvider.toUpperCase();

  return {
    summary: `AI-optimized ${providerLabel} pipeline blueprint for a ${data.teamSize}-person team targeting ${data.desiredVelocity} deployment velocity. Addresses ${data.bottlenecks || "core bottlenecks"} with automated compliance gates and intelligent release orchestration.`,
    architecture: ARCH_NODES,
    edges: [
      { from: "ingress", to: "ci" },
      { from: "ci", to: "k8s" },
      { from: "k8s", to: "ai" },
      { from: "vault", to: "ci" },
      { from: "k8s", to: "obs" },
      { from: "ai", to: "obs" },
    ],
    roadmap: [
      {
        day: 1,
        phase: "KICKOFF & ASSESSMENT",
        cardTitle: "Map your infrastructure landscape",
        items: [
          "Infrastructure audit & dependency mapping",
          "CI/CD baseline assessment",
          "Security posture scan",
          "Team workflow interviews",
        ],
      },
      {
        day: 30,
        phase: "DISCOVERY & BLUEPRINT",
        cardTitle: "Design your deployment blueprint",
        items: [
          "Automated build & test pipelines",
          "Container registry & artifact management",
          "Staging environment parity",
          "Initial GitOps workflows",
        ],
      },
      {
        day: 60,
        phase: "PIPELINE FOUNDATION",
        cardTitle: "Build your CI/CD developer platform",
        items: [
          "Multi-environment promotion gates",
          "Cost optimization dashboards",
          "AI-assisted deployment reviews",
          "Compliance evidence automation",
        ],
      },
      {
        day: 90,
        phase: "AUTONOMOUS DELIVERY",
        cardTitle: "Scale intelligent release operations",
        items: [
          "Self-healing deployment pipelines",
          "Predictive incident prevention",
          "Full compliance certification readiness",
          "Executive ROI reporting dashboard",
        ],
      },
    ],
    recommendations: [
      `Migrate ${data.pipelineState} workflows to declarative GitOps on ${providerLabel}`,
      `Implement policy-as-code for: ${data.compliance.join(", ") || "baseline security"}`,
      "Deploy AI agents for deployment risk scoring and rollback automation",
      `Reduce deploy cycle from ${data.deployFrequency} cadence to on-demand releases`,
      "Enable infrastructure drift detection with automated remediation",
    ],
    roi,
    cicdPlan: [
      "Unified pipeline templates with environment promotion",
      "Parallel test execution with flaky test quarantine",
      "Canary deployments with automated traffic shifting",
      "Secrets rotation integrated into deploy hooks",
      "Real-time deployment analytics & SLA tracking",
    ],
  };
}

export const STREAMING_CHUNKS = [
  "Analyzing infrastructure topology...",
  "Mapping CI/CD bottlenecks...",
  "Calculating ROI projections...",
  "Generating architecture nodes...",
  "Optimizing deployment pathways...",
  "Finalizing 30-60-90 roadmap...",
];

export const CHAT_RESPONSES: Record<string, string> = {
  default:
    "I can help you design AI-driven deployment pipelines, estimate ROI, and create 30-60-90 day modernization roadmaps. What infrastructure challenge are you facing?",
  pipeline:
    "Based on your inputs, I recommend a GitOps-first pipeline with automated compliance gates. Key wins: 40% faster deploys, reduced manual toil, and continuous audit evidence.",
  roi: "Typical enterprise clients see $180K–$450K annual savings through deploy automation, reduced incident MTTR, and cloud cost optimization within the first year.",
  kubernetes:
    "For Kubernetes scaling, prioritize: HPA/VPA tuning, multi-cluster federation, service mesh for observability, and AI-driven capacity planning.",
};

export function getChatResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("roi") || lower.includes("savings"))
    return CHAT_RESPONSES.roi;
  if (lower.includes("k8s") || lower.includes("kubernetes"))
    return CHAT_RESPONSES.kubernetes;
  if (lower.includes("pipeline") || lower.includes("deploy"))
    return CHAT_RESPONSES.pipeline;
  return CHAT_RESPONSES.default;
}
