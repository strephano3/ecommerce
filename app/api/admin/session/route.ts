import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, getAdminPassword, getAdminSessionValue } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if ((body.password || "") !== getAdminPassword()) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, getAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
