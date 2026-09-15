import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  BarChart3,
  Globe,
  ArrowRight,
  Search,
  Database,
  Layers,
} from "lucide-react";
import { Page } from "../shared";

export const AnalyzingPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [logs, setLogs] = useState<string[]>([
    "⚡ Initializing AI Neural Core 5.5...",
    "🔍 Extracting core problem & solution semantics...",
  ]);

  const steps = [
    { label: "Parsing idea structure & value proposition", detail: "Semantics & NLP Analysis", icon: Layers },
    { label: "Running SWOT framework & risk assessment", detail: "Strengths, Threats & Moat", icon: ShieldCheck },
    { label: "Calculating TAM / SAM / SOM market size", detail: "Financial Projection Engine", icon: TrendingUp },
    { label: "Scanning competitor & market landscape", detail: "Indexing 1,400+ SaaS Signals", icon: Search },
    { label: "Generating AI Viability Radar Score", detail: "100-Point Algorithmic Rating", icon: BarChart3 },
    { label: "Compiling investor insights report", detail: "Generating Executive Briefing", icon: Database },
  ];

  const logPool = [
    "📊 Benchmarking market sizing against $42.8B global SaaS segment...",
    "🎯 Querying Crunchbase & Pitchbook startup telemetry...",
    "🛡️ Calculating defensibility score & acquisition velocity...",
    "⚡ Simulating 5-year CAC to LTV monetization curve...",
    "✨ Synthesizing key investor recommendations...",
    "✅ Report compilation complete. 100% verified.",
  ];

  // Automated step progression timer
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          const nextStep = prev + 1;
          const targetProgress = Math.round(((nextStep + 1) / steps.length) * 100);
          setProgress(targetProgress);

          // Add next log entry
          if (logPool[nextStep - 1]) {
            setLogs((prevLogs) => [logPool[nextStep - 1], ...prevLogs.slice(0, 4)]);
          }
          return nextStep;
        } else {
          setProgress(100);
          return prev;
        }
      });
    }, 2400);

    return () => clearInterval(stepInterval);
  }, []);

  // Smooth progress bar increment
  const isComplete = progress >= 100;

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-20 pt-24 text-white" style={{ background: "#2563eb" }}>
      {/* ── Background Cyber Grid & Glowing Orbs ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-400/20 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* ── Top Header Badge ── */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md shadow-lg shadow-blue-900/20">
            <Cpu size={14} className="animate-spin text-blue-200" style={{ animationDuration: "4s" }} />
            <span>AI Autonomous Engine Active</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-3xl font-black text-white md:text-5xl tracking-tight">
            {isComplete ? "Analysis Complete!" : "AI is Analyzing Your Concept"}
          </h1>
          <p className="mt-2 text-sm text-blue-100 font-medium max-w-md mx-auto">
            {isComplete
              ? "Your startup hypothesis has been validated across 50+ intelligence benchmarks."
              : "Scanning market telemetry, competitor signals, and monetization metrics in real-time."}
          </p>
        </div>

        {/* ── Main Dashboard Container ── */}
        <div className="grid gap-6 md:grid-cols-12 items-start">
          
          {/* Left Column: AI Visual Radar & Steps */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Step Progress Card */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-blue-950/30">
              
              {/* Overall Progress Bar */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-100">
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-yellow-300" />
                    <span>Progress</span>
                  </span>
                  <span className="text-sm font-black text-white">{progress}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-blue-950/40 p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-300 via-cyan-300 to-emerald-400 transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-3.5">
                {steps.map((stepItem, idx) => {
                  const isDone = idx < currentStepIndex || isComplete;
                  const isCurrent = idx === currentStepIndex && !isComplete;
                  const Icon = stepItem.icon;

                  return (
                    <div
                      key={stepItem.label}
                      className={`flex items-center gap-3.5 rounded-2xl border p-3.5 transition-all duration-500 ${
                        isCurrent
                          ? "border-white/40 bg-white/20 shadow-lg shadow-blue-900/30 translate-x-1"
                          : isDone
                          ? "border-emerald-400/30 bg-emerald-500/10 text-white"
                          : "border-white/10 bg-white/5 opacity-50"
                      }`}
                    >
                      {/* Step Indicator Badge */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold transition-all ${
                          isDone
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                            : isCurrent
                            ? "bg-white text-blue-700 shadow-md shadow-white/20 animate-pulse"
                            : "bg-blue-950/40 text-blue-200 border border-white/10"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 size={18} />
                        ) : isCurrent ? (
                          <Loader2 size={18} className="animate-spin text-blue-600" />
                        ) : (
                          <Icon size={16} />
                        )}
                      </div>

                      {/* Step Text Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs md:text-sm font-bold truncate ${
                              isDone ? "text-white" : isCurrent ? "text-white" : "text-blue-200"
                            }`}
                          >
                            {stepItem.label}
                          </h4>
                          {isCurrent && (
                            <span className="ml-2 rounded-full bg-blue-400/30 px-2 py-0.5 text-[10px] font-bold text-blue-100 uppercase tracking-widest animate-pulse">
                              Running
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-blue-200/80 truncate">{stepItem.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: AI Central Orb & Realtime Feeds */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Animated AI Radar Core */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-xl shadow-2xl shadow-blue-950/30 relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
              
              {/* Spinning Tech Orbit Rings */}
              <div className="relative flex items-center justify-center my-4">
                <div className="absolute h-40 w-40 rounded-full border border-dashed border-white/30 animate-spin" style={{ animationDuration: "12s" }} />
                <div className="absolute h-32 w-32 rounded-full border border-white/20 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
                
                {/* Central AI Pulse Orb */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-xl shadow-cyan-400/40">
                  <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-40" />
                  <Zap size={36} className="text-white animate-pulse" />
                </div>
              </div>

              {/* Status Header */}
              <div className="mt-2 space-y-1">
                <div className="text-2xl font-black text-white tracking-tight">
                  {progress}% <span className="text-xs font-normal text-blue-200">Processed</span>
                </div>
                <div className="text-xs font-semibold text-blue-200">
                  {isComplete ? "Validation Report Generated" : "Synthesizing Market Intelligence..."}
                </div>
              </div>
            </div>

            {/* Live Terminal Log Feed */}
            <div className="rounded-3xl border border-white/20 bg-blue-950/80 p-5 backdrop-blur-xl shadow-2xl font-mono text-xs text-blue-200 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] font-sans font-bold uppercase tracking-widest text-blue-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  Live Intelligence Stream
                </span>
                <span>Console</span>
              </div>

              <div className="space-y-2 min-h-[110px] flex flex-col justify-end">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 transition-all ${
                      i === 0 ? "text-cyan-300 font-semibold" : "text-blue-200/70"
                    }`}
                  >
                    <span className="text-blue-400 select-none">&gt;</span>
                    <span className="truncate">{log}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Data Benchmarks</div>
                <div className="mt-1 text-xl font-black text-white">50+ Signals</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">AI Confidence</div>
                <div className="mt-1 text-xl font-black text-emerald-300">98.4%</div>
              </div>
            </div>

          </div>

        </div>

        {/* ── Bottom Action Footer ── */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3 text-xs font-semibold text-blue-100">
            <Globe size={18} className="text-blue-300 shrink-0" />
            <span>Average analysis runtime ~45s. Your results will auto-save to dashboard.</span>
          </div>

          <button
            onClick={() => setPage("results")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3 text-sm font-black text-blue-700 shadow-xl transition-all duration-300 hover:bg-blue-50 hover:scale-105 active:scale-95"
          >
            <span>{isComplete ? "Explore Full Insights Report" : "Preview Results (Demo)"}</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
