"use client";

import { motion } from "framer-motion";
import type { ProjectedTravelItem } from "./types";

type StarPointProps = {
  point: ProjectedTravelItem;
  index: number;
  active: boolean;
  labelOffset?: {
    dx: number;
    dy: number;
  };
  onEnter: (point: ProjectedTravelItem) => void;
  onLeave: () => void;
};

export function StarPoint({ point, index, active, labelOffset, onEnter, onLeave }: StarPointProps) {
  const labelX = point.x + (labelOffset?.dx ?? 12);
  const labelY = point.y + (labelOffset?.dy ?? -12);

  return (
    <g
      className="cursor-pointer"
      onMouseEnter={() => onEnter(point)}
      onMouseLeave={onLeave}
      onFocus={() => onEnter(point)}
      onBlur={onLeave}
      tabIndex={0}
      role="button"
      aria-label={`${point.city} ${point.date}`}
    >
      <motion.circle
        cx={point.x}
        cy={point.y}
        r={active ? 34 : 26}
        fill="rgba(35,241,255,0.12)"
        stroke="rgba(35,241,255,0.36)"
        strokeWidth="1"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: [0, 1.2, 1], opacity: [0, 0.82, 0.22] }}
        viewport={{ once: true }}
        transition={{ delay: 0.16 + index * 0.11, duration: 1.1, ease: "easeOut" }}
        style={{ transformOrigin: `${point.x}px ${point.y}px` }}
      />
      <motion.circle
        cx={point.x}
        cy={point.y}
        r={18}
        fill="none"
        stroke="rgba(35,241,255,0.52)"
        strokeWidth="1"
        initial={{ scale: 0.2, opacity: 0 }}
        whileInView={{ scale: [0.2, 1.15, 1.65], opacity: [0, 0.7, 0] }}
        viewport={{ once: true }}
        transition={{ delay: 0.24 + index * 0.11, duration: 1.25, ease: "easeOut" }}
        style={{ transformOrigin: `${point.x}px ${point.y}px` }}
      />
      <motion.circle
        cx={point.x}
        cy={point.y}
        r={active ? 7 : 5.5}
        fill="#5dffff"
        stroke={active ? "#fff" : "rgba(255,255,255,0.54)"}
        strokeWidth={active ? 2 : 1}
        filter="url(#stellarGlow)"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        animate={{
          scale: active ? [1.08, 1.32, 1.08] : [1, 1.16, 1],
          opacity: [0.82, 1, 0.82]
        }}
        whileHover={{ scale: 1.5 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.3 + index * 0.11,
          duration: 2.2,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />
      <text
        x={labelX}
        y={labelY}
        fill={active ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.86)"}
        stroke="rgba(4,10,18,0.92)"
        strokeWidth="3"
        paintOrder="stroke"
        fontSize="13"
        fontWeight="800"
        className="pointer-events-none select-none transition-opacity"
      >
        {point.city}
      </text>
    </g>
  );
}
