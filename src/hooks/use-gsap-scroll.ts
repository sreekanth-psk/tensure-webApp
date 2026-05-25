"use client";

import { useEffect, useRef } from "react";
import { ensureGsapPlugins, gsap } from "@/lib/gsap-client";

ensureGsapPlugins();

interface ScrollRevealOptions {
  y?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  scrub?: boolean | number;
  pin?: boolean;
  horizontal?: boolean;
}

export function useGsapScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 60,
      opacity = 0,
      duration = 1,
      stagger = 0.1,
      start = "top 85%",
      scrub = false,
      pin = false,
    } = options;

    const children = el.querySelectorAll("[data-reveal]");
    const targets = children.length > 0 ? children : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity, ...(options.horizontal ? { x: y } : {}) },
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start,
            scrub: scrub || false,
            pin,
            toggleActions: scrub
              ? undefined
              : "play none none reverse",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [options]);

  return ref;
}

export function useGsapCounter(
  targetValue: number,
  duration = 2,
  enabled = true
) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const obj = { value: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        value: targetValue,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = Math.round(obj.value).toLocaleString();
          }
        },
      });
    });

    return () => ctx.revert();
  }, [targetValue, duration, enabled]);

  return ref;
}

export function useGsapIntro(callback: () => gsap.core.Timeline) {
  useEffect(() => {
    const tl = callback();
    return () => {
      tl.kill();
    };
  }, [callback]);
}
