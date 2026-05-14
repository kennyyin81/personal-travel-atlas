"use client";

import { motion } from "framer-motion";
import type { TravelItem } from "@/data/travel";
import { fadeUp } from "./motion-presets";

type TimelineProps = {
  items: TravelItem[];
};

export function Timeline({ items }: TimelineProps) {
  const years = [...new Set(items.map((item) => item.year))].sort((a, b) => b - a);

  return (
    <div className="space-y-8">
      {years.map((year) => (
        <div key={year} className="grid gap-5 lg:grid-cols-[150px_1fr]">
          <motion.div
            className="text-4xl font-semibold text-white/88 lg:sticky lg:top-10 lg:h-fit"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            {year}
          </motion.div>
          <div className="relative space-y-4 border-l border-white/12 pl-5 sm:pl-7">
            {items
              .filter((item) => item.year === year)
              .map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: 26 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="glass relative rounded-2xl p-5 transition duration-300 hover:border-gold/40 hover:shadow-gold"
                >
                  <span className="absolute -left-[31px] top-7 h-3 w-3 rounded-full bg-gold shadow-[0_0_22px_rgba(247,211,138,0.75)] sm:-left-[37px]" />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.city}</h3>
                      <p className="mt-1 text-sm text-white/52">
                        {item.province} · {item.date}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-cyan/10 px-3 py-1 text-xs text-cyan"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 leading-7 text-white/66">{item.description}</p>
                </motion.article>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
