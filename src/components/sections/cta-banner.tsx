"use client";

import { useEffect, useRef } from "react";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

ensureGsapPlugins();

/** Fixed layout so SSR and client markup match (no Math.random at render). */
const PARTICLES = [
  { left: 12, top: 18, duration: 3.2, delay: 0.1 },
  { left: 28, top: 42, duration: 4.1, delay: 0.6 },
  { left: 45, top: 8, duration: 3.8, delay: 1.2 },
  { left: 62, top: 55, duration: 4.5, delay: 0.3 },
  { left: 78, top: 22, duration: 3.5, delay: 1.5 },
  { left: 91, top: 68, duration: 4.8, delay: 0.8 },
  { left: 5, top: 72, duration: 3.9, delay: 1.8 },
  { left: 35, top: 88, duration: 4.2, delay: 0.4 },
  { left: 55, top: 35, duration: 3.6, delay: 1.1 },
  { left: 72, top: 82, duration: 4.6, delay: 0.2 },
  { left: 18, top: 58, duration: 3.4, delay: 1.4 },
  { left: 48, top: 12, duration: 4.3, delay: 0.7 },
  { left: 68, top: 48, duration: 3.7, delay: 1.6 },
  { left: 88, top: 5, duration: 4.0, delay: 0.5 },
  { left: 8, top: 32, duration: 3.3, delay: 1.0 },
  { left: 38, top: 65, duration: 4.4, delay: 1.3 },
  { left: 58, top: 78, duration: 3.1, delay: 0.9 },
  { left: 82, top: 38, duration: 4.7, delay: 1.7 },
  { left: 22, top: 8, duration: 3.5, delay: 0.0 },
  { left: 42, top: 52, duration: 4.1, delay: 1.9 },
  { left: 65, top: 15, duration: 3.8, delay: 0.6 },
  { left: 95, top: 45, duration: 4.2, delay: 1.2 },
  { left: 15, top: 92, duration: 3.6, delay: 0.3 },
  { left: 52, top: 28, duration: 4.5, delay: 1.5 },
  { left: 75, top: 62, duration: 3.9, delay: 0.8 },
  { left: 32, top: 75, duration: 4.3, delay: 1.1 },
  { left: 60, top: 92, duration: 3.4, delay: 0.4 },
  { left: 8, top: 48, duration: 4.6, delay: 1.8 },
  { left: 48, top: 68, duration: 3.7, delay: 0.2 },
  { left: 85, top: 85, duration: 4.0, delay: 1.4 },
] as const;

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-emerald-glow/60"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

export function CTABanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(".cta-content > *", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-6 mb-24 overflow-hidden rounded-3xl bg-navy-950 lg:mx-8"
    >
      <Particles />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-brand/20 via-transparent to-blue-600/10" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-brand/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="cta-content relative px-8 py-20 text-center lg:px-16 lg:py-28">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-6 inline-flex"
        >
          <Sparkles className="h-8 w-8 text-emerald-glow" />
        </motion.div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Accelerate Infrastructure Delivery with AI
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-300">
          Join enterprise teams shipping faster with AI-driven pipeline design,
          automated compliance, and intelligent ROI optimization.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="emerald" size="lg">
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="glass" size="lg" className="text-white border-white/20">
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
