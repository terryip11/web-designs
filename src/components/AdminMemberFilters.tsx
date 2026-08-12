"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "", label: "全部角色" },
  { value: "member", label: "一般會員" },
  { value: "admin", label: "管理員" },
] as const;

export default function AdminMemberFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const role = searchParams.get("role") ?? "";

  function applyFilters(nextQ = q, nextRole = role) {
    const params = new URLSearchParams();
    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextRole) params.set("role", nextRole);
    const query = params.toString();
    router.push(query ? `/admin/members?${query}` : "/admin/members");
  }

  return (
    <form
      className="mb-6 flex flex-wrap gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters();
      }}
    >
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋 Email、姓名、電話、公司…"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-9 pr-3 text-sm text-white focus:border-violet-500 focus:outline-none"
        />
      </div>
      <select
        value={role}
        onChange={(e) => applyFilters(q, e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value || "all"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
      >
        搜尋
      </button>
    </form>
  );
}
