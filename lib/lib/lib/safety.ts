const defaultBanned = [
  "slur",
  "hate",
  "racist",
  "explicit",
  "sexual",
  "harass",
  "kill",
  "violence",
  "religion",
  "politic",
  "ssn",
  "credit card"
];

const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const phoneRegex = /\+?\d[\d\s().-]{7,}\d/g;
const urlRegex = /(https?:\/\/|www\.)\S+/gi;
const addressRegex = /\d{1,5}\s+\w+\s+(Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Boulevard|Blvd\.?|Lane|Ln\.?)/gi;

export function maskPII(text: string) {
  return text
    .replace(emailRegex, "[email]")
    .replace(phoneRegex, "[phone]")
    .replace(urlRegex, "[url]")
    .replace(addressRegex, "[address]");
}

export function containsBannedTopic(text: string, bannedTopics: string[]) {
  const lower = text.toLowerCase();
  const allBanned = [...defaultBanned, ...bannedTopics].map((item) => item.toLowerCase());
  return allBanned.some((topic) => topic && lower.includes(topic));
}

export function isSafeForPublish(text: string, bannedTopics: string[]) {
  if (containsBannedTopic(text, bannedTopics)) {
    return { safe: false, reason: "Contains banned topics." };
  }
  if (text.toLowerCase().includes("http://") || text.toLowerCase().includes("https://")) {
    return { safe: false, reason: "Contains URL." };
  }
  return { safe: true };
}
