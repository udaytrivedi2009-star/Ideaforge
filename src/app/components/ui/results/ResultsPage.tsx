import { useState } from "react";
import {
  CheckCircle2,
  ArrowLeft,
  Share2,
  Download,
  TrendingUp,
  ShieldAlert,
  Award,
  Zap,
  Users,
  Target,
  BarChart3,
  DollarSign,
  ChevronRight,
  Flame,
  Sparkles,
  X,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  Layers,
  Activity,
  HelpCircle,
} from "lucide-react";
import { Page } from "../shared";
import { DashboardIdea } from "../dashboard/DashboardPage";

interface ResultsPageProps {
  setPage: (p: Page) => void;
  selectedIdea?: DashboardIdea | null;
}

export const ResultsPage = ({ setPage, selectedIdea }: ResultsPageProps) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "swot" | "competitors" | "financials">("all");
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Fallback to latest or sample idea if none selected
  const idea = selectedIdea || {
    id: 1,
    title: "Data recovery centres all over the world",
    description:
      "We recover valuable or old memory data from storage devices globally through decentralized cleanrooms and cloud encryption pipelines.",
    status: "validated" as const,
    statusLabel: "Validated",
    score: "87 / 100",
    date: "Sep 13",
  };

  const swot = {
    strengths: [
      "AI-automated data retrieval pipelines reduce turnaround time by 75%",
      "Clear TAM of $4.2B with high enterprise data retention demand",
      "Proprietary hardware-level memory extraction IP & zero data loss guarantee",
      "High customer LTV with recurring enterprise compliance contracts",
    ],
    weaknesses: [
      "High initial cleanroom & hardware equipment overhead",
      "Specialized technician onboarding required for legacy drive formats",
      "Dependency on third-party forensic hardware tools",
    ],
    opportunities: [
      "GDPR & HIPAA data compliance mandating secure data recovery audit trails",
      "Partnership with cloud backup providers for hybrid physical-cloud recovery",
      "Expand to mobile & IoT storage recovery market ($1.5T sector)",
    ],
    threats: [
      "Rapid shift towards fully cloud-native non-volatile storage",
      "Heavy encryption standard updates blocking raw chip extraction",
      "Price competition from regional unaccredited recovery shops",
    ],
  };

  const competitors = [
    { name: "DriveSavers Data Recovery", threat: "High", moat: "Enterprise contracts & cleanrooms", funding: "$45M", share: "34%" },
    { name: "Ontrack (KLDiscovery)", threat: "High", moat: "Global brand & forensic tools", funding: "$120M", share: "28%" },
    { name: "Stellar Data Recovery", threat: "Medium", moat: "Consumer software suite", funding: "$18M", share: "15%" },
    { name: "Secure Data Recovery", threat: "Medium", moat: "SSAER 18 certification", funding: "$25M", share: "12%" },
  ];

  // ── Share URLs with Bulletproof Idea Slug ──
  const cleanTitle = (idea?.title || selectedIdea?.title || "New Startup Concept")
    .toString()
    .trim();

  const ideaSlug = cleanTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const finalSlug = ideaSlug.length > 0 ? ideaSlug : "new-startup-concept";

  const origin =
    typeof window !== "undefined" && window.location && window.location.origin
      ? window.location.origin
      : "http://localhost:5173";

  const shareUrl = `${origin}/${finalSlug}`;
  const shareTitle = `Check out the AI Startup Validation Report for "${cleanTitle}" on Ideaforge!`;

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-emerald-500 hover:bg-emerald-600",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
    },
    {
      name: "X (Twitter)",
      icon: Send,
      color: "bg-slate-900 hover:bg-black border border-white/20",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Reddit",
      icon: ExternalLink,
      color: "bg-orange-600 hover:bg-orange-700",
      url: `https://www.reddit.com/submit?title=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: ExternalLink,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Telegram",
      icon: Send,
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // ── PDF Export Functionality ──
  const handleExportPDF = () => {
    setExporting(true);

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Ideaforge Analysis Report - ${cleanTitle}</title>
        <style>
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; background: #fff; line-height: 1.6; }
          .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; }
          .desc { font-size: 15px; color: #475569; margin: 0; }
          .score-box { background: #eff6ff; border: 2px solid #2563eb; padding: 15px 25px; border-radius: 12px; text-align: center; }
          .score { font-size: 36px; font-weight: 900; color: #2563eb; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: 700; color: #1e3a8a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
          .card-title { font-weight: 700; font-size: 14px; margin-bottom: 5px; color: #0f172a; }
          ul { margin: 0; padding-left: 20px; font-size: 13px; color: #334155; }
          li { margin-bottom: 6px; }
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; pt: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${cleanTitle}</h1>
            <p class="desc">${idea.description}</p>
            <p style="font-size: 12px; color: #64748b; margin-top: 8px;">Analysis Date: ${idea.date || "Today"} | Status: Validated Concept</p>
          </div>
          <div class="score-box">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #1e40af;">Validation Score</div>
            <div class="score">${idea.score || "87/100"}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Key Viability Ratings</div>
          <div class="grid-3">
            <div class="card">
              <div class="card-title">Business Score</div>
              <div style="font-size: 24px; font-weight: 800; color: #2563eb;">8.9 / 10</div>
            </div>
            <div class="card">
              <div class="card-title">Investor Readiness</div>
              <div style="font-size: 24px; font-weight: 800; color: #2563eb;">8.5 / 10</div>
            </div>
            <div class="card">
              <div class="card-title">Community Signal</div>
              <div style="font-size: 24px; font-weight: 800; color: #16a34a;">94% Positive</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Market Sizing (TAM / SAM / SOM)</div>
          <div class="grid-3">
            <div class="card"><div class="card-title">TAM</div><div style="font-size: 24px; font-weight: 800;">$4.2B</div></div>
            <div class="card"><div class="card-title">SAM</div><div style="font-size: 24px; font-weight: 800;">$840M</div></div>
            <div class="card"><div class="card-title">SOM</div><div style="font-size: 24px; font-weight: 800;">$42M</div></div>
          </div>
        </div>

        <div class="footer">Generated by Ideaforge AI Platform • Confidential Report</div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = `Ideaforge_Report_${finalSlug}.html`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    setTimeout(() => {
      window.print();
      setExporting(false);
    }, 500);
  };

  return (
    <div
      className="min-h-screen pt-20 pb-28 px-4 sm:px-6 text-white relative selection:bg-cyan-400 selection:text-blue-950"
      style={{
        background: "radial-gradient(ellipse at 50% -20%, #2563eb 0%, #1d4ed8 45%, #1e3a8a 100%)",
      }}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-400/20 blur-[140px] rounded-full" />
        <div className="absolute top-3/4 left-1/3 w-[600px] h-[300px] bg-cyan-400/15 blur-[120px] rounded-full" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* ── Top Bar Navigation ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setPage("dashboard")}
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to My Ideas</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs font-black text-blue-700 shadow-xl transition-all duration-300 hover:bg-blue-50 hover:scale-105 active:scale-95"
            >
              <Share2 size={15} />
              <span>Share Report Link</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-blue-900/50 px-5 py-2.5 text-xs font-black text-white backdrop-blur-xl transition-all duration-300 hover:bg-blue-900/80 hover:border-white/50 hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl"
            >
              <Download size={15} />
              <span>{exporting ? "Generating PDF..." : "Export Report"}</span>
            </button>
          </div>
        </div>

        {/* ── HERO BANNER: IDEA TITLE & OVERALL VALIDATION SCORE ── */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/25 bg-white/10 p-6 md:p-10 backdrop-blur-2xl shadow-[0_16px_48px_0_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-white/40">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-400/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 px-3.5 py-1 text-xs font-black text-emerald-300 shadow-inner">
                  <CheckCircle2 size={14} /> Analysis Verified
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 px-3.5 py-1 text-xs font-black text-cyan-200 shadow-inner">
                  <Sparkles size={14} /> AI Intelligence Matrix
                </span>
                <span className="text-xs font-semibold text-blue-200">Added {idea.date || "Today"}</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                {cleanTitle}
              </h1>

              <p className="text-sm md:text-base text-blue-100/90 leading-relaxed max-w-2xl font-normal">
                {idea.description}
              </p>
            </div>

            {/* Glowing Radial Score Badge */}
            <div className="relative group/score flex flex-col items-center justify-center rounded-3xl border border-white/30 bg-gradient-to-b from-blue-950/80 to-blue-900/60 p-7 text-center shrink-0 min-w-[220px] shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-cyan-400/50">
              <div className="absolute inset-0 rounded-3xl bg-cyan-400/5 opacity-0 group-hover/score:opacity-100 transition-opacity duration-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 mb-1">
                Validation Viability Score
              </span>
              <div className="text-6xl font-black tracking-tight text-emerald-300 my-1 drop-shadow-lg">
                87<span className="text-xl text-blue-200 font-bold">/100</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 px-3.5 py-1 text-xs font-extrabold text-emerald-300">
                <Flame size={13} /> Strong Market Signal
              </div>
            </div>
          </div>

          {/* Interactive Progress Meter */}
          <div className="mt-8 pt-6 border-t border-white/15 space-y-2.5">
            <div className="flex justify-between text-xs font-bold text-blue-200">
              <span className="flex items-center gap-1"><AlertCircleIcon size={13} /> Low Viability</span>
              <span className="text-white font-extrabold tracking-wide">87% Viability Threshold Achieved</span>
              <span className="text-cyan-300 font-extrabold">Unicorn Potential</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-blue-950/80 p-0.5 border border-white/20 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)] transition-all duration-1000"
                style={{ width: "87%" }}
              />
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE VIEW MODES TAB BAR ── */}
        <div className="flex items-center justify-between border-b border-white/15 pb-2 overflow-x-auto gap-2 scrollbar-none">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "Full Report Blueprint", icon: Layers },
              { id: "swot", label: "SWOT Intelligence", icon: ShieldAlert },
              { id: "competitors", label: "Competitors & Moats", icon: Users },
              { id: "financials", label: "Financial Forecasts", icon: DollarSign },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-white text-blue-700 shadow-xl scale-105"
                      : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10"
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-blue-200 font-semibold">
            <Activity size={14} className="text-emerald-400 animate-pulse" /> Live Telemetry Synced
          </span>
        </div>

        {/* ── SECTION: TOP METRIC CARDS ── */}
        {(activeTab === "all" || activeTab === "financials") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                id: "business",
                title: "Business Score",
                value: "8.9",
                max: "/ 10",
                desc: "High unit economics & LTV potential",
                icon: BarChart3,
                color: "text-cyan-300",
                border: "hover:border-cyan-400/50",
              },
              {
                id: "investor",
                title: "Investor Readiness",
                value: "8.5",
                max: "/ 10",
                desc: "Ready for pre-seed / seed investor deck",
                icon: Award,
                color: "text-yellow-300",
                border: "hover:border-yellow-400/50",
              },
              {
                id: "moat",
                title: "Moat Defensibility",
                value: "7.8",
                max: "/ 10",
                desc: "Hardware IP & proprietary tech barrier",
                icon: Target,
                color: "text-emerald-300",
                border: "hover:border-emerald-400/50",
              },
              {
                id: "community",
                title: "Community Signal",
                value: "94%",
                max: "Positive",
                desc: "142 Founder upvotes & early demand",
                icon: Flame,
                color: "text-orange-300",
                border: "hover:border-orange-400/50",
              },
            ].map((metric) => {
              const IconComp = metric.icon;
              return (
                <div
                  key={metric.id}
                  onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
                  className={`group cursor-pointer rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:bg-white/15 ${metric.border} shadow-xl relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
                      <IconComp size={16} className={metric.color} />
                      {metric.title}
                    </span>
                    <HelpCircle size={14} className="text-white/40 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-4xl font-black text-white tracking-tight">
                    {metric.value} <span className="text-xs font-semibold text-blue-200">{metric.max}</span>
                  </div>
                  <p className="text-xs text-blue-100/90 mt-2 font-medium leading-relaxed">{metric.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SECTION: MARKET SIZING (TAM / SAM / SOM) ── */}
        {(activeTab === "all" || activeTab === "financials") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <TrendingUp size={24} className="text-cyan-300" /> Market Sizing & Opportunity
              </h2>
              <span className="text-xs font-bold text-blue-200 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                USD ($) Projections
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group rounded-3xl border border-white/20 bg-gradient-to-b from-white/15 to-white/5 p-7 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/50 shadow-2xl relative">
                <div className="text-xs font-extrabold uppercase tracking-widest text-blue-200 mb-2">
                  TAM (Total Addressable)
                </div>
                <div className="text-5xl font-black text-white tracking-tight my-2">$4.2B</div>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  Global data recovery & hardware forensics total market valuation.
                </p>
              </div>

              <div className="group rounded-3xl border border-white/20 bg-gradient-to-b from-white/15 to-white/5 p-7 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400/50 shadow-2xl relative">
                <div className="text-xs font-extrabold uppercase tracking-widest text-cyan-200 mb-2">
                  SAM (Serviceable Addressable)
                </div>
                <div className="text-5xl font-black text-cyan-200 tracking-tight my-2">$840M</div>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  North America & EU enterprise SMB compliance and data recovery market.
                </p>
              </div>

              <div className="group rounded-3xl border border-white/20 bg-gradient-to-b from-white/15 to-white/5 p-7 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400/50 shadow-2xl relative">
                <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 mb-2">
                  SOM (Obtainable Yr 3)
                </div>
                <div className="text-5xl font-black text-emerald-300 tracking-tight my-2">$42M</div>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  Targeting 5% obtainable market capture within 36 months of launch.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION: SWOT ANALYSIS MATRIX ── */}
        {(activeTab === "all" || activeTab === "swot") && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <ShieldAlert size={24} className="text-yellow-300" /> SWOT Intelligence Matrix
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="rounded-3xl border border-emerald-400/40 bg-emerald-950/40 p-7 backdrop-blur-2xl space-y-4 shadow-xl hover:border-emerald-400/60 transition-all duration-300">
                <div className="flex items-center gap-2.5 font-black text-emerald-300 text-sm uppercase tracking-wider">
                  <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> Strengths
                </div>
                <ul className="space-y-3 text-xs md:text-sm text-blue-50 font-medium">
                  {swot.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-400 font-black">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="rounded-3xl border border-rose-400/40 bg-rose-950/40 p-7 backdrop-blur-2xl space-y-4 shadow-xl hover:border-rose-400/60 transition-all duration-300">
                <div className="flex items-center gap-2.5 font-black text-rose-300 text-sm uppercase tracking-wider">
                  <span className="h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_10px_#f43f5e]" /> Weaknesses
                </div>
                <ul className="space-y-3 text-xs md:text-sm text-blue-50 font-medium">
                  {swot.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-rose-400 font-black">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="rounded-3xl border border-cyan-400/40 bg-cyan-950/40 p-7 backdrop-blur-2xl space-y-4 shadow-xl hover:border-cyan-400/60 transition-all duration-300">
                <div className="flex items-center gap-2.5 font-black text-cyan-300 text-sm uppercase tracking-wider">
                  <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" /> Opportunities
                </div>
                <ul className="space-y-3 text-xs md:text-sm text-blue-50 font-medium">
                  {swot.opportunities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-cyan-400 font-black">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="rounded-3xl border border-amber-400/40 bg-amber-950/40 p-7 backdrop-blur-2xl space-y-4 shadow-xl hover:border-amber-400/60 transition-all duration-300">
                <div className="flex items-center gap-2.5 font-black text-amber-300 text-sm uppercase tracking-wider">
                  <span className="h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]" /> Threats
                </div>
                <ul className="space-y-3 text-xs md:text-sm text-blue-50 font-medium">
                  {swot.threats.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-amber-400 font-black">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION: COMPETITOR LANDSCAPE ── */}
        {(activeTab === "all" || activeTab === "competitors") && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Users size={24} className="text-cyan-300" /> Competitor Landscape & Defensibility
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {competitors.map((comp) => (
                <div
                  key={comp.name}
                  className="group rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-2xl space-y-3 transition-all duration-300 hover:scale-[1.03] hover:border-white/40 shadow-xl"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-white text-sm truncate">{comp.name}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                        comp.threat === "High"
                          ? "bg-rose-500/25 text-rose-300 border border-rose-400/40"
                          : "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40"
                      }`}
                    >
                      {comp.threat}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 font-medium">Moat: {comp.moat}</p>
                  <div className="flex justify-between items-center text-[11px] font-bold text-blue-200 pt-2 border-t border-white/10">
                    <span>Funding: {comp.funding}</span>
                    <span className="text-cyan-300">Share: {comp.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION: REVENUE FORECASTING ── */}
        {(activeTab === "all" || activeTab === "financials") && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <DollarSign size={24} className="text-emerald-300" /> 3-Year Revenue Projections
            </h2>

            <div className="rounded-3xl border border-white/25 bg-gradient-to-r from-blue-950/80 via-blue-900/60 to-blue-950/80 p-8 backdrop-blur-2xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center shadow-2xl">
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-widest text-blue-200">Year 1 Projection</div>
                <div className="text-4xl font-black text-white">$1.2M</div>
                <p className="text-xs text-blue-100 font-medium">Initial 120 corporate cleanroom subscriptions</p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-widest text-cyan-200">Year 2 Projection</div>
                <div className="text-4xl font-black text-cyan-200">$4.8M</div>
                <p className="text-xs text-blue-100 font-medium">Expansion into European compliance hubs</p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-300">Year 3 Projection</div>
                <div className="text-4xl font-black text-emerald-300">$14.5M</div>
                <p className="text-xs text-blue-100 font-medium">78% Gross Margin with AI automation scaling</p>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTION PLAN & DASHBOARD RETURN ── */}
        <div className="rounded-3xl border border-white/25 bg-gradient-to-r from-blue-900/90 to-blue-950/90 p-8 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-cyan-300">
              <Zap size={15} /> Recommended Action Plan
            </div>
            <h3 className="text-2xl font-black text-white">Pre-Launch Landing Page & Founder Discovery</h3>
            <p className="text-xs md:text-sm text-blue-100 max-w-xl font-medium leading-relaxed">
              Validate early demand by launching a high-converting waitlist page and interviewing 15 enterprise IT
              compliance leads.
            </p>
          </div>

          <button
            onClick={() => setPage("dashboard")}
            className="w-full md:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-blue-700 shadow-2xl transition-all duration-300 hover:bg-blue-50 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Go to My Dashboard</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── MULTI-PLATFORM SHARE MODAL ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-white/25 bg-blue-900/95 p-6 shadow-2xl backdrop-blur-2xl space-y-6 relative text-white">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5 font-black text-lg">
                <Share2 size={20} className="text-cyan-300" />
                <span>Share Insight Report</span>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-blue-100 font-medium">
                Share this report directly across platforms or copy the private share link:
              </p>

              {/* Direct Social Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shareLinks.map((platform) => {
                  const IconComp = platform.icon;
                  return (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl text-xs font-black text-white transition-all hover:scale-105 shadow-md ${platform.color}`}
                    >
                      <IconComp size={18} />
                      <span>{platform.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Direct Copy Link Field */}
            <div className="space-y-2 pt-2 border-t border-white/15">
              <label className="block text-[11px] font-black uppercase tracking-wider text-blue-200">
                Direct Report URL
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-blue-950/80 p-2.5">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-transparent text-xs text-blue-100 outline-none px-2 font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-blue-950 text-xs font-black transition-all flex items-center gap-1.5 shrink-0 shadow-lg"
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Inline Helper Icon ────────────────────────────────────────────── */
const AlertCircleIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
