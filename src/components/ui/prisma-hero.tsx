import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Gauge,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

interface PrismaHeroProps {
  onValidateClick?: () => void;
}

/* ─── Animated counter hook ────────────────────────────────────────── */
function useCounter(target: number, duration = 1600, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const begin = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - begin) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

/* ─── Individual orbiting node ──────────────────────────────────────── */
interface NodeProps {
  label: string;
  Icon: React.ElementType;
  metricLabel: string;
  metricValue: string;
  metricColor: string;
  posClass: string;
  delay: string;
  dx: string;
  dy: string;
  tilt: string;
  glowColor: string;
  iconBg: string;
}

function ValidationNode({
  label,
  Icon,
  metricLabel,
  metricValue,
  metricColor,
  posClass,
  delay,
  dx,
  dy,
  tilt,
  glowColor,
  iconBg,
}: NodeProps) {
  return (
    <div className={`absolute ${posClass} group/node`}>
      <div
        className="hero-validation-node relative flex h-28 w-28 flex-col items-center justify-center gap-1 overflow-visible rounded-2xl"
        style={
          {
            "--dx": dx,
            "--dy": dy,
            "--tilt": tilt,
            animation:
              "heroNodeFloat 10s cubic-bezier(.45,0,.2,1) infinite, heroNodeGlow 6s ease-in-out infinite",
            animationDelay: delay,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(18px)",
            border: "1.5px solid rgba(37,99,235,0.18)",
            boxShadow: `0 12px 48px ${glowColor}, 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)`,
          } as React.CSSProperties
        }
      >
        {/* sweep shimmer */}
        <div
          className="hero-node-sweep pointer-events-none absolute inset-y-0 w-8 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent blur-sm"
          style={{
            animation: "heroSignalSweep 5.2s ease-in-out infinite",
            animationDelay: delay,
          }}
        />
        {/* orbit ring */}
        <div
          className="hero-node-orbit pointer-events-none absolute -inset-3 rounded-full border border-dashed opacity-40"
          style={{
            borderColor: metricColor,
            animation: "heroNodeOrbit 22s linear infinite",
            animationDelay: delay,
          }}
        />
        {/* icon */}
        <div
          className="relative z-10 grid h-12 w-12 place-items-center rounded-xl shadow-md"
          style={{ background: iconBg }}
        >
          <Icon size={22} className="text-white" />
        </div>
        {/* label */}
        <span
          className="relative z-10 text-[11px] font-black uppercase tracking-widest"
          style={{ color: "#1e40af" }}
        >
          {label}
        </span>
        {/* tooltip card that appears on hover */}
        <div
          className="pointer-events-none absolute -top-16 left-1/2 z-30 -translate-x-1/2 scale-90 rounded-xl border border-blue-100 bg-white px-3 py-2 text-center opacity-0 shadow-xl transition-all duration-300 group-hover/node:scale-100 group-hover/node:opacity-100"
          style={{ minWidth: 120 }}
        >
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-400">
            {metricLabel}
          </div>
          <div
            className="mt-0.5 text-sm font-black"
            style={{ color: "#1e40af" }}
          >
            {metricValue}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Connection line between center and a node ─────────────────────── */
function ConnectionLine({
  angle,
  length = 160,
  delay = "0s",
}: {
  angle: number;
  length?: number;
  delay?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 origin-left"
      style={{
        width: length,
        height: 1,
        transform: `rotate(${angle}deg)`,
        background:
          "linear-gradient(90deg, rgba(37,99,235,0.35) 0%, transparent 100%)",
        animation: "connectionPulse 3s ease-in-out infinite",
        animationDelay: delay,
        marginTop: -0.5,
      }}
    />
  );
}

/* ─── Floating metric badge ─────────────────────────────────────────── */
function FloatingBadge({
  icon: Icon,
  label,
  value,
  color,
  posClass,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  posClass: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute ${posClass} hidden sm:flex items-center gap-2 rounded-xl border border-blue-100/80 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md`}
      style={{
        animation: "heroNodeFloat 8s ease-in-out infinite",
        animationDelay: delay,
      }}
    >
      <div
        className="grid h-7 w-7 place-items-center rounded-lg"
        style={{ background: color }}
      >
        <Icon size={14} className="text-white" />
      </div>
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-blue-400">
          {label}
        </div>
        <div className="text-xs font-black text-blue-900">{value}</div>
      </div>
    </div>
  );
}

/* ─── Main Hero ─────────────────────────────────────────────────────── */
export default function PrismaHero({ onValidateClick }: PrismaHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  /* parallax glow follows mouse */
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const nodes: NodeProps[] = [
    {
      label: "TAM",
      Icon: BarChart3,
      metricLabel: "Total Market",
      metricValue: "$2.4B",
      metricColor: "#3b82f6",
      posClass: "left-[6%] top-[28%]",
      delay: "0s",
      dx: "22px",
      dy: "-18px",
      tilt: "6deg",
      glowColor: "rgba(59,130,246,0.18)",
      iconBg: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
    },
    {
      label: "ICP",
      Icon: Users,
      metricLabel: "Ideal Profile",
      metricValue: "B2B SaaS",
      metricColor: "#6366f1",
      posClass: "right-[6%] top-[28%]",
      delay: "-2.5s",
      dx: "-22px",
      dy: "18px",
      tilt: "-6deg",
      glowColor: "rgba(99,102,241,0.18)",
      iconBg: "linear-gradient(135deg,#4f46e5,#818cf8)",
    },
    {
      label: "Risk",
      Icon: ShieldAlert,
      metricLabel: "Risk Score",
      metricValue: "Low 18%",
      metricColor: "#f97316",
      posClass: "left-[8%] bottom-[22%]",
      delay: "-5s",
      dx: "28px",
      dy: "16px",
      tilt: "-7deg",
      glowColor: "rgba(249,115,22,0.15)",
      iconBg: "linear-gradient(135deg,#ea580c,#fb923c)",
    },
    {
      label: "Score",
      Icon: Gauge,
      metricLabel: "Viability",
      metricValue: "91/100",
      metricColor: "#10b981",
      posClass: "right-[8%] bottom-[22%]",
      delay: "-7.5s",
      dx: "-26px",
      dy: "-16px",
      tilt: "7deg",
      glowColor: "rgba(16,185,129,0.18)",
      iconBg: "linear-gradient(135deg,#059669,#34d399)",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center lg:px-16 lg:pt-32"
      style={{ background: "#ffffff" }}
    >
      <style>{`
        @keyframes heroNodeFloat {
          0%,100% { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
          25%      { transform: translate3d(calc(var(--dx)*.55), calc(var(--dy)*-.45),0) rotate(calc(var(--tilt)*.55)) scale(1.03); }
          50%      { transform: translate3d(var(--dx), var(--dy),0) rotate(var(--tilt)) scale(.97); }
          75%      { transform: translate3d(calc(var(--dx)*-.35), calc(var(--dy)*.65),0) rotate(calc(var(--tilt)*-.45)) scale(1.04); }
        }
        @keyframes heroNodeGlow {
          0%,100% { box-shadow: 0 12px 48px rgba(59,130,246,.14); }
          50%      { box-shadow: 0 18px 64px rgba(59,130,246,.32); }
        }
        @keyframes heroNodeOrbit { to { transform: rotate(360deg); } }
        @keyframes heroSignalSweep {
          0%       { transform: translateX(-200%) skewX(-12deg); opacity: 0; }
          30%      { opacity: 1; }
          70%,100% { transform: translateX(200%) skewX(-12deg); opacity: 0; }
        }
        @keyframes connectionPulse {
          0%,100% { opacity: .22; }
          50%      { opacity: .55; }
        }
        @keyframes bluePulseRing {
          0%   { transform: translate(-50%,-50%) scale(.7); opacity:.6; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity:0; }
        }
        @keyframes shimmerText {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gridFlow {
          0% { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hero-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 28px 80px rgba(29,78,216,.38), inset 0 1px 0 rgba(255,255,255,.5); }
        .hero-cta-secondary:hover { transform: translateY(-3px); background: rgba(239,246,255,1) !important; }
        @media (prefers-reduced-motion: reduce) {
          .hero-validation-node, .hero-node-orbit, .hero-node-sweep { animation: none !important; }
        }
      `}</style>

      {/* ── Background: white with animated blue grid ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37,99,235,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,.055) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          animation: "gridFlow 12s linear infinite",
        }}
      />
      {/* gradient fade at bottom of grid */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-40 z-0"
        style={{ background: "linear-gradient(to top, #ffffff, transparent)" }}
      />
      {/* gradient fade at top */}
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-32 z-0"
        style={{ background: "linear-gradient(to bottom, #eff6ff, transparent)" }}
      />

      {/* ── Mouse-following glow ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(59,130,246,0.09) 0%, transparent 55%)`,
          transition: "background 0.1s linear",
        }}
      />

      {/* ── Central blue pulse rings ── */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-blue-200"
            style={{
              width: 320 + i * 160,
              height: 320 + i * 160,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              opacity: 0.35 - i * 0.08,
              animation: `bluePulseRing ${3 + i * 1.2}s ease-out infinite`,
              animationDelay: `${i * 1.1}s`,
            }}
          />
        ))}
      </div>

      {/* ── Connection lines from center to nodes ── */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        <ConnectionLine angle={-145} length={180} delay="0s" />
        <ConnectionLine angle={-35} length={180} delay="-1s" />
        <ConnectionLine angle={145} length={180} delay="-2s" />
        <ConnectionLine angle={35} length={180} delay="-3s" />
      </div>

      {/* ── Validation Nodes ── */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        {nodes.map((n) => (
          <ValidationNode key={n.label} {...n} />
        ))}
      </div>

      {/* ── Floating metric badges ── */}
      <FloatingBadge
        icon={TrendingUp}
        label="Market Trend"
        value="+142% YoY"
        color="linear-gradient(135deg,#1d4ed8,#3b82f6)"
        posClass="left-[3%] top-[50%]"
        delay="-1.5s"
      />
      <FloatingBadge
        icon={Zap}
        label="AI Speed"
        value="Under 60s"
        color="linear-gradient(135deg,#7c3aed,#a78bfa)"
        posClass="right-[2%] top-[50%]"
        delay="-3s"
      />

      {/* ── Main content ── */}
      <div
        className="relative z-20 mx-auto max-w-4xl"
        style={{ animation: "fadeUp .9s ease both" }}
      >
        {/* eyebrow badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 shadow-sm">
          <Sparkles size={12} className="text-blue-500" />
          AI-Powered Startup Validation
        </div>

        {/* headline */}
        <h1
          className="text-5xl font-black leading-[1.03] tracking-tight md:text-[5.5rem]"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #2563eb 65%, #3b82f6 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmerText 6s linear infinite",
          }}
        >
          Validate Your
          <br />
          Startup Before
          <br />
          You Build.
        </h1>

        {/* subtitle */}
        <p
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed md:text-lg"
          style={{ color: "#3b5a8a", animation: "fadeUp 1.1s ease both" }}
        >
          Know if your idea is worth pursuing with AI-powered market research,
          competitor analysis, validation scores, and investor-ready
          recommendations.
        </p>

        {/* CTA buttons */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animation: "fadeUp 1.3s ease both" }}
        >
          <button
            id="hero-validate-btn"
            onClick={onValidateClick}
            className="hero-cta-primary group relative inline-flex min-h-14 items-center gap-2.5 overflow-hidden rounded-2xl px-8 text-sm font-bold text-white transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #3b82f6 100%)",
              boxShadow: "0 20px 60px rgba(29,78,216,.32), inset 0 1px 0 rgba(255,255,255,.28)",
            }}
          >
            <span className="relative z-10">Validate Your Startup</span>
            <ArrowRight size={17} className="relative z-10 transition-transform group-hover:translate-x-1" />
            {/* shimmer overlay */}
            <div
              className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-full"
              aria-hidden="true"
            />
          </button>

          <button
            id="hero-how-btn"
            className="hero-cta-secondary group inline-flex min-h-14 items-center gap-2.5 rounded-2xl px-8 text-sm font-bold text-blue-700 transition-all duration-300"
            style={{
              background: "rgba(239,246,255,0.85)",
              border: "1.5px solid rgba(37,99,235,0.22)",
              boxShadow: "0 4px 18px rgba(37,99,235,0.10)",
              backdropFilter: "blur(8px)",
            }}
          >
            See How It Works
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1 text-blue-500" />
          </button>
        </div>


      </div>
    </section>
  );
}