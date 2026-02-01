import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { getOrCreateUser } from "@/lib/user";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const sessionId = getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 401 });
  }

  const user = await getOrCreateUser(sessionId);
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (Object.prototype.hasOwnProperty.call(body, "likeStatus")) {
    data.likeStatus = body.likeStatus;
  }
  if (Object.prototype.hasOwnProperty.call(body, "usedInRealLife")) {
    data.usedInRealLife = body.usedInRealLife;
  }
  if (Object.prototype.hasOwnProperty.call(body, "notes")) {
    data.notes = body.notes;
  }

  const pun = await prisma.pun.updateMany({
    where: { id: params.id, userId: user.id },
    data
  });

  if (pun.count === 0) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
