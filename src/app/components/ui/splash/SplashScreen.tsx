import { useState, useEffect } from "react";
import GatewayFlow from "@/components/ui/gateway-flow";
import { Zap, Sparkles, Activity, ShieldCheck } from "lucide-react";

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  // textVisible controls when IDEAFORGE text emerges from the center of the splash screen
  const [textVisible, setTextVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress counter for first 1.2 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    // 1. At 0.8 seconds: IDEAFORGE text smoothly emerges from center
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 800);

    // 2. IDEAFORGE text displays for 2 seconds (0.8s -> 2.8s), then starts fading out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2800);

    // 3. Complete splash screen and transition to main app (at 3.4 seconds)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3400);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white text-slate-900 select-none overflow-hidden transition-all duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* 1. GatewayFlow Canvas Background (White Background with Vibrant Blue Dots) */}
      <div className="absolute inset-0 z-0">
        <GatewayFlow className="w-full h-full" mode="light" speed={1.2} />
      </div>

      {/* 2. Top Telemetry Bar */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between text-xs font-mono tracking-widest pointer-events-none max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-blue-200 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
          <span className="text-slate-900 font-bold tracking-wider">
            IDEAFORGE.AI
          </span>
          <span
            className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-300"
          >
            V4.2 CORE
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-blue-200 shadow-md">
          <div className="flex items-center gap-2">
            <Activity size={13} className="animate-pulse text-blue-600" />
            <span className="text-slate-700 font-semibold">NEURAL CORE</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span className="text-slate-700 font-semibold">{progress < 100 ? `${progress}%` : "READY"}</span>
          </div>
        </div>
      </div>

      {/* 3. Center IDEAFORGE Text Emergence (Emerges smoothly from center over white/blue animation) */}
      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 pointer-events-none">
        <div
          className={`flex flex-col items-center text-center transition-all duration-700 ease-out transform ${
            textVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-75 translate-y-6 pointer-events-none"
          }`}
        >
          {/* Glowing Blue Emblem Icon */}
          <div className="relative mb-6">
            <div
              className="absolute -inset-6 rounded-full blur-2xl opacity-60 animate-pulse bg-blue-400"
            />
            <div
              className="relative w-24 h-24 rounded-3xl p-[2px] backdrop-blur-xl shadow-[0_10px_40px_rgba(37,99,235,0.35)] border border-blue-200 bg-gradient-to-br from-blue-500 via-sky-400 to-blue-700"
            >
              <div
                className="w-full h-full rounded-[22px] bg-white flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/40 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
                <Zap size={48} className="text-blue-600 relative z-10 drop-shadow-[0_0_12px_rgba(37,99,235,0.5)]" />
              </div>
            </div>
          </div>

          {/* IDEAFORGE Text (Emerges from center in Vibrant Light/Electric Blue) */}
          <h1
            className="text-6xl sm:text-8xl font-black tracking-tight mb-3 uppercase text-center bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(56,189,248,0.4)]"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            IDEAFORGE
          </h1>

          {/* Subtitle Tagline */}
          <p
            className="text-sm sm:text-base font-bold tracking-wider max-w-md mb-6 uppercase text-sky-700"
          >
            AI Startup Exploration & Multi-Agent Engine
          </p>

          {/* Feature Pill Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md text-xs font-bold border shadow-md bg-blue-50/90 border-blue-200 text-blue-700"
          >
            <Sparkles size={14} className="animate-spin text-blue-600" style={{ animationDuration: "3s" }} />
            <span>SYSTEM IGNITION COMPLETE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
