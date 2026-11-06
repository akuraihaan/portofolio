"use client";
import { useEffect, useRef } from "react";
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        const value = max > 0 ? scrollY / max : 0;
        if (bar.current) {
          bar.current.style.transform = `scaleX(${value})`;
          bar.current.setAttribute(
            "aria-valuenow",
            String(Math.round(value * 100)),
          );
        }
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      ref={bar}
      className="reading-progress"
      role="progressbar"
      aria-label="Progres membaca"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    />
  );
}
