import { useState } from "react";
import { Lightbulb, Star, ThumbsUp, Settings, LogOut, Inbox, Rocket } from "lucide-react";
import {
  Page,
  palette,
  metallicGradient,
  MetallicBtn,
  GlassCard,
  Tag,
} from "../shared";
import { DashboardIdea } from "../dashboard/DashboardPage";

interface ProfilePageProps {
  setPage: (p: Page) => void;
  user?: { name: string; email: string; avatar: string } | null;
  userIdeas?: DashboardIdea[];
  onLogout?: () => void;
}

export const ProfilePage = ({
  setPage,
  user,
  userIdeas = [],
  onLogout,
}: ProfilePageProps) => {
  const [tab, setTab] = useState<"ideas" | "votes" | "settings">("ideas");
  const userName = user?.name || "Alex Kim";
  const userEmail = user?.email || "alex@startup.com";
  const userAvatar = user?.avatar || "AK";

  const handleSignOut = () => {
    if (onLogout) onLogout();
    setPage("landing");
  };

  // Compute dynamic stats based on user's persistent ideas
  const ideaCount = userIdeas.length;
  const avgScore =
    ideaCount === 0
      ? "0.0"
      : (
          userIdeas.reduce((acc, curr) => {
            const scoreNum = parseFloat(curr.score || "8.5");
            return acc + (isNaN(scoreNum) ? 8.5 : scoreNum);
          }, 0) / ideaCount
        ).toFixed(1);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <GlassCard glow className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-lg"
              style={{ background: metallicGradient }}
            >
              {userAvatar}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                {userName}
              </h1>
              <p className="text-white/50 text-sm">{userEmail}</p>

              {/* Dynamic Stats Row */}
              <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                <span className="flex items-center gap-1 font-semibold text-white/80">
                  <Lightbulb size={13} className="text-amber-300" />
                  {ideaCount} {ideaCount === 1 ? "idea" : "ideas"}
                </span>
                <span className="flex items-center gap-1 font-semibold text-white/80">
                  <Star size={13} className="text-cyan-300" />
                  Avg score {avgScore}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={13} />
                  0 votes cast
                </span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <MetallicBtn outline onClick={() => setTab("settings")} className="text-xs px-4 py-2">
                <Settings size={14} className="inline mr-1" />Settings
              </MetallicBtn>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-red-300 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {(["ideas", "votes", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                tab === t ? "text-white shadow-lg" : "text-white/50 hover:text-white"
              }`}
              style={{
                background: tab === t ? metallicGradient : "rgba(255,255,255,0.08)",
                border: `1px solid ${palette.text.faint}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Ideas Tab */}
        {tab === "ideas" && (
          <div>
            {userIdeas.length === 0 ? (
              /* EMPTY STATE FOR FIRST-TIME USER */
              <GlassCard className="p-8 sm:p-12 text-center flex flex-col items-center justify-center border-dashed border-white/20">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
                  style={{ background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                >
                  <Inbox size={32} className="text-cyan-300" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                  No Submitted Ideas Yet
                </h3>

                <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  When you submit startup concepts, they will automatically be saved and displayed here in your founder profile.
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
              /* PERSISTENT USER IDEAS GRID */
              <div className="space-y-3">
                {userIdeas.map((idea) => (
                  <GlassCard key={idea.id} className="p-4 hover:border-cyan-400/40 transition-colors">
                    <div className="flex justify-between items-center gap-4">
                      <div>
                        <h3 className="font-bold text-white text-sm">{idea.title}</h3>
                        <p className="text-white/60 text-xs line-clamp-1 mt-0.5">{idea.description}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Tag color="blue">{idea.statusLabel || "Concept"}</Tag>
                          <span className="text-xs text-white/40">Added {idea.date || "Recently"}</span>
                        </div>
                      </div>
                      {idea.score && (
                        <div
                          className="text-xl font-black shrink-0"
                          style={{
                            fontFamily: "'Unbounded', sans-serif",
                            background: metallicGradient,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {idea.score}
                        </div>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Votes Tab */}
        {tab === "votes" && (
          <GlassCard className="p-8 text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: palette.matte[600], border: `1px solid ${palette.text.faint}` }}
            >
              <ThumbsUp size={28} className="text-white/50" />
            </div>
            <p className="text-white/60 text-sm">You haven&apos;t voted on any startup ideas yet.</p>
            <MetallicBtn outline onClick={() => setPage("dashboard")} className="mt-4 text-xs px-4 py-2">
              Go to Dashboard
            </MetallicBtn>
          </GlassCard>
        )}

        {/* Settings Tab */}
        {tab === "settings" && (
          <div className="space-y-4">
            <GlassCard className="p-6">
              <h3 className="font-bold text-white text-sm mb-4">Account Settings</h3>
              <div className="space-y-4">
                {[
                  { id: "settings-name", name: "displayName", label: "Display Name", value: userName },
                  { id: "settings-email", name: "email", label: "Email", value: userEmail },
                  { id: "settings-role", name: "role", label: "Role", value: "Founder" },
                ].map((f) => (
                  <div key={f.label}>
                    <label htmlFor={f.id} className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      name={f.name}
                      defaultValue={f.value}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                      style={{ background: palette.matte[600], border: `1px solid ${palette.text.faint}` }}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut size={14} /> Sign Out of Account
              </button>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
