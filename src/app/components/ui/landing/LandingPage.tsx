import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, BarChart3, Brain, Check, ChevronDown, Crosshair, DatabaseZap,
  Gauge, Globe2, Handshake, Inbox, LayoutDashboard, Lightbulb, LineChart,
  LockKeyhole, MessageSquareText, PieChart, Radar, Rocket, Search, Settings,
  Sparkles, Target, Users, Zap, Clock, X,
} from "lucide-react";
import { GlassCard, Page, ScrollReveal, StatCounter } from "../shared";
import QueueCarousel, { QueueCarouselItem } from "@/components/ui/queue-carousel";
import PrismaHero from "@/components/ui/prisma-hero";

const queueFeatures: QueueCarouselItem[] = [
  {
    icon: Search,
    title: "Competitor Analysis",
    subtitle: "Market Landscape & Pricing Gaps",
    desc: "Map incumbents, pricing structures, customer complaints, and exposed market edges automatically.",
    details: [
      "Scans top 50 direct & indirect competitors in 60s",
      "Identifies unaddressed customer pain points & rating gaps",
      "Extracts positioning weaknesses and moat opportunities",
    ],
    badge: "Live Research",
    metrics: "98% Coverage",
  },
  {
    icon: Globe2,
    title: "Market Sizing (TAM/SAM)",
    subtitle: "Financial Horizon & Urgency",
    desc: "Estimate total addressable market, buyer urgency, pricing power, and macro category momentum.",
    details: [
      "Calculates TAM, SAM, and SOM based on live industry benchmarks",
      "Measures search intent growth & category search volume",
      "Models willingness-to-pay across B2B and B2C segments",
    ],
    badge: "Financial Engine",
    metrics: "$4.2M SAM Model",
  },
  {
    icon: Crosshair,
    title: "SWOT Intelligence",
    subtitle: "Risk Radar & Strategic Moats",
    desc: "Surface internal strengths, hidden weaknesses, macro threats, and high-leverage strategic moats.",
    details: [
      "4-quadrant automated SWOT matrix generated from live web signals",
      "Flags regulatory, API dependency, and SEO competition risks",
      "Recommends defensible product moats before writing code",
    ],
    badge: "Risk Diagnostic",
    metrics: "Low Risk Rating",
  },
  {
    icon: LineChart,
    title: "Revenue Forecasting",
    subtitle: "Monetization & Retention Paths",
    desc: "Model revenue potential across realistic pricing tiers, churn rates, and adoption curves.",
    details: [
      "Simulates 3-year MRR growth under conservative & aggressive scenarios",
      "Recommends optimal pricing models (Freemium vs. Usage vs. Flat)",
      "Provides CAC payback benchmarks for your target vertical",
    ],
    badge: "Financial OS",
    metrics: "Yr 3 $1.2M MRR",
  },
  {
    icon: Gauge,
    title: "Business Score",
    subtitle: "Single Viability Index",
    desc: "Compress complex evidence into a clear, unified opportunity score founders can present to investors.",
    details: [
      "0–100 composite index combining demand, risk, and moat strength",
      "Benchmark against 10,000+ historical startup launch profiles",
      "Actionable green/yellow/red signal for go/no-go decisions",
    ],
    badge: "Viability Engine",
    metrics: "88/100 Viable",
  },
  {
    icon: Target,
    title: "Validation Scoring",
    subtitle: "Hypothesis Testing Map",
    desc: "Know whether the idea is promising, crowded, underexplored, or high-risk before building.",
    details: [
      "Prioritizes top 5 critical assumptions requiring instant validation",
      "Generates landing page copy and value proposition tests",
      "Tracks user signal confidence scores over time",
    ],
    badge: "Hypothesis Map",
    metrics: "94% Confidence",
  },
  {
    icon: Handshake,
    title: "Investor Readiness",
    subtitle: "Diligence & Deck Intelligence",
    desc: "Translate loose product ideas into sharper proof points, risk notes, and investor-ready memos.",
    details: [
      "Auto-generates 1-page investment memo formatted for VCs & Angels",
      "Prepares answers for top 10 tough investor diligence questions",
      "Highlights founder-market fit and unfair advantage points",
    ],
    badge: "VC Memo Ready",
    metrics: "Seed Tier Ready",
  },
  {
    icon: MessageSquareText,
    title: "Community Signal",
    subtitle: "Peer Feedback & Operator Insights",
    desc: "Blend deep AI research with feedback from verified builders, mentors, and operators in the network.",
    details: [
      "Get feedback from builders who launched similar products",
      "Identify potential co-founders and early beta testers",
      "Community rating alignment with AI recommendation engine",
    ],
    badge: "Network Power",
    metrics: "500+ Operators",
  },
];

