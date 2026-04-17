"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

// ─── Per-project image & layout config ───────────────────────────────
// layout types:
//   "gallery"   → standard carousel, good landscape images
//   "grid"      → multiple images shown together (mixed orientations)
//   "split"     → image left + text right (few images, strong branding)
//   "text-hero" → text-dominant, minimal/no imagery
//   "livedemo"  → premium: auto-cycling frames of a live site + mobile frame
type Category = "brand" | "product";

interface LiveScreen {
  src: string;
  label: { pt: string; en: string };
}

interface ProjectConfig {
  layout: "gallery" | "grid" | "split" | "text-hero" | "showcase" | "livedemo";
  category: Category;
  images: string[];
  coverIndex: number; // which image to show as the main/cover
  tags: string[];
  accent?: string; // optional brand color for bg
  gridCols?: number; // for grid layout
  liveUrl?: string; // live site link (showcase / livedemo)
  // livedemo-only
  screens?: LiveScreen[];
  mobileScreens?: string[]; // mobile frames that cycle in sync
}

const projectConfigs: ProjectConfig[] = [
  // 0 — Kokokotsu
  {
    layout: "gallery",
    category: "brand",
    images: [
      "/cases/kokokotsu/1.png",
      "/cases/kokokotsu/2.webp",
      "/cases/kokokotsu/3.webp",
      "/cases/kokokotsu/4.webp",
      "/cases/kokokotsu/5.webp",
      "/cases/kokokotsu/6.webp",
      "/cases/kokokotsu/7.webp",
      "/cases/kokokotsu/8.webp",
    ],
    coverIndex: 0,
    tags: ["Branding", "Identity", "Design System", "London"],
  },
  // 1 — Vodka
  {
    layout: "split",
    category: "brand",
    images: ["/cases/vodka.png", "/cases/vodka/1.jpg"],
    coverIndex: 0,
    tags: ["Packaging", "Luxury", "Brand Identity", "Product"],
    accent: "#1a1a1a",
  },
  // 2 — FFS
  {
    layout: "split",
    category: "brand",
    images: ["/cases/ffs.jpg", "/cases/ffs/1.jpg"],
    coverIndex: 0,
    tags: ["Branding", "Art Direction", "Bold", "London"],
    accent: "#1a1a1a",
  },
  // 3 — Gato Preto
  {
    layout: "gallery",
    category: "brand",
    images: [
      "/cases/gato-preto/1.jpg",
      "/cases/gato-preto/3.jpg",
      "/cases/gato-preto/5.jpg",
      "/cases/gato-preto/6.jpg",
      "/cases/gato-preto/7.jpg",
      "/cases/gato-preto/8.jpg",
    ],
    coverIndex: 0,
    tags: ["Branding", "Illustration", "Packaging", "Beer"],
  },
  // 4 — Vestuario/Moda Fitness
  {
    layout: "gallery",
    category: "brand",
    images: [
      "/cases/vestuario/1.jpg",
      "/cases/vestuario/2.webp",
      "/cases/vestuario/5.webp",
      "/cases/vestuario/6.webp",
    ],
    coverIndex: 0,
    tags: ["Branding", "Fashion", "E-commerce", "Apparel"],
  },
  // 5 — Sabai: LIVE DEMO (e-commerce cosmetics)
  {
    layout: "livedemo",
    category: "product",
    images: [
      "/cases/sabai-live/desktop-1-hero.jpg",
      "/cases/sabai-live/desktop-3-section3.jpg",
      "/cases/sabai-live/desktop-5-section5.jpg",
      "/cases/sabai-live/desktop-6-produto-cool.jpg",
      "/cases/sabai-live/desktop-9-hub.jpg",
    ],
    coverIndex: 0,
    tags: ["E-commerce", "Brand", "Design System", "Cosmetics"],
    liveUrl: "https://sabai-git-main-adenaobocaos-projects.vercel.app",
    screens: [
      { src: "/cases/sabai-live/desktop-1-hero.jpg",        label: { pt: "Home", en: "Home" } },
      { src: "/cases/sabai-live/desktop-3-section3.jpg",    label: { pt: "Linha", en: "Line" } },
      { src: "/cases/sabai-live/desktop-6-produto-cool.jpg",label: { pt: "Produto", en: "Product" } },
      { src: "/cases/sabai-live/desktop-5-section5.jpg",    label: { pt: "Social", en: "Social" } },
      { src: "/cases/sabai-live/desktop-9-hub.jpg",         label: { pt: "Hub", en: "Hub" } },
    ],
    mobileScreens: [
      "/cases/sabai-live/mobile-1-hero.jpg",
      "/cases/sabai-live/mobile-2-products.jpg",
      "/cases/sabai-live/mobile-3-produto.jpg",
      "/cases/sabai-live/mobile-1-hero.jpg",
      "/cases/sabai-live/mobile-3-produto.jpg",
    ],
  },
  // 6 — Boteco: LIVE DEMO (SaaS for restaurant)
  {
    layout: "livedemo",
    category: "product",
    images: [
      "/cases/boteco/home-desktop.jpg",
      "/cases/boteco/dashboard-desktop.jpg",
      "/cases/boteco/dashboard-pedidos.jpg",
      "/cases/boteco/dashboard-cozinha.jpg",
      "/cases/boteco/dashboard-whatsapp.jpg",
    ],
    coverIndex: 0,
    tags: ["Next.js", "Supabase", "Payments", "WhatsApp API"],
    liveUrl: "https://adenaobocao-boteco-da-estacao-1c8n.vercel.app",
    screens: [
      { src: "/cases/boteco/home-desktop.jpg",         label: { pt: "Home", en: "Home" } },
      { src: "/cases/boteco/dashboard-desktop.jpg",    label: { pt: "Painel", en: "Panel" } },
      { src: "/cases/boteco/dashboard-pedidos.jpg",    label: { pt: "Pedidos", en: "Orders" } },
      { src: "/cases/boteco/dashboard-cozinha.jpg",    label: { pt: "Cozinha", en: "Kitchen" } },
      { src: "/cases/boteco/dashboard-whatsapp.jpg",   label: { pt: "WhatsApp", en: "WhatsApp" } },
    ],
    mobileScreens: [
      "/cases/boteco/home-mobile.jpg",
      "/cases/boteco/dashboard-mobile.jpg",
      "/cases/boteco/dashboard-mobile.jpg",
      "/cases/boteco/dashboard-mobile.jpg",
      "/cases/boteco/home-mobile.jpg",
    ],
  },
];

