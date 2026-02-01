import { computeProfessionalFitScore } from "./scoring";
import { containsBannedTopic } from "./safety";

export type PunCandidate = {
  text: string;
  short_explanation: string;
  safety_flag: boolean;
  tags?: string[];
  professional_fit_score: number;
};

type GenerateInput = {
  inputText: string;
  scene: string;
  language: string;
  tone: string;
  bannedTopics: string[];
};

const stubTags = ["wordplay", "light", "contextual"];

function buildPrompt({ inputText, scene, language, tone, bannedTopics }: GenerateInput) {
  return `You are PunCraft, a practical pun generator. Create 5 short, context-appropriate puns.
Scene: ${scene}
Language: ${language}
Tone: ${tone}
User banned topics: ${bannedTopics.join(", ") || "none"}
Input: ${inputText}
Constraints:
- Avoid explicit content, harassment, political/religious incitement, and personal data.
- Return JSON with key "candidates": array of 5 items.
Each item: {"text": string, "short_explanation": string (<=2 lines), "safety_flag": boolean, "tags": string[]}
Only output JSON.`;
}

function buildStubCandidates({ inputText, scene, language, tone }: GenerateInput) {
  return Array.from({ length: 5 }).map((_, index) => {
    const text =
      language === "jp"
        ? `${inputText}で${scene.replace(/_/g, " ")}を${tone}に言うと「${inputText}${index + 1}」`
        : `${inputText} meets ${scene.replace(/_/g, " ")} (${tone}) #${index + 1}`;
    const safetyFlag = false;
    const score = computeProfessionalFitScore({ text, scene, tone, safetyFlag });
    return {
      text,
      short_explanation:
        language === "jp"
          ? "入力語を文脈に合わせて言い換えています。"
          : "A simple wordplay twist that fits the scene.",
      safety_flag: safetyFlag,
      tags: stubTags,
      professional_fit_score: score.total
    };
  });
}

export async function generatePuns(input: GenerateInput): Promise<PunCandidate[]> {
  const { inputText, bannedTopics, scene, tone } = input;
  if (containsBannedTopic(inputText, bannedTopics)) {
    return buildStubCandidates({ ...input, inputText: "[redacted]" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return buildStubCandidates(input);
  }

  const prompt = buildPrompt(input);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.candidates)) {
      throw new Error("Invalid candidate payload");
    }

    return parsed.candidates.slice(0, 5).map((candidate: PunCandidate) => {
      const safetyFlag = Boolean(candidate.safety_flag);
      const score = computeProfessionalFitScore({
        text: candidate.text,
        scene,
        tone,
        safetyFlag
      });
      return {
        ...candidate,
        professional_fit_score: score.total
      };
    });
  } catch (error) {
    return buildStubCandidates(input);
  }
}
