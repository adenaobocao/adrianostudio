"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = 2000 / value;
    const timer = setInterval(() => { start++; setCount(start); if (start >= value) clearInterval(timer); }, step);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl md:text-6xl font-bold text-accent tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function About() {
  const { lang, t } = useI18n();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    { value: 50, suffix: "+", label: t.about.stat1[lang] },
    { value: 8, suffix: "+", label: t.about.stat2[lang] },
    { value: 6, suffix: "+", label: t.about.stat3[lang] },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative bg-bg-primary py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4 block">{t.about.label[lang]}</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8 text-text-primary">
              {t.about.heading1[lang]}<br /><span className="text-accent">{t.about.heading2[lang]}</span>
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-muted max-w-lg">
              <p>{t.about.p1[lang]}</p>
              <p>{t.about.p2[lang]}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] overflow-hidden group">
            <Image src="/adriano.png" alt="Adriano" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" sizes="(max-width: 768px) 100vw, 600px" priority />
            <div className="absolute top-0 right-0 w-20 h-20">
              <div className="absolute top-0 right-0 w-full h-px bg-accent" />
              <div className="absolute top-0 right-0 h-full w-px bg-accent" />
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20">
              <div className="absolute bottom-0 left-0 w-full h-px bg-accent" />
              <div className="absolute bottom-0 left-0 h-full w-px bg-accent" />
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 border-t border-border pt-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
