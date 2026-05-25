"use client";

import { motion } from "framer-motion";
import type { AIBlueprint, PipelineFormData } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ROIPanelProps {
  formData: PipelineFormData;
  blueprint: AIBlueprint | null;
}

function estimateROI(formData: PipelineFormData) {
  const savings = Math.round(
    (180000 + formData.teamSize * 8500) *
      Math.min(formData.teamSize / 10, 3)
  );
  const reduction = Math.min(
    75,
    35 + formData.teamSize * 0.8
  );
  const payback = Math.max(3, 12 - Math.floor(formData.teamSize / 5));
  return { savings, reduction, payback };
}

export function ROIPanel({ formData, blueprint }: ROIPanelProps) {
  const roi = blueprint?.roi ?? {
    annualSavings: estimateROI(formData).savings,
    deployTimeReduction: estimateROI(formData).reduction,
    paybackMonths: estimateROI(formData).payback,
    complianceScore: 60 + (formData.compliance?.length || 1) * 12,
    readinessScore: 70,
    confidenceScore: 88,
  };

  const bars = [
    { label: "Deploy Time Saved", value: roi.deployTimeReduction, color: "bg-emerald-brand" },
    { label: "Compliance Readiness", value: roi.complianceScore, color: "bg-blue-500" },
    { label: "Deployment Readiness", value: roi.readinessScore, color: "bg-violet-500" },
    { label: "AI Confidence", value: roi.confidenceScore, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-6 py-2">
      <div className="rounded-xl bg-gradient-to-br from-emerald-brand/10 to-navy-50 p-6">
        <p className="text-sm text-navy-500">Projected Annual Savings</p>
        <p className="mt-1 text-4xl font-bold text-navy-900">
          {formatCurrency(roi.annualSavings)}
        </p>
        <p className="mt-2 text-sm text-navy-600">
          Payback period: <strong>{roi.paybackMonths} months</strong>
        </p>
      </div>

      <div className="space-y-4">
        {bars.map((bar, i) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-navy-600">{bar.label}</span>
              <span className="font-semibold text-navy-900">
                {Math.round(bar.value)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-navy-100">
              <motion.div
                className={`h-full rounded-full ${bar.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${bar.value}%` }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-navy-400">
        Estimates based on team size, pipeline maturity, and target velocity.
        Generate a full blueprint for detailed projections.
      </p>
    </div>
  );
}
