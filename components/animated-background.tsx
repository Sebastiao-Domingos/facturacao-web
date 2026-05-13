// src/components/animated-background.tsx
"use client";
import { motion } from "framer-motion";

export const AnimatedBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
    {/* Grid de pontos de alta precisão */}
    <div
      className="absolute inset-0 opacity-[0.3] dark:opacity-[0.15]"
      style={{
        backgroundImage: `radial-gradient(var(--primary) 0.5px, transparent 0.5px)`,
        backgroundSize: "32px 32px",
      }}
    />
    {/* Orbes de luz orgânicas */}
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        x: [-50, 50, -50],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-10%] h-150 w-150 rounded-full bg-primary/20 blur-[120px]"
    />
    <motion.div
      animate={{
        scale: [1.2, 1, 1.2],
        x: [50, -50, 50],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-[-10%] right-[-10%] h-150 w-150 rounded-full bg-violet-600/20 blur-[120px]"
    />
  </div>
);
