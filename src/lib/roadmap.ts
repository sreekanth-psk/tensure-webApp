import type { RoadmapPhase } from "@/types";

/** Ensures roadmap entries are safe after schema/API changes or HMR. */
export function normalizeRoadmapPhase(
  raw: Partial<RoadmapPhase> & { title?: string }
): RoadmapPhase {
  const day = raw.day ?? 0;
  return {
    day,
    phase:
      raw.phase ??
      (typeof raw.title === "string"
        ? raw.title.toUpperCase()
        : `PHASE ${day}`),
    cardTitle: raw.cardTitle ?? raw.title ?? "Key deliverables",
    items: Array.isArray(raw.items) ? raw.items : [],
    maturity: raw.maturity,
    compliance: raw.compliance,
  };
}

export function normalizeRoadmap(
  phases: Array<Partial<RoadmapPhase> & { title?: string }> | undefined
): RoadmapPhase[] {
  if (!phases?.length) return [];
  return phases.map(normalizeRoadmapPhase);
}
