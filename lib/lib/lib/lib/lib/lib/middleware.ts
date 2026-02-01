import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const sessionId = request.cookies.get("puncraft_session")?.value;
  if (!sessionId) {
    response.cookies.set("puncraft_session", crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });
  }
  return response;
}

export const config = {
  matcher: ["/", "/library", "/community", "/settings", "/api/:path*"]
};
