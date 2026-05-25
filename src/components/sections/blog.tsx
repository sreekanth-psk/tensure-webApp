"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { INSIGHT_POSTS } from "@/lib/insights";

export function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".blog-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
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
      id="resources"
      ref={sectionRef}
      className="bg-surface py-24 lg:py-32"
    >
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-12 xl:px-16">
        <div className="mb-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-emerald-brand">
              Resources
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              Latest Insights
            </h2>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-emerald-brand hover:underline"
          >
            View all articles →
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {INSIGHT_POSTS.map((post) => (
            <motion.article
              key={post.id}
              className="blog-card group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-glass"
              whileHover={{ y: -6 }}
            >
              <div className="relative h-52 overflow-hidden bg-navy-950">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                  {post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-3 text-xs text-navy-500">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-emerald-dark">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-brand opacity-0 transition-opacity group-hover:opacity-100">
                  Read more
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div className="mt-4 h-0.5 w-0 bg-emerald-brand transition-all duration-300 group-hover:w-full" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
