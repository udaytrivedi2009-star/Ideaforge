# Ideaforge

Ideaforge is an AI-powered startup validation platform designed to help founders turn raw ideas into structured, testable business opportunities. The product guides users from idea submission to validation, AI-driven insight generation, and portfolio tracking, making it easier to evaluate traction, risks, and strategic direction before a launch.

## Overview

The application combines:

- a polished landing and auth experience
- a founder dashboard for managing ideas
- AI-assisted idea analysis and recommendations
- structured startup validation workflows
- profile and portfolio views for idea history and performance
- a lightweight backend service for AI-powered insights using Anthropic or OpenAI

This project is built as a modern React + Vite frontend with a Node/Express API layer for AI orchestration.

## Product Vision

Ideaforge helps early-stage founders answer questions like:

- Is this idea worth pursuing?
- What assumptions should be validated first?
- What market risks do I need to test?
- Which ideas are strongest or most actionable?

By combining a founder-friendly workflow with AI generated feedback, the platform turns uncertain ideas into clearer validation decisions.

## Core Features

### 1. Landing Experience
A premium landing page introduces the product, positions the platform value proposition, and routes users into onboarding or sign-in.

### 2. Authentication Flow
Users can sign in or move through a lightweight auth journey before entering the dashboard experience.

### 3. Founder Dashboard
The dashboard acts as the main workspace for:

- viewing ideas
- monitoring validation progress
- reviewing AI-generated insights
- navigating between portfolio, analysis, and profile sections

### 4. Idea Submission
Users can submit new startup ideas with metadata and descriptions, which are then stored locally in the app and surfaced across the dashboard workflow.

### 5. AI Insight Engine
Ideas can be sent to the backend AI service, which generates contextual feedback based on:

- business idea description
- founder context
- prior user prompts and conversation history

The backend supports both Anthropic and OpenAI models, making it easy to swap providers.

### 6. Profile and Portfolio Management
The app includes profile pages and idea tracking features so users can review submissions and manage their validation journey over time.

### 7. Responsive UI
The interface is built with a polished, modern design system using reusable UI primitives and responsive layout patterns.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Lucide React
- Framer Motion / motion utilities
- Custom design tokens and reusable UI components

### Backend
- Node.js
- Express
- Anthropic SDK
- OpenAI SDK
- Zod validation
- CORS and environment-based configuration

### Tools
- pnpm (lock file included)
- ESBuild / Vite for fast local development
- tsx for TypeScript execution in the backend

## Project Structure

```text
Ideaforge/
├── public/                 # Static public assets and site metadata
├── server/
│   └── index.ts           # Express AI backend
├── src/
│   ├── app/               # Main application pages and UI logic
│   ├── components/        # Reusable UI components
│   ├── imports/           # Import layer or supporting modules
│   ├── lib/               # Utilities and helpers
│   ├── styles/            # Global CSS and theme files
│   ├── types/             # Type definitions
│   └── main.tsx           # App bootstrap
├── .gitignore
├── ATTRIBUTIONS.md
├── components.json
├── default_shadcn_theme.css
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── vite.config.ts
└── guidelines/
    └── Guidelines.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 18+ or later
- npm or pnpm
- a valid AI provider API key for either Anthropic or OpenAI

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Ideaforge
```

2. Install dependencies:

```bash
npm install
```

or, if preferred:

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=3001
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_key
# OR
# OPENAI_API_KEY=your_openai_key
# OPENAI_MODEL=gpt-4.1-mini
# ANTHROPIC_MODEL=claude-3-5-sonnet-latest
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

> If you do not configure an API key, the AI backend will fail when the insight endpoint is called.

## Running the App

### Start the frontend

```bash
npm run dev
```

This runs the Vite application locally.

### Start the AI backend

Open a second terminal and run:

```bash
npm run server
```

The backend exposes the health endpoint at:

```text
http://localhost:3001/api/health
```

and the insight route at:

```text
http://localhost:3001/api/ai/insights
```

## Available Scripts

From the project root:

```bash
npm run dev     # starts the frontend development server
npm run build   # creates a production build
npm run server  # starts the Express AI backend
```

## Application Flow

The app follows a simple founder journey:

1. User lands on the marketing page
2. User signs in or enters the app
3. User submits one or more startup ideas
4. The app directs the idea into a validation workflow
5. AI produces recommendations, risks, and suggestions
6. The founder reviews insights in the dashboard and profile experience

## AI Backend Behavior

The backend service validates incoming requests and routes them to the configured AI provider.

It includes:

- request validation with Zod
- CORS configuration for local frontend origins
- simple rate limiting for AI requests
- provider abstractions for Anthropic and OpenAI
- timeout handling for long-running AI calls

## Design and UX Notes

The interface is intentionally designed to feel premium and founder-focused, with:

- dark editorial styling
- neon blue accent gradients
- strong typography for startup and product messaging
- glassmorphism-inspired cards and clear hierarchy
- a responsive dashboard layout for ideation workflows

## Notes for Contributors

If you are extending the project, the most relevant entry points are:

- [src/app/App.tsx](src/app/App.tsx) — central page routing and app state
- [src/app/components/ui/dashboard/DashboardPage.tsx](src/app/components/ui/dashboard/DashboardPage.tsx) — main founder dashboard experience
- [src/app/components/ui/landing/LandingPage.tsx](src/app/components/ui/landing/LandingPage.tsx) — product marketing entry page
- [server/index.ts](server/index.ts) — AI backend and provider integration

## Future Enhancements

Potential next steps for the product include:

- persistent user accounts and real database storage
- idea scoring models and trend analytics
- richer AI validation reports
- competitor intelligence integration
- investor-ready export features
- team collaboration and sharing workflows

## License

This project currently does not declare a specific license in the repository. If you plan to distribute or deploy it publicly, it is recommended to add a license file and define the terms clearly.

## Contact / Project Ownership

This repository appears to be a product prototype focused on startup validation and founder tooling. Update this section with your organization, maintainer, or contact details before public release.

---

Built for early-stage founder workflows, AI-guided validation, and decision-making clarity.
