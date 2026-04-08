"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const socials = [
  { label: "GitHub", href: "https://github.com/adriano", icon: "GH" },
  { label: "LinkedIn", href: "https://linkedin.com/in/adriano", icon: "LI" },
  { label: "Instagram", href: "https://instagram.com/adriano", icon: "IG" },
  { label: "X", href: "https://x.com/adriano", icon: "X" },
];

export default function Footer() {
  const { lang, t } = useI18n();

  return (
    <footer className="bg-bg-secondary border-t border-white/5 py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="font-display text-lg font-bold text-text-secondary">ADRIANO<span className="text-accent">.</span></span>
            <span className="font-mono text-[10px] text-text-secondary/20 uppercase tracking-wider">{t.footer.tagline[lang]}</span>
          </div>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="w-10 h-10 flex items-center justify-center border border-white/10 text-text-secondary/40 hover:text-accent hover:border-accent/30 transition-all duration-300 font-mono text-xs">
                {s.icon}
              </a>
            ))}
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-mono text-xs text-text-secondary/30 hover:text-accent transition-colors duration-300 uppercase tracking-wider flex items-center gap-2 group">
              {t.footer.backToTop[lang]}
              <motion.span className="inline-block" whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400 }}>↑</motion.span>
            </button>
            <span className="font-mono text-[10px] text-text-secondary/15">
              © {new Date().getFullYear()} Adriano. {t.footer.builtWith[lang]}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
