"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  shape: "square" | "circle" | "rect";
}

const COLORS = [
  "#fbbf24", "#f97316", "#ec4899",
  "#a78bfa", "#60a5fa", "#34d399", "#f43f5e",
];

export default function Confetti({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const p: Particle[] = Array.from({ length: 70 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 9 + 6,
      delay: Math.random() * 0.6,
      duration: Math.random() * 1.5 + 2,
      rotation: Math.random() * 360,
      shape: (["square", "circle", "rect"] as const)[Math.floor(Math.random() * 3)],
    }));

    setParticles(p);
    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-20px",
            width: p.shape === "rect" ? p.size * 2 : p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "rect" ? "2px" : "2px",
            animationName: "confetti-fall",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
