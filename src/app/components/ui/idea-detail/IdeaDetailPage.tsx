import { useState } from "react";
import {
  ChevronRight, CheckCircle2, Flame, Users, Clock, Eye,
  ThumbsUp, Share2, BookOpen, MessageCircle, Heart,
} from "lucide-react";
import {
  Page,
  palette,
  metallicGradient,
  MetallicBtn,
  GlassCard,
  Tag,
} from "../shared";
import { comments } from "../shared/mockData";

export const IdeaDetailPage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [newComment, setNewComment] = useState("");
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setPage("dashboard")} className="text-white/50 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors">
          <ChevronRight size={14} className="rotate-180" /> Back to Dashboard
        </button>

        {/* Idea header */}
        <GlassCard glow className="p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag color="green"><CheckCircle2 size={10} className="mr-1" />Validated</Tag>
                <Tag color="orange"><Flame size={10} className="mr-1" />Trending</Tag>
              </div>
              <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                AI-Powered Resume Screener
              </h1>
              <p className="text-white/50 text-sm mb-4">
                Automate resume screening with GPT-4 to cut time-to-hire by 60% for mid-size HR teams.
              </p>
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1"><Users size={12} />Alex Kim</span>
                <span className="flex items-center gap-1"><Clock size={12} />Validated Jun 25</span>
                <span className="flex items-center gap-1"><Eye size={12} />1.2K views</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black" style={{ fontFamily: "'Unbounded', sans-serif", background: metallicGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>87</div>
              <div className="text-xs text-white/40 mt-1">Score</div>
              <div className="mt-2 text-sm font-bold text-white">142 votes</div>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-5 border-t" style={{ borderColor: palette.text.faint }}>
            <MetallicBtn className="text-xs px-4 py-2"><ThumbsUp size={12} className="inline mr-1" />Upvote (142)</MetallicBtn>
            <MetallicBtn outline className="text-xs px-4 py-2"><Share2 size={12} className="inline mr-1" />Share</MetallicBtn>
            <MetallicBtn outline className="text-xs px-4 py-2"><BookOpen size={12} className="inline mr-1" />Full Report</MetallicBtn>
          </div>
        </GlassCard>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["HR Tech", "AI / ML", "B2B SaaS", "Series Seed", "USA"].map((t) => <Tag key={t} color="blue">{t}</Tag>)}
        </div>

        {/* Discussion */}
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MessageCircle size={18} className="text-white/60" /> Discussion
          <span className="text-sm text-white/40 font-normal">({comments.length} comments)</span>
        </h2>

        {/* Comment input */}
        <GlassCard className="p-4 mb-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: palette.metallic[500], border: `1px solid ${palette.metallic[300]}66` }}>AK</div>
            <div className="flex-1">
              <label htmlFor="new-comment" className="sr-only">Add a comment</label>
              <input
                id="new-comment"
                name="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts or feedback…"
                aria-label="Add a comment"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: palette.matte[600], border: `1px solid ${palette.text.faint}` }}
              />
              {newComment && (
                <div className="mt-2 flex justify-end">
                  <MetallicBtn className="text-xs px-4 py-1.5">Post Comment</MetallicBtn>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Comments */}
        <div className="space-y-3">
          {comments.map((c) => (
            <GlassCard key={c.author} className="p-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: palette.metallic[500], border: `1px solid ${palette.metallic[300]}66` }}>
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{c.author}</span>
                    <span className="text-xs text-white/30">{c.time}</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{c.text}</p>
                  <button aria-label={`Like ${c.author}'s comment`} className="mt-2 flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors">
                    <Heart size={11} /> Like
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
