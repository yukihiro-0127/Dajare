import { prisma } from "./prisma";

export async function getOrCreateUser(sessionId: string) {
  const existing = await prisma.user.findUnique({
    where: { sessionId }
  });
  if (existing) return existing;
  return prisma.user.create({
    data: {
      sessionId
    }
  });
}
