"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const icons = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 20l9-5V9l-9 5-9-5v6l9 5z" /><path d="M12 10l9-5-9-5-9 5 9 5z" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M8 9l3 3-3 3m5 0h3M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="12" r="3" /><path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9l2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9l2.83-2.83" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
];

const serviceKeys = ["s1", "s2", "s3", "s4"] as const;

function ServiceCard({ serviceKey, index, icon }: { serviceKey: typeof serviceKeys[number]; index: number; icon: React.ReactNode }) {
  const { lang, t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const service = t.services[serviceKey];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTilt({ x: ((e.clientX - rect.left) / rect.width - 0.5) * 8, y: ((e.clientY - rect.top) / rect.height - 0.5) * -8 });
  };

  return (
    <motion.div ref={cardRef}
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })} onClick={() => setExpanded(!expanded)}
      className="group relative bg-bg-primary border border-border hover:border-accent/40 transition-colors duration-500 cursor-pointer overflow-hidden"
      style={{ transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`, transition: tilt.x === 0 ? "transform 0.5s ease" : "transform 0.1s ease" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-accent/5 to-transparent" />
      <div className="relative p-8 md:p-10">
        <div className="flex items-start justify-between mb-6">
          <span className="font-mono text-xs text-muted">0{index + 1}</span>
          <span className="text-accent transition-transform duration-300 group-hover:scale-110">{icon}</span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 text-text-primary group-hover:text-accent transition-colors duration-300">{service.title[lang]}</h3>
        <p className="text-muted leading-relaxed text-sm">{service.description[lang]}</p>
        <motion.div initial={false} animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
          <ul className="mt-6 pt-6 border-t border-border space-y-2">
            {service.details[lang].map((detail) => (
              <li key={detail} className="flex items-center gap-2 text-sm text-text-primary/70">
                <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />{detail}
              </li>
            ))}
          </ul>
        </motion.div>
        <div className="mt-6 flex items-center gap-2 font-mono text-xs text-accent uppercase tracking-wider">
          <span>{expanded ? t.services.less[lang] : t.services.more[lang]}</span>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="inline-block">↓</motion.span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const connectorRef = useRef(null);
  const connectorInView = useInView(connectorRef, { once: true, margin: "-50px" });

  return (
    <section id="services" ref={ref} className="bg-bg-primary py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4 block">{t.services.label[lang]}</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary">
            {t.services.heading[lang]} <span className="text-accent">{t.services.headingAccent[lang]}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {serviceKeys.map((key, i) => <ServiceCard key={key} serviceKey={key} index={i} icon={icons[i]} />)}
        </div>

        <div ref={connectorRef} className="relative my-12 md:my-16 flex items-center justify-center">
          <motion.div initial={{ scaleY: 0 }} animate={connectorInView ? { scaleY: 1 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="w-px h-16 bg-gradient-to-b from-border to-accent origin-top" />
          <motion.div initial={{ scale: 0 }} animate={connectorInView ? { scale: 1 } : {}} transition={{ delay: 0.6, duration: 0.4 }} className="absolute bottom-0 w-3 h-3 rounded-full bg-accent" />
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative group">
          <div className="relative border border-accent/30 bg-bg-secondary overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-accent/8 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-xs text-accent tracking-widest">{t.services.sales.label[lang]}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-accent"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" /></svg>
              </div>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text-secondary mb-6 leading-tight">
                {t.services.sales.title[lang]} <span className="text-accent">{t.services.sales.titleAccent[lang]}</span>
              </h3>
              <p className="text-text-secondary/50 text-lg leading-relaxed max-w-2xl mb-10">
                {t.services.sales.description[lang]} <span className="text-accent font-medium">{t.services.sales.descriptionAccent[lang]}</span>.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.services.sales.items[lang].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }} className="border border-white/5 p-5 hover:border-accent/20 transition-colors duration-300">
                    <h4 className="font-display text-sm font-bold text-text-secondary mb-2">{item.title}</h4>
                    <p className="text-text-secondary/35 text-xs leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="font-mono text-xs text-text-secondary/20 uppercase tracking-wider">
                  {t.services.sales.footer[lang]} <span className="text-accent">{t.services.sales.footerAccent[lang]}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
