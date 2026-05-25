"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";
import { Zap, RotateCcw, Server, Database } from "lucide-react";

/* ─────────────────────────────────────────────
   Pipeline step definitions
───────────────────────────────────────────── */
interface PipelineStep {
  id: number;
  phase: string;
  title: string;
  description: string;
  tools: string[];
  targetPath: string;
  activatedStep: string;
  consoleLines: { text: string; color: string }[];
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 1,
    phase: "LOCAL CLI/GIT PUSH",
    title: "Developer commits code",
    description:
      "Developers push their branches safely with lightweight linting, testing, and secret scans executing immediately.",
    tools: ["GIT &", "HUSKY"],
    targetPath: "[GIT & HUSKY]",
    activatedStep: "Developer commits code",
    consoleLines: [
      { text: "$ git push origin main", color: "text-emerald-400" },
      {
        text: "✓ Authenticated developer SSH validation block",
        color: "text-emerald-300",
      },
      {
        text: "✓ Husky: Executing prepush TypeScript compilation tests",
        color: "text-emerald-300",
      },
      {
        text: "✓ Git Hook Success: Code changes pushed to target registry",
        color: "text-emerald-300",
      },
    ],
  },
  {
    id: 2,
    phase: "ARGOCD / GITOPS SYNC",
    title: "Continuous build & validation",
    description:
      "Automatic cluster and pipeline triggers build containers, push to securely-scanned registry registries, and verify schemas.",
    tools: ["DOCKER & AWS", "ECR"],
    targetPath: "[ARGOCD & GITOPS]",
    activatedStep: "Continuous build & validation",
    consoleLines: [
      { text: "$ docker build -t app:latest .", color: "text-emerald-400" },
      {
        text: "✓ Container image built and vulnerability scanned",
        color: "text-emerald-300",
      },
      {
        text: "✓ Schema validation passed: 0 breaking changes detected",
        color: "text-emerald-300",
      },
      {
        text: "✓ Image pushed to ECR: sha256:a4f8b2c...",
        color: "text-emerald-300",
      },
    ],
  },
  {
    id: 3,
    phase: "GOLDEN PATH PROVISIONING",
    title: "Self-service Kubernetes deployment",
    description:
      "Terraform modules and Helm chart templates provision staging environments dynamically within milliseconds, isolating test environments.",
    tools: ["KUBERNETES &", "TERRAFORM"],
    targetPath: "[TERRAFORM & HELM]",
    activatedStep: "Self-service K8s deployment",
    consoleLines: [
      { text: "$ terraform apply -auto-approve", color: "text-emerald-400" },
      {
        text: "✓ Namespace tensure-staging created in 340ms",
        color: "text-emerald-300",
      },
      {
        text: "✓ Helm chart deployed: app v2.4.1 → staging",
        color: "text-emerald-300",
      },
      {
        text: "✓ Health checks passed: 3/3 pods running",
        color: "text-emerald-300",
      },
    ],
  },
  {
    id: 4,
    phase: "UNIFIED OBSERVABILITY",
    title: "Live performance & logs",
    description:
      "Production containers load with automated telemetry, real-time alert filters, and automatic rollback on anomalous error levels.",
    tools: ["PROMETHEUS &", "DATADOG"],
    targetPath: "[PROMETHEUS & DD]",
    activatedStep: "Live performance & logs",
    consoleLines: [
      {
        text: "$ kubectl rollout status deployment/app",
        color: "text-emerald-400",
      },
      {
        text: "✓ P99 latency: 42ms — within SLA threshold",
        color: "text-emerald-300",
      },
      { text: "✓ Error rate: 0.003% — nominal", color: "text-emerald-300" },
      {
        text: "✓ Rollback watchdog armed: monitoring anomalies",
        color: "text-emerald-300",
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   Cluster state per step
───────────────────────────────────────────── */
const CLUSTER_STATES = [
  { replicas: "PENDING", rollback: "ARMED" },
  { replicas: "BUILDING", rollback: "STANDBY" },
  { replicas: "ONLINE (67%)", rollback: "STABLE" },
  { replicas: "ONLINE (100%)", rollback: "STABLE" },
];

/* ─────────────────────────────────────────────
   Console Output Panel
───────────────────────────────────────────── */
function ConsolePanel({ step }: { step: PipelineStep; stepIndex: number }) {
  const clusterState = CLUSTER_STATES[step.id - 1];
  const isFullyOnline = step.id === 4;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-950/30">
      {/* Mac-style window header */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-500" />
        <span className="ml-auto font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Console Stream Output
        </span>
      </div>

      {/* Console body */}
      <div className="flex flex-1 flex-col gap-4 overflow-auto p-5">
        {/* Target path badge */}
        <div className="inline-flex w-fit items-center rounded border border-slate-700 bg-slate-800/60 px-3 py-1.5 font-mono text-xs text-slate-300">
          TARGET PATH:{" "}
          <span className="ml-1 text-amber-300">{step.targetPath}</span>
        </div>

        {/* Activated step badge */}
        <div className="inline-flex w-fit items-center rounded border border-slate-700 bg-slate-800/60 px-3 py-1.5 font-mono text-xs text-slate-300">
          ACTIVATED STEP:{" "}
          <span className="ml-1 text-slate-200">{step.activatedStep}</span>
        </div>

        {/* Console lines */}
        <div className="space-y-1.5 rounded-lg bg-black/30 p-4">
          {step.consoleLines.map((line, i) => (
            <p
              key={i}
              className={`font-mono text-xs leading-relaxed ${line.color}`}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>

      {/* Cluster state footer */}
      <div className="border-t border-white/10 px-5 py-4">
        <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Local Cluster State:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Server className="h-3 w-3 text-slate-400" />
              <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                Staging Replicas
              </p>
            </div>
            <p
              className={`mt-1 font-mono text-sm font-bold ${isFullyOnline ? "text-emerald-400" : "text-amber-400"}`}
            >
              {clusterState.replicas}
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Database className="h-3 w-3 text-slate-400" />
              <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                Rollback Status
              </p>
            </div>
            <p
              className={`mt-1 font-mono text-sm font-bold ${clusterState.rollback === "STABLE" ? "text-emerald-400" : "text-amber-400"}`}
            >
              {clusterState.rollback}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Section
───────────────────────────────────────────── */
export function PipelineEngineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToStep = useCallback(
    (index: number) => {
      setActiveStep(index);
    },
    []
  );

  // Auto-rotate logic
  useEffect(() => {
    if (!autoRotate) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
    }, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRotate]);

  // GSAP entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(".pipeline-header", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      });
      gsap.from(".pipeline-left", {
        x: -48,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
      gsap.from(".pipeline-right", {
        x: 48,
        opacity: 0,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const currentStep = PIPELINE_STEPS[activeStep];

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
    >
      {/* Subtle background texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.04),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="pipeline-header mb-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-700">
            <Zap size={11} className="text-emerald-600" />
            Pipeline Engine
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[42px]">
            How your code travels to production
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            Click on any phase to pause automation and inspect pipeline status.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]">
          {/* ── Left: Steps panel ── */}
          <div className="pipeline-left space-y-4">
            {/* Auto-rotate toggle */}
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Pipeline Sequence Steps:
              </p>
              <button
                onClick={() => setAutoRotate((v) => !v)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${autoRotate
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${autoRotate ? "animate-pulse bg-emerald-500" : "bg-slate-400"}`}
                />
                {autoRotate ? "Auto Rotate On" : "Auto Rotate Off"}
                <RotateCcw size={9} />
              </button>
            </div>

            {/* Steps */}
            {PIPELINE_STEPS.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setAutoRotate(false);
                    goToStep(index);
                  }}
                  className={`w-full rounded-2xl border p-5 text-left transition-all duration-300 ${isActive
                    ? "border-emerald-200 bg-emerald-600 shadow-lg shadow-emerald-600/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/60"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs font-bold ${isActive ? "text-emerald-200" : "text-slate-400"}`}
                        >
                          0{step.id}
                        </span>
                        <span
                          className={`font-mono text-[9px] font-bold uppercase tracking-widest ${isActive ? "text-emerald-300" : "text-slate-400"}`}
                        >
                          {step.phase}
                        </span>
                      </div>
                      <h3
                        className={`mt-1.5 text-base font-bold ${isActive ? "text-white" : "text-slate-800"}`}
                      >
                        {step.title}
                      </h3>
                      {isActive && (
                        <p className="mt-2 text-sm leading-relaxed text-emerald-100/90">
                          {step.description}
                        </p>
                      )}
                    </div>

                    {/* Tool tags */}
                    <div
                      className={`shrink-0 rounded-lg border px-2.5 py-2 text-center font-mono text-[9px] font-bold uppercase leading-snug tracking-wider ${isActive
                        ? "border-emerald-400/40 bg-emerald-700/50 text-emerald-200"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                    >
                      {step.tools.map((t) => (
                        <div key={t}>{t}</div>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Right: Console panel ── */}
          <div className="pipeline-right h-full lg:sticky lg:top-28">
            <ConsolePanel step={currentStep} stepIndex={activeStep} />
          </div>
        </div>
      </div>
    </section>
  );
}
