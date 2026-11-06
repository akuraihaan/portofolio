"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  baseAlpha: number;
  color: string;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener("resize", handleResize);

    // Star initialization
    const starCount = Math.floor((width * height) / 4500);
    const starColors = ["#ffffff", "#e0e7ff", "#93c5fd", "#60a5fa", "#2c67ed", "#a78bfa"];
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const count = Math.min(Math.floor((width * height) / 4500), 280);
      for (let i = 0; i < count; i++) {
        const baseAlpha = 0.2 + Math.random() * 0.7;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.6 + 0.3,
          alpha: baseAlpha,
          baseAlpha,
          speed: 0.005 + Math.random() * 0.02,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    // Meteors
    const meteors: Meteor[] = [];
    const createMeteor = () => {
      if (Math.random() > 0.03 || meteors.length >= 3) return;
      meteors.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        length: 80 + Math.random() * 70,
        speed: 9 + Math.random() * 8,
        angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2, // ~45 deg downward
        alpha: 1,
        active: true,
      });
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Deep space base gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, "#070c24");
      bgGrad.addColorStop(0.45, "#040716");
      bgGrad.addColorStop(1, "#02040a");

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle cosmic nebula glows
      // 1. Top center-left blue nebula
      const nebula1 = ctx.createRadialGradient(
        width * 0.25,
        height * 0.2,
        0,
        width * 0.25,
        height * 0.2,
        width * 0.4
      );
      nebula1.addColorStop(0, "rgba(44, 103, 237, 0.12)");
      nebula1.addColorStop(0.6, "rgba(44, 103, 237, 0.03)");
      nebula1.addColorStop(1, "transparent");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      // 2. Right purple-blue nebula
      const nebula2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.45,
        0,
        width * 0.8,
        height * 0.45,
        width * 0.35
      );
      nebula2.addColorStop(0, "rgba(79, 70, 229, 0.08)");
      nebula2.addColorStop(0.5, "rgba(44, 103, 237, 0.02)");
      nebula2.addColorStop(1, "transparent");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      // 3. Bottom cyan-blue ambient nebula
      const nebula3 = ctx.createRadialGradient(
        width * 0.5,
        height * 0.85,
        0,
        width * 0.5,
        height * 0.85,
        width * 0.45
      );
      nebula3.addColorStop(0, "rgba(30, 64, 175, 0.09)");
      nebula3.addColorStop(1, "transparent");
      ctx.fillStyle = nebula3;
      ctx.fillRect(0, 0, width, height);

      // Draw Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        // Twinkle
        star.alpha = star.baseAlpha + Math.sin(tick * star.speed + i) * 0.3;
        star.alpha = Math.max(0.08, Math.min(1, star.alpha));

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.fill();
        ctx.restore();
      }

      // Handle Meteors
      if (tick % 70 === 0) {
        createMeteor();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) {
          meteors.splice(i, 1);
          continue;
        }

        const vx = Math.cos(m.angle) * m.speed;
        const vy = Math.sin(m.angle) * m.speed;
        m.x += vx;
        m.y += vy;
        m.alpha -= 0.015;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          m.active = false;
          continue;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        meteorGrad.addColorStop(0, "rgba(44, 103, 237, 0)");
        meteorGrad.addColorStop(0.7, "rgba(96, 165, 250, " + m.alpha * 0.8 + ")");
        meteorGrad.addColorStop(1, "rgba(255, 255, 255, " + m.alpha + ")");

        ctx.save();
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = "#60a5fa";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // Meteor glowing head
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#93c5fd";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Subtle cosmic grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#2c67ed_1px,transparent_1px)] [background-size:32px_32px]"
      />
    </div>
  );
}

