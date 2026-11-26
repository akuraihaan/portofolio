"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SplitText } from "../motion/SplitText";
import { AnimatedUnderline } from "../motion/AnimatedUnderline";
import { Sprite } from "../collage";
import { useMotionContext } from "../motion/MotionProvider";
import {
  SPRINGS,
  DURATION,
  VIEWPORT_ONCE,
  staggerContainer,
  staggerItem,
} from "../motion/MotionSystem";
import {
  motorsportSkillGroups,
  type SkillCategoryGroup,
  type DynamicSkillRecord,
} from "../motorsport/MotorsportSkills";

interface SkillsProps {
  groups?: SkillCategoryGroup[];
  dynamicSkills?: DynamicSkillRecord[];
}

export function Skills({
  groups = motorsportSkillGroups,
  dynamicSkills = [],
}: SkillsProps) {
  const [activeTab, setActiveTab] = useState("all");
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

  const effectiveGroups = useMemo(() => {
    if (!dynamicSkills || dynamicSkills.length === 0) return groups;
    const map = new Map<string, SkillCategoryGroup>();
    groups.forEach((g) => map.set(g.id, { ...g, skills: [...g.skills] }));

    dynamicSkills.forEach((ds) => {
      const cat = (ds.category || "").toLowerCase();
      let target = "tools";
      if (cat.includes("front") || cat.includes("react") || cat.includes("web") || cat.includes("css")) target = "frontend";
      else if (cat.includes("back") || cat.includes("server") || cat.includes("api") || cat.includes("node")) target = "backend";
      else if (cat.includes("data") || cat.includes("sql") || cat.includes("sec")) target = "database";
      else if (cat.includes("design") || cat.includes("ui") || cat.includes("ux")) target = "uiux";
      else if (cat.includes("edu") || cat.includes("pedagogi")) target = "pedagogy";

      const grp = map.get(target);
      if (grp && !grp.skills.some((s) => s.name.toLowerCase() === ds.name.toLowerCase())) {
        grp.skills.push({
          name: ds.name,
          level: "Mahir",
          desc: ds.description || "Verified production engineering capability.",
        });
      }
    });
    return Array.from(map.values());
  }, [groups, dynamicSkills]);

  const displayed =
    activeTab === "all" ? effectiveGroups : effectiveGroups.filter((g) => g.id === activeTab);

  return (
    <section
      id="skills"
      className="relative w-full max-w-7xl mx-auto py-24 md:py-32 px-6 sm:px-8 border-t border-[#000000]/10 dark:border-[#FAF8F5]/10"
    >
      <Sprite kind="spark" color="green" size="md" className="hidden md:inline-block absolute top-16 right-16" />

      <div className="max-w-3xl mb-12 space-y-4">
        <span className="inline-block px-2.5 py-1 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-xs uppercase tracking-[0.05em]">
          03 // TECHNICAL TOOLKIT
        </span>
        <h2 className="font-hero-display text-4xl sm:text-5xl text-[#000000] dark:text-[#FAF8F5] leading-[1.08]">
          <SplitText text="Interactive typographic stack & engineering craft." type="words" />
        </h2>
        <p className="font-body-editorial text-sm sm:text-base text-[#000000]/75 dark:text-[#FAF8F5]/75">
          Tanpa persentase artifisial — setiap teknologi didukung implementasi sistem nyata dan riset akademik.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-12">
        {[
          { id: "all", label: `All (${effectiveGroups.length})` },
          ...effectiveGroups.map((g) => ({ id: g.id, label: g.name })),
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={() => setCursor({ active: true, variant: "hover" })}
              onMouseLeave={resetCursor}
              className={`relative px-3.5 py-1.5 rounded-[0.5rem] font-mono text-xs uppercase tracking-[0.04em] cursor-pointer transition-colors ${
                isActive
                  ? "text-[#FAF8F5]"
                  : "bg-[#FFD4C2]/60 dark:bg-[#252420] text-[#000000] dark:text-[#FAF8F5] hover:bg-[#FFD4C2]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="pgSkillTab"
                  transition={SPRINGS.snappy}
                  className="absolute inset-0 rounded-[0.5rem] bg-[#F05A28] -z-0"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Typographic Skill Groups */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={prefersReduced ? {} : "hidden"}
          animate="visible"
          exit={prefersReduced ? {} : { opacity: 0, y: -8, transition: { duration: DURATION.fast } }}
          variants={staggerContainer(0.06, 0.02)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayed.map((group) => (
            <motion.div
              key={group.id}
              variants={staggerItem}
              className="p-6 rounded-[0.75rem] bg-[#FAF8F5] dark:bg-[#252420] border border-[#000000]/12 dark:border-[#FAF8F5]/12 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between pb-3 mb-4 border-b border-[#000000]/10 dark:border-[#FAF8F5]/10">
                  <h3 className="font-editorial text-2xl text-[#000000] dark:text-[#FAF8F5]">
                    <AnimatedUnderline color="#F05A28" thickness={1.5}>
                      {group.name}
                    </AnimatedUnderline>
                  </h3>
                  <span className="font-mono text-xs text-[#F05A28]">{group.code}</span>
                </div>

                <div className="space-y-3.5">
                  {group.skills.map((skill) => (
                    <motion.div
                      key={skill.name}
                      whileHover={prefersReduced ? {} : { x: 4 }}
                      transition={SPRINGS.snappy}
                      className="group/sk"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-xs sm:text-[13px] text-[#000000] dark:text-[#FAF8F5] group-hover/sk:text-[#F05A28] transition-colors">
                          {skill.name}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[0.35rem] bg-[#C4D94E]/60 text-[#000000]">
                          {skill.level}
                        </span>
                      </div>
                      <p className="font-body-editorial text-xs text-[#000000]/65 dark:text-[#FAF8F5]/65 mt-0.5">
                        {skill.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
