"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
import type { MotorsportProjectItem } from "../motorsport/MotorsportGallery";

interface SkillsProps {
  groups?: SkillCategoryGroup[];
  dynamicSkills?: DynamicSkillRecord[];
  projects?: MotorsportProjectItem[];
}

export function Skills({
  groups = motorsportSkillGroups,
  dynamicSkills = [],
  projects = [],
}: SkillsProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState<{
    name: string;
    desc: string;
  } | null>(null);
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
          desc: ds.description || "Digunakan pada pengembangan aplikasi produksi.",
        });
      }
    });
    return Array.from(map.values());
  }, [groups, dynamicSkills]);

  const displayed =
    activeTab === "all" ? effectiveGroups : effectiveGroups.filter((g) => g.id === activeTab);

  // Match projects that use the selected technology
  const relatedProjects = useMemo(() => {
    if (!selectedSkill) return [];
    const keyword = selectedSkill.name.toLowerCase().split(" ")[0];
    return projects.filter((p) =>
      p.technologies.some(
        (t) =>
          t.toLowerCase().includes(keyword) ||
          selectedSkill.name.toLowerCase().includes(t.toLowerCase())
      )
    );
  }, [selectedSkill, projects]);

  return (
    <section
      id="skills"
      className="relative w-full max-w-7xl mx-auto py-24 md:py-32 px-6 sm:px-8 border-t border-[#000000]/10 dark:border-[#FAF8F5]/10"
    >
      <Sprite kind="spark" color="green" size="md" className="hidden md:inline-block absolute top-16 right-16" />

      <div className="max-w-3xl mb-10 space-y-3">
        <span className="inline-block px-2.5 py-1 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-xs uppercase tracking-[0.05em]">
          Teknologi
        </span>
        <h2 className="font-hero-display text-4xl sm:text-5xl text-[#000000] dark:text-[#FAF8F5] leading-[1.08]">
          <SplitText text="Alat dan bahasa yang saya gunakan." type="words" />
        </h2>
        <p className="font-body-editorial text-sm sm:text-base text-[#000000]/75 dark:text-[#FAF8F5]/75">
          Pilih salah satu teknologi di bawah untuk melihat peran dan proyek yang memakainya.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {[
          { id: "all", label: `Semua (${effectiveGroups.length})` },
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

      {/* Interactive Technology Explorer Drawer */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={SPRINGS.snappy}
            className="mb-10 p-5 sm:p-6 rounded-[0.75rem] bg-[#FFD4C2] text-[#000000] flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1 max-w-2xl">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#F05A28]">
                Teknologi terpilih
              </span>
              <h3 className="font-editorial text-2xl">{selectedSkill.name}</h3>
              <p className="font-body-editorial text-sm text-[#000000]/80">{selectedSkill.desc}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {relatedProjects.length > 0 ? (
                relatedProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[0.45rem] bg-[#F05A28] text-[#FAF8F5] font-mono text-[11px] uppercase"
                  >
                    <span>{proj.title}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                ))
              ) : (
                <span className="font-mono text-[11px] text-[#000000]/65">
                  Dipakai pada pengembangan sistem internal.
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const isPicked = selectedSkill?.name === skill.name;
                    return (
                      <button
                        key={skill.name}
                        type="button"
                        onClick={() =>
                          setSelectedSkill(
                            isPicked ? null : { name: skill.name, desc: skill.desc }
                          )
                        }
                        className={`px-3 py-1.5 rounded-[0.45rem] font-mono text-xs cursor-pointer transition-colors ${
                          isPicked
                            ? "bg-[#F05A28] text-[#FAF8F5]"
                            : "bg-[#FAF8F5] dark:bg-[#1A1917] border border-[#000000]/15 dark:border-[#FAF8F5]/15 text-[#000000] dark:text-[#FAF8F5] hover:border-[#F05A28]"
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
