"use client";

import { motion } from "framer-motion";
import type { AIBlueprint } from "@/types";

const nodeColors: Record<string, string> = {
  compute: "#3b82f6",
  storage: "#8b5cf6",
  network: "#06b6d4",
  security: "#ef4444",
  ci: "#10b981",
  ai: "#f59e0b",
};

interface BlueprintVisualizationProps {
  blueprint: AIBlueprint;
}

export function BlueprintVisualization({
  blueprint,
}: BlueprintVisualizationProps) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-navy-900/50">
      <svg viewBox="0 0 100 80" className="h-full w-full">
        {/* Edges */}
        {blueprint.edges.map((edge, i) => {
          const from = blueprint.architecture.find((n) => n.id === edge.from);
          const to = blueprint.architecture.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          return (
            <motion.g
              key={`${edge.from}-${edge.to}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
            >
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#10b981"
                strokeWidth="0.3"
                strokeOpacity="0.6"
              />
            </motion.g>
          );
        })}

        {/* Nodes */}
        {blueprint.architecture.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="4"
              fill={nodeColors[node.type] || "#10b981"}
              opacity="0.9"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill="none"
              stroke={nodeColors[node.type]}
              strokeWidth="0.2"
              opacity="0.4"
            >
              <animate
                attributeName="r"
                values="6;8;6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x={node.x}
              y={node.y + 8}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="2.5"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Animated flow dots */}
      <div className="absolute bottom-2 left-2 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-emerald-brand"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        <span className="ml-2 font-mono text-[10px] text-navy-500">
          Live topology
        </span>
      </div>
    </div>
  );
}
