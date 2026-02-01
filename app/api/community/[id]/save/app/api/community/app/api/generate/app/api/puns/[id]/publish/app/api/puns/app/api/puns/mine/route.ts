import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { getOrCreateUser } from "@/lib/user";

export async function GET(request: Request) {
  const sessionId = getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session." }, { status: 401 });
  }

  const user = await getOrCreateUser(sessionId);
  const url = new URL(request.url);
  const scene = url.searchParams.get("scene");
  const language = url.searchParams.get("language");

  const puns = await prisma.pun.findMany({
    where: {
      userId: user.id,
      ...(scene ? { scene } : {}),
      ...(language ? { language } : {})
    },
    orderBy: {
      savedAt: "desc"
    }
  });

  return NextResponse.json({ puns });
}
