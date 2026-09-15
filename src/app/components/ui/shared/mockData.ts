

export interface Idea {
  id: number;
  title: string;
  status: "validated" | "analyzing" | "draft";
  score: number | null;
  votes: number;
  tags: string[];
  date: string;
}

export const ideas: Idea[] = [];


export const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  validated: { label: "Validated", color: "green", dot: "#10B981" },
  analyzing: { label: "Analyzing…", color: "blue", dot: "#5A96D4" }, // matches palette.metallic[400]
  draft: { label: "Draft", color: "orange", dot: "#F59E0B" },
};

export interface CommunityIdea {
  id: number;
  title: string;
  author: string;
  score: number;
  votes: number;
  tags: string[];
  trending: boolean;
}

export const communityIdeas: CommunityIdea[] = [
  { id: 1, title: "B2B SaaS for Construction Site Safety Monitoring", author: "Maya R.", score: 91, votes: 312, tags: ["B2B", "AI", "Safety"], trending: true },
  { id: 2, title: "Subscription Box for Indie Game Merch", author: "Leo K.", score: 64, votes: 87, tags: ["Consumer", "Gaming"], trending: false },
  { id: 3, title: "Carbon Credit Marketplace for SMBs", author: "Priya S.", score: 78, votes: 201, tags: ["Climate", "Marketplace"], trending: true },
  { id: 4, title: "AI Writing Coach for Non-Native Speakers", author: "James T.", score: 83, votes: 156, tags: ["AI", "EdTech"], trending: false },
  { id: 5, title: "Peer Mentorship App for First-Gen College Students", author: "Sofia M.", score: 72, votes: 98, tags: ["EdTech", "Social"], trending: false },
  { id: 6, title: "On-Demand Tutoring for Trade Skills (Electrician, Plumbing)", author: "Dan O.", score: 88, votes: 271, tags: ["Marketplace", "Education"], trending: true },
];

export interface Comment {
  author: string;
  avatar: string;
  time: string;
  text: string;
}

export const comments: Comment[] = [
  { author: "Priya S.", avatar: "PS", time: "2h ago", text: "This is exactly what I was looking for. The market timing feels right given the wave of AI hiring tools." },
  { author: "Leo K.", avatar: "LK", time: "4h ago", text: "Have you considered targeting staffing agencies first? Faster sales cycle than direct enterprise." },
  { author: "Maya R.", avatar: "MR", time: "1d ago", text: "The SWOT here is solid. Competitor moat analysis is particularly sharp. Validated from my own research." },
];
