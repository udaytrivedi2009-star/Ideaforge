import { useState } from "react";
import {
  Zap,
  LayoutDashboard,
  Lightbulb,
  Brain,
  Settings,
  Sparkles,
  HelpCircle,
  LogOut,
  MoreVertical,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Rocket,
  Trash2,
  Edit3,
  Inbox,
  Search,
  ArrowUpRight,
  TrendingUp,
  ChevronDown,
  Award,
  AlertTriangle,
  ShieldAlert,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { Page, palette, metallicGradient, GlassCard } from "../shared";
import { UserProfile } from "@/app/App";
import { PromptInput } from "@/components/ui/ai-chat-input";

export interface DashboardIdea {
  id: number;
  title: string;
  description: string;
  status: "validated" | "analyzing" | "community-hot" | "draft";
  statusLabel: string;
  scanned?: string;
  score?: string;
  actionLabel?: string;
  likes?: number;
  comments?: number;
  avatars?: string[];
  date?: string;
}

type InsightChatMessage = {
  role: "user" | "assistant";
  text: string;
};

interface DashboardPageProps {
  setPage: (p: Page) => void;
  user?: UserProfile | null;
  onLogout?: () => void;
  ideas?: DashboardIdea[];
  onAddIdea?: (idea: Omit<DashboardIdea, "id">) => void;
  onDeleteIdea?: (id: number) => void;
  onSelectIdea?: (idea: DashboardIdea) => void;
}

export const DashboardPage = ({
  setPage,
  user,
  onLogout,
  ideas = [],
  onDeleteIdea,
  onSelectIdea,
}: DashboardPageProps) => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "my-ideas" | "ai-insights" | "settings"
  >("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [activeMenuCardId, setActiveMenuCardId] = useState<number | null>(null);

  // Portfolio & Insights Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedIdeaForInsightsId, setSelectedIdeaForInsightsId] = useState<number | null>(null);
  const [insightChats, setInsightChats] = useState<Record<number, InsightChatMessage[]>>({});
  const [isInsightLoading, setIsInsightLoading] = useState(false);


  // Sidebar navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, targetPage: "dashboard" as Page },
    { id: "my-ideas", label: "My Ideas", icon: Lightbulb, targetPage: "dashboard" as Page },
    { id: "ai-insights", label: "AI Insights", icon: Brain, targetPage: "dashboard" as Page },
    { id: "settings", label: "Settings", icon: Settings, targetPage: "profile" as Page },
  ];

  const handleNavClick = (item: (typeof navItems)[0]) => {
    setActiveTab(item.id as typeof activeTab);
    setMobileMenuOpen(false);
    if (item.targetPage !== "dashboard") {
      setPage(item.targetPage);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    setPage("landing");
  };

  const totalValidations = ideas.length;
  const validationProgress = Math.min(Math.round((totalValidations / 20) * 100), 100);
  const velocityScore = totalValidations === 0 ? 0 : Math.min(70 + totalValidations * 5, 98);
  const profileHype = totalValidations === 0 ? "0.0k" : `${(totalValidations * 0.8).toFixed(1)}k`;

  // Filter ideas for "My Ideas" portfolio view
  const filteredPortfolioIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ? true : idea.status === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedIdeaForInsights = ideas.find((idea) => idea.id === selectedIdeaForInsightsId) || null;
  const selectedInsightChat = selectedIdeaForInsightsId !== null ? insightChats[selectedIdeaForInsightsId] || [] : [];
  const insightPrompts = [
    "Give me practical suggestions for this idea",
    "What doubts or risks should I test first?",
    "How can I improve the business model?",
  ];

  const handleInsightChatSubmit = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || !selectedIdeaForInsights || isInsightLoading) return;

    const ideaId = selectedIdeaForInsights.id;
    const history = selectedInsightChat;
    setInsightChats((prev) => ({
      ...prev,
      [selectedIdeaForInsights.id]: [
        ...(prev[selectedIdeaForInsights.id] || []),
        { role: "user", text: trimmed },
      ],
    }));

    setIsInsightLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_AI_API_URL || "http://localhost:3001";
      const result = await fetch(`${apiBaseUrl}/api/ai/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          idea: {
            title: selectedIdeaForInsights.title,
            description: selectedIdeaForInsights.description,
          },
          history,
        }),
      });

      const data = await result.json() as { answer?: string; error?: string };
      if (!result.ok || !data.answer) {
        throw new Error(data.error || "The AI service could not answer.");
      }

      setInsightChats((prev) => ({
        ...prev,
        [ideaId]: [
          ...(prev[ideaId] || []),
          { role: "assistant", text: data.answer as string },
        ],
      }));
    } catch (error) {
      console.error("Insight request failed:", error);
      setInsightChats((prev) => ({
        ...prev,
        [ideaId]: [
          ...(prev[ideaId] || []),
          { role: "assistant", text: "I could not reach the AI service. Check that the backend is running and try again." },
        ],
      }));
    } finally {
      setIsInsightLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row text-white selection:bg-cyan-500/30"
      style={{ background: palette.matte[900] }}
    >
      {/* Mobile Top Header */}
      <div
        className="md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40"
        style={{ background: `${palette.matte[900]}EE`, borderColor: palette.text.faint, backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={() => setPage("landing")}
          className="flex items-center gap-2 font-black text-lg tracking-tight"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: metallicGradient }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span>Ideaforge</span>
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl border text-white/80 hover:text-white"
          style={{ borderColor: palette.text.faint, background: palette.matte[800] }}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 md:w-64 flex flex-col justify-between p-5 border-r transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f0f6ff 100%)",
          borderColor: "rgba(59, 130, 246, 0.2)",
          boxShadow: "4px 0 24px rgba(59, 130, 246, 0.08)",
          minHeight: "100vh",
        }}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-8 cursor-pointer group" onClick={() => setPage("landing")}>
            <div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)" }}
                >
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span
                  className="font-black text-xl tracking-tight text-blue-900 group-hover:text-blue-600 transition-colors"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  Ideaforge
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-widest text-blue-400 uppercase mt-1 pl-0.5">
                Series A Path
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(false);
              }}
              className="md:hidden text-blue-400 hover:text-blue-700"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? "text-white font-semibold shadow-lg scale-[1.01]"
                      : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  }`}
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
                        }
                      : {}
                  }
                >
                  <Icon
                    size={18}
                    className={`transition-colors ${
                      isActive ? "text-white" : "text-blue-400 group-hover:text-blue-700"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Action Controls */}
        <div className="pt-6 space-y-3 border-t" style={{ borderColor: "rgba(59, 130, 246, 0.18)" }}>
          {/* Help */}
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-blue-500 hover:text-blue-800 hover:bg-blue-50 transition-colors"
          >
            <HelpCircle size={16} />
            <span>Help</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-blue-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "dashboard" && (
          <>
            {/* Top Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-black tracking-tight text-white"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  Founder Dashboard
                </h1>
                <p className="text-white/60 text-xs sm:text-sm mt-1">
                  Welcome back, Innovator.{" "}
                  <span className="text-cyan-300 font-semibold">{ideas.length} ideas</span> in your validation workspace.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Velocity Pill Badge */}
                <div
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  style={{ background: "rgba(16, 185, 129, 0.1)" }}
                >
                  <Zap size={14} className="fill-emerald-400 text-emerald-400 animate-pulse" />
                  <span>{velocityScore}% Velocity</span>
                </div>

                {/* Profile Avatar */}
                <button
                  onClick={() => setPage("profile")}
                  className="relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white border-2 border-white/20 transition-transform hover:scale-105"
                  style={{ background: palette.metallic[500] }}
                >
                  {user?.avatar ? (
                    <span className="text-sm font-semibold">{user.avatar}</span>
                  ) : user?.name ? (
                    <span>{user.name.slice(0, 2).toUpperCase()}</span>
                  ) : (
                    <span className="text-xs">IN</span>
                  )}
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                </button>
              </div>
            </div>

            {/* Row 1: Hero Banner + Profile Hype & Validations Stat Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Ready to Disrupt Hero Banner (Span 2) */}
              <div
                className="lg:col-span-2 relative overflow-hidden rounded-2xl border p-6 sm:p-7 flex flex-col justify-between min-h-[200px]"
                style={{
                  background: "linear-gradient(135deg, rgba(35, 103, 174, 0.4) 0%, rgba(20, 50, 90, 0.6) 100%)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Background Accent Glow */}
                <div
                  className="absolute -right-16 -top-16 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
                  style={{ background: palette.metallic[300] }}
                />

                <div className="relative z-10 max-w-xl">
                  <h2
                    className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    Ready to Disrupt?
                  </h2>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6">
                    Input your raw concept and let our AI engine stress-test the market viability in real-time.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setPage("submit")}
                    className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] inline-flex items-center gap-2 group"
                    style={{ background: metallicGradient }}
                  >
                    <Rocket size={16} className="group-hover:rotate-12 transition-transform" />
                    <span>Launch New Idea</span>
                  </button>
                </div>
              </div>

              {/* Profile Hype & Total Validations Stat Card */}
              <GlassCard className="p-6 flex flex-col justify-between">
                {/* Upper Metric: Profile Hype */}
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">
                    Profile Hype
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span
                      className="text-2xl sm:text-3xl font-black text-white"
                      style={{ fontFamily: "'Unbounded', sans-serif" }}
                    >
                      {profileHype}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      +{totalValidations > 0 ? "12%" : "0%"}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px my-4" style={{ background: "rgba(255, 255, 255, 0.08)" }} />

                {/* Lower Metric: Total Validations */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                      Total Validations
                    </span>
                    <span className="text-xs font-bold text-cyan-300">
                      {totalValidations} <span className="text-white/40 font-normal">/ 20 cap</span>
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${validationProgress}%`,
                        background: "linear-gradient(90deg, #10B981 0%, #3B82F6 100%)",
                        boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                      }}
                    />
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Row 2: Recent Ideas Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                  Recent Activity
                </h2>
                {ideas.length > 0 && (
                  <button
                    onClick={() => setActiveTab("my-ideas")}
                    className="text-xs font-semibold text-white/70 hover:text-cyan-300 transition-colors flex items-center gap-1 group"
                  >
                    <span>View All Portfolio</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {ideas.length === 0 ? (
                /* FIRST TIME USER EMPTY STATE */
                <GlassCard className="p-8 sm:p-12 text-center flex flex-col items-center justify-center border-dashed border-white/20">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
                    style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                  >
                    <Inbox size={32} className="text-cyan-300" />
                  </div>

                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    Your Dashboard is Empty
                  </h3>

                  <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                    Welcome to Ideaforge! You have no submitted ideas yet. Launch your raw concept to start AI market stress-testing and competitor moat analysis.
                  </p>

                  <button
                    onClick={() => setPage("submit")}
                    className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
                    style={{ background: metallicGradient }}
                  >
                    <Rocket size={16} />
                    <span>Submit First Idea</span>
                  </button>
                </GlassCard>
              ) : (
                /* USER IDEAS GRID */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {ideas.slice(0, 3).map((idea) => (
                    <GlassCard
                      key={idea.id}
                      className="p-5 flex flex-col justify-between transition-all hover:scale-[1.01] cursor-pointer group relative"
                      onClick={() =>
                        setPage(
                          idea.status === "analyzing"
                            ? "analyzing"
                            : idea.status === "validated"
                            ? "results"
                            : "idea-detail"
                        )
                      }
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          {idea.status === "analyzing" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                              <span>Analyzing</span>
                            </span>
                          )}

                          {idea.status === "validated" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 size={12} className="text-emerald-400" />
                              <span>Validated</span>
                            </span>
                          )}

                          {idea.status === "community-hot" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              <span>🔥 Community Hot</span>
                            </span>
                          )}

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuCardId(activeMenuCardId === idea.id ? null : idea.id);
                              }}
                              className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                              aria-label="Idea options"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeMenuCardId === idea.id && (
                              <div
                                className="absolute right-0 top-full mt-1 w-44 rounded-xl py-1.5 z-30 shadow-2xl border text-xs"
                                style={{
                                  background: palette.matte[800],
                                  borderColor: "rgba(255, 255, 255, 0.15)",
                                  backdropFilter: "blur(16px)",
                                }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuCardId(null);
                                    setPage("idea-detail");
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2"
                                >
                                  <Edit3 size={13} />
                                  <span>View Details</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuCardId(null);
                                    if (onDeleteIdea) onDeleteIdea(idea.id);
                                  }}
                                  className="w-full text-left px-3.5 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <h3 className="font-bold text-white text-base mb-1.5 group-hover:text-cyan-300 transition-colors">
                          {idea.title}
                        </h3>
                        <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-6">
                          {idea.description}
                        </p>
                      </div>

                      <div
                        className="flex items-center justify-between pt-3 border-t"
                        style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
                      >
                        {idea.status === "validated" && (
                          <>
                            <div className="flex items-center gap-1 text-emerald-400 font-black text-sm">
                              <CheckCircle2 size={15} />
                              <span>{idea.score || "9.0 Score"}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPage("results");
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
                            >
                              Results
                            </button>
                          </>
                        )}
                        {idea.status !== "validated" && (
                          <span className="text-xs text-white/40 font-medium">Updated {idea.date || "Today"}</span>
                        )}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>

            {/* Row 3: Bottom Quick Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard
                className="p-4 flex items-center gap-3.5 hover:border-cyan-400/40 transition-colors cursor-pointer"
                onClick={() => alert("Pitch Scheduled: Tomorrow at 10:00 AM")}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-300">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Next Pitch</div>
                  <div className="text-xs text-white/50">Tomorrow at 10:00 AM</div>
                </div>
              </GlassCard>

              <GlassCard
                className="p-4 flex items-center gap-3.5 hover:border-emerald-400/40 transition-colors cursor-pointer"
                onClick={() => setPage("community")}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                  <Users size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Active Mentors</div>
                  <div className="text-xs text-white/50">3 experts online now</div>
                </div>
              </GlassCard>

              <GlassCard
                className="p-4 flex items-center gap-3.5 hover:border-purple-400/40 transition-colors cursor-pointer"
                onClick={() => setPage("community")}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-300">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Market Trend</div>
                  <div className="text-xs text-white/50">PropTech is rising</div>
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY IDEAS DEDICATED PORTFOLIO VIEW */}
        {/* ========================================================================= */}
        {activeTab === "my-ideas" && (
          <div className="space-y-6">
            {/* Portfolio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-black tracking-tight text-white"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  My Startup Portfolio
                </h1>
                <p className="text-white/60 text-xs sm:text-sm mt-1">
                  Filter, search, and manage all your validated concepts and market analyses in one place.
                </p>
              </div>

              <button
                onClick={() => setPage("submit")}
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
                style={{ background: metallicGradient }}
              >
                <Rocket size={16} />
                <span>New Concept +</span>
              </button>
            </div>

            {/* Control Bar: Search & Category Filters */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border"
              style={{ background: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255, 255, 255, 0.08)" }}
            >
              {/* Search Box */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search your startup ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs text-white placeholder-white/40 outline-none transition-all"
                  style={{ background: palette.matte[800], border: "1px solid rgba(255, 255, 255, 0.1)" }}
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: "all", label: `All (${ideas.length})` },
                  { id: "validated", label: `Validated (${ideas.filter((i) => i.status === "validated").length})` },
                  { id: "analyzing", label: `Analyzing (${ideas.filter((i) => i.status === "analyzing").length})` },
                  { id: "community-hot", label: `Community (${ideas.filter((i) => i.status === "community-hot").length})` },
                ].map((filterTab) => (
                  <button
                    key={filterTab.id}
                    onClick={() => setFilterCategory(filterTab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      filterCategory === filterTab.id
                        ? "text-white shadow-md"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                    style={filterCategory === filterTab.id ? { background: metallicGradient } : {}}
                  >
                    {filterTab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ideas Portfolio Content */}
            {filteredPortfolioIdeas.length === 0 ? (
              <GlassCard className="p-8 sm:p-12 text-center flex flex-col items-center justify-center border-dashed border-white/20">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
                  style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                >
                  <Lightbulb size={32} className="text-amber-300" />
                </div>

                <h3
                  className="text-xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  {searchQuery ? "No Matching Ideas Found" : "No Ideas Saved in Your Portfolio"}
                </h3>

                <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  {searchQuery
                    ? `No ideas match "${searchQuery}". Try adjusting your search term.`
                    : "You haven't submitted any startup ideas yet. Every unicorn begins with a single signal. Launch your concept to get detailed AI scores."}
                </p>

                <button
                  onClick={() => setPage("submit")}
                  className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
                  style={{ background: metallicGradient }}
                >
                  <Rocket size={16} />
                  <span>Launch Startup Concept</span>
                </button>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPortfolioIdeas.map((idea) => (
                  <GlassCard
                    key={idea.id}
                    className="p-5 flex flex-col justify-between hover:border-cyan-400/40 transition-all cursor-pointer group relative"
                    onClick={() => {
                      if (onSelectIdea) onSelectIdea(idea);
                      setPage(
                        idea.status === "analyzing"
                          ? "analyzing"
                          : idea.status === "validated"
                          ? "results"
                          : "idea-detail"
                      );
                    }}
                  >
                    <div>
                      {/* Top status & options menu */}
                      <div className="flex items-center justify-between mb-3.5">
                        {idea.status === "analyzing" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                            <span>Analyzing</span>
                          </span>
                        )}

                        {idea.status === "validated" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>Validated</span>
                          </span>
                        )}

                        {idea.status === "community-hot" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            <span>🔥 Community Hot</span>
                          </span>
                        )}

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuCardId(activeMenuCardId === idea.id ? null : idea.id);
                            }}
                            className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Idea options"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuCardId === idea.id && (
                            <div
                              className="absolute right-0 top-full mt-1 w-44 rounded-xl py-1.5 z-30 shadow-2xl border text-xs"
                              style={{
                                background: palette.matte[800],
                                borderColor: "rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(16px)",
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuCardId(null);
                                  setPage("idea-detail");
                                }}
                                className="w-full text-left px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2"
                              >
                                <Edit3 size={13} />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuCardId(null);
                                  if (onDeleteIdea) onDeleteIdea(idea.id);
                                }}
                                className="w-full text-left px-3.5 py-2 text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <h3 className="font-bold text-white text-base mb-1.5 group-hover:text-cyan-300 transition-colors">
                        {idea.title}
                      </h3>
                      <p className="text-white/60 text-xs leading-relaxed line-clamp-3 mb-6">
                        {idea.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & Actions */}
                    <div
                      className="flex items-center justify-between pt-3 border-t"
                      style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
                    >
                      <div className="text-xs text-white/40 font-medium">
                        Added {idea.date || "Recently"}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectIdea) onSelectIdea(idea);
                          setPage("results");
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors flex items-center gap-1"
                      >
                        <span>View Analysis</span>
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AI INSIGHTS & VIABILITY SCORE RADAR */}
        {/* ========================================================================= */}
        {activeTab === "ai-insights" && (
          <>
            {selectedIdeaForInsightsId === null ? (
              /* STEP 1: IDEA SELECTION SCREEN */
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-2">
                    <Brain size={13} className="text-cyan-300" />
                    <span>AI Insights Studio</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Select an Idea for AI Insights
                  </h1>
                  <p className="text-white/60 text-xs sm:text-sm mt-1">
                    Select a startup concept from your portfolio below to generate real-time AI market viability stress-testing, moat evaluation, and SWOT analysis.
                  </p>
                </div>

                {ideas.length === 0 ? (
                  <GlassCard className="p-8 sm:p-12 text-center flex flex-col items-center justify-center border-dashed border-white/20">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl" style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                      <Brain size={32} className="text-cyan-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                      No Ideas Found
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                      You haven't submitted any startup concepts yet. Submit your first idea to unlock AI Insights scoring.
                    </p>
                    <button
                      onClick={() => setPage("submit")}
                      className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
                      style={{ background: metallicGradient }}
                    >
                      <Rocket size={16} />
                      <span>Submit First Idea</span>
                    </button>
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ideas.map((idea) => (
                      <GlassCard
                        key={idea.id}
                        className="p-6 flex flex-col justify-between hover:border-cyan-400/50 transition-all cursor-pointer group"
                        onClick={() => setSelectedIdeaForInsightsId(idea.id)}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              <Lightbulb size={12} />
                              <span>{idea.statusLabel || "Concept"}</span>
                            </span>
                            <span className="text-[11px] text-white/40 font-medium">Added {idea.date || "Recently"}</span>
                          </div>

                          <h3 className="font-bold text-white text-base mb-2 group-hover:text-cyan-300 transition-colors" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                            {idea.title}
                          </h3>
                          <p className="text-white/60 text-xs leading-relaxed line-clamp-3 mb-6">
                            {idea.description}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIdeaForInsightsId(idea.id);
                          }}
                          className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all duration-200 hover:scale-[1.02] inline-flex items-center justify-center gap-2 group-hover:bg-cyan-500"
                          style={{ background: metallicGradient }}
                        >
                          <Sparkles size={14} className="text-amber-300" />
                          <span>Analyze AI Insights</span>
                          <ArrowUpRight size={14} />
                        </button>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* STEP 2: DETAILED AI MARKET INSIGHTS PAGE FOR SELECTED IDEA */
              <div className="space-y-6">
                {/* Back Button & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <button
                      onClick={() => setSelectedIdeaForInsightsId(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors mb-3"
                    >
                      <ArrowLeft size={14} />
                      <span>← Select Different Idea</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        <Sparkles size={13} className="animate-pulse text-cyan-300" />
                        <span>AI Stress-Testing Engine</span>
                      </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                      AI Market Insights & Radar
                    </h1>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">
                      Analyzing concept: <span className="text-cyan-300 font-bold">{ideas.find(i => i.id === selectedIdeaForInsightsId)?.title || "Selected Idea"}</span>
                    </p>
                  </div>

                  {/* Idea Switcher Dropdown */}
                  {ideas.length > 0 && (
                    <div className="relative shrink-0 self-start sm:self-auto">
                      <select
                        value={selectedIdeaForInsightsId}
                        onChange={(e) => setSelectedIdeaForInsightsId(Number(e.target.value))}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800/80 border border-white/15 outline-none appearance-none pr-9 cursor-pointer"
                      >
                        {ideas.map((item) => (
                          <option key={item.id} value={item.id} className="bg-slate-900 text-white">
                            💡 {item.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    </div>
                  )}
                </div>

                {/* AI Copilot Chat */}
                <GlassCard className="p-5 sm:p-6 border-cyan-400/30" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)" }}>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-blue-500">
                          <MessageCircle size={14} />
                          <span>AI Copilot</span>
                        </div>
                        <h2 className="text-lg font-black text-blue-900" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                          Chat about {selectedIdeaForInsights?.title || "this idea"}
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-blue-500">
                          Ask for suggestions, doubts, launch steps, pricing ideas, or ways to improve the concept.
                        </p>
                      </div>
                      <span className="self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
                        Idea-aware
                      </span>
                    </div>

                    <div className="max-h-72 space-y-3 overflow-y-auto rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
                      {selectedInsightChat.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-blue-200 bg-white p-4 text-sm font-medium text-blue-500">
                          Start with a question about your selected idea. The copilot will answer using the idea title and description.
                        </div>
                      ) : (
                        selectedInsightChat.map((message, index) => (
                          <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${message.role === "user" ? "bg-blue-600 text-white" : "border border-blue-100 bg-white text-blue-900"}`}>
                              {message.text}
                            </div>
                          </div>
                        ))
                      )}
                      {isInsightLoading && (
                        <div className="rounded-xl border border-blue-100 bg-white p-4 text-sm font-medium text-blue-500">
                          Ideaforge is thinking...
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {insightPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          disabled={isInsightLoading}
                          onClick={() => handleInsightChatSubmit(prompt)}
                          className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="mb-3 block text-[11px] font-bold uppercase tracking-widest text-blue-500">
                        AI Copilot
                      </label>
                      <div className={`mx-auto w-full max-w-md transition-opacity ${isInsightLoading ? "pointer-events-none opacity-60" : ""}`}>
                        <PromptInput
                          placeholder=""
                          onSubmit={(value) => handleInsightChatSubmit(value)}
                          showModelSelector={false}
                          showEffortSelector={false}
                          showAttachmentButton={false}
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>

            {/* Top Row: Overall Viability Score & Score Radar Metrics */}
            <div className="hidden grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Main Score Hero Card */}
              <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-[10px] font-bold tracking-widest text-cyan-300 uppercase mb-2">
                    Overall AI Viability Index
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl sm:text-5xl font-black text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                      91<span className="text-lg text-white/40 font-normal">/100</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Top 5% Signal
                    </span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed mb-4">
                    Strong market pull detected with high TAM opportunity. Minimal initial execution risk.
                  </p>
                </div>

                {/* Breakdown Meters */}
                <div className="space-y-3 relative z-10 pt-3 border-t border-white/10">
                  {[
                    { label: "Market TAM Opportunity", val: 94, color: "#10B981" },
                    { label: "Defensibility & Moat", val: 87, color: "#3B82F6" },
                    { label: "Customer Pain Urgency", val: 92, color: "#8B5CF6" },
                    { label: "Monetization Speed", val: 89, color: "#F59E0B" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70 font-medium">{m.label}</span>
                        <span className="text-white font-bold">{m.val}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.val}%`, background: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* 4 Score Pillar Stat Cards (Grid Span 2) */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 1: TAM */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <TrendingUp size={18} />
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        9.4 / 10
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">Market TAM Opportunity</h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      $14.2B global market growing at 18.4% CAGR over the next 5 years.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-emerald-400/90 font-medium">
                    ✓ High market tailwinds
                  </div>
                </GlassCard>

                {/* Card 2: Moat */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <ShieldCheck size={18} />
                      </div>
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                        8.7 / 10
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">Defensibility Moat</h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Proprietary dataset accumulation creates compounding switching costs.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-blue-400/90 font-medium">
                    ✓ Strong data network effect
                  </div>
                </GlassCard>

                {/* Card 3: Pain */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Zap size={18} />
                      </div>
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                        9.2 / 10
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">Customer Pain Urgency</h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      High intent search volume and active Reddit/Twitter complaints detected.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-purple-400/90 font-medium">
                    ✓ Urgent willingness-to-pay
                  </div>
                </GlassCard>

                {/* Card 4: Monetization */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Award size={18} />
                      </div>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        8.9 / 10
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">Time-to-Revenue</h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Estimated 30-day conversion cycle with SaaS subscription pricing.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-amber-400/90 font-medium">
                    ✓ Quick B2B sales cycle
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Section 2: AI SWOT Analysis Matrix */}
            <div className="hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                  AI SWOT Analysis Matrix
                </h2>
                <span className="text-xs text-white/50">Updated via real-time market signals</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <GlassCard className="p-5 border-l-4 border-l-emerald-500">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                    <CheckCircle2 size={16} />
                    <span>Strengths</span>
                  </div>
                  <ul className="space-y-2 text-xs text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>Low customer acquisition cost due to built-in viral referral mechanics.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>Proprietary automated workflow reduces manual user friction by 80%.</span>
                    </li>
                  </ul>
                </GlassCard>

                {/* Weaknesses */}
                <GlassCard className="p-5 border-l-4 border-l-amber-500">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
                    <AlertTriangle size={16} />
                    <span>Weaknesses</span>
                  </div>
                  <ul className="space-y-2 text-xs text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>Initial dependence on third-party API token costs during initial scale.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>Requires user onboarding education for legacy workflow users.</span>
                    </li>
                  </ul>
                </GlassCard>

                {/* Opportunities */}
                <GlassCard className="p-5 border-l-4 border-l-cyan-500">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-3">
                    <TrendingUp size={16} />
                    <span>Opportunities</span>
                  </div>
                  <ul className="space-y-2 text-xs text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-300 mt-0.5">•</span>
                      <span>White-label B2B enterprise tier for agency partners.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-300 mt-0.5">•</span>
                      <span>Expansion into EU & LATAM markets with localized AI models.</span>
                    </li>
                  </ul>
                </GlassCard>

                {/* Threats */}
                <GlassCard className="p-5 border-l-4 border-l-rose-500">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-3">
                    <ShieldAlert size={16} />
                    <span>Threats</span>
                  </div>
                  <ul className="space-y-2 text-xs text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>Established incumbents introducing lightweight copycat features.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>Potential AI API price fluctuations requiring local model fallbacks.</span>
                    </li>
                  </ul>
                </GlassCard>
              </div>
              </div>
          </div>
        )}
      </>
    )}

        {/* Footer */}
        <footer
          className="pt-8 pb-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40"
          style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <div>
            <span className="font-bold text-white/80 mr-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              Ideaforge
            </span>
            <span>© 2026 Ideaforge. Audacious Validation.</span>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={() => setPage("about")} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => setPage("about")} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => setPage("about")} className="hover:text-white transition-colors">API</button>
            <button onClick={() => setIsHelpModalOpen(true)} className="hover:text-white transition-colors">Support</button>
          </div>
        </footer>
      </main>

      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div
            className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl"
            style={{ background: palette.matte[800], borderColor: "rgba(255, 255, 255, 0.15)" }}
          >
            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mb-4 text-cyan-300">
              <HelpCircle size={22} />
            </div>

            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>
              Ideaforge Support
            </h3>
            <p className="text-xs text-white/60 mb-4">
              Need assistance with your market validation or score analysis? Our team is available 24/7.
            </p>

            <div className="space-y-2 mb-6 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-cyan-300 block mb-0.5">Documentation & Guides</span>
                <span className="text-white/50">Learn how our AI calculates viability scores.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="font-bold text-cyan-300 block mb-0.5">Live Mentor Chat</span>
                <span className="text-white/50">Connect with startup advisors in real-time.</span>
              </div>
            </div>

            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white border border-white/20 hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

