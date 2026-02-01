import { describe, expect, it } from "vitest";
import { containsBannedTopic, maskPII } from "@/lib/safety";

describe("safety utilities", () => {
  it("masks emails, phones, and urls", () => {
    const input = "Email me at test@example.com or call +1 555-123-4567. Visit https://puncraft.dev";
    const masked = maskPII(input);
    expect(masked).toContain("[email]");
    expect(masked).toContain("[phone]");
    expect(masked).toContain("[url]");
  });

  it("detects banned topics", () => {
    expect(containsBannedTopic("Avoid politics", ["politics"])).toBe(true);
    expect(containsBannedTopic("hello world", ["politics"])).toBe(false);
  });
});