const faqs = [
  ["How does Ideaforge validate an idea?", "It combines AI research, competitor mapping, market signals, scoring models, and recommendation logic into one founder-ready report."],
  ["Is this for early ideas or existing startups?", "Both. You can test a rough concept before building or benchmark an existing startup against market and investor-readiness signals."],
  ["Can students and hackathon teams use it?", "Yes. The workflow is fast enough for hackathons and structured enough for serious startup planning."],
  ["Does it replace customer interviews?", "No. It helps you decide what to test, which assumptions matter, and whether the opportunity deserves deeper validation."],
] as const;

const styles = `
html{scroll-behavior:smooth}@keyframes mesh{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-2%,1%,0) scale(1.06)}}@keyframes particles{to{transform:translateY(-110px)}}@keyframes beam{0%,100%{transform:translateX(-8%) rotate(-10deg);opacity:.2}50%{transform:translateX(8%) rotate(-6deg);opacity:.42}}@keyframes dashFloat{0%,100%{transform:translateY(0) rotateX(5deg) rotateY(-7deg)}50%{transform:translateY(-14px) rotateX(7deg) rotateY(-4deg)}}@keyframes pulseGlow{0%,100%{opacity:.46;transform:scale(1)}50%{opacity:.82;transform:scale(1.04)}}@keyframes rise{from{transform:scaleY(.28);opacity:.45}to{transform:scaleY(1);opacity:1}}@keyframes orbit{to{transform:rotate(360deg)}}@keyframes ripple{0%{transform:translate(-50%,-50%) scale(.4);opacity:.55}100%{transform:translate(-50%,-50%) scale(2.6);opacity:0}}@keyframes roadmapFlow{0%{background-position:0% 50%;opacity:.58}50%{background-position:100% 50%;opacity:1}100%{background-position:0% 50%;opacity:.58}}@keyframes roadmapPulse{0%,100%{box-shadow:0 0 0 0 rgba(125,211,252,.20),0 18px 45px rgba(6,17,31,.24)}50%{box-shadow:0 0 0 8px rgba(125,211,252,0),0 22px 52px rgba(6,17,31,.30)}}.if-bg{background:radial-gradient(circle at 18% 18%,rgba(79,177,255,.30),transparent 30%),radial-gradient(circle at 82% 8%,rgba(144,205,255,.22),transparent 28%),radial-gradient(circle at 72% 70%,rgba(17,24,39,.42),transparent 30%),linear-gradient(135deg,#06172d 0%,#0a2e55 42%,#06111f 100%)}.if-mesh{animation:mesh 16s ease-in-out infinite}.if-particles{background-image:radial-gradient(circle,rgba(255,255,255,.42) 1px,transparent 1.6px);background-size:72px 72px;animation:particles 18s linear infinite}.if-beam{animation:beam 12s ease-in-out infinite}.if-dashboard{animation:dashFloat 8s ease-in-out infinite;transform-style:preserve-3d}.if-glow{animation:pulseGlow 5s ease-in-out infinite}.if-orbit{animation:orbit 22s linear infinite}.if-bar{transform-origin:bottom;animation:rise 1.2s cubic-bezier(.16,1,.3,1) both}.if-ripple:after{content:"";position:absolute;left:50%;top:50%;width:70px;height:70px;border-radius:999px;background:rgba(255,255,255,.26);opacity:0;transform:translate(-50%,-50%) scale(.4)}.if-ripple:hover:after{animation:ripple .75s ease-out}@media(max-width:768px){.if-dashboard{animation:none;transform:none!important}.if-particles{opacity:.22}}
`;

