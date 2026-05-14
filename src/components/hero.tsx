"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./motion-presets";

type HeroProps = {
  cityCount: number;
  directionalCities: {
    east: string;
    west: string;
    south: string;
    north: string;
  };
};

const heroStats = [
  { key: "cities", label: "已点亮城市", caption: "Lit cities" },
  { key: "east", label: "最东抵达", caption: "East" },
  { key: "west", label: "最西抵达", caption: "West" },
  { key: "south", label: "最南抵达", caption: "South" },
  { key: "north", label: "最北抵达", caption: "North" }
] as const;

export function Hero({ cityCount, directionalCities }: HeroProps) {
  const values = {
    cities: `${cityCount} 座`,
    east: directionalCities.east,
    west: directionalCities.west,
    south: directionalCities.south,
    north: directionalCities.north
  };

  return (
    <section className="relative flex min-h-[96vh] items-center overflow-hidden px-5 py-24 sm:px-8">
      <motion.div
        className="hero-aurora absolute -inset-24 opacity-90"
        animate={{
          backgroundPosition: ["0% 0%", "65% 38%", "0% 0%"],
          scale: [1, 1.05, 1],
          rotate: [0, 2, 0]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-[-20%] top-16 h-px bg-gradient-to-r from-transparent via-cyan/45 to-transparent"
        animate={{ opacity: [0.18, 0.62, 0.18], x: ["-8%", "8%", "-8%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-12 left-1/2 h-80 w-[70rem] -translate-x-1/2 rounded-[100%] border border-cyan/15 bg-cyan/[0.025]"
        animate={{ scale: [1, 1.06, 1], opacity: [0.18, 0.35, 0.18] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[8%] top-[12%] h-56 w-56 rounded-full bg-cyan/20 blur-3xl"
        animate={{ x: [0, 32, 0], y: [0, -18, 0], scale: [1, 1.2, 1], opacity: [0.28, 0.56, 0.28] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[16%] right-[8%] h-72 w-72 rounded-full bg-gold/15 blur-3xl"
        animate={{ x: [0, -28, 0], y: [0, 22, 0], scale: [1.1, 0.92, 1.1], opacity: [0.24, 0.5, 0.24] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,transparent_0,rgba(8,11,18,0.24)_52%,rgba(5,7,13,0.9)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto max-w-5xl text-center"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.055] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_18px_rgba(125,211,252,0.9)]" />
            Personal Travel Atlas
          </motion.p>
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-balance text-6xl font-semibold tracking-tight text-white sm:text-8xl lg:text-9xl"
          >
            <span className="block text-white/92">我走过的</span>
            <span className="block bg-gradient-to-r from-white via-cyan to-gold bg-clip-text text-transparent">
              地方
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/66 sm:text-xl"
          >
            把去过的城市点亮成一张私人地图，也看见自己抵达过的东、西、南、北。
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <a
              href="#travel-map"
              className="min-w-36 rounded-full border border-white/14 bg-white/[0.065] px-5 py-3 text-center text-sm font-semibold text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan/45 hover:bg-cyan/[0.105] hover:text-white hover:shadow-[0_0_34px_rgba(125,211,252,0.16)]"
            >
              查看点亮地图
            </a>
            <a
              href="#travel-timeline"
              className="min-w-36 rounded-full border border-white/14 bg-white/[0.065] px-5 py-3 text-center text-sm font-semibold text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan/45 hover:bg-cyan/[0.105] hover:text-white hover:shadow-[0_0_34px_rgba(125,211,252,0.16)]"
            >
              浏览旅行时间轴
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5"
        >
          {heroStats.map((stat) => (
            <motion.div
              key={stat.key}
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass min-h-32 overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan/45 hover:bg-white/[0.08] hover:shadow-glow"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-cyan/58">{stat.caption}</p>
              <p className="mt-2 text-sm text-white/48">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                {values[stat.key]}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
