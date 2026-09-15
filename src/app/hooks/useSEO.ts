import { useEffect } from "react";
import { Page } from "../components/ui/shared";

interface PageSEO {
  title: string;
  description: string;
}

const pageSeoMap: Record<Page, PageSEO> = {
  landing: {
    title: "Ideaforge | AI Startup Idea Validation & Market Intelligence",
    description: "Validate startup concepts in seconds with AI-powered SWOT analysis, market sizing (TAM/SAM/SOM), competitor moat analysis, and 3-year revenue forecasts.",
  },
  auth: {
    title: "Sign In & Get Started | Ideaforge Founder Platform",
    description: "Sign in or create your free founder account on Ideaforge to validate startup concepts and generate investor-ready reports.",
  },
  dashboard: {
    title: "Founder Dashboard | Ideaforge Idea Portfolio & Insights",
    description: "Manage your validated startup portfolio, view detailed viability scores, and explore deep market analytics on your dashboard.",
  },
  submit: {
    title: "Validate Your Startup Idea | Ideaforge AI Engine",
    description: "Submit your startup idea for instant AI-driven market validation, SWOT analysis, competitor auditing, and financial projections.",
  },
  analyzing: {
    title: "Analyzing Startup Concept... | Ideaforge Live Telemetry",
    description: "Live AI telemetry engines analyzing market size, competitor landscape, financial model, and investor readiness for your startup.",
  },
  results: {
    title: "Full Insights Report & Analysis | Ideaforge AI Validation",
    description: "Comprehensive startup report featuring TAM/SAM/SOM market sizing, 4-quadrant SWOT matrix, competitor moats, 3-year revenue forecasts, and action plan.",
  },
  "idea-detail": {
    title: "Startup Idea Deep Dive | Ideaforge Market Intelligence",
    description: "In-depth breakdown of startup metrics, community signal, founder readiness, and execution roadmap.",
  },
  profile: {
    title: "Founder Profile & Saved Ideas | Ideaforge Platform",
    description: "View your saved startup concepts, validation scores, and account settings on your Ideaforge profile.",
  },
  about: {
    title: "About Ideaforge | Built for Solo Founders & SaaS Teams",
    description: "Learn how Ideaforge empowers solo founders and SaaS builders to validate ideas quickly and raise capital with data-driven confidence.",
  },
  "not-found": {
    title: "404 - Page Not Found | Ideaforge",
    description: "The page or startup analysis report you are looking for does not exist or has been moved.",
  },
};

export const useSEO = (page: Page) => {
  useEffect(() => {
    const seo = pageSeoMap[page] || pageSeoMap.landing;
    document.title = seo.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", seo.description);
    } else {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      metaDesc.setAttribute("content", seo.description);
      document.head.appendChild(metaDesc);
    }
  }, [page]);
};
