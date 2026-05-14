"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { TravelItem } from "@/data/travel";

type CityCardsProps = {
  items: TravelItem[];
};

export function CityCards({ items }: CityCardsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="group glass overflow-hidden rounded-2xl transition duration-500 hover:-translate-y-2 hover:border-cyan/45 hover:bg-white/[0.08] hover:shadow-[0_26px_90px_rgba(0,0,0,0.42),0_0_42px_rgba(125,211,252,0.18)]"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={item.cover}
              alt={`${item.city}旅行封面`}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/10 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            <div className="absolute left-4 top-4 rounded-full border border-white/18 bg-black/28 px-3 py-1 text-sm text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
              {item.date}
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">{item.city}</h3>
                <p className="mt-1 text-sm text-white/50">{item.province}</p>
              </div>
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_18px_rgba(247,211,138,0.8)] transition duration-300 group-hover:scale-125 group-hover:shadow-[0_0_28px_rgba(247,211,138,0.95)]" />
            </div>
            <p className="mt-4 min-h-20 leading-7 text-white/64">{item.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
