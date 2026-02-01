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

  const existing = await prisma.communityLike.findUnique({
    where: { userId_punId: { userId: user.id, punId: params.id } }
  });

  if (!existing) {
    await prisma.$transaction([
      prisma.communityLike.create({
        data: { userId: user.id, punId: params.id }
      }),
      prisma.pun.update({
        where: { id: params.id },
        data: { communityLikeCount: { increment: 1 } }
      })
    ]);
  }

  return NextResponse.json({ success: true });
}
