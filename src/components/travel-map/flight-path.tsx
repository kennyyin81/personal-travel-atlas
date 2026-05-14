"use client";

import { motion } from "framer-motion";
import type { ProjectedTravelItem } from "./types";

type FlightPathProps = {
  from: ProjectedTravelItem;
  to: ProjectedTravelItem;
  index: number;
};

export function FlightPath({ from, to, index }: FlightPathProps) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const lift = Math.min(72, Math.max(32, Math.abs(from.x - to.x) * 0.14));
  const path = `M ${from.x} ${from.y} Q ${midX} ${midY - lift} ${to.x} ${to.y}`;

  return (
    <g>
      <motion.path
        d={path}
        fill="none"
        stroke="rgba(35,241,255,0.18)"
        strokeWidth="1"
        strokeDasharray="5 10"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.42 + index * 0.08, duration: 0.9, ease: "easeOut" }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="rgba(90,255,255,0.48)"
        strokeLinecap="round"
        strokeWidth="2"
        strokeDasharray="1 150"
        initial={{ strokeDashoffset: 150, opacity: 0 }}
        whileInView={{ strokeDashoffset: -150, opacity: [0, 0.95, 0] }}
        viewport={{ once: false }}
        transition={{
          delay: 1.1 + index * 0.16,
          duration: 2.8,
          repeat: Infinity,
          repeatDelay: 2.2,
          ease: "easeInOut"
        }}
      />
    </g>
  );
}
