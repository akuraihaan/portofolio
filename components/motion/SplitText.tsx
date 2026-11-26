"use client";

/**
 * SplitText — Splits text into animated words or characters
 * Uses overflow hidden masks for the classic editorial reveal.
 */
import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASINGS, DURATION } from "./MotionSystem";

interface SplitTextProps {
  text: string;
  type?: "words" | "chars";
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  variants?: Variants;
  /** If true, trigger on mount instead of IntersectionObserver */
  immediate?: boolean;
}

const defaultWordVariants: Variants = {
  hidden: { y: "105%", opacity: 0, skewY: 1.5 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    skewY: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASINGS.organic,
      delay: i * 0.055,
    },
  }),
};

const defaultCharVariants: Variants = {
  hidden: { y: "120%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: DURATION.medium,
      ease: EASINGS.editorial,
      delay: i * 0.03,
    },
  }),
};

export function SplitText({
  text,
  type = "words",
  className = "",
  wordClassName = "",
  delay = 0,
  once = true,
  variants,
  immediate = false,
}: SplitTextProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  const tokens = type === "chars" ? Array.from(text) : text.split(" ");
  const childVariants = variants ?? (type === "chars" ? defaultCharVariants : defaultWordVariants);

  const containerProps = immediate
    ? { initial: "hidden", animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: { once, margin: "-60px" } };

  return (
    <motion.span
      {...containerProps}
      aria-label={text}
      className={`inline-block ${className}`}
    >
      {tokens.map((token, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden leading-tight"
          aria-hidden="true"
        >
          <motion.span
            custom={i + delay * 15}
            variants={childVariants}
            className={`inline-block ${wordClassName}`}
          >
            {token === " " ? "\u00A0" : token}
            {type === "words" && i < tokens.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
