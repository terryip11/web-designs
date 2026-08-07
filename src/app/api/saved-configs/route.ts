import { NextResponse } from "next/server";
import { createAuthServerClient } from "@/lib/supabase/server";
import type { DesignSelections } from "@/types";
import type { SketchState } from "@/types/sketch";

export async function GET() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("saved_configs")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "讀取失敗" }, { status: 500 });
  }

  return NextResponse.json({ configs: data });
}

export async function POST(request: Request) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    template_id,
    selected_features,
    design_selections,
    sketch_snapshot,
    total_price,
  } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "請提供方案名稱" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("saved_configs")
    .insert({
      user_id: user.id,
      name: String(name).trim(),
      template_id: template_id ?? null,
      selected_features: selected_features ?? [],
      design_selections: (design_selections ?? {}) as DesignSelections,
      sketch_snapshot: (sketch_snapshot ?? null) as SketchState | null,
      total_price: total_price ?? 0,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("saved_configs insert:", error);
    return NextResponse.json({ error: "儲存失敗" }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
