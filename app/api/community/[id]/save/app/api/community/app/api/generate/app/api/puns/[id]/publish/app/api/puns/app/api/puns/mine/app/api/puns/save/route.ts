import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { getOrCreateUser } from "@/lib/user";

export async function POST(request: Request) {
  const sessionId = getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 401 });
  }

  const body = await request.json();
  const {
    inputText,
    scene,
    language,
    tone,
    candidates,
    selectedText,
    professionalFitScore,
    safetyFlag
  } = body;

  if (!inputText || !scene || !language || !tone || !selectedText) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const user = await getOrCreateUser(sessionId);
  const pun = await prisma.pun.create({
    data: {
      userId: user.id,
      inputText,
      scene,
      language,
      tone,
      candidatesJson: candidates,
      selectedText,
      professionalFitScore: Number(professionalFitScore ?? 0),
      safetyFlag: Boolean(safetyFlag),
      savedAt: new Date()
    }
  });

  return NextResponse.json({ pun });
}
