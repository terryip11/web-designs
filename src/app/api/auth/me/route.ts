import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth/admin";
import { createAuthServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, isAdmin: false });
  }

  return NextResponse.json({
    user: { email: user.email, id: user.id },
    isAdmin: await isAdmin(user),
  });
}
