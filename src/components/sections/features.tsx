"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";
import {
  Brain,
  Container,
  DollarSign,
  ShieldCheck,
  Rocket,
  GitBranch,
} from "lucide-react";

ensureGsapPlugins();

const features = [
  {
    icon: Brain,
    title: "AI Pipeline Optimization",
    description:
      "ML-driven analysis of bottlenecks with automated remediation recommendations.",
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Container,
    title: "Kubernetes Automation",
    description:
      "Declarative cluster management with intelligent scaling and drift detection.",
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: DollarSign,
    title: "Cloud Cost Intelligence",
    description:
      "Real-time spend analytics with predictive optimization across multi-cloud.",
    gradient: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Security Compliance Monitoring",
    description:
      "Continuous SOC2, PCI-DSS evidence collection with policy-as-code gates.",
    gradient: "from-red-500/20 to-orange-500/10",
  },
  {
    icon: Rocket,
    title: "Release Acceleration",
    description:
      "Canary deployments, feature flags, and automated rollback orchestration.",
    gradient: "from-amber-500/20 to-yellow-500/10",
  },
  {
    icon: GitBranch,
    title: "Infrastructure Drift Detection",
    description:
      "GitOps reconciliation with AI-predicted configuration anomalies.",
    gradient: "from-navy-500/20 to-slate-500/10",
  },
];

function FeatureCard({
  feature,
}: {
  feature: (typeof features)[0];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const node = ref.current;
    if (!node) return;
    node.style.transform = `perspective(900px) rotateX(${py * -10}deg) rotateY(${px * 10}deg)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <motion.div
      ref={ref}
      data-reveal
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className="group relative transition-transform duration-200"
    >
      <div
        className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 blur-xl transition-opacity group-hover:opacity-100`}
      />
      <div className="relative rounded-2xl border border-navy-100 bg-white p-8 shadow-glass transition-shadow group-hover:shadow-premium">
        <div className="mb-4 inline-flex rounded-xl bg-navy-50 p-3">
          <feature.icon className="h-6 w-6 text-emerald-brand" />
        </div>
        <h3 className="text-xl font-bold text-navy-900">{feature.title}</h3>
        <p className="mt-3 text-navy-600 leading-relaxed">
          {feature.description}
        </p>
        <motion.div
          className="mt-4 h-0.5 w-0 bg-emerald-brand group-hover:w-full"
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="bg-surface-muted py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald-brand">
            Platform Capabilities
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            AI-Powered Deployment Insights
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
