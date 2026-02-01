const sceneKeywords: Record<string, string[]> = {
  business_first_meeting: ["meet", "intro", "handshake", "welcome", "team"],
  business_internal_presentation: ["deck", "slide", "roadmap", "update", "metrics"],
  business_email_subject: ["subject", "follow-up", "update", "action", "FYI"],
  friends_casual_chat: ["hang", "coffee", "weekend", "buddy", "lol"]
};

type ScoreInput = {
  text: string;
  scene: string;
  tone: string;
  safetyFlag: boolean;
};

export function computeProfessionalFitScore({
  text,
  scene,
  tone,
  safetyFlag
}: ScoreInput) {
  const trimmed = text.trim();
  const lengthScore = trimmed.length <= 80 ? 30 : trimmed.length <= 120 ? 20 : 10;
  const clarityScore = lengthScore + (trimmed.includes(" ") ? 10 : 5);

  const keywords = sceneKeywords[scene] ?? [];
  const lower = trimmed.toLowerCase();
  const hitCount = keywords.filter((keyword) => lower.includes(keyword)).length;
  const contextFitScore = Math.min(40, hitCount * 10 + (tone === "professional" ? 10 : 5));

  const safetyScore = safetyFlag ? 5 : 20;

  const total = Math.min(100, clarityScore + contextFitScore + safetyScore);
  return {
    clarity: Math.min(40, clarityScore),
    contextFit: Math.min(40, contextFitScore),
    safety: safetyScore,
    total
  };
}
