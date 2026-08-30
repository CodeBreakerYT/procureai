import { NextResponse } from "next/server";

const COOKIE_NAME = "procureai_auth";

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as { username?: string; password?: string };

  const expectedUser = process.env.DEMO_USERNAME ?? "admin";
  const expectedPass = process.env.DEMO_PASSWORD ?? "123456";

  if (username !== expectedUser || password !== expectedPass) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours — plenty for an evaluation pass, expires on its own
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
