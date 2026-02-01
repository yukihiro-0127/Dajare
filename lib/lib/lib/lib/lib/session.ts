import { cookies } from "next/headers";

export function getSessionId() {
  return cookies().get("puncraft_session")?.value ?? null;
}
