"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const caseImages = [
  ["/cases/kokokotsu/1.png","/cases/kokokotsu/2.webp","/cases/kokokotsu/3.webp","/cases/kokokotsu/4.webp","/cases/kokokotsu/5.webp","/cases/kokokotsu/6.webp","/cases/kokokotsu/7.webp","/cases/kokokotsu/8.webp"],
  ["/cases/vodka/1.jpg"],
  ["/cases/ffs/1.jpg"],
  ["/cases/gato-preto/1.jpg","/cases/gato-preto/3.jpg","/cases/gato-preto/5.jpg","/cases/gato-preto/6.jpg","/cases/gato-preto/7.jpg","/cases/gato-preto/8.jpg"],
  ["/cases/vestuario/1.jpg","/cases/vestuario/5.webp","/cases/vestuario/6.webp"],
  ["/cases/viralata.png"],
  ["/cases/sabai/1.jpg","/cases/sabai/2.jpg","/cases/sabai/3.jpg","/cases/sabai/4.jpg","/cases/sabai/5.jpg","/cases/sabai/6.jpg"],
  ["/cases/boteco/1.jpg","/cases/boteco/2.jpg","/cases/boteco/3.jpg","/cases/boteco/5.jpg","/cases/boteco/6.jpg"],
  [],
];

const caseTags = [
  ["Branding", "Identity", "Design System", "London"],
  ["Packaging", "Luxury", "Brand Identity", "Product"],
  ["Branding", "Art Direction", "Bold", "London"],
  ["Branding", "Illustration", "Packaging", "Beer"],
  ["Branding", "Fashion", "E-commerce", "Apparel"],
  ["Web3", "React", "Illustration", "Crypto"],
  ["Brand", "Design System", "E-commerce", "Cosmetics"],
  ["Next.js", "Supabase", "Payments", "WhatsApp API"],
  ["Python", "AI Agent", "Solana", "Web3"],
];

function CaseCard({ index }: { index: number }) {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeImg, setActiveImg] = useState(0);
  const project = t.cases.projects[index];
  const images = caseImages[index];
  const tags = caseTags[index];
  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  return (
    <motion.article ref={ref} initial={{ opacity: 0, y: 60 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="group relative">
      <div className="relative overflow-hidden bg-bg-secondary border border-white/5 hover:border-accent/20 transition-all duration-500">
        <div className="relative aspect-[16/9] overflow-hidden">
          {hasImages ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 w-full h-full">
                  <Image src={images[activeImg]} alt={`${project.title} — ${activeImg + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 1200px" quality={80} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-bg-secondary/0 group-hover:bg-bg-secondary/20 transition-all duration-500" />
              {hasMultiple && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeImg ? "bg-accent w-6" : "bg-white/30 hover:bg-white/60"}`}
                      aria-label={`${lang === "pt" ? "Imagem" : "Image"} ${i + 1}`} />
                  ))}
                </div>
              )}
              {hasMultiple && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setActiveImg((p) => (p === 0 ? images.length - 1 : p - 1)); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-bg-secondary/60 backdrop-blur-sm text-white/60 hover:text-accent hover:bg-bg-secondary/80 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label={t.cases.prev[lang]}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setActiveImg((p) => (p === images.length - 1 ? 0 : p + 1)); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-bg-secondary/60 backdrop-blur-sm text-white/60 hover:text-accent hover:bg-bg-secondary/80 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label={t.cases.next[lang]}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                </>
              )}
              {hasMultiple && (
                <div className="absolute top-4 right-4 font-mono text-[10px] text-white/40 bg-bg-secondary/50 backdrop-blur-sm px-2 py-1 z-10">
                  {activeImg + 1} / {images.length}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-bg-secondary flex items-center justify-center">
              <span className="font-display text-3xl md:text-5xl font-bold text-white/5">{project.title}</span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-text-secondary group-hover:text-accent transition-colors duration-300">{project.title}</h3>
              <p className="font-mono text-xs text-text-secondary/30 mt-1">{project.type[lang]}</p>
            </div>
          </div>
          <p className="text-text-secondary/50 text-sm leading-relaxed mb-5">{project.description[lang]}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/10 text-text-secondary/40">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Cases() {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="work" ref={ref} className="bg-bg-secondary py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary/30 mb-4 block">{t.cases.label[lang]}</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-secondary">{t.cases.heading[lang]}<span className="text-accent">.</span></h2>
          <p className="mt-4 text-text-secondary/30 max-w-lg font-body">{t.cases.subtitle[lang]}</p>
        </motion.div>
        <div className="space-y-6 md:space-y-8">
          {t.cases.projects.map((_, i) => <CaseCard key={i} index={i} />)}
        </div>
      </div>
    </section>
  );
}
