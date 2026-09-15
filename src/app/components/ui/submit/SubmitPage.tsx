import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Brain,
  Gauge,
  Rocket,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Page } from "../shared";
import { PromptInput } from "@/components/ui/ai-chat-input";

/* ── input validation helper & checklist component ──────────────────── */
export const validateField = (text: string) => {
  const trimmed = text.trim();
  const notEmpty = trimmed.length > 0;
  const minLength = trimmed.length >= 10;

  const lower = trimmed.toLowerCase();
  const cleanStr = lower.replace(/[^a-z0-9]/g, "");
  const uniqueChars = new Set(cleanStr).size;
  const words = trimmed.split(/\s+/).filter((w) => w.length > 1);
  const isRepeated = /^(.)\1+$/i.test(cleanStr);
  const isKeyboardMash = /^(asdf|qwerty|zxcv|1234|abcd)/i.test(cleanStr);

  const isGibberish =
    isRepeated ||
    isKeyboardMash ||
    (trimmed.length >= 5 && uniqueChars < 3) ||
    (trimmed.length >= 12 && words.length <= 1 && uniqueChars < 4);

  const isValid = notEmpty && minLength && !isGibberish;

  return {
    notEmpty,
    minLength,
    isMeaningful: notEmpty && !isGibberish,
    isValid,
    charCount: trimmed.length,
  };
};



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

/* ── palette tokens ─────────────────────────────────────────────────── */
const blue: Record<number, string> = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a",
};

/* ── small sub-components ────────────────────────────────────────────── */
const FeaturePill = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm">
    <Icon size={13} className="text-blue-500" />
    {label}
  </div>
);

const StepDot = ({ num, active, done }: { num: number; active: boolean; done: boolean }) => (
  <div
    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all duration-300"
    style={{
      background: done || active ? "#ffffff" : "rgba(255,255,255,0.2)",
      border: `2px solid ${active || done ? "#ffffff" : "rgba(255,255,255,0.4)"}`,
      color: active || done ? blue[600] : "#ffffff",
      boxShadow: active ? "0 0 0 4px rgba(255,255,255,0.3)" : "none",
    }}
  >
    {done ? <CheckCircle2 size={13} /> : num}
  </div>
);

/* ── analysisItems for the launch step ─────────────────────────────── */
const analysisItems = [
  [BarChart3, "Market Size Analysis (TAM / SAM / SOM)"],
  [Target, "Competitor Landscape Mapping"],
  [Brain, "SWOT Intelligence Matrix"],
  [Gauge, "Validation Viability Score 0–100"],
  [Users, "ICP & Audience Profiling"],
  [Rocket, "Investor Readiness Memo"],
];

