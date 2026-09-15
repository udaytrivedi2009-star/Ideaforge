import { ArrowRight } from "lucide-react";
import {
  Page,
  palette,
  metallicGradient,
  MetallicBtn,
  GlassCard,
  SectionLabel,
} from "../shared";

export const AboutPage = ({ setPage }: { setPage: (p: Page) => void }) => (
  <div className="min-h-screen pt-24 pb-12 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <SectionLabel>About</SectionLabel>
      <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight"
        style={{ fontFamily: "'Unbounded', sans-serif" }}>
        Validation for the <span style={{ background: metallicGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ambitious</span>.
      </h1>
      <p className="text-white/50 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
        ValidateAI gives founders and investors the AI-powered intelligence they need
        to make confident decisions about which ideas to pursue, fund, or accelerate.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { num: "24K+", label: "Ideas Validated" },
          { num: "8.2K+", label: "Active Founders" },
          { num: "47s", label: "Avg Analysis Time" },
        ].map((s) => (
          <GlassCard key={s.label} className="p-8 text-center" glow>
            <div className="text-4xl font-black text-white mb-2" style={{ fontFamily: "'Unbounded', sans-serif" }}>{s.num}</div>
            <div className="text-sm text-white/50">{s.label}</div>
          </GlassCard>
        ))}
      </div>
      <MetallicBtn onClick={() => setPage("auth")}>
        Get Started Free <ArrowRight size={16} className="inline ml-1" />
      </MetallicBtn>
    </div>
  </div>
);
