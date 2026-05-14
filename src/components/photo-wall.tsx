"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { TravelItem } from "@/data/travel";

type PhotoWallProps = {
  items: TravelItem[];
};

export function PhotoWall({ items }: PhotoWallProps) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {items.map((item, index) => (
        <motion.figure
          key={item.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="group glass relative mb-5 break-inside-avoid overflow-hidden rounded-2xl transition duration-500 hover:-translate-y-1 hover:border-gold/35 hover:shadow-[0_24px_70px_rgba(0,0,0,0.42),0_0_36px_rgba(247,211,138,0.13)]"
        >
          <div
            className={
              index % 3 === 0
                ? "relative aspect-[4/5]"
                : index % 3 === 1
                  ? "relative aspect-[5/4]"
                  : "relative aspect-square"
            }
          >
            <Image
              src={item.cover}
              alt={`${item.city}照片`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent opacity-72 transition duration-300 group-hover:opacity-95" />
            <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-4 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-lg font-semibold text-white">{item.city}</p>
              <p className="mt-1 text-sm text-white/66">{item.province} · {item.date}</p>
            </figcaption>
          </div>
        </motion.figure>
      ))}
    </div>
  );
}
