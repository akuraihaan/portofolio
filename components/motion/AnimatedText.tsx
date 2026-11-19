"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASINGS } from "./MotionSystem";

interface AnimatedTextProps {
  text: string;
  type?: "chars" | "words" | "lines";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function AnimatedText({
  text,
  type = "words",
  className = "",
  delay = 0,
  stagger = 0.04,
  once = true,
}: AnimatedTextProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  if (type === "chars") {
    const chars = Array.from(text);
    return (
      <motion.span
        className={`inline-block ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-40px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay,
            },
          },
        }}
      >
        {chars.map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 15, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.4,
                  ease: EASINGS.editorial,
                },
              },
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  // Default: Words
  const words = text.split(" ");
  return (
    <motion.span
      className={`inline-block flex-wrap gap-x-1.5 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 18, filter: "blur(2px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.45,
                ease: EASINGS.editorial,
              },
            },
          }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.span>
  );
}
