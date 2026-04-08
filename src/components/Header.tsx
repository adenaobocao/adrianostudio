"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: t.header.about[lang], href: "#about" },
    { label: t.header.services[lang], href: "#services" },
    { label: t.header.work[lang], href: "#work" },
    { label: t.header.contact[lang], href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled ? "bg-bg-secondary/90 backdrop-blur-md py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 flex items-center justify-between">
          <a href="#" className="font-display text-xl font-bold tracking-tight text-text-secondary">
            ADRIANO<span className="text-accent">.</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-widest text-text-secondary/60 hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}

            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className="font-mono text-xs uppercase tracking-widest text-text-secondary/40 hover:text-accent transition-colors duration-300 border border-white/10 px-3 py-1 hover:border-accent/30"
            >
              {lang === "pt" ? "EN" : "PT"}
            </button>

            <MagneticButton
              as="a"
              href="#contact"
              className="ml-2 px-5 py-2 border border-accent text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-text-secondary transition-all duration-300"
            >
              {t.header.cta[lang]}
            </MagneticButton>
          </nav>

          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className="font-mono text-xs text-text-secondary/40 border border-white/10 px-2 py-1 z-[110]"
            >
              {lang === "pt" ? "EN" : "PT"}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-[110]"
              aria-label={t.header.menuLabel[lang]}
            >
              <span className={`block w-6 h-[1.5px] bg-text-secondary transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
              <span className={`block w-6 h-[1.5px] bg-text-secondary transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 2rem) 2rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2rem) 2rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2rem) 2rem)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[105] bg-bg-secondary flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                className="font-display text-4xl font-bold text-text-secondary hover:text-accent transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-4 px-8 py-3 border border-accent text-accent font-mono text-sm uppercase tracking-widest"
            >
              {t.header.cta[lang]}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
