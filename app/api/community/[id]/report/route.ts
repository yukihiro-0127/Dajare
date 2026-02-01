import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { getOrCreateUser } from "@/lib/user";

const validReasons = ["spam", "offensive", "personal_info", "other"];

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const sessionId = getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 401 });
  }

  const user = await getOrCreateUser(sessionId);
  const body = await request.json();
  const reason = validReasons.includes(body.reason) ? body.reason : "other";

  const existing = await prisma.communityReport.findUnique({
    where: { userId_punId: { userId: user.id, punId: params.id } }
  });

  if (!existing) {
    await prisma.communityReport.create({
      data: { userId: user.id, punId: params.id, reason, detail: body.detail }
    });

    const updated = await prisma.pun.update({
      where: { id: params.id },
      data: { reportCount: { increment: 1 } }
    });

    if (updated.reportCount >= 3) {
      await prisma.pun.update({
        where: { id: params.id },
        data: { isHidden: true }
      });
    }
  }

  return NextResponse.json({ success: true });
}
