"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";

export default function Quote() {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const words = t.quote.text[lang].split(" ");

  return (
    <section ref={ref} className="bg-bg-secondary py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1000px] px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <span className="font-display text-6xl md:text-8xl text-accent/20 leading-none select-none">&ldquo;</span>
        </motion.div>
        <p className="font-display text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-text-secondary -mt-8 md:-mt-12">
          {words.map((word, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="inline-block mr-[0.3em]">
              {word}
            </motion.span>
          ))}
        </p>
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8, duration: 0.6 }} className="mt-10">
          <div className="w-12 h-px bg-accent mx-auto mb-4" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary/30">— Adriano</p>
        </motion.div>
      </div>
    </section>
  );
}
