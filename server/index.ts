import "dotenv/config";
import cors from "cors";
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { z } from "zod";

const app = express();
const port = Number(process.env.PORT || 3001);
const provider = process.env.AI_PROVIDER || "anthropic";
const requestTimeoutMs = 30_000;
const rateLimitWindowMs = 60_000;
const rateLimitMax = 20;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

if (provider !== "anthropic" && provider !== "openai") {
  throw new Error(`Unsupported AI_PROVIDER: ${provider}. Use anthropic or openai.`);
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:4173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "64kb" }));

app.use("/api/ai", (request, response, next) => {
  const now = Date.now();
  const clientKey = request.ip || request.socket.remoteAddress || "unknown";
  const current = requestCounts.get(clientKey);

  if (!current || current.resetAt <= now) {
    requestCounts.set(clientKey, { count: 1, resetAt: now + rateLimitWindowMs });
    return next();
  }

  if (current.count >= rateLimitMax) {
    return response.status(429).json({ error: "Too many AI requests. Please try again shortly." });
  }

  current.count += 1;
  return next();
});

const chatRequestSchema = z.object({
  question: z.string().trim().min(1).max(4000),
  idea: z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(5000),
  }),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().max(4000),
      })
    )
    .max(20)
    .default([]),
});

const systemPrompt = `You are Ideaforge's startup validation assistant.
Answer based on the selected startup idea. Be practical, specific, and concise.
Separate assumptions from facts, do not invent market data, and recommend concrete next validation steps.`;

const getAnthropicAnswer = async (
  question: string,
  idea: { title: string; description: string },
  history: { role: "user" | "assistant"; text: string }[],
  signal: AbortSignal
) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const client = new Anthropic({ apiKey });
  const result = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
    max_tokens: 1000,
    signal,
    system: `${systemPrompt}\n\nSelected idea:\nTitle: ${idea.title}\nDescription: ${idea.description}`,
    messages: [
      ...history.map((message) => ({ role: message.role, content: message.text })),
      { role: "user" as const, content: question },
    ],
  });

  const textBlock = result.content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : "The AI returned no text response.";
};

const getOpenAIAnswer = async (
  question: string,
  idea: { title: string; description: string },
  history: { role: "user" | "assistant"; text: string }[],
  signal: AbortSignal
) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const client = new OpenAI({ apiKey });
  const result = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    instructions: `${systemPrompt}\n\nSelected idea:\nTitle: ${idea.title}\nDescription: ${idea.description}`,
    input: [
      ...history.map((message) => ({ role: message.role, content: message.text })),
      { role: "user" as const, content: question },
    ],
  }, { signal });

  return result.output_text || "The AI returned no text response.";
};

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, provider });
});

app.post("/api/ai/insights", async (request, response) => {
  const parsed = chatRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid question or idea data." });
  }

  const { question, idea, history } = parsed.data;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const answer = provider === "openai"
      ? await getOpenAIAnswer(question, idea, history, controller.signal)
      : await getAnthropicAnswer(question, idea, history, controller.signal);

    return response.json({ answer });
  } catch (error) {
    if (controller.signal.aborted) {
      return response.status(504).json({ error: "The AI service timed out. Please try again." });
    }
    console.error("AI provider request failed:", error instanceof Error ? error.message : error);
    return response.status(502).json({ error: "The AI service could not answer right now." });
  } finally {
    clearTimeout(timeout);
  }
});

app.listen(port, () => {
  console.log(`Ideaforge AI backend listening on http://localhost:${port}`);
});
