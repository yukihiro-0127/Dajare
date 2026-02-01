import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { getOrCreateUser } from "@/lib/user";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const sessionId = getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 401 });
  }

  const user = await getOrCreateUser(sessionId);
  const pun = await prisma.pun.findFirst({
    where: { id: params.id, isPublished: true, isHidden: false }
  });

  if (!pun) {
    return NextResponse.json({ error: "Pun not found." }, { status: 404 });
  }

  const existing = await prisma.communitySave.findUnique({
    where: { userId_punId: { userId: user.id, punId: pun.id } }
  });

  if (!existing) {
    await prisma.$transaction([
      prisma.communitySave.create({
        data: { userId: user.id, punId: pun.id }
      }),
      prisma.pun.create({
        data: {
          userId: user.id,
          inputText: pun.inputText,
          scene: pun.scene,
          language: pun.language,
          tone: pun.tone,
          candidatesJson: pun.candidatesJson,
          selectedText: pun.selectedText,
          professionalFitScore: pun.professionalFitScore,
          safetyFlag: pun.safetyFlag,
          notes: `Copied from community punId=${pun.id}`
        }
      }),
      prisma.pun.update({
        where: { id: pun.id },
        data: { communitySaveCount: { increment: 1 } }
      })
    ]);
  }

  return NextResponse.json({ success: true });
}
