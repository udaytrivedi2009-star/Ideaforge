import { useState, useEffect, useRef } from "react";
import {
  Zap, ArrowRight, Menu, X,
} from "lucide-react";

export type Page =
  | "landing" | "auth" | "dashboard" | "submit" | "analyzing"
  | "results" | "idea-detail" | "profile" | "about" | "not-found";

export const palette = {
  matte: {
    900: "#1D5A9C", 800: "#2367AE", 700: "#2870C0",
    600: "#3A7CC8", 500: "#4C89D0",
  },
  metallic: {
    600: "#1E5FA5", 500: "#2870C0", 400: "#5A96D4",
    300: "#8CBAE5", 200: "#BEDDF2", 100: "#E6F2FB",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255,255,255,0.7)",
    muted: "rgba(255,255,255,0.5)",
    dim: "rgba(255,255,255,0.3)",
    faint: "rgba(255,255,255,0.12)",
  },
};

export const metallicGradient = `linear-gradient(135deg, ${palette.metallic[600]} 0%, ${palette.metallic[400]} 50%, ${palette.metallic[300]} 100%)`;
export const metallicShimmer = `linear-gradient(90deg, ${palette.metallic[500]}88 0%, ${palette.metallic[300]} 50%, ${palette.metallic[500]}88 100%)`;

export const MetallicBtn = ({
  children, onClick, className = "", outline = false,
}: { children: React.ReactNode; onClick?: () => void; className?: string; outline?: boolean }) => (
  <button
    onClick={onClick}
    className={`relative px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 overflow-hidden group ${
      outline
        ? `border text-white/70 hover:text-white hover:bg-white/5`
        : "text-white hover:scale-[1.02] active:scale-[0.98]"
    } ${className}`}
    style={
      !outline
        ? { background: metallicGradient, backgroundSize: "200% 200%" }
        : { borderColor: palette.text.faint }
    }
  >
    {!outline && (
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
        style={{
          background: metallicShimmer,
          transform: "skewX(-20deg)",
        }}
      />
    )}
    {children}
  </button>
);

export const GlassCard = ({
  children,
  className = "",
  glow = false,
  onClick,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setOpacity(1); setIsFocused(true); }}
      onMouseLeave={() => { setOpacity(0); setIsFocused(false); }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${className}`}
      style={{
        background: palette.matte[700],
        borderColor: isFocused ? "transparent" : (glow ? palette.text.muted : palette.text.faint),
        boxShadow: glow ? `0 0 30px ${palette.metallic[500]}22` : "none",
        ...style,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 -m-[1px] rounded-2xl border transition-opacity duration-300"
        style={{
          opacity,
          borderWidth: "1px",
          borderColor: palette.metallic[400],
          maskImage: `radial-gradient(130px circle at ${position.x}px ${position.y}px, black, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(130px circle at ${position.x}px ${position.y}px, black, transparent 100%)`,
          zIndex: 5,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: opacity * 0.6,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${palette.metallic[400]}22, transparent 80%)`,
          zIndex: 1,
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export const useCountUp = (end: number, duration: number = 2000, trigger: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const increment = end / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, trigger]);

  return count;
};

export const StatCounter = ({ end, suffix = "", duration = 1500 }: { end: number; suffix?: string; duration?: number }) => {
  const [trig, setTrig] = useState(false);
  const count = useCountUp(end, duration, trig);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrig(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export const ScrollReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const TiltContainer = ({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  style?: React.CSSProperties;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width;
    const yVal = (e.clientY - rect.top) / rect.height;

    const rotateY = (xVal - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - yVal) * maxTilt * 2;

    setCoords({
      rotateX,
      rotateY,
      glareX: xVal * 100,
      glareY: yVal * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setCoords({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, opacity: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg)`,
        ...style,
      }}
    >
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${coords.glareX}% ${coords.glareY}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`,
            opacity: coords.opacity,
            zIndex: 10,
          }}
        />
      )}
      {children}
    </div>
  );
};

export const Tag = ({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "green" | "purple" | "orange" }) => {
  const colors: Record<string, string> = {
    blue: `${palette.matte[700]} border-${palette.metallic[400]}33 text-white/80`,
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-300 border-orange-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}
      style={color === "blue" ? { background: `${palette.metallic[500]}22`, borderColor: `${palette.metallic[500]}44` } : {}}>
      {children}
    </span>
  );
};