const Button = ({ children, onClick, secondary = false }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean }) => (
  <button onClick={onClick} className={`if-ripple group relative inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 text-sm font-bold transition-all duration-300 hover:-translate-y-1 ${secondary ? "text-white" : "text-slate-950"}`} style={{ background: secondary ? "linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.04))" : "linear-gradient(135deg,#f8fbff 0%,#b8dfff 45%,#5fa7ff 100%)", border: "1px solid rgba(255,255,255,.22)", boxShadow: secondary ? "0 16px 50px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.16)" : "0 24px 80px rgba(70,164,255,.38),inset 0 1px 0 rgba(255,255,255,.9)" }}>
    <span className="relative z-10">{children}</span><ArrowRight size={17} className="relative z-10 transition-transform group-hover:translate-x-1" />
  </button>
);

const Bg = ({ glow }: { glow: { x: number; y: number } }) => (
  <><div className="if-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"><div className="if-bg if-mesh absolute -inset-24 opacity-80"/><div className="if-particles absolute inset-0 opacity-35"/><div className="absolute inset-0 opacity-[.14]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px)", backgroundSize: "88px 88px" }}/><div className="if-beam absolute left-[-10%] top-24 h-[520px] w-[65%] rotate-[-8deg] bg-gradient-to-r from-transparent via-sky-200/25 to-transparent blur-2xl"/><div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#06111f] to-transparent"/></div><div className="pointer-events-none fixed inset-0 z-0 opacity-55" style={{ background: `radial-gradient(circle at ${glow.x}% ${glow.y}%,rgba(125,211,252,.16),transparent 24%)` }}/></>
);

const Metric = ({ label, value, sub }: { label: string; value: string; sub: string }) => <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4"><div className="text-[11px] font-bold text-white/45">{label}</div><div className="mt-2 text-4xl font-black leading-none text-white">{value}</div><div className="mt-2 text-[10px] font-semibold text-emerald-300">{sub}</div></div>;

