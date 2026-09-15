import { useState, useEffect } from "react";
import { Page, palette, Nav } from "@/app/components/ui/shared";
import { LandingPage } from "@/app/components/ui/landing/LandingPage";
import { AuthPage } from "@/app/components/ui/auth/AuthPage";
import { DashboardPage, DashboardIdea } from "@/app/components/ui/dashboard/DashboardPage";
import { SubmitPage } from "@/app/components/ui/submit/SubmitPage";
import { AnalyzingPage } from "@/app/components/ui/analyzing/AnalyzingPage";
import { ResultsPage } from "@/app/components/ui/results/ResultsPage";
import { IdeaDetailPage } from "@/app/components/ui/idea-detail/IdeaDetailPage";
import { ProfilePage } from "@/app/components/ui/profile/ProfilePage";
import { AboutPage } from "@/app/components/ui/about/AboutPage";
import { NotFoundPage } from "@/app/components/ui/not-found/NotFoundPage";
import { SplashScreen } from "@/app/components/ui/splash/SplashScreen";
import { useSEO } from "@/app/hooks/useSEO";
import TidalCursor from "@/components/ui/tidal-cursor";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

function App() {
  const [page, setPage] = useState<Page>("landing");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (window.location.pathname !== "/") {
      setPage("not-found");
    }
  }, []);

  // Dynamic SEO title and description update per page
  useSEO(page);

  // Persist user session only for the current browser tab/session (sessionStorage)
  // Using sessionStorage means the session is cleared when the browser/tab is closed
  // Clean up any stale user session previously stored in localStorage (old behavior)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      localStorage.removeItem("ideaforge_user"); // remove any stale persistent session
      const savedUser = sessionStorage.getItem("ideaforge_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [selectedIdea, setSelectedIdea] = useState<DashboardIdea | null>(null);

  // Persistent User Ideas state: Default to EMPTY array [] for first-time users
  const [userIdeas, setUserIdeas] = useState<DashboardIdea[]>(() => {
    try {
      const savedIdeas = localStorage.getItem("ideaforge_user_ideas");
      if (savedIdeas) {
        return JSON.parse(savedIdeas);
      }
    } catch (e) {
      console.error("Failed to load user ideas from localStorage:", e);
    }
    return [];
  });

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      sessionStorage.setItem("ideaforge_user", JSON.stringify(newUser));
    } catch (e) {
      console.error("Failed to save user session:", e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem("ideaforge_user");
    } catch (e) {
      console.error("Failed to clear user session:", e);
    }
  };

  const handleAddIdea = (newIdeaData: Omit<DashboardIdea, "id">) => {
    const createdIdea: DashboardIdea = {
      ...newIdeaData,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: "validated",
      score: "87 / 100",
    };
    setSelectedIdea(createdIdea);
    setUserIdeas((prev) => {
      const updated = [createdIdea, ...prev];
      try {
        localStorage.setItem("ideaforge_user_ideas", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to persist idea:", e);
      }
      return updated;
    });
  };

  const handleDeleteIdea = (ideaId: number) => {
    setUserIdeas((prev) => {
      const updated = prev.filter((item) => item.id !== ideaId);
      try {
        localStorage.setItem("ideaforge_user_ideas", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update stored ideas:", e);
      }
      return updated;
    });
  };

  // Navigation handler: Redirect logged in user away from auth page
  const handleSetPage = (targetPage: Page) => {
    if (window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }

    if (user && targetPage === "auth") {
      setPage("dashboard");
    } else {
      setPage(targetPage);
    }
  };

  // Auto-redirect from auth page to dashboard if user is already logged in
  useEffect(() => {
    if (user && page === "auth") {
      setPage("dashboard");
    }
  }, [user, page]);

  const renderPage = () => {
    switch (page) {
      case "landing":
        return <LandingPage setPage={handleSetPage} />;
      case "auth":
        if (user) {
          return (
            <DashboardPage
              setPage={handleSetPage}
              user={user}
              onLogout={handleLogout}
              ideas={userIdeas}
              onAddIdea={handleAddIdea}
              onDeleteIdea={handleDeleteIdea}
              onSelectIdea={(idea) => setSelectedIdea(idea)}
            />
          );
        }
        return <AuthPage setPage={handleSetPage} onLogin={handleLogin} user={user} />;
      case "dashboard":
        return (
          <DashboardPage
            setPage={handleSetPage}
            user={user}
            onLogout={handleLogout}
            ideas={userIdeas}
            onAddIdea={handleAddIdea}
            onDeleteIdea={handleDeleteIdea}
            onSelectIdea={(idea) => setSelectedIdea(idea)}
          />
        );
      case "submit":
        return <SubmitPage setPage={handleSetPage} onAddIdea={handleAddIdea} />;
      case "analyzing":
        return <AnalyzingPage setPage={handleSetPage} />;
      case "results":
        return <ResultsPage setPage={handleSetPage} selectedIdea={selectedIdea || userIdeas[0] || null} />;
      case "idea-detail":
        return <IdeaDetailPage setPage={handleSetPage} />;
      case "profile":
        return <ProfilePage setPage={handleSetPage} user={user} userIdeas={userIdeas} onLogout={handleLogout} />;
      case "about":
        return <AboutPage setPage={handleSetPage} />;
      case "not-found":
        return <NotFoundPage setPage={handleSetPage} />;
      default:
        return <NotFoundPage setPage={handleSetPage} />;
    }
  };

  return (
    <div className="relative min-h-screen" style={{ background: palette.matte[900] }}>
      <TidalCursor color="#ffffff" ringColor="rgba(255, 255, 255, 0.25)" dotSize={7} ringSize={36} />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className={showSplash ? "invisible" : "visible"}>
        {page !== "dashboard" && <Nav page={page} setPage={handleSetPage} user={user} />}
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
