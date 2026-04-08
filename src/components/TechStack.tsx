"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";

const row1 = ["Next.js","React","TypeScript","Tailwind CSS","Node.js","Python","Supabase","PostgreSQL","Prisma","MongoDB"];
const row2 = ["Claude API","OpenAI","LangChain","Framer Motion","GSAP","Three.js","Solana","Web3.js","Figma","Vercel","Docker"];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-3 group">
      <div className={reverse ? "animate-marquee-reverse" : "animate-marquee"}>
        <div className="flex gap-4 w-max">
          {doubled.map((item, i) => (
            <div key={`${item}-${i}`} className="flex items-center gap-3 px-5 py-3 border border-border hover:border-accent/40 bg-bg-primary hover:bg-accent/5 transition-all duration-300 whitespace-nowrap group/item">
              <span className="w-2 h-2 rounded-full bg-accent/30 group-hover/item:bg-accent transition-colors" />
              <span className="font-mono text-sm text-text-primary/70 group-hover/item:text-accent transition-colors">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TechStack() {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-bg-primary py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4 block">{t.stack.label[lang]}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
            {t.stack.heading[lang]} <span className="text-accent">{t.stack.headingAccent[lang]}</span>
          </h2>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </motion.div>
    </section>
  );
}
