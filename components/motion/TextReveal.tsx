"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASINGS } from "./MotionSystem";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
  stagger?: number;
}

export function WordReveal({
  text,
  className = "",
  as: Component = "h2",
  delay = 0,
  stagger = 0.04,
}: TextRevealProps) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");

  if (prefersReduced) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, idx) => (
        <span key={idx} className="inline-block overflow-hidden mr-[0.28em] last:mr-0">
          <motion.span
            initial={{ y: "115%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: DURATION.slow,
              ease: EASINGS.editorial,
              delay: delay + idx * stagger,
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}

export function SplitTextReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: DURATION.normal,
          ease: EASINGS.editorial,
          delay,
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
}

