"use client";

import { useEffect, useRef } from "react";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";
import { usePipelineStore } from "@/store/pipeline-store";
import { normalizeRoadmap } from "@/lib/roadmap";
import type { RoadmapPhase } from "@/types";

const defaultPhases: RoadmapPhase[] = [
  {
    day: 1,
    phase: "KICKOFF & ASSESSMENT",
    cardTitle: "Map your infrastructure landscape",
    items: [
      "Infrastructure audit and dependency mapping",
      "CI/CD baseline and toolchain review",
      "Security posture and compliance gap scan",
    ],
  },
  {
    day: 30,
    phase: "DISCOVERY & BLUEPRINT",
    cardTitle: "Design your deployment blueprint",
    items: [
      "Target architecture and pipeline topology",
      "ROI model and modernization priorities",
      "30-day execution plan with clear owners",
    ],
  },
  {
    day: 60,
    phase: "PIPELINE FOUNDATION",
    cardTitle: "Build your CI/CD developer platform",
    items: [
      "Automated build, test, and release pipelines",
      "GitOps workflows and environment promotion",
      "Observability, gates, and rollback automation",
    ],
  },
  {
    day: 90,
    phase: "AUTONOMOUS DELIVERY",
    cardTitle: "Scale intelligent release operations",
    items: [
      "Self-healing pipelines and drift remediation",
      "Continuous compliance evidence collection",
      "Executive dashboards with live ROI tracking",
    ],
  },
];

function PhaseLabel({
  phase,
  align = "left",
}: {
  phase: RoadmapPhase;
  align?: "left" | "right";
}) {
  return (
    <div className={`text-left ${align === "right" ? "md:text-right" : "md:text-left"}`}>
      <p className="text-2xl font-bold tracking-tight text-blue-600">
        Day {phase.day}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-navy-500">
        {phase.phase}
      </p>
    </div>
  );
}

function PhaseCard({ phase }: { phase: RoadmapPhase }) {
  return (
    <div className="rounded-2xl border border-navy-100/80 bg-white p-5 sm:p-8 shadow-[0_4px_24px_rgba(16,24,40,0.06)]">
      <h3 className="text-lg font-semibold text-navy-900">{phase.cardTitle}</h3>
      <ul className="mt-5 space-y-3">
        {phase.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed text-navy-600"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhaseBadge({ day }: { day: number }) {
  return (
    <div className="relative z-10 flex h-14 w-14 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-2xl border border-navy-100 bg-white shadow-[0_8px_30px_rgba(16,24,40,0.08)]">
      <span className="text-2xl sm:text-3xl font-bold text-blue-600">{day}</span>
    </div>
  );
}

export function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const blueprint = usePipelineStore((s) => s.blueprint);
  const phases = blueprint?.roadmap
    ? normalizeRoadmap(blueprint.roadmap)
    : defaultPhases;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(".timeline-milestone", {
        y: 48,
        opacity: 0,
        stagger: 0.18,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
        },
      });
    }, el);
    return () => ctx.revert();
  }, [phases.length]);

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f7f8fa] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Getting Started
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Here&apos;s what we&apos;ll get done in 90 days
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-500">
            Clear phases with deliverables that prove progress at every step
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute left-[28px] sm:left-[36px] top-0 h-full w-px -translate-x-1/2 bg-navy-200/80 md:left-1/2"
            aria-hidden
          />

          <div className="space-y-16 md:space-y-24">
            {phases.map((phase, index) => {
              const labelOnLeft = index % 2 === 0;

              return (
                <div
                  key={phase.day}
                  className="timeline-milestone relative grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr] md:grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-6 gap-y-4 md:gap-12"
                >
                  {/* Label element */}
                  <div
                    className={
                      labelOnLeft
                        ? "col-start-2 row-start-1 md:col-start-1 md:row-start-auto md:pr-4"
                        : "col-start-2 row-start-1 md:col-start-3 md:row-start-auto md:pl-4"
                    }
                  >
                    <PhaseLabel phase={phase} align={labelOnLeft ? "right" : "left"} />
                  </div>

                  {/* Badge element */}
                  <div className="col-start-1 row-start-1 row-span-2 flex items-start justify-center pt-2 md:col-start-2 md:row-start-auto md:row-span-1 md:pt-0">
                    <PhaseBadge day={phase.day} />
                  </div>

                  {/* Card element */}
                  <div
                    className={
                      labelOnLeft
                        ? "col-start-2 row-start-2 md:col-start-3 md:row-start-auto md:pl-4"
                        : "col-start-2 row-start-2 md:col-start-1 md:row-start-auto md:pr-4"
                    }
                  >
                    <PhaseCard phase={phase} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