const HeroDashboard = () => {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent<HTMLDivElement>) => { const r = ref.current?.getBoundingClientRect(); if (!r) return; setMouse({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); };
  return (
    <div ref={ref} onMouseMove={move} className="relative mx-auto w-full max-w-2xl lg:mx-0">
        <div className="if-glow absolute -inset-8 rounded-[2rem] bg-sky-400/25 blur-3xl"/>
      <div className="absolute -right-5 bottom-20 z-20 hidden rounded-2xl border border-sky-200/30 bg-slate-950/85 px-4 py-3 text-xs text-white shadow-2xl backdrop-blur-xl md:block pointer-events-none whitespace-nowrap">
        <div className="flex items-center gap-2 font-bold text-sky-100">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>
          Opportunity found
        </div>
        <div className="mt-0.5 text-[11px] text-white/60">Underserved college founders</div>
      </div>
      <div className="if-dashboard relative rounded-[28px] border p-4 backdrop-blur-2xl" style={{ background: "linear-gradient(145deg,rgba(11,37,68,.88),rgba(7,18,35,.78)),radial-gradient(circle at 85% 15%,rgba(107,184,255,.25),transparent 34%)", borderColor: "rgba(255,255,255,.18)", boxShadow: "0 40px 130px rgba(0,0,0,.44),inset 0 1px 0 rgba(255,255,255,.18)", transform: "rotateX(5deg) rotateY(-7deg)" }}>
        <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%,rgba(255,255,255,.20),transparent 38%)` }}/>
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-300/70"/>
            <span className="h-3 w-3 rounded-full bg-amber-200/70"/>
            <span className="h-3 w-3 rounded-full bg-emerald-300/70"/>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/60">ideaforge.ai/live-validation</div>
        </div>
        <div className="relative z-10 grid gap-3 pt-4 lg:grid-cols-[1.05fr_.95fr]">
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white/55">Idea Input</span>
                <Sparkles size={15} className="text-sky-200"/>
              </div>
              <p className="text-sm leading-relaxed text-white/82">Describe your startup concept...</p>
              <div className="mt-4 flex gap-2">
                {["B2B SaaS","Founder Ops","Pre-MVP"].map(t=><span key={t} className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-semibold text-white/55">{t}</span>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Validation Score" value="91" sub="+18 signal lift"/>
              <Metric label="Funding Potential" value="A-" sub="seed ready"/>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white/55">Market Opportunity</span>
                <span className="text-[11px] font-bold text-emerald-300">$2.4B TAM</span>
              </div>
              <div className="flex h-24 items-end gap-2">
                {[32,48,42,67,58,76,83,92].map((h,i)=><div key={i} className="flex-1 overflow-hidden rounded-t-lg bg-white/8"><div className="if-bar h-full rounded-t-lg bg-gradient-to-t from-sky-500 to-cyan-100" style={{ height: `${h}%`, animationDelay: `${i*90}ms` }}/></div>)}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-white/55">AI Confidence</span>
                <span className="text-xs font-bold text-sky-100">94%</span>
              </div>
              <div className="relative mx-auto grid h-32 w-32 place-items-center rounded-full">
                <div className="if-orbit absolute inset-0 rounded-full border border-dashed border-sky-200/35"/>
                <div className="absolute inset-4 rounded-full border border-white/10 bg-sky-300/10"/>
                <Brain size={34} className="text-sky-100 drop-shadow-[0_0_18px_rgba(125,211,252,.75)]"/>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <div className="mb-3 text-xs font-bold text-white/55">Competitors</div>
              {["FounderSuite","Pitchbook Lite","Manual research"].map((n,i)=><div key={n} className="mb-2 flex items-center justify-between rounded-xl bg-white/[.06] px-3 py-2 last:mb-0"><span className="truncate text-[11px] font-semibold text-white/65">{n}</span><span className="text-[10px] text-sky-200">{i===0?"High":i===1?"Med":"Low"}</span></div>)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Strengths","Risks","Moat","Timing"].map((item,i)=><div key={item} className="rounded-xl border border-white/10 bg-white/[.06] p-3"><div className="mb-2 text-[10px] font-bold text-white/45">{item}</div><div className={`h-1.5 rounded-full ${i===1?"bg-amber-300/70":"bg-emerald-300/75"}`}/></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ eyebrow, title, body, light }: { eyebrow: string; title: string; body?: string; light?: boolean }) => <ScrollReveal className="mx-auto mb-14 max-w-3xl text-center"><p className={`mb-4 text-xs font-bold uppercase tracking-[.24em] ${light ? "text-blue-500" : "text-sky-200/65"}`}>{eyebrow}</p><h2 className={`text-4xl font-black leading-[1.04] md:text-6xl ${light ? "text-blue-900" : "text-white"}`}>{title}</h2>{body && <p className={`mx-auto mt-5 max-w-2xl text-base leading-relaxed ${light ? "text-blue-700/70" : "text-white/55"}`}>{body}</p>}</ScrollReveal>;

const RoadmapCards = () => {
  const steps = [
    [Sparkles, "Submit Idea", "Describe the product, audience, pricing, and the problem you want to solve."],
    [Brain, "AI Research", "Ideaforge studies competitors, market momentum, risks, and revenue paths."],
    [BarChart3, "Business Validation", "Scores and diagnostics show whether the opportunity deserves focus."],
    [Rocket, "Launch with Confidence", "Leave with next steps, risks to test, and investor-ready clarity."],
  ] as const;

  return (
    <section className="relative z-10 px-6 py-24 lg:px-10">
      <Header eyebrow="How it works" title="A validation pipeline for decisions, not decks." body="Move from instinct to evidence through a calm, structured research flow built for founders moving fast." />
      <div className="mx-auto max-w-7xl">
        <div className="relative grid gap-6 lg:grid-cols-4 lg:gap-8">
          {steps.map(([Icon, title, body], i) => (
            <ScrollReveal key={title} delay={i * 90}>
              <div className="group relative h-full">
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(100%+1px)] top-1/2 z-0 hidden h-2 w-8 -translate-y-1/2 overflow-hidden rounded-full border border-sky-200/25 bg-sky-950/15 lg:block">
                    <div className="h-full w-full rounded-full bg-[linear-gradient(90deg,rgba(125,211,252,.20),rgba(255,255,255,.80),rgba(56,189,248,.28))] bg-[length:220%_100%]" style={{ animation: `roadmapFlow ${2.4 + i * 0.25}s ease-in-out infinite` }} />
                  </div>
                )}
                <GlassCard className="h-full min-h-[238px] p-6" glow style={{ background: "rgba(255,255,255,.052)", borderRadius: 22 }}>
                  <div className="mb-7 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-sky-200/20 bg-sky-300/12 text-sky-100" style={{ animation: `roadmapPulse ${3.2 + i * 0.2}s ease-in-out infinite` }}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[.18em] text-sky-100/55">Step {i + 1}</span>
                    </div>
                    <span className="text-sm font-black text-white/24">0{i + 1}</span>
                  </div>
                  <h3 className="mb-3 max-w-[13rem] text-[1.6rem] font-black leading-[1.08] text-white">{title}</h3>
                  <p className="max-w-[15rem] text-sm leading-relaxed text-white/58">{body}</p>
                </GlassCard>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
const Preview = () => {
  const nav = [
    [LayoutDashboard, "Dashboard", true],
    [Lightbulb, "My Ideas", false],
    [Brain, "AI Insights", false],
    [Settings, "Settings", false],
  ] as const;

  return (
    <ScrollReveal>
      <div className="relative mx-auto max-w-7xl">
        <div className="if-glow absolute -inset-8 rounded-[2rem] bg-sky-300/20 blur-3xl" />
        <div
          className="if-dashboard relative overflow-hidden rounded-[30px] border shadow-[0_40px_130px_rgba(0,0,0,.40)]"
          style={{
            background: "#1D5A9C",
            borderColor: "rgba(255,255,255,.16)",
            transform: "rotateX(5deg) rotateY(-7deg)",
          }}
        >
          <div className="grid min-h-[600px] lg:grid-cols-[260px_1fr]">
            <aside className="hidden flex-col justify-between border-r bg-gradient-to-b from-white to-[#f0f6ff] p-5 lg:flex" style={{ borderColor: "rgba(59,130,246,.20)" }}>
              <div>
                <div className="mb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 shadow-lg">
                      <Zap size={16} className="text-white" />
                    </div>
                    <div className="text-xl font-black tracking-tight text-blue-950">Ideaforge</div>
                  </div>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-blue-400">Series A Path</p>
                </div>
                <nav className="space-y-1.5">
                  {nav.map(([Icon, label, active]) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold ${active ? "text-white shadow-lg" : "text-blue-600"}`}
                      style={active ? { background: "linear-gradient(135deg,#1d4ed8,#3b82f6)" } : { background: "transparent" }}
                    >
                      <Icon size={18} className={active ? "text-white" : "text-blue-400"} />
                      <span>{label}</span>
                    </div>
                  ))}
                </nav>
              </div>
              <div className="space-y-3 border-t border-blue-200/70 pt-6">
                <div className="px-4 py-2.5 text-xs font-medium text-blue-500">Help</div>
                <div className="px-4 py-2.5 text-xs font-medium text-blue-400">Logout</div>
              </div>
            </aside>

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Founder Dashboard</h3>
                  <p className="mt-1 text-xs text-white/60 sm:text-sm">
                    Welcome back, Innovator. <span className="font-semibold text-cyan-300">0 ideas</span> in your validation workspace.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,.15)]">
                    <Zap size={14} className="fill-emerald-400 text-emerald-400" />
                    <span>0% Velocity</span>
                  </div>
                  <div className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-white/20 bg-sky-600 text-xs font-bold text-white">
                    IN
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <div className="relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border p-6 sm:p-7 lg:col-span-2" style={{ background: "linear-gradient(135deg,rgba(35,103,174,.4),rgba(20,50,90,.6))", borderColor: "rgba(255,255,255,.12)", backdropFilter: "blur(12px)" }}>
                  <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-100/20 blur-3xl" />
                  <div className="relative max-w-xl">
                    <h4 className="mb-2 text-xl font-bold tracking-tight text-white sm:text-2xl">Ready to Disrupt?</h4>
                    <p className="mb-6 text-xs leading-relaxed text-white/70 sm:text-sm">Input your raw concept and let our AI engine stress-test the market viability in real-time.</p>
                  </div>
                  <div className="relative inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-br from-blue-700 via-blue-500 to-sky-300 px-6 py-3 text-xs font-bold text-white shadow-xl sm:text-sm">
                    <Rocket size={16} />
                    Launch New Idea
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-white/12 bg-white/[.055] p-6">
                  <div>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/40">Profile Hype</div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-black text-white">0.0k</span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">+0%</span>
                    </div>
                  </div>
                  <div className="my-4 h-px bg-white/10" />
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total Validations</span>
                      <span className="text-xs font-bold text-cyan-300">0 <span className="font-normal text-white/40">/ 20 cap</span></span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[3%] rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white">Recent Activity</h4>
                  <span className="text-xs font-semibold text-white/50">Live workspace</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[.055] p-8 text-center sm:p-12">
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-white/15 bg-white/[.06] shadow-xl">
                    <Inbox size={32} className="text-cyan-300" />
                  </div>
                  <h5 className="mb-2 text-xl font-bold text-white">Your Dashboard is Empty</h5>
                  <p className="mx-auto mb-6 max-w-md text-xs leading-relaxed text-white/60 sm:text-sm">
                    Welcome to Ideaforge! You have no submitted ideas yet. Launch your raw concept to start AI market stress-testing and competitor moat analysis.
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-700 via-blue-500 to-sky-300 px-6 py-3 text-xs font-bold text-white shadow-xl sm:text-sm">
                    <Rocket size={16} />
                    Submit First Idea
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {([
                  [Clock, "Next Pitch", "Tomorrow at 10:00 AM", "cyan"],
                  [Users, "Active Mentors", "3 experts online now", "emerald"],
                  [BarChart3, "Market Trend", "PropTech is rising", "purple"],
                ] as const).map(([Icon, title, text, tone]) => (
                  <div key={title as string} className="flex items-center gap-3.5 rounded-2xl border border-white/12 bg-white/[.055] p-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${tone === "emerald" ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400" : tone === "purple" ? "border-purple-500/30 bg-purple-500/15 text-purple-300" : "border-cyan-500/30 bg-cyan-500/15 text-cyan-300"}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{title as string}</div>
                      <div className="text-xs text-white/50">{text as string}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};
export const LandingPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [openFaq, setOpenFaq] = useState(0); const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [footerNotice, setFooterNotice] = useState<{ title: string; body: string } | null>(null);
  const footerLinks: Record<string, { label: string; action: () => void }[]> = {
    Product: [
      { label: "Validation Engine", action: () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }) },
      { label: "AI Reports", action: () => setFooterNotice({ title: "AI Reports", body: "Turn competitor research, market sizing, SWOT intelligence, and revenue forecasts into one decision-ready report." }) },
      { label: "Dashboard", action: () => setPage("dashboard") },
      { label: "Community", action: () => setFooterNotice({ title: "Community", body: "Community feedback is coming soon. Join the validation workspace today to be first in line." }) },
    ],
    "Use Cases": [
      { label: "Founders", action: () => setPage("auth") },
      { label: "Hackathons", action: () => setFooterNotice({ title: "Hackathons", body: "Move from a raw concept to a sharp, evidence-backed pitch before demo day." }) },
      { label: "Investors", action: () => setFooterNotice({ title: "Investors", body: "Review opportunity signals, market evidence, and investor-readiness diagnostics in one place." }) },
      { label: "Incubators", action: () => setFooterNotice({ title: "Incubators", body: "Give every cohort a consistent way to test assumptions and prioritize the strongest ideas." }) },
    ],
  };
  useEffect(() => { const f = (e: MouseEvent) => setGlow({ x: e.clientX / window.innerWidth * 100, y: e.clientY / window.innerHeight * 100 }); window.addEventListener("mousemove", f); return () => window.removeEventListener("mousemove", f); }, []);
  return <main className="relative min-h-screen overflow-hidden text-white"><style>{styles}</style><Bg glow={glow}/><PrismaHero onValidateClick={() => setPage("auth")} /><RoadmapCards /><section id="products" className="relative z-10 scroll-mt-24 px-6 py-28 lg:px-10" style={{ background: "#ffffff" }}>
  <Header light eyebrow="AI features" title="Everything a serious founder needs before building." body="Research, scoring, community feedback, and strategic recommendations in one premium intelligence layer."/>
  <QueueCarousel items={queueFeatures} />
