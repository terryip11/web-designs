"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";
import {
  getAuthCallbackUrl,
  getPasswordResetCallbackUrl,
} from "@/lib/auth/site-url";
import { checkRateLimit } from "@/lib/rate-limit";

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

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const ipRate = checkRateLimit(`auth:resend:ip:${ip}`, 3, 60 * 60 * 1000);
  if (!ipRate.ok) {
    return { error: "發送過於頻繁，請稍後再試" };
  }

  const emailRate = checkRateLimit(
    `auth:resend:email:${trimmed.toLowerCase()}`,
    2,
    60 * 60 * 1000
  );
  if (!emailRate.ok) {
    return { error: "此 Email 驗證信已多次發送，請稍後再試" };
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

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "請填寫 Email" };
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const ipRate = checkRateLimit(`auth:reset:ip:${ip}`, 5, 60 * 60 * 1000);
  if (!ipRate.ok) {
    return { error: "請求過於頻繁，請稍後再試" };
  }

  const emailRate = checkRateLimit(
    `auth:reset:email:${email.toLowerCase()}`,
    3,
    60 * 60 * 1000
  );
  if (!emailRate.ok) {
    return { error: "此 Email 已多次請求重設，請稍後再試" };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getPasswordResetCallbackUrl(),
  });

  if (error) {
    console.error("[requestPasswordReset]", error.message);
    return { error: "發送失敗，請稍後再試" };
  }

  return { success: true, email };
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < 6) {
    return { error: "密碼至少 6 個字元" };
  }
  if (password !== confirm) {
    return { error: "兩次輸入的密碼不一致" };
  }

  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "連結已失效，請重新申請重設密碼" };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "更新失敗，請稍後再試" };
  }

  redirect("/account");
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
