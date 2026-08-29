import Groq from "groq-sdk";

// Free-tier friendly: Groq hosts open-weight models at very low/no cost and
// with fast inference, which matters for a live demo. Override via
// GROQ_MODEL if you want to try a different hosted model.
export const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

let _client: Groq | null = null;

/** Lazily constructed so the app still boots (and falls back to mock data) with no API key set. */
export function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) return null;
  if (!_client) _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _client;
}

export function hasGroqKey(): boolean {
  return !!process.env.GROQ_API_KEY;
}
