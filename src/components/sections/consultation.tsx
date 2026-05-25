"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";

const BENEFITS = [
  "Direct review from a Principal Architect — no sales fluff.",
  "Get custom architectural wireframes and repository template layouts.",
  "Clear commercial estimation and timeline roadmap in writing.",
];

export function ConsultationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.from(".consult-left > *", {
        x: -40,
        opacity: 0,
        stagger: 0.14,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
      gsap.from(".consult-card", {
        x: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="consultation"
      className="bg-surface py-24 lg:py-32"
    >
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 xl:px-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* ─── Left: copy ─── */}
          <div className="consult-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5">
              <Mail className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                Let&apos;s Accelerate
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-5xl">
              Ready to ship code like
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                containers?
              </span>
            </h2>

            {/* Body */}
            <p className="max-w-lg text-base leading-relaxed text-navy-600">
              Tell us about your current cloud bottlenecks. Our principal
              platform engineers will audit your Kubernetes, IaC, and deployment
              pipelines, then outline a{" "}
              <span className="font-semibold text-emerald-700">
                custom 90-day action map
              </span>{" "}
              tailored specifically to your fintech stack.
            </p>

            {/* Benefits */}
            <ul className="space-y-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm leading-relaxed text-navy-700">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Right: form card ─── */}
          <div className="consult-card rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-100/60 lg:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-navy-900">
                  Request received!
                </h3>
                <p className="max-w-sm text-sm text-navy-600">
                  Our team will reach out within one business day to schedule
                  your free architecture review.
                </p>
              </div>
            ) : (
              <>
                <h3 className="mb-6 text-xl font-bold text-navy-900">
                  Book a platform consultation
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="consult-name"
                      className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-navy-500"
                    >
                      Your Full Name:
                    </label>
                    <input
                      id="consult-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy-900 placeholder-navy-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="consult-email"
                      className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-navy-500"
                    >
                      Work Email Address:
                    </label>
                    <input
                      id="consult-email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@yourcompany.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy-900 placeholder-navy-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="consult-description"
                      className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-navy-500"
                    >
                      Brief Bottlenecks Description:
                    </label>
                    <textarea
                      id="consult-description"
                      name="description"
                      rows={4}
                      placeholder="e.g. Kubernetes configuration drift, slow CI/CD builds…"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-navy-900 placeholder-navy-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    id="consultSubmitButton"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:bg-emerald-700 hover:shadow-emerald-700/30 active:scale-[0.98]"
                  >
                    Request Consultation Details
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