// ─── Lightbox ────────────────────────────────────────────────────────
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const img = images[current];

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)),
    [images.length]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Image */}
      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={img}
          alt=""
          width={1400}
          height={900}
          className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
          quality={90}
        />
      </motion.div>

      {/* Nav arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40">
          {current + 1} / {images.length}
        </div>
      )}
    </motion.div>
  );
}

// ─── Gallery Layout ──────────────────────────────────────────────────
function GalleryCard({
  index,
  config,
  onImageClick,
}: {
  index: number;
  config: ProjectConfig;
  onImageClick: (images: string[], startIndex: number) => void;
}) {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeImg, setActiveImg] = useState(0);
  const project = t.cases.projects[index];
  const images = config.images;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-bg-secondary border border-white/5 hover:border-accent/20 transition-all duration-500">
        {/* Image area */}
        <div
          className="relative aspect-[16/9] overflow-hidden cursor-pointer"
          onClick={() => onImageClick(images, activeImg)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeImg]}
                alt={`${project.title} — ${activeImg + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 1200px"
                quality={80}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-bg-secondary/0 group-hover:bg-bg-secondary/20 transition-all duration-500" />

          {/* Thumbnail strip at bottom */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-1.5 justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                    className={`relative w-10 h-7 overflow-hidden border transition-all duration-300 ${
                      i === activeImg ? "border-accent scale-110" : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="40px" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Counter badge */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 font-mono text-[10px] text-white/40 bg-bg-secondary/50 backdrop-blur-sm px-2 py-1">
              {activeImg + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-text-secondary group-hover:text-accent transition-colors duration-300">
                {project.title}
              </h3>
              <p className="font-mono text-xs text-text-secondary/30 mt-1">
                {project.type[lang]}
              </p>
            </div>
          </div>
          <p className="text-text-secondary/50 text-sm leading-relaxed mb-5">
            {project.description[lang]}
          </p>
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/10 text-text-secondary/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Grid Layout (for mixed orientations: Sabai, Boteco) ─────────────
function GridCard({
  index,
  config,
  onImageClick,
}: {
  index: number;
  config: ProjectConfig;
  onImageClick: (images: string[], startIndex: number) => void;
}) {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const project = t.cases.projects[index];
  const images = config.images;
  const heroImg = images[0];
  const gridImages = images.slice(1);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-bg-secondary border border-white/5 hover:border-accent/20 transition-all duration-500">
        {/* Hero image */}
        <div
          className="relative aspect-[2/1] overflow-hidden cursor-pointer"
          onClick={() => onImageClick(images, 0)}
        >
          <Image
            src={heroImg}
            alt={`${project.title}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 1200px"
            quality={80}
          />
          <div className="absolute inset-0 bg-bg-secondary/0 group-hover:bg-bg-secondary/15 transition-all duration-500" />
        </div>

        {/* Grid of secondary images */}
        {gridImages.length > 0 && (
          <div className={`grid gap-1 p-1 pt-0 ${
            gridImages.length >= 3 ? "grid-cols-3" : gridImages.length === 2 ? "grid-cols-2" : "grid-cols-1"
          }`}>
            {gridImages.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[3/4] overflow-hidden cursor-pointer group/thumb"
                onClick={() => onImageClick(images, i + 1)}
              >
                <Image
                  src={img}
                  alt={`${project.title} — ${i + 2}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                  sizes="(max-width: 768px) 33vw, 400px"
                  quality={75}
                />
                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-all duration-300" />
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="p-6 md:p-8">
          <div className="mb-3">
            <h3 className="font-display text-xl md:text-2xl font-bold text-text-secondary group-hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>
            <p className="font-mono text-xs text-text-secondary/30 mt-1">
              {project.type[lang]}
            </p>
          </div>
          <p className="text-text-secondary/50 text-sm leading-relaxed mb-5">
            {project.description[lang]}
          </p>
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/10 text-text-secondary/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Split Layout (image + text side by side: Vodka, FFS) ────────────
function SplitCard({
  index,
  config,
  onImageClick,
}: {
  index: number;
  config: ProjectConfig;
  onImageClick: (images: string[], startIndex: number) => void;
}) {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const project = t.cases.projects[index];
  const images = config.images;
  const coverImg = images[config.coverIndex];
  const secondaryImg = images.length > 1 ? images[config.coverIndex === 0 ? 1 : 0] : null;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-bg-secondary border border-white/5 hover:border-accent/20 transition-all duration-500">
        <div className="grid md:grid-cols-2">
          {/* Image side */}
          <div
            className="relative aspect-square md:aspect-auto md:min-h-[400px] overflow-hidden cursor-pointer bg-black/30"
            onClick={() => onImageClick(images, config.coverIndex)}
          >
            <Image
              src={coverImg}
              alt={project.title}
              fill
              className="object-contain p-4 md:p-8 transition-transform duration-700 group-hover:scale-[1.05]"
              sizes="(max-width: 768px) 100vw, 600px"
              quality={85}
            />
          </div>

          {/* Text side */}
          <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
            <span className="font-mono text-xs text-accent uppercase tracking-[0.3em] mb-4 block">
              0{index + 1}
            </span>
            <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-text-secondary group-hover:text-accent transition-colors duration-300 mb-4">
              {project.title}
            </h3>
            <p className="font-mono text-xs text-text-secondary/30 mb-6">
              {project.type[lang]}
            </p>
            <p className="text-text-secondary/50 text-sm leading-relaxed mb-8">
              {project.description[lang]}
            </p>

            {/* Secondary image thumbnail */}
            {secondaryImg && (
              <div
                className="relative w-full aspect-[16/9] overflow-hidden mb-8 cursor-pointer group/sec"
                onClick={() => onImageClick(images, config.coverIndex === 0 ? 1 : 0)}
              >
                <Image
                  src={secondaryImg}
                  alt={`${project.title} — detail`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/sec:scale-105"
                  sizes="(max-width: 768px) 100vw, 500px"
                  quality={75}
                />
                <div className="absolute inset-0 bg-black/0 group-hover/sec:bg-black/20 transition-all duration-300" />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {config.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/10 text-text-secondary/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── LiveDemo Layout (auto-cycling frames, pause-on-hover, live link) ─
const CYCLE_MS = 3500;

function LiveDemoCard({
  index,
  config,
  onImageClick,
}: {
  index: number;
  config: ProjectConfig;
  onImageClick: (images: string[], startIndex: number) => void;
}) {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 for progress bar
  const project = t.cases.projects[index];
  const screens = config.screens ?? [];
  const mobileScreens = config.mobileScreens ?? [];

  // Auto-cycle with progress. Pauses on hover.
  useEffect(() => {
    if (paused || screens.length < 2) return;
    const started = Date.now();
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - started;
      const p = Math.min(1, elapsed / CYCLE_MS);
      setProgress(p);
      if (p >= 1) {
        setActive((a) => (a + 1) % screens.length);
        setProgress(0);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, paused, screens.length]);

  const goTo = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  const currentScreen = screens[active];
  const currentMobile = mobileScreens[active] ?? mobileScreens[0];
  const displayUrl = config.liveUrl?.replace(/^https?:\/\//, "") ?? "localhost:3000";

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden bg-bg-secondary border border-white/5 hover:border-accent/20 transition-all duration-500">
        {/* Browser + mobile stage */}
        <div className="relative p-4 md:p-8 lg:p-10 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex gap-6 items-start">
            {/* Desktop frame */}
            <div className="flex-1 min-w-0">
              {/* Browser chrome */}
              <div className="bg-[#2a2a2a] rounded-t-lg px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 bg-[#1a1a1a] rounded-md px-3 py-1 flex items-center gap-2">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/20 flex-shrink-0">
                    <path d="M8 1a4.5 4.5 0 00-4.5 4.5V7H2.5A1.5 1.5 0 001 8.5v6A1.5 1.5 0 002.5 16h11a1.5 1.5 0 001.5-1.5v-6A1.5 1.5 0 0013.5 7H12V5.5A4.5 4.5 0 008 1z" fill="currentColor" />
                  </svg>
                  <span className="font-mono text-[10px] text-white/40 truncate">
                    {displayUrl}
                  </span>
                </div>
              </div>
              {/* Screen */}
              <div
                className="relative aspect-[16/10] overflow-hidden bg-white cursor-pointer rounded-b-lg shadow-2xl"
                onClick={() => onImageClick(config.images, active)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    {currentScreen && (
                      <Image
                        src={currentScreen.src}
                        alt={`${project.title} — ${currentScreen.label[lang]}`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 900px"
                        quality={88}
                        priority={active === 0}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                {/* Live pulse corner */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="relative flex w-2 h-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/80">
                    {t.cases.liveBadge[lang]}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile frame cycling in sync */}
            {mobileScreens.length > 0 && (
              <div
                className="hidden md:block flex-shrink-0 w-[140px] lg:w-[180px] cursor-pointer"
                onClick={() => onImageClick(mobileScreens, active % mobileScreens.length)}
              >
                <div className="bg-[#2a2a2a] rounded-[22px] p-1.5 shadow-2xl">
                  <div className="relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#2a2a2a] rounded-b-xl z-10" />
                    <div className="relative aspect-[9/19.5] overflow-hidden rounded-[18px] bg-white">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0"
                        >
                          {currentMobile && (
                            <Image
                              src={currentMobile}
                              alt={`${project.title} — mobile`}
                              fill
                              className="object-cover object-top"
                              sizes="180px"
                              quality={82}
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs + progress + live link */}
          <div className="mt-5">
            {/* Progress bar */}
            <div className="h-[2px] bg-white/5 mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {screens.map((screen, i) => (
                <button
                  key={screen.src}
                  onClick={() => goTo(i)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                    active === i
                      ? "bg-accent text-bg-secondary"
                      : "border border-white/10 text-text-secondary/40 hover:border-accent/30 hover:text-accent"
                  }`}
                >
                  {screen.label[lang]}
                </button>
              ))}
              {config.liveUrl && (
                <a
                  href={config.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 border border-accent/40 text-accent font-mono text-[10px] uppercase tracking-wider hover:bg-accent hover:text-bg-secondary transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                  </span>
                  {t.cases.openLive[lang]}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 md:p-8 border-t border-white/5">
          <div className="mb-3">
            <h3 className="font-display text-xl md:text-2xl font-bold text-text-secondary group-hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>
            <p className="font-mono text-xs text-text-secondary/30 mt-1">
              {project.type[lang]}
            </p>
          </div>
          <p className="text-text-secondary/50 text-sm leading-relaxed mb-5">
            {project.description[lang]}
          </p>
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/10 text-text-secondary/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Showcase Layout (browser + mobile mockups: Boteco, Sabai) ───────
function ShowcaseCard({
  index,
  config,
  onImageClick,
}: {
  index: number;
  config: ProjectConfig;
  onImageClick: (images: string[], startIndex: number) => void;
}) {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeScreen, setActiveScreen] = useState(0);
  const project = t.cases.projects[index];
  const images = config.images;
  // Separate desktop and mobile images
  const desktopImages = images.filter((_, i) => i !== 2); // all except mobile
  const mobileImage = images[2]; // mobile screenshot

  const screens = [
    { label: "Home", idx: 0 },
    { label: "Dashboard", idx: 1 },
    { label: "Full Page", idx: 3 },
  ];

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-bg-secondary border border-white/5 hover:border-accent/20 transition-all duration-500">
        {/* Browser mockup + mobile */}
        <div className="relative p-4 md:p-8 lg:p-10 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex gap-6 items-start">
            {/* Desktop browser frame */}
            <div className="flex-1 min-w-0">
              {/* Browser chrome */}
              <div className="bg-[#2a2a2a] rounded-t-lg px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 bg-[#1a1a1a] rounded-md px-3 py-1 flex items-center gap-2">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-white/20 flex-shrink-0">
                    <path d="M8 1a4.5 4.5 0 00-4.5 4.5V7H2.5A1.5 1.5 0 001 8.5v6A1.5 1.5 0 002.5 16h11a1.5 1.5 0 001.5-1.5v-6A1.5 1.5 0 0013.5 7H12V5.5A4.5 4.5 0 008 1z" fill="currentColor" />
                  </svg>
                  <span className="font-mono text-[10px] text-white/30 truncate">
                    {config.liveUrl?.replace("https://", "") || "localhost:3000"}
                  </span>
                </div>
              </div>
              {/* Screen */}
              <div
                className="relative aspect-[16/10] overflow-hidden bg-white cursor-pointer rounded-b-lg"
                onClick={() => onImageClick(images, activeScreen === 2 ? 3 : activeScreen)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScreen}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={desktopImages[activeScreen]}
                      alt={`${project.title} — ${screens[activeScreen]?.label || ""}`}
                      fill
                      className={`${activeScreen === 2 ? "object-cover object-top" : "object-cover"} transition-transform duration-700 group-hover:scale-[1.01]`}
                      sizes="(max-width: 768px) 100vw, 900px"
                      quality={85}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile frame */}
            {mobileImage && (
              <div
                className="hidden md:block flex-shrink-0 w-[140px] lg:w-[180px] cursor-pointer"
                onClick={() => onImageClick(images, 2)}
              >
                {/* Phone frame */}
                <div className="bg-[#2a2a2a] rounded-[20px] p-1.5 shadow-2xl">
                  {/* Notch */}
                  <div className="relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#2a2a2a] rounded-b-xl z-10" />
                    <div className="relative aspect-[9/19.5] overflow-hidden rounded-[14px] bg-white">
                      <Image
                        src={mobileImage}
                        alt={`${project.title} — mobile`}
                        fill
                        className="object-cover object-top"
                        sizes="180px"
                        quality={80}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Screen switcher tabs */}
          <div className="flex items-center gap-2 mt-4">
            {screens.map((screen, i) => (
              <button
                key={screen.label}
                onClick={() => setActiveScreen(i)}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-300 ${
                  activeScreen === i
                    ? "bg-accent text-bg-secondary"
                    : "border border-white/10 text-text-secondary/40 hover:border-accent/30 hover:text-accent"
                }`}
              >
                {screen.label}
              </button>
            ))}

            {/* Live link */}
            {config.liveUrl && (
              <a
                href={config.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 border border-accent/30 text-accent font-mono text-[10px] uppercase tracking-wider hover:bg-accent hover:text-bg-secondary transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </a>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-6 md:p-8 border-t border-white/5">
          <div className="mb-3">
            <h3 className="font-display text-xl md:text-2xl font-bold text-text-secondary group-hover:text-accent transition-colors duration-300">
              {project.title}
            </h3>
            <p className="font-mono text-xs text-text-secondary/30 mt-1">
              {project.type[lang]}
            </p>
          </div>
          <p className="text-text-secondary/50 text-sm leading-relaxed mb-5">
            {project.description[lang]}
          </p>
          <div className="flex flex-wrap gap-2">
            {config.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/10 text-text-secondary/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Text-Hero Layout (minimal imagery: Viralata, Caramelo) ──────────
function TextHeroCard({
  index,
  config,
}: {
  index: number;
  config: ProjectConfig;
}) {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const project = t.cases.projects[index];
  const hasImage = config.images.length > 0;
  const accentColor = config.accent || "#FF4D00";

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden border border-white/5 hover:border-accent/20 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${accentColor}15 0%, #1A1A1A 50%, ${accentColor}08 100%)`,
        }}
      >
        <div className="relative p-8 md:p-12 lg:p-16">
          {/* Decorative large text in background */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none select-none">
            <span
              className="font-display text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold leading-none opacity-[0.03] tracking-tighter"
              style={{ color: accentColor }}
            >
              {project.title.split(" ")[0]}
            </span>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 md:gap-12">
            {/* Icon/image if available */}
            {hasImage && (
              <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 relative">
                <Image
                  src={config.images[0]}
                  alt={project.title}
                  fill
                  className="object-contain"
                  sizes="112px"
                />
              </div>
            )}

            <div className="flex-1">
              <span className="font-mono text-xs uppercase tracking-[0.3em] mb-4 block" style={{ color: accentColor }}>
                {project.type[lang]}
              </span>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text-secondary group-hover:text-accent transition-colors duration-300 mb-6">
                {project.title}
              </h3>
              <p className="text-text-secondary/50 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                {project.description[lang]}
              </p>
              <div className="flex flex-wrap gap-2">
                {config.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border text-text-secondary/40"
                    style={{ borderColor: `${accentColor}30` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Filter Pills ────────────────────────────────────────────────────
type Filter = "all" | Category;

function FilterPills({
  value,
  onChange,
  counts,
}: {
  value: Filter;
  onChange: (f: Filter) => void;
  counts: Record<Filter, number>;
}) {
  const { lang, t } = useI18n();
  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t.cases.filterAll[lang] },
    { key: "brand", label: t.cases.filterBrand[lang] },
    { key: "product", label: t.cases.filterProduct[lang] },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-10 md:mb-14">
      {filters.map((f) => {
        const active = value === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`relative px-4 md:px-5 py-2 md:py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
              active
                ? "bg-accent text-bg-secondary border border-accent"
                : "border border-white/10 text-text-secondary/40 hover:border-accent/40 hover:text-accent"
            }`}
          >
            <span>{f.label}</span>
            <span className={`ml-2 text-[9px] ${active ? "text-bg-secondary/60" : "text-text-secondary/30"}`}>
              {counts[f.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Cases Section ──────────────────────────────────────────────
// Each project card is assigned a slot: "wide" (full width) or "half" (2-col).
// Text-hero cards pair up; split cards pair up; gallery/grid/livedemo are wide.
type Slot = "wide" | "half";

function slotFor(cfg: ProjectConfig): Slot {
  if (cfg.layout === "split" || cfg.layout === "text-hero") return "half";
  return "wide";
}

export default function Cases() {
  const { lang, t } = useI18n();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const openLightbox = useCallback((images: string[], startIndex: number) => {
    setLightbox({ images, index: startIndex });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const renderCard = (cfgIndex: number) => {
    const config = projectConfigs[cfgIndex];
    switch (config.layout) {
      case "gallery":
        return <GalleryCard key={cfgIndex} index={cfgIndex} config={config} onImageClick={openLightbox} />;
      case "grid":
        return <GridCard key={cfgIndex} index={cfgIndex} config={config} onImageClick={openLightbox} />;
      case "split":
        return <SplitCard key={cfgIndex} index={cfgIndex} config={config} onImageClick={openLightbox} />;
      case "showcase":
        return <ShowcaseCard key={cfgIndex} index={cfgIndex} config={config} onImageClick={openLightbox} />;
      case "livedemo":
        return <LiveDemoCard key={cfgIndex} index={cfgIndex} config={config} onImageClick={openLightbox} />;
      case "text-hero":
        return <TextHeroCard key={cfgIndex} index={cfgIndex} config={config} />;
    }
  };

  // Project display order — curated for visual rhythm.
  // brands first, then live demos paired at the end for maximum impact.
  const displayOrder = [0, 1, 2, 3, 4, 6, 5];

  const counts: Record<Filter, number> = {
    all: projectConfigs.length,
    brand: projectConfigs.filter((c) => c.category === "brand").length,
    product: projectConfigs.filter((c) => c.category === "product").length,
  };

  const visibleIndexes = displayOrder.filter((i) => {
    if (filter === "all") return true;
    return projectConfigs[i].category === filter;
  });

  // Group consecutive "half" slots into pairs to render a 2-col grid.
  type Group = { kind: "wide"; idx: number } | { kind: "pair"; idxs: number[] };
  const groups: Group[] = [];
  let pairBuffer: number[] = [];
  const flushPair = () => {
    if (pairBuffer.length === 0) return;
    groups.push({ kind: "pair", idxs: pairBuffer });
    pairBuffer = [];
  };
  for (const i of visibleIndexes) {
    const slot = slotFor(projectConfigs[i]);
    if (slot === "half") {
      pairBuffer.push(i);
      if (pairBuffer.length === 2) flushPair();
    } else {
      flushPair();
      groups.push({ kind: "wide", idx: i });
    }
  }
  flushPair();

  return (
    <section id="work" ref={ref} className="bg-bg-secondary py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary/30 mb-4 block">
            {t.cases.label[lang]}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-secondary">
            {t.cases.heading[lang]}
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-4 text-text-secondary/30 max-w-lg font-body">
            {t.cases.subtitle[lang]}
          </p>
        </motion.div>

        <FilterPills value={filter} onChange={setFilter} counts={counts} />

        {/* Filtered project list with animated transitions */}
        <motion.div
          layout
          className="space-y-6 md:space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {groups.map((g, gi) => (
              <motion.div
                key={g.kind === "wide" ? `w-${g.idx}` : `p-${g.idxs.join("-")}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, delay: gi * 0.04 }}
                className={g.kind === "pair" ? "grid md:grid-cols-2 gap-6 md:gap-8" : ""}
              >
                {g.kind === "wide" ? renderCard(g.idx) : g.idxs.map((i) => renderCard(i))}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.index}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
