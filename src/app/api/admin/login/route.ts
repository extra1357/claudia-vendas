import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { user, pass } = await req.json();
  if (!checkCredentials(user, pass))
    return NextResponse.json({ error: "Credenciais invalidas" }, { status: 401 });

  const token = await signToken(user);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", "", { maxAge: 0 });
  return res;
}
