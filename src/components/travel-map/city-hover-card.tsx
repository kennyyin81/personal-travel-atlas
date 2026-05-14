"use client";

import { motion } from "framer-motion";
import { mapViewBox } from "@/data/map";
import type { ProjectedTravelItem } from "./types";

type CityHoverCardProps = {
  point: ProjectedTravelItem | null;
};

export function CityHoverCard({ point }: CityHoverCardProps) {
  if (!point) {
    return null;
  }

  const left = `${(point.x / mapViewBox.width) * 100}%`;
  const top = `${(point.y / mapViewBox.height) * 100}%`;
  const horizontal = point.x > mapViewBox.width * 0.66 ? "-translate-x-[calc(100%+18px)]" : "translate-x-5";
  const vertical = point.y > mapViewBox.height * 0.7 ? "-translate-y-[calc(100%-12px)]" : "-translate-y-4";

  return (
    <motion.div
      key={point.id}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`pointer-events-none absolute z-20 w-64 rounded-2xl border border-white/14 bg-[#08101d]/88 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.46),0_0_32px_rgba(125,211,252,0.16)] backdrop-blur-2xl ${horizontal} ${vertical}`}
      style={{ left, top }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Lit City</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{point.city}</h3>
        </div>
        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_22px_rgba(247,211,138,0.95)]" />
      </div>
      <p className="text-sm text-white/58">
        {point.province} · {point.date}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/72">{point.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {point.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-white/74"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
