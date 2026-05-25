"use client";

import { useEffect, useRef } from "react";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";
import { Shield, Award, Cloud } from "lucide-react";

ensureGsapPlugins();

const partners = [
  "AWS", "Google Cloud", "Microsoft Azure", "Kubernetes",
  "HashiCorp", "Datadog", "GitHub", "ArgoCD",
  "AWS", "Google Cloud", "Microsoft Azure", "Kubernetes",
];

const certifications = [
  { icon: Shield, label: "SOC 2 Type II" },
  { icon: Award, label: "ISO 27001" },
  { icon: Cloud, label: "Cloud Native Certified" },
];

export function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(".trust-cert", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-navy-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-navy-500">
          Trusted by Enterprise DevOps Teams
        </p>

        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-16 whitespace-nowrap">
            {partners.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-2xl font-bold text-navy-300/80 transition-colors hover:text-navy-600"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {certifications.map((cert) => (
            <div
              key={cert.label}
              className="trust-cert flex items-center gap-3 rounded-xl border border-navy-100 px-6 py-4"
            >
              <cert.icon className="h-6 w-6 text-emerald-brand" />
              <span className="font-medium text-navy-700">{cert.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
