"use server";

import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import { getAuthCallbackUrl } from "@/lib/auth/site-url";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const next = String(formData.get("next") ?? "/account");

  if (!email || !password) {
    return { error: "請填寫 Email 與密碼" };
  }

  if (password.length < 6) {
    return { error: "密碼至少 6 個字元" };
  }

  const supabase = await createAuthServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || undefined },
      emailRedirectTo: getAuthCallbackUrl(next),
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return { needsVerification: true, email };
  }

  redirect(next.startsWith("/") ? next : "/account");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/account");

  if (!email || !password) {
    return { error: "請填寫 Email 與密碼" };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error: "請先至 Email 信箱點擊驗證連結",
        needsVerification: true,
        email,
      };
    }
    return { error: "Email 或密碼不正確" };
  }

  redirect(next.startsWith("/") ? next : "/account");
}

export async function signInWithGoogle(next = "/account") {
  const supabase = await createAuthServerClient();
  const safeNext = next.startsWith("/") ? next : "/account";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthCallbackUrl(safeNext),
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "無法啟動 Google 登入" };
}

export async function resendVerificationEmail(email: string) {
  const trimmed = email.trim();
  if (!trimmed) {
    return { error: "請提供 Email" };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: trimmed,
    options: {
      emailRedirectTo: getAuthCallbackUrl("/account"),
    },
  });

  if (error) {
    return { error: "發送失敗，請稍後再試" };
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();

  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "請先登入" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      phone: phone || null,
      company: company || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: "更新失敗，請稍後再試" };
  }

  return { success: true };
}
