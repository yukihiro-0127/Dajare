import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { getOrCreateUser } from "@/lib/user";

export async function GET() {
  const sessionId = getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 401 });
  }

  const user = await getOrCreateUser(sessionId);
  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const sessionId = getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 401 });
  }

  const user = await getOrCreateUser(sessionId);
  const body = await request.json();

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: body.displayName || null,
      tonePreference: body.tonePreference ?? undefined,
      defaultScene: body.defaultScene ?? undefined,
      bannedTopics: Array.isArray(body.bannedTopics) ? body.bannedTopics : undefined
    }
  });

  return NextResponse.json({ user: updated });
}
