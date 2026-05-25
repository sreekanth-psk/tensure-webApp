"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";
import { scrollToSection } from "@/lib/scroll-to";
import { Terminal, ArrowRight, Play } from "lucide-react";

const CinematicHero3D = dynamic(
  () => import("@/components/three/cinematic-hero-3d"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[450px] items-center justify-center rounded-3xl bg-gradient-to-b from-slate-50 to-white">
        <div className="h-8 w-8 animate-pulse rounded-full border-2 border-emerald-500/30 border-t-emerald-500" />
      </div>
    ),
  }
);

const heroMetrics = [
  { label: "Uptime", value: "99.999% SLA", dot: "bg-emerald-500" },
  { label: "Velocity", value: "10x Speed", dot: "bg-blue-500" },
  { label: "Security", value: "SOC2 Ready", dot: "bg-teal-600" },
] as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-headline", { y: 36, opacity: 0, duration: 0.85 }, "-=0.3")
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.45")
        .from(
          ".hero-cta > *",
          { y: 20, opacity: 0, stagger: 0.1, duration: 0.55 },
          "-=0.4"
        )
        .from(
          ".hero-metric",
          { y: 20, opacity: 0, stagger: 0.08, duration: 0.5 },
          "-=0.35"
        );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[96vh] flex-col justify-center overflow-hidden border-b border-slate-200/50 bg-gradient-to-b from-slate-50/80 via-white to-slate-50  text-slate-900 lg:pt-20"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(16,185,129,0.06),rgba(255,255,255,0))]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[5%] top-1/4 h-[450px] w-[450px] rounded-full bg-emerald-500/5 blur-[130px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-12 left-12 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[110px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 py-16 md:px-12 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-16">
          <div ref={contentRef} className="space-y-8 md:col-span-1 lg:col-span-5">
            <div className="hero-badge inline-flex items-center space-x-2 rounded-full border border-emerald-100/90 bg-emerald-50/80 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-dark shadow-sm">
              <Terminal size={12} className="text-emerald-dark" />
              <span>AI Orchestrator Core Active</span>
            </div>

            <h1 className="hero-headline text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[46px] xl:text-[52px]">
              AI-Driven <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Platform Engineering
              </span>
            </h1>

            <p className="hero-sub max-w-xl font-sans text-sm leading-relaxed text-slate-600 md:text-base">
              Accelerate cloud delivery with intelligent DevOps automation,
              deployment orchestration, and AI-powered infrastructure workflows.
            </p>

            <div className="hero-metric grid max-w-lg grid-cols-3 gap-2 sm:gap-5 border-t border-slate-200/80 pt-6">
              {heroMetrics.map((m) => (
                <div key={m.label} className="space-y-1">
                  <span className="block font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    {m.label}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
                    <span className="block text-xs sm:text-sm font-bold text-slate-800">
                      {m.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-cta flex flex-col items-stretch gap-4 pt-4 sm:flex-row sm:items-center">
              <a
                href="#engine"
                onClick={(e) => scrollToSection(e, "#engine")}
                className="flex cursor-pointer items-center justify-center space-x-2 rounded-xl border border-slate-800 bg-slate-900 px-8 py-4 text-center text-xs font-medium uppercase tracking-widest text-white shadow-md transition-all duration-300 hover:bg-slate-800 active:scale-95"
                id="heroPrimaryButton"
              >
                <span>Generate Blueprint</span>
                <ArrowRight size={14} />
              </a>
              <a
                href="#roadmap"
                onClick={(e) => scrollToSection(e, "#roadmap")}
                className="inline-flex cursor-pointer items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                id="heroSecondaryButton"
              >
                <Play size={12} className="fill-slate-700 text-slate-700" />
                <span>Watch Demo</span>
              </a>
            </div>
          </div>

          <div className="relative h-[320px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl shadow-slate-950/40 sm:h-[450px] md:h-[480px] md:col-span-1 lg:col-span-7 lg:h-[600px]">
            <CinematicHero3D />
          </div>
        </div>
      </div>
    </section>
  );
}
