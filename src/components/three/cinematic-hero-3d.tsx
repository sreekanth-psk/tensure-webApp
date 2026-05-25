"use client";

import React, { useEffect, useRef, useState } from "react";
import { Shield, Activity, Zap, Server, Cpu } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  length: number;
  width: number;
  color: string;
}

// Shades of premium emerald, mint, and teal greens
const greenColors = [
  "rgba(16, 185, 129, opacity)",  // emerald-500
  "rgba(52, 211, 153, opacity)",  // emerald-400
  "rgba(5, 150, 105, opacity)",   // emerald-600
  "rgba(110, 231, 183, opacity)", // emerald-300
  "rgba(52, 211, 153, opacity)",  // emerald-400
  "rgba(4, 120, 87, opacity)",    // emerald-700
];

function getRandomGreenColor(): string {
  const colorTemplate = greenColors[Math.floor(Math.random() * greenColors.length)];
  const opacity = (0.2 + Math.random() * 0.45).toFixed(3);
  return colorTemplate.replace("opacity", opacity);
}

export default function CinematicHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hoverDurationRef = useRef<number>(0);
  const centerRef = useRef({ x: 0, y: 0 });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovering: false });
  const mouseStateRef = useRef(mousePos);

  useEffect(() => {
    mouseStateRef.current = mousePos;
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovering: true,
    });
  };

  const handleMouseEnter = () => {
    setMousePos((prev) => ({ ...prev, isHovering: true }));
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovering: false }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      centerRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const particlesCount = 280;
    const particles: Particle[] = [];

    const centerX = centerRef.current.x;
    const centerY = centerRef.current.y;
    const maxRadius = Math.max(canvas.width, canvas.height) * 0.65;

    for (let i = 0; i < particlesCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = (0.05 + 0.9 * Math.random()) * maxRadius;
      const pSpeed = (0.0004 + Math.random() * 0.0009) * (Math.random() > 0.5 ? 1 : -1);

      particles.push({
        x: centerX + Math.cos(theta) * r,
        y: centerY + Math.sin(theta) * r,
        angle: theta,
        radius: r,
        speed: pSpeed,
        length: 2 + Math.random() * 3.5,
        width: 0.8 + Math.random() * 0.6,
        color: getRandomGreenColor(),
      });
    }

    let currentCenterX = centerX;
    let currentCenterY = centerY;

    const render = () => {
      const { x: mx, y: my, isHovering: hover } = mouseStateRef.current;

      if (hover) {
        hoverDurationRef.current = Math.min(1, hoverDurationRef.current + 0.015);
      } else {
        hoverDurationRef.current = Math.max(0, hoverDurationRef.current - 0.02);
      }

      const hd = hoverDurationRef.current;
      const speedMultiplier = 1.0 + hd * 7.5;
      const lengthMultiplier = 1.0 + hd * 0.8;

      const targetCenterX = hover 
        ? currentCenterX + (mx - currentCenterX) * hd * 0.35
        : centerRef.current.x;
      const targetCenterY = hover 
        ? currentCenterY + (my - currentCenterY) * hd * 0.35
        : centerRef.current.y;

      currentCenterX += (targetCenterX - currentCenterX) * 0.08;
      currentCenterY += (targetCenterY - currentCenterY) * 0.08;

      // Draw Sci-Fi Glowing Radial Background
      const radialGrad = ctx.createRadialGradient(
        currentCenterX,
        currentCenterY,
        5,
        currentCenterX,
        currentCenterY,
        maxRadius * 0.9
      );
      // Dark green center glow transitioning to deep dark slate
      radialGrad.addColorStop(0, "#012a1d");
      radialGrad.addColorStop(0.35, "#011611");
      radialGrad.addColorStop(1, "#070a10");
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw vortex particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed * speedMultiplier;

        const wave = Math.sin(p.angle * 2.5) * (4 + hd * 8);
        const targetX = currentCenterX + Math.cos(p.angle) * (p.radius + wave);
        const targetY = currentCenterY + Math.sin(p.angle) * (p.radius + wave);

        p.x += (targetX - p.x) * 0.15;
        p.y += (targetY - p.y) * 0.15;

        const lengthVal = p.length * lengthMultiplier;
        const vx = Math.cos(p.angle + Math.PI / 2 * (p.speed > 0 ? 1 : -1));
        const vy = Math.sin(p.angle + Math.PI / 2 * (p.speed > 0 ? 1 : -1));

        ctx.beginPath();
        ctx.moveTo(p.x - vx * lengthVal, p.y - vy * lengthVal);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.width;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-full w-full overflow-hidden bg-slate-950"
      id="cinematicHeroControlDeck"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full pointer-events-none"
      />

      {/* Sci-Fi Overlay Cards */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-5">
        <div className="flex w-full items-center justify-between">
          <div className="pointer-events-auto flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-1.5 shadow-md backdrop-blur-md">
            <Cpu size={14} className="animate-pulse text-emerald-400" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-300">
              ORCHESTRATOR CORE.v4
            </span>
          </div>
          <div className="pointer-events-auto flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-1.5 shadow-md backdrop-blur-md">
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
            <span className="font-mono text-[9px] font-bold uppercase text-emerald-400">
              SYSTEM: ONLINE
            </span>
          </div>
        </div>

        <div className="pointer-events-auto mt-auto grid w-full max-w-[340px] grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 shadow-md backdrop-blur-md transition-all hover:border-emerald-500/35 hover:shadow-emerald-500/5">
            <div className="mb-1 flex items-center space-x-1.5 text-emerald-400">
              <Shield size={12} />
              <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-slate-400">
                SOC2 AUDITING
              </span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xs font-medium text-slate-300">Continuous</span>
              <span className="font-mono text-[9px] font-bold text-emerald-400">100%</span>
            </div>
            <span className="mt-0.5 block font-mono text-[8px] text-slate-500">
              Automated blueprint compliance
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 shadow-md backdrop-blur-md transition-all hover:border-blue-500/35 hover:shadow-blue-500/5">
            <div className="mb-1 flex items-center space-x-1.5 text-blue-400">
              <Zap size={12} />
              <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-slate-400">
                DEPLOY VELOCITY
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-sm font-bold text-slate-200">4.2</span>
              <span className="font-mono text-[8px] text-slate-400 ml-1">MINS</span>
            </div>
            <span className="mt-0.5 block font-mono text-[8px] text-slate-500">
              Commit to global production
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 shadow-md backdrop-blur-md transition-all hover:border-emerald-500/35 hover:shadow-emerald-500/5">
            <div className="mb-1 flex items-center space-x-1.5 text-emerald-400">
              <Activity size={12} />
              <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-slate-400">
                INFRA HEALTH
              </span>
            </div>
            <span className="text-sm font-bold text-emerald-400">99.999%</span>
            <span className="mt-0.5 block font-mono text-[8px] text-slate-500">
              Zero single points of failure
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 shadow-md backdrop-blur-md transition-all hover:border-teal-500/35 hover:shadow-teal-500/5">
            <div className="mb-1 flex items-center space-x-1.5 text-teal-400">
              <Server size={12} />
              <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-slate-400">
                CLUSTER SCALE
              </span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-sm font-bold text-slate-200">14.5k</span>
              <span className="ml-1 text-[8.5px] text-slate-400">Active PODs</span>
            </div>
            <span className="mt-0.5 block font-mono text-[8px] text-slate-500">
              Elastic container orchestration
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
