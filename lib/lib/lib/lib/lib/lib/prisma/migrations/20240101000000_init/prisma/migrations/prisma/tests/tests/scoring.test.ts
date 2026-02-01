import { describe, expect, it } from "vitest";
import { computeProfessionalFitScore } from "@/lib/scoring";

describe("scoring", () => {
  it("returns total within 0-100", () => {
    const score = computeProfessionalFitScore({
      text: "Welcome to the team meeting, let's taco 'bout goals",
      scene: "business_first_meeting",
      tone: "professional",
      safetyFlag: false
    });
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
  });
});