</section><section id="research" className="relative z-10 scroll-mt-24 px-6 py-28 lg:px-10"><Header eyebrow="Interactive dashboard" title="A command center for startup conviction." body="Charts, heatmaps, SWOT intelligence, business metrics, recommendations, and investor signals stay visible in one cinematic interface."/><div className="mx-auto max-w-7xl"><Preview/></div></section><section id="solutions" className="relative z-10 scroll-mt-24 px-6 py-28 lg:px-10" style={{ background: "#ffffff" }}><Header light eyebrow="Why choose us" title="Traditional research is slow. Ideaforge is compounding intelligence."/><ScrollReveal><div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-lg md:grid-cols-2"><div className="border-b border-blue-100 p-8 md:border-b-0 md:border-r"><h3 className="mb-6 text-2xl font-black text-blue-300">Traditional Research</h3>{["Weeks of manual search","Scattered documents","Unclear investor readiness","No unified opportunity score","Expensive consultants"].map(x=><div key={x} className="mb-4 flex gap-3 text-blue-300"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-200"/>{x}</div>)}</div><div className="relative p-8"><div className="absolute inset-0 bg-blue-50/60"/><h3 className="relative mb-6 text-2xl font-black text-blue-900">Ideaforge AI</h3>{["Decision report in minutes","Competitors, TAM, SWOT, and scores together","Investor-readiness diagnostics","Clear opportunity and validation scoring","AI recommendations with next tests"].map(x=><div key={x} className="relative mb-4 flex gap-3 text-blue-700"><Check size={18} className="mt-.5 shrink-0 text-blue-500"/>{x}</div>)}</div></div></ScrollReveal></section><section className="relative z-10 px-6 py-28 lg:px-10">
  <Header eyebrow="Platform Assurance" title="Built for people who cannot afford to build the wrong thing." body="Skip assumptions. Validate with real data, competitive intelligence, and predictive risk scoring before committing engineering time." />
  <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
    {[
      {
        icon: Search,
        badge: "6-Week Research in 60s",
        title: "Zero-Assumption Market Mapping",
        desc: "Ideaforge scans live market data, incumbent pricing gaps, and customer pain intensity signals to tell you where your product stands before writing line 1 of code.",
        stat: "100,000+ Signals Processed",
      },
      {
        icon: BarChart3,
        badge: "Investor-Grade Intelligence",
        title: "Objective Risk & TAM Scoring",
        desc: "Receive clear ratings on market viability, SAM/SOM potential, failure risks, and monetization fit—formatted into actionable decision memos.",
        stat: "95% Predictive Accuracy",
      },
      {
        icon: Rocket,
        badge: "Rapid Execution Path",
        title: "Actionable Launch Playbook",
        desc: "Transform raw startup ambition into an ordered, step-by-step launch roadmap with prioritized audience testing, feature scopes, and positioning strategies.",
        stat: "120+ Avg. Hours Saved",
      },
    ].map(({ icon: Icon, badge, title, desc, stat }, i) => (
      <ScrollReveal key={title} delay={i * 100}>
        <GlassCard className="h-full p-8 flex flex-col justify-between" style={{ background: "rgba(255,255,255,.052)", borderRadius: 24 }}>
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-300/12 text-sky-100">
                <Icon size={22} />
              </div>
              <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-bold text-sky-200">
                {badge}
              </span>
            </div>
            <h3 className="mb-3 text-2xl font-black text-white">{title}</h3>
            <p className="mb-6 text-sm leading-relaxed text-white/60">{desc}</p>
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white/40">Impact</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
              <Sparkles size={12} /> {stat}
            </span>
          </div>
        </GlassCard>
      </ScrollReveal>
    ))}
  </div>
