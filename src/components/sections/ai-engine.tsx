"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";
import {
  Sparkles,
  Calculator,
  Loader2,
  Wifi,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { usePipelineStore } from "@/store/pipeline-store";
import { AI_SCENARIOS } from "@/lib/mock-ai";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { BlueprintVisualization, ROIPanel } from "@/components/ai";

ensureGsapPlugins();

export function AIEngineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    formData,
    activeTab,
    blueprint,
    isGenerating,
    streamingText,
    setFormField,
    setActiveTab,
    applyScenario,
    generateBlueprint,
  } = usePipelineStore();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".engine-panel",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="engine"
      ref={sectionRef}
      className="relative bg-surface py-24 lg:py-32"
    >
      <div className="absolute inset-0 bg-hero-glow opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center" data-reveal>
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald-brand">
            AI Spec & Calculator Engine
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Configure Your Infrastructure Blueprint
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-600">
            Describe your DevOps environment and let AI agents generate
            deployment pipelines, ROI projections, and execution roadmaps.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Panel */}
          <GlassCard className="engine-panel border-navy-100/80">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "spec" | "roi")}
            >
              <TabsList className="w-full">
                <TabsTrigger value="spec" className="flex-1 gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Spec Blueprint
                </TabsTrigger>
                <TabsTrigger value="roi" className="flex-1 gap-2">
                  <Calculator className="h-4 w-4" />
                  ROI Calculator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="spec" className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Cloud Provider</Label>
                    <Select
                      value={formData.cloudProvider}
                      onValueChange={(v) =>
                        setFormField(
                          "cloudProvider",
                          v as typeof formData.cloudProvider
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gcp">GCP</SelectItem>
                        <SelectItem value="aws">AWS</SelectItem>
                        <SelectItem value="azure">Azure</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pipeline State</Label>
                    <Select
                      value={formData.pipelineState}
                      onValueChange={(v) =>
                        setFormField(
                          "pipelineState",
                          v as typeof formData.pipelineState
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="partial-cicd">Partial CI/CD</SelectItem>
                        <SelectItem value="mature">Mature</SelectItem>
                        <SelectItem value="legacy">Legacy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Team Size</Label>
                    <Input
                      type="number"
                      value={formData.teamSize}
                      onChange={(e) =>
                        setFormField("teamSize", parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deploy Frequency</Label>
                    <Select
                      value={formData.deployFrequency}
                      onValueChange={(v) => setFormField("deployFrequency", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pipeline Bottlenecks</Label>
                  <Input
                    value={formData.bottlenecks}
                    onChange={(e) => setFormField("bottlenecks", e.target.value)}
                    placeholder="Manual gates, slow tests..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Security Concerns</Label>
                  <Input
                    value={formData.securityConcerns}
                    onChange={(e) =>
                      setFormField("securityConcerns", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Current Tooling</Label>
                  <Input
                    value={formData.currentTooling}
                    onChange={(e) =>
                      setFormField("currentTooling", e.target.value)
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Budget (USD)</Label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormField("budget", parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Desired Velocity</Label>
                    <Select
                      value={formData.desiredVelocity}
                      onValueChange={(v) =>
                        setFormField("desiredVelocity", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="controlled">Controlled</SelectItem>
                        <SelectItem value="experimental">Experimental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="roi">
                <ROIPanel formData={formData} blueprint={blueprint} />
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Label className="mb-3 block">Pre-built AI Scenarios</Label>
              <div className="flex flex-wrap gap-2">
                {AI_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => applyScenario(scenario.preset)}
                    className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-700 transition-all hover:border-emerald-brand/50 hover:bg-emerald-brand/5 hover:text-emerald-dark"
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="emerald"
              size="lg"
              className="mt-8 w-full"
              onClick={() => generateBlueprint()}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Blueprint...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Custom Blueprint
                </>
              )}
            </Button>
          </GlassCard>

          {/* Right Panel */}
          <div className="engine-panel relative min-h-[520px] overflow-hidden rounded-2xl border border-navy-200/60 bg-navy-950 shadow-premium">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.12),_transparent_50%)]" />

            <div className="relative flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${isGenerating ? "animate-pulse bg-amber-400" : blueprint ? "bg-emerald-brand" : "bg-navy-500"}`}
                />
                <span className="font-mono text-xs text-navy-300">
                  {isGenerating
                    ? "AI Processing..."
                    : blueprint
                      ? "Blueprint Generated"
                      : "Awaiting Target Architecture Spec"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-glow">
                <Wifi className="h-3 w-3" />
                Live AI
              </div>
            </div>

            <div className="relative p-6">
              <AnimatePresence mode="wait">
                {isGenerating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-brand" />
                      <span className="font-mono text-sm text-emerald-glow">
                        {streamingText}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-3 rounded bg-white/10"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          style={{ width: `${70 - i * 12}%` }}
                        />
                      ))}
                    </div>
                    <pre className="overflow-hidden rounded-lg bg-black/40 p-4 font-mono text-xs text-emerald-glow/80">
                      {`{
  "status": "streaming",
  "agent": "pipeline-architect-v2",
  "confidence": 0.${Math.floor(Math.random() * 20 + 80)}...
}`}
                    </pre>
                  </motion.div>
                )}

                {!isGenerating && !blueprint && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex min-h-[400px] flex-col items-center justify-center text-center"
                  >
                    <div className="mb-4 rounded-full border border-dashed border-navy-600 p-8">
                      <Sparkles className="h-12 w-12 text-navy-600" />
                    </div>
                    <p className="text-lg font-medium text-navy-400">
                      Awaiting Target Architecture Spec
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-navy-500">
                      Configure your infrastructure parameters and generate an
                      AI-powered blueprint with ROI analysis.
                    </p>
                  </motion.div>
                )}

                {!isGenerating && blueprint && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <BlueprintVisualization blueprint={blueprint} />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        {
                          label: "Annual Savings",
                          value: formatCurrency(blueprint.roi.annualSavings),
                        },
                        {
                          label: "Deploy Reduction",
                          value: formatPercent(
                            blueprint.roi.deployTimeReduction
                          ),
                        },
                        {
                          label: "Readiness",
                          value: formatPercent(blueprint.roi.readinessScore),
                        },
                        {
                          label: "AI Confidence",
                          value: formatPercent(blueprint.roi.confidenceScore),
                        },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="rounded-lg bg-white/5 p-3 text-center"
                        >
                          <p className="text-lg font-bold text-emerald-glow">
                            {m.value}
                          </p>
                          <p className="text-xs text-navy-400">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg bg-white/5 p-4">
                      <div className="mb-2 flex items-center gap-2 text-emerald-glow">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">AI Summary</span>
                      </div>
                      <p className="text-sm leading-relaxed text-navy-300">
                        {blueprint.summary}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
