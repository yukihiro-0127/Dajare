import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort") ?? "trending";
  const scene = url.searchParams.get("scene");
  const language = url.searchParams.get("language");
  const tone = url.searchParams.get("tone");

  const baseWhere = {
    isPublished: true,
    isHidden: false,
    ...(scene ? { scene } : {}),
    ...(language ? { language } : {}),
    ...(tone ? { tone } : {})
  };

  if (sort === "new") {
    const items = await prisma.pun.findMany({
      where: baseWhere,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        selectedText: true,
        scene: true,
        language: true,
        tone: true,
        professionalFitScore: true,
        communityLikeCount: true,
        communitySaveCount: true,
        publishedAt: true,
        createdAt: true,
        savedAt: true,
        user: { select: { displayName: true } }
      }
    });

    return NextResponse.json({
      items: items.map((item) => {
        const { user, ...rest } = item;
        return { ...rest, authorDisplayName: user.displayName };
      })
    });
  }

  const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  const items = await prisma.pun.findMany({
    where: {
      ...baseWhere,
      publishedAt: { gte: sevenDaysAgo }
    },
    select: {
      id: true,
      selectedText: true,
      scene: true,
      language: true,
      tone: true,
      professionalFitScore: true,
      communityLikeCount: true,
      communitySaveCount: true,
      publishedAt: true,
      createdAt: true,
      savedAt: true,
      user: { select: { displayName: true } }
    }
  });

  const sorted = [...items].sort((a, b) => {
    const scoreA = a.communityLikeCount * 2 + a.communitySaveCount;
    const scoreB = b.communityLikeCount * 2 + b.communitySaveCount;
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
  });

  return NextResponse.json({
    items: sorted.map((item) => {
      const { user, ...rest } = item;
      return { ...rest, authorDisplayName: user.displayName };
    })
  });
}