/* ── main page ───────────────────────────────────────────────────────── */
export const SubmitPage = ({
  setPage,
  onAddIdea,
}: {
  setPage: (p: Page) => void;
  onAddIdea?: (idea: Omit<DashboardIdea, "id">) => void;
}) => {
  const [step, setStep] = useState(1);
  const [aiPrompt, setAiPrompt] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const steps = ["Idea", "Details", "Launch"];

  const handleStep1Submit = (val: string) => {
    const v = validateField(val);
    if (!v.isValid) {
      setErrorMsg("Please enter a valid startup idea description (at least 10 characters, no blank or random text).");
      return;
    }
    setErrorMsg(null);
    setAiPrompt(val);
    setStep(2);
  };

  const handleStep2Continue = () => {
    const probValid = validateField(problem).isValid;
    const solValid = validateField(solution).isValid;
    if (!probValid || !solValid) {
      setErrorMsg("Both Problem Statement and Your Solution must meet all checklist criteria (min 10 characters, no blank or random text) to continue.");
      return;
    }
    setErrorMsg(null);
    setStep(3);
  };

  const isStepAvailable = (targetStep: number) => {
    if (targetStep <= step) return true;
    if (targetStep === 2) return validateField(aiPrompt).isValid;
    if (targetStep === 3) {
      return validateField(aiPrompt).isValid && validateField(problem).isValid && validateField(solution).isValid;
    }
    return false;
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep <= step) {
      setErrorMsg(null);
      setStep(targetStep);
      return;
    }

    if (targetStep === 2) {
      handleStep1Submit(aiPrompt);
      return;
    }

    if (targetStep === 3) {
      if (!validateField(aiPrompt).isValid) {
        handleStep1Submit(aiPrompt);
        setStep(1);
        return;
      }
      handleStep2Continue();
    }
  };

  const handleLaunchAnalysis = () => {
    const userTypedTitle = aiPrompt.trim().replace(/^["']|["']$/g, "") || "New Startup Concept";
    if (onAddIdea) {
      onAddIdea({
        title: userTypedTitle,
        description:
          solution.trim() ||
          problem.trim() ||
          aiPrompt.trim() ||
          "AI-powered market validation analysis in progress...",
        status: "analyzing",
        statusLabel: "Analyzing",
        scanned: "12% Scanned",
        avatars: ["US", "AI"],
        likes: 0,
        comments: 0,
      });
    }
    setPage("analyzing");
  };

  /* shared input style matching AI chat box */
  const inputCls =
    "w-full rounded-2xl border border-blue-500 bg-blue-600 px-4 py-3.5 text-sm font-medium text-white placeholder-blue-200 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 shadow-md shadow-blue-600/20";

  return (
    <div
      className="relative min-h-screen overflow-hidden px-4 pb-20 pt-24"
      style={{ background: "#2563eb" }}
    >
      {/* ── animated grid background ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,.15), transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* ── page header ── */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            <Sparkles size={12} className="text-blue-200" />
            AI-Powered Validation
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Submit Your Idea
          </h1>
          <p className="mt-2 text-sm text-blue-100 font-medium">
            Give us the signal — AI does the rest in under 60&nbsp;seconds.
          </p>
        </div>

        {/* ── stepper ── */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                type="button"
                onClick={() => handleStepClick(i + 1)}
                disabled={!isStepAvailable(i + 1)}
                className={`flex flex-col items-center gap-1 px-4 transition-opacity ${isStepAvailable(i + 1) ? "cursor-pointer" : "cursor-default opacity-60"}`}
              >
                <StepDot num={i + 1} active={i + 1 === step} done={i + 1 < step} />
                <span
                  className="text-[10px] font-bold uppercase tracking-widest transition-colors"
                  style={{ color: i + 1 <= step ? "#ffffff" : "#bfdbfe" }}
                >
                  {s}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className="mx-2 h-px w-16 transition-all duration-500"
                  style={{ background: i + 1 < step ? "#ffffff" : "rgba(255,255,255,0.3)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── step card ── */}
        <div
          className="rounded-[28px] border border-blue-100 bg-white shadow-xl shadow-blue-100/60"
          style={{ boxShadow: "0 20px 60px rgba(37,99,235,.10), 0 2px 8px rgba(37,99,235,.06)" }}
        >
          <div className="p-8">
            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ════ STEP 1 — Idea ════ */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-1 text-xl font-black text-blue-900">
                    What's your idea?
                  </h2>
                  <p className="text-xs text-blue-400">
                    Describe your startup concept, market hypothesis, or problem space.
                  </p>
                </div>

                {/* AI prompt input — star of the show */}
                <div className="py-4">
                  <label className="mb-3 block text-[11px] font-bold uppercase tracking-widest text-blue-400">
                    Describe with AI Copilot
                  </label>
                  <div className="flex flex-col items-center">
                    <PromptInput
                      value={aiPrompt}
                      onChange={(val) => {
                        setErrorMsg(null);
                        setAiPrompt(val);
                      }}
                      placeholder=""
                      onSubmit={(val) => handleStep1Submit(val)}
                      clearOnSubmit={false}
                      showModelSelector={false}
                      models={["GPT 5.5", "Opus 4.8", "Gemini 3.5 Flash", "Composer 2.5", "GLM 5.2"]}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ════ STEP 2 — Details ════ */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-black text-blue-900">Describe the problem</h2>
                <div>
                  <label htmlFor="problem-statement" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-blue-400">
                    Problem Statement
                  </label>
                  <textarea
                    id="problem-statement"
                    rows={3}
                    value={problem}
                    onChange={(e) => {
                      setErrorMsg(null);
                      setProblem(e.target.value);
                    }}
                    placeholder="What pain point does this solve? Who has this problem?"
                    className={inputCls + " resize-none"}
                  />
                </div>
                <div>
                  <label htmlFor="idea-solution" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-blue-400">
                    Your Solution
                  </label>
                  <textarea
                    id="idea-solution"
                    rows={3}
                    value={solution}
                    onChange={(e) => {
                      setErrorMsg(null);
                      setSolution(e.target.value);
                    }}
                    placeholder="How does your idea solve it? What makes it unique?"
                    className={inputCls + " resize-none"}
                  />
                </div>
              </div>
            )}

            {/* ════ STEP 3 — Launch ════ */}
            {step === 3 && (
              <div className="space-y-6">
                {/* hero icon */}
                <div className="flex flex-col items-center gap-3 text-center">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${blue[700]}, ${blue[500]})` }}
                  >
                    <Zap size={36} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-blue-900">Ready to launch?</h2>
                    <p className="mt-1 max-w-xs text-sm text-blue-400">
                      Our AI will analyze your idea and have investor-grade results in under 60&nbsp;seconds.
                    </p>
                  </div>
                </div>

                {/* idea recap */}
                {aiPrompt && (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">Your Idea</div>
                    <div className="text-sm font-bold text-blue-900">{aiPrompt}</div>
                  </div>
                )}

                {/* what the analysis includes */}
                <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 text-[11px] font-bold uppercase tracking-widest text-blue-400">
                    Analysis will include
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {analysisItems.map(([Icon, label]) => {
                      const IconComp = Icon as React.ElementType;
                      return (
                        <div key={label as string} className="flex items-center gap-2.5 text-xs font-semibold text-blue-700">
                          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-50">
                            <IconComp size={13} className="text-blue-500" />
                          </div>
                          {label as string}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* feature pills */}
                <div className="flex flex-wrap justify-center gap-2">
                  <FeaturePill icon={Sparkles} label="AI-Powered" />
                  <FeaturePill icon={Gauge} label="90s Results" />
                  <FeaturePill icon={Users} label="500+ Investors" />
                </div>
              </div>
            )}

            {/* ── nav buttons ── */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => {
                  setErrorMsg(null);
                  step > 1 ? setStep((s) => s - 1) : setPage("dashboard");
                }}
                className="rounded-xl border border-blue-100 px-5 py-2.5 text-sm font-semibold text-blue-500 transition-all hover:border-blue-300 hover:text-blue-700"
              >
                {step === 1 ? "Cancel" : "← Back"}
              </button>

              {step === 1 ? (
                <button
                  onClick={() => handleStep1Submit(aiPrompt)}
                  className="flex items-center gap-2 rounded-xl px-7 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${blue[700]}, ${blue[500]})`,
                    boxShadow: "0 8px 24px rgba(37,99,235,.30)",
                  }}
                >
                  Continue <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  onClick={() => (step === 2 ? handleStep2Continue() : handleLaunchAnalysis())}
                  className="flex items-center gap-2 rounded-xl px-7 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${blue[700]}, ${blue[500]})`,
                    boxShadow: "0 8px 24px rgba(37,99,235,.30)",
                  }}
                >
                  {step === 3 ? (
                    <>
                      <Zap size={15} /> Launch Analysis
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight size={15} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
