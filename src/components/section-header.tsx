"use client";

import { motion } from "framer-motion";
import { fadeUp } from "./motion-presets";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <motion.div
      className="mb-8 max-w-3xl lg:mb-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-white/62 sm:text-lg">
        {description}
      </p>
    </motion.div>
  );
}
