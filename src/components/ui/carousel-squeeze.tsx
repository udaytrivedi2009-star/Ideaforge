"use client";

import React, { useState } from "react";
import { type LucideIcon } from "lucide-react";

export interface CarouselSqueezeItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  badge?: string;
}

export interface CarouselSqueezeProps {
  items: CarouselSqueezeItem[];
  className?: string;
}

export function CarouselSqueeze({ items, className = "" }: CarouselSqueezeProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className={`relative w-full max-w-7xl mx-auto py-10 px-4 select-none ${className}`}>
      {/* Top Ambient Glow Node */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_25px_8px_rgba(255,255,255,0.9)] opacity-90 pointer-events-none animate-pulse" />

      {/* 8-Card Squeeze Grid (2 Rows x 4 Columns matching reference design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 relative z-10">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;

          // Compute Squeeze Dynamics: Hovered card pops up & expands; others compress/squeeze
          let squeezeTransform = "scale-100 opacity-100 translate-y-0";
          if (isHovered) {
            squeezeTransform = "scale-[1.045] -translate-y-2 opacity-100 z-30 shadow-[0_25px_60px_rgba(0,0,0,0.4)]";
          } else if (isAnyHovered) {
            squeezeTransform = "scale-[0.97] opacity-75 translate-y-0 z-10";
          }

          return (
            <div
              key={item.title}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`relative rounded-[28px] p-7 md:p-8 transition-all duration-500 cubic-bezier(0.16,1,0.3,1) cursor-pointer overflow-hidden backdrop-blur-2xl flex flex-col justify-between min-h-[260px] md:min-h-[280px] border ${squeezeTransform}`}
              style={{
                background: isHovered
                  ? "radial-gradient(circle at 30% 0%, rgba(255, 255, 255, 0.22), transparent 70%), linear-gradient(135deg, rgba(37, 99, 235, 0.55), rgba(15, 23, 42, 0.65))"
                  : "linear-gradient(135deg, rgba(30, 90, 170, 0.38), rgba(15, 35, 70, 0.45))",
                borderColor: isHovered ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.15)",
                boxShadow: isHovered
                  ? "0 20px 50px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)"
                  : "0 10px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
              }}
            >
              {/* Top Row: Icon */}
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300 ${
                      isHovered
                        ? "bg-white/20 text-white border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        : "bg-white/10 text-white/80 border border-white/10"
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Card Title (Large Bold Unbounded / Sans font matching reference) */}
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight leading-tight">
                  {item.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm leading-relaxed text-white/70 font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Center Pill Control (Matching exact bottom pill in reference image) */}
      <div className="flex items-center justify-center mt-10">
        <div className="w-14 h-1.5 rounded-full bg-slate-900/80 border border-white/20 shadow-md transition-all duration-300 hover:w-20 hover:bg-sky-400/80 cursor-pointer" />
      </div>
    </div>
  );
}

export default CarouselSqueeze;
