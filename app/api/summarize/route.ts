import OpenAI from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const RATE_LIMIT_DURATION = "10s";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(1, RATE_LIMIT_DURATION),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests", retryAfter: RATE_LIMIT_DURATION },
        {
          status: 429,
          headers: {
            "Retry-After": RATE_LIMIT_DURATION,
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a summarization assistant. Summarize the given text.`,
        },
        { role: "user", content: text },
      ],
      max_tokens: 150,
      stop: null,
      temperature: 0.7,
    });

    const summary = response.choices[0]?.message?.content?.replace(
      /^"(.*)"$/,
      "$1"
    );

    return NextResponse.json(summary);
  } catch (error) {
    console.error("[AI_SUMMARIZE_POST]", error);
    return NextResponse.json(
      { error: "An error occurred during your request" },
      { status: 500 }
    );
  }
}
