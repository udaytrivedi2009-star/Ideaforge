import { Home, Rocket, Compass, AlertTriangle } from "lucide-react";
import { Page } from "../shared";

interface NotFoundPageProps {
  setPage: (p: Page) => void;
}

export const NotFoundPage = ({ setPage }: NotFoundPageProps) => {
  return (
    <div
      className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center relative overflow-hidden text-white"
      style={{
        background: "radial-gradient(ellipse at 50% -20%, #2563eb 0%, #1d4ed8 45%, #1e3a8a 100%)",
      }}
    >
      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-400/20 blur-[130px] rounded-full" />
        <div className="absolute top-2/3 left-1/3 w-[500px] h-[250px] bg-cyan-400/15 blur-[110px] rounded-full" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center space-y-8">
        {/* 404 Hero Badge */}
        <div className="inline-flex flex-col items-center justify-center p-8 rounded-3xl border border-white/25 bg-white/10 backdrop-blur-2xl shadow-2xl space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-amber-300 shadow-lg">
            <AlertTriangle size={32} />
          </div>

          <div className="text-7xl font-black tracking-tight text-white drop-shadow-lg">
            4<span className="text-cyan-300">0</span>4
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-900/60 border border-white/20 px-4 py-1 text-xs font-black uppercase tracking-widest text-cyan-200">
            Page Not Found
          </span>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-white">Lost in Innovation?</h1>
          <p className="text-sm md:text-base text-blue-100/90 leading-relaxed font-medium max-w-md mx-auto">
            The page or startup analysis report you are looking for does not exist, has been moved, or the link is expired.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage("landing")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-xs font-black text-blue-700 shadow-xl transition-all duration-300 hover:bg-blue-50 hover:scale-105 active:scale-95"
          >
            <Home size={15} />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={() => setPage("dashboard")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-blue-900/50 px-6 py-3.5 text-xs font-black text-white backdrop-blur-xl transition-all duration-300 hover:bg-blue-900/80 hover:scale-105 active:scale-95"
          >
            <Compass size={15} />
            <span>Go to Dashboard</span>
          </button>

          <button
            onClick={() => setPage("submit")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/40 bg-cyan-500/20 px-6 py-3.5 text-xs font-black text-cyan-200 backdrop-blur-xl transition-all duration-300 hover:bg-cyan-500/30 hover:scale-105 active:scale-95"
          >
            <Rocket size={15} />
            <span>Validate New Idea</span>
          </button>
        </div>
      </div>
    </div>
  );
};
