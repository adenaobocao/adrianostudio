"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const nameChars = "ADRIANO".split("");
const roles = ["Art Director", "Fullstack Developer", "AI Builder"];

export default function Hero() {
  const { lang, t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let mouse = { x: w / 2, y: h / 2 };
    let raf: number;

    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const count = Math.min(80, Math.floor((w * h) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const onMouse = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { const f = (150 - dist) / 150; p.vx += (dx / dist) * f * 0.02; p.vy += (dy / dist) * f * 0.02; }
        p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.vy *= 0.99;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 77, 0, 0.25)"; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 77, 0, ${0.06 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", onResize); window.addEventListener("mousemove", onMouse);
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMouse); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center bg-bg-secondary overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/[0.03]" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.03]" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white/[0.03]" />
        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/[0.03]" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/[0.03]" />
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="overflow-hidden">
          <h1 className="font-display font-bold text-text-secondary leading-[0.85] tracking-tighter" style={{ fontSize: "clamp(3.5rem, 12vw, 12rem)" }}>
            {nameChars.map((char, i) => (
              <motion.span key={i} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="inline-block">
                {char}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-sm md:text-base text-text-secondary/40">
          {roles.map((role, i) => (
            <span key={role} className="flex items-center gap-3">
              {i > 0 && <span className="text-accent">×</span>}
              <span className="hover:text-accent transition-colors duration-300">{role}</span>
            </span>
          ))}
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 font-body text-base md:text-lg text-text-secondary/30 max-w-xl mx-auto leading-relaxed">
          {t.hero.tagline[lang]}
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-secondary/20">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-accent/50 to-transparent" />
      </motion.div>
    </section>
  );
}