</section><section id="resources" className="relative z-10 scroll-mt-24 px-6 py-28 lg:px-10" style={{ background: "#ffffff" }}><Header light eyebrow="FAQ" title="Questions founders ask before trusting the signal."/><div className="mx-auto max-w-3xl space-y-3">{faqs.map(([q,a],i)=><ScrollReveal key={q} delay={i*60}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)} className="w-full rounded-2xl border border-blue-100 bg-blue-50/60 p-5 text-left transition-all hover:bg-blue-50 hover:border-blue-200"><div className="flex items-center justify-between gap-6"><span className="text-lg font-black text-blue-900">{q}</span><ChevronDown className={`shrink-0 text-blue-400 transition-transform ${openFaq===i?"rotate-180":""}`} size={19}/></div>{openFaq===i&&<p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-700/75">{a}</p>}</button></ScrollReveal>)}</div></section><section className="relative z-10 px-6 pb-16 pt-10 lg:px-10"><ScrollReveal><div className="mx-auto max-w-6xl overflow-hidden rounded-[34px] border border-white/12 bg-white/[.055] px-6 py-20 text-center shadow-[0_35px_120px_rgba(0,0,0,.32)] backdrop-blur-xl md:px-14"><div className="mx-auto mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-sky-300/12"><LockKeyhole size={24} className="text-sky-100"/></div><h2 className="text-5xl font-black leading-[1.02] text-white md:text-7xl">Validate Before You Build.</h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">Start with evidence, not optimism. Let AI stress-test your startup idea before your team spends months shipping.</p><div className="mt-9"><Button onClick={() => setPage("auth")}>Start Free Validation</Button></div></div></ScrollReveal></section><footer className="relative z-10 overflow-hidden border-t border-white/10 bg-gradient-to-br from-[#0b3b70] via-[#155a98] to-[#1b78b5] px-6 py-14 backdrop-blur-xl lg:px-10"><div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"/><div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl"/><div className="mx-auto max-w-7xl"><div className="grid gap-10 md:grid-cols-[1.35fr_1fr_1fr_1fr]"> <div className="max-w-sm"><div className="mb-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 shadow-[0_0_30px_rgba(125,211,252,.35)]"><Zap size={18} className="text-cyan-100"/></div><span className="text-xl font-black text-white">Ideaforge</span></div><p className="text-sm leading-6 text-blue-100/75">AI startup validation for founders who want evidence before execution. Competitors, market sizing, scoring, feedback, and investor readiness in one place.</p></div>{Object.entries(footerLinks).map(([heading, links])=><div key={heading}><h4 className="mb-4 text-xs font-black uppercase tracking-[.18em] text-cyan-100/80">{heading}</h4><div className="space-y-3">{links.map(({ label, action })=><button key={label} onClick={action} className="group flex items-center gap-2 text-left text-sm text-white/70 transition-all hover:translate-x-1 hover:text-white"><span>{label}</span><ArrowRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100"/></button>)}</div></div>)}</div><div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/15 pt-6 text-xs text-blue-100/60 md:flex-row md:items-center"><span>Copyright 2026 Ideaforge. All rights reserved.</span><div className="flex flex-wrap gap-5"><span>Enterprise AI research</span><span>Built for pre-build decisions</span></div></div></div></footer>{footerNotice&&<div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="footer-dialog-title" onClick={() => setFooterNotice(null)}><div className="relative w-full max-w-md rounded-3xl border border-cyan-200/30 bg-gradient-to-br from-[#123f73] to-[#1591b5] p-7 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}><button aria-label="Close" onClick={() => setFooterNotice(null)} className="absolute right-4 top-4 rounded-full p-2 text-white/70 transition hover:bg-white/15 hover:text-white"><X size={18}/></button><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100/20"><Zap size={22} className="text-cyan-100"/></div><h2 id="footer-dialog-title" className="text-2xl font-black">{footerNotice.title}</h2><p className="mt-3 text-sm leading-6 text-blue-50/85">{footerNotice.body}</p><button onClick={() => setFooterNotice(null)} className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-blue-800 transition hover:bg-cyan-100">Got it</button></div></div>}</main>;
};
