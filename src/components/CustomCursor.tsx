"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setHidden(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onEnter = () => setHidden(false);
    const onLeave = () => setHidden(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    // Detect hover targets
    const addHoverListeners = () => {
      const targets = document.querySelectorAll(
        'a, button, [data-cursor="pointer"], input, textarea, [role="button"]'
      );
      targets.forEach((el) => {
        el.addEventListener("mouseenter", () => setHovering(true));
        el.addEventListener("mouseleave", () => setHovering(false));
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Smooth ring follow
    let raf: number;
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[10000] pointer-events-none will-change-transform"
        style={{ mixBlendMode: "difference" }}
      >
        <div
          className="rounded-full bg-white transition-all duration-200"
          style={{
            width: hovering ? 48 : clicking ? 6 : 10,
            height: hovering ? 48 : clicking ? 6 : 10,
            marginLeft: hovering ? -24 : clicking ? -3 : -5,
            marginTop: hovering ? -24 : clicking ? -3 : -5,
            opacity: hovering ? 0.5 : 1,
          }}
        />
      </div>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{ mixBlendMode: "difference" }}
      >
        <div
          className="rounded-full border border-white/40 transition-all duration-300"
          style={{
            width: hovering ? 0 : 36,
            height: hovering ? 0 : 36,
            marginLeft: hovering ? 0 : -18,
            marginTop: hovering ? 0 : -18,
            opacity: hovering ? 0 : 0.5,
          }}
        />
      </div>
    </>
  );
}
