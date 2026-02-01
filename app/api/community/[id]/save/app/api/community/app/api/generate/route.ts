import { NextResponse } from "next/server";
import { generatePuns } from "@/lib/generate";
import { getSessionId } from "@/lib/session";
import { getOrCreateUser } from "@/lib/user";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const sessionId = getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 401 });
  }

  const limiter = checkRateLimit(`generate:${sessionId}`, 1, 5000);
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Too many requests. Slow down." }, { status: 429 });
  }

  const body = await request.json();
  const { inputText, scene, language, tone } = body;

  if (!inputText || !scene || !language || !tone) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const user = await getOrCreateUser(sessionId);
  const candidates = await generatePuns({
    inputText,
    scene,
    language,
    tone,
    bannedTopics: user.bannedTopics
  });

  return NextResponse.json({ candidates });
}
