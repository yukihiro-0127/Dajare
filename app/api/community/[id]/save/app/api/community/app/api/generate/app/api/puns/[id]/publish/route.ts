import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { getOrCreateUser } from "@/lib/user";
import { checkRateLimit } from "@/lib/rateLimit";
import { isSafeForPublish, maskPII } from "@/lib/safety";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const sessionId = getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 401 });
  }

  const user = await getOrCreateUser(sessionId);
  const body = await request.json();
  const action = body.action ?? "publish";

  const pun = await prisma.pun.findFirst({
    where: { id: params.id, userId: user.id }
  });

  if (!pun) {
    return NextResponse.json({ error: "Pun not found." }, { status: 404 });
  }

  if (action === "unpublish") {
    await prisma.pun.update({
      where: { id: pun.id },
      data: { isPublished: false, publishedAt: null }
    });
    return NextResponse.json({ success: true });
  }

  if (!user.displayName) {
    return NextResponse.json({ error: "Display name required." }, { status: 400 });
  }

  const limiter = checkRateLimit(`publish:${sessionId}`, 10, 1000 * 60 * 60 * 24);
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Publish limit reached." }, { status: 429 });
  }

  const safetyInput = isSafeForPublish(pun.selectedText, user.bannedTopics);
  const safetyContext = isSafeForPublish(pun.inputText, user.bannedTopics);

  if (!safetyInput.safe || !safetyContext.safe) {
    return NextResponse.json({ error: "Failed safety checks." }, { status: 400 });
  }

  await prisma.pun.update({
    where: { id: pun.id },
    data: {
      isPublished: true,
      publishedAt: new Date(),
      inputText: maskPII(pun.inputText),
      selectedText: maskPII(pun.selectedText)
    }
  });

  return NextResponse.json({ success: true });
}