export const Nav = ({ page, setPage, user = null }: { page: Page; setPage: (p: Page) => void; user?: { name: string; avatar: string } | null }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links: { label: string; page: Page; section?: string }[] = [
    { label: "Products", page: "landing", section: "products" },
    { label: "Solutions", page: "landing", section: "solutions" },
    { label: "Research", page: "landing", section: "research" },
    { label: "Resources", page: "landing", section: "resources" },
  ];
  const handleNavClick = (link: { page: Page; section?: string }) => {
    setPage(link.page);
    if (link.section) {
      const targetId = link.section;
      window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    setPage("landing");
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 80);
    setMobileOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: `${palette.matte[800]}CC`,
        backdropFilter: "blur(24px)",
        borderColor: palette.text.faint,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 font-black text-xl sm:text-2xl tracking-tight transition-opacity hover:opacity-90 shrink-0"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: metallicGradient }}>
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-white drop-shadow-[0_0_18px_rgba(190,221,242,0.35)] inline-block whitespace-nowrap">
            IdeaForge
          </span>
        </button>

        <div className="hidden md:flex items-center justify-center gap-6 flex-1 px-4">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNavClick(l)}
              className={`w-auto shrink-0 whitespace-nowrap text-sm font-semibold transition-colors ${page === l.page ? "text-white" : "text-white/60 hover:text-white"}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <button
              onClick={() => setPage("profile")}
              aria-label="View profile"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white/80 transition-transform hover:scale-105 shrink-0"
              style={{ background: palette.metallic[500], border: `1px solid ${palette.metallic[300]}66` }}
            >
              {(user as { avatar?: string; name?: string }).avatar || ((user as { avatar?: string; name?: string }).name ? (user as { name?: string }).name?.slice(0, 2).toUpperCase() : "US")}
            </button>
          ) : (
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setPage("auth")}
                className="w-auto shrink-0 whitespace-nowrap text-sm font-semibold text-white/70 hover:text-white transition-colors px-3 py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={() => setPage("auth")}
                className="w-auto shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-lg"
                style={{ background: metallicGradient }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-white"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-3"
          style={{ borderColor: palette.text.faint, background: palette.matte[900] }}>
          {links.map((l) => (
            <button key={l.page} onClick={() => handleNavClick(l)}
              className="text-left text-sm font-medium text-white/60 hover:text-white transition-colors py-2">
              {l.label}
            </button>
          ))}
          {user ? (
            <button onClick={() => { setPage("profile"); setMobileOpen(false); }}
              className="text-left text-sm font-medium text-white/60 hover:text-white transition-colors py-2 mt-2 border-t"
              style={{ borderColor: palette.text.faint }}>
              Profile
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: palette.text.faint }}>
              <button
                onClick={() => { setPage("auth"); setMobileOpen(false); }}
                className="w-full py-2 text-center text-sm font-semibold text-white/80 border rounded-xl"
                style={{ borderColor: palette.text.faint }}
              >
                Sign In
              </button>
              <button
                onClick={() => { setPage("auth"); setMobileOpen(false); }}
                className="w-full py-2 text-center text-sm font-bold text-white rounded-xl"
                style={{ background: metallicGradient }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">{children}</p>
);

export const ArrowLink = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button onClick={onClick}
    className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors group">
    {children}
    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
  </button>
);

export const Divider = () => (
  <div className="w-full h-px" style={{ background: palette.text.faint }} />
);
