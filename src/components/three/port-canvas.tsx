"use client";

import { useEffect, useRef } from "react";
import { DeploymentCorridorScene } from "./deployment-corridor-scene";

/** Cinematic deployment corridor — vanilla Three.js for Next.js stability */
export default function PortCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let scene: DeploymentCorridorScene | null = null;

    try {
      scene = new DeploymentCorridorScene(el);
    } catch (err) {
      console.error("[DeploymentCorridor]", err);
    }

    const onResize = () => scene?.resize();
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      scene?.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 h-full w-full"
      style={{ minHeight: "100vh", background: "#f4f6f8" }}
      aria-hidden
    />
  );
}
