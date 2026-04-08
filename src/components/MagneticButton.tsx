"use client";

import { useRef, useState, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  as = "button",
  href,
  target,
  rel,
  onClick,
  type = "button",
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setTransform({ x, y });
  };

  const handleLeave = () => setTransform({ x: 0, y: 0 });

  const style = {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    transition: transform.x === 0 ? "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)" : "transform 0.15s ease-out",
  };

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      type={as === "button" ? type : undefined}
    >
      {children}
    </Tag>
  );
}
