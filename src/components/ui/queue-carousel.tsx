"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle2, type LucideIcon } from "lucide-react";

export interface QueueCarouselItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  desc: string;
  details: string[];
  badge: string;
  metrics: string;
}

export interface QueueCarouselProps {
  items: QueueCarouselItem[];
  className?: string;
}

export function QueueCarousel({ items, className = "" }: QueueCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  // Autoplay functionality: Automatically advances cards every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  // Scroll active card into view horizontally within the track container ONLY (does NOT scroll the window page)
  useEffect(() => {
    if (trackRef.current) {
      const activeCard = trackRef.current.children[activeIndex] as HTMLElement;
      if (activeCard) {
        const track = trackRef.current;
        const cardLeft = activeCard.offsetLeft;
        track.scrollTo({
          left: cardLeft - 32,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  return (
    <div
      className={`relative w-full max-w-7xl mx-auto py-2 select-none overflow-visible ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Queue Navigation Header */}
      <div className="flex items-center justify-between mb-6 px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
            Validation Queue ({activeIndex + 1} / {items.length}) • {isPaused ? "Paused" : "Auto-Playing"}
          </span>
        </div>

        {/* Navigation Arrow Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-3.5 rounded-2xl border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:scale-105 active:scale-95 bg-white shadow-md transition-all duration-300"
            aria-label="Previous Ticket"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            className="p-3.5 rounded-2xl border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:scale-105 active:scale-95 bg-white shadow-md transition-all duration-300"
            aria-label="Next Ticket"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* 2. Single Line Queue Track (Movie Ticket Window Line Effect) */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto pt-10 pb-16 px-8 sm:px-12 scrollbar-none no-scrollbar scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = idx === activeIndex;
          const distance = idx - activeIndex;

          // Queue Squeeze Dynamics: Front person (active) is focused & expanded with White background; people behind shrink & compress
          let queueStyle = "scale-90 opacity-40 translate-y-0";
          if (isActive) {
            queueStyle = "scale-100 opacity-100 translate-y-0 z-30 shadow-[0_30px_90px_rgba(0,0,0,0.35)] border-blue-300";
          } else if (distance === 1) {
            queueStyle = "scale-95 opacity-80 translate-y-0 z-20 hover:opacity-100 border-white/20";
          } else if (distance === 2) {
            queueStyle = "scale-90 opacity-60 translate-y-0 z-10 border-white/10";
          } else if (distance < 0) {
            queueStyle = "scale-90 opacity-45 translate-y-0 border-white/10";
          }

          return (
            <div
              key={item.title}
              onClick={() => setActiveIndex(idx)}
              className={`snap-start shrink-0 w-[340px] sm:w-[400px] md:w-[460px] rounded-[32px] p-8 cursor-pointer transition-all duration-500 cubic-bezier(0.16,1,0.3,1) select-none relative overflow-hidden backdrop-blur-2xl flex flex-col justify-between border ${queueStyle}`}
              style={{
                background: isActive
                  ? "radial-gradient(circle at 100% 0%, rgba(219,234,254,0.7), #ffffff)"
                  : "linear-gradient(145deg, #1e40af, #2563eb)",
              }}
            >
              {/* Queue Ticket Number Watermark */}
              <div
                className={`absolute top-4 right-6 text-7xl font-black font-mono pointer-events-none ${
                  isActive ? "text-blue-900/10" : "text-white/10"
                }`}
              >
                #0{idx + 1}
              </div>

              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                        : "bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    <Icon size={26} />
                  </div>

                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${
                      isActive
                        ? "bg-blue-100/90 text-blue-700 border-blue-200 shadow-sm"
                        : "bg-white/15 text-white border-white/25"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Card Title & Subtitle */}
                <h3
                  className={`text-3xl font-black tracking-tight mb-1 transition-colors ${
                    isActive ? "text-[#06172d]" : "text-white"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs font-bold uppercase tracking-widest mb-4 transition-colors ${
                    isActive ? "text-blue-600" : "text-blue-200"
                  }`}
                >
                  {item.subtitle}
                </p>

                {/* Core Description */}
                <p
                  className={`text-sm leading-relaxed font-medium mb-6 transition-colors ${
                    isActive ? "text-slate-700" : "text-blue-100/85"
                  }`}
                >
                  {item.desc}
                </p>

                {/* Rich Contextual Details List */}
                <div
                  className={`space-y-2.5 mb-6 pt-4 border-t ${
                    isActive ? "border-slate-200" : "border-white/15"
                  }`}
                >
                  {item.details.map((detail, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2.5 text-xs font-semibold ${
                        isActive ? "text-slate-700" : "text-blue-100"
                      }`}
                    >
                      <CheckCircle2
                        size={15}
                        className={`shrink-0 mt-0.5 ${isActive ? "text-blue-600" : "text-blue-200"}`}
                      />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div
                className={`pt-4 border-t flex items-center justify-between text-xs ${
                  isActive ? "border-slate-200" : "border-white/15"
                }`}
              >
                <span
                  className={`font-bold uppercase tracking-wider ${
                    isActive ? "text-slate-400" : "text-blue-200"
                  }`}
                >
                  Signal Metric
                </span>
                <span
                  className={`font-mono font-bold flex items-center gap-1.5 ${
                    isActive ? "text-blue-600" : "text-white"
                  }`}
                >
                  <Sparkles size={13} className={isActive ? "text-blue-500" : "text-blue-200"} />{" "}
                  {item.metrics}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Ticket Line Progress Bar */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx === activeIndex
                ? "w-10 bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                : "w-2 bg-blue-200 hover:bg-blue-400"
            }`}
            aria-label={`Jump to ticket ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default QueueCarousel;
