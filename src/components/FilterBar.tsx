"use client";

interface FilterBarProps {
  categories: string[];
  styles: string[];
  selectedCategory: string;
  selectedStyle: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function FilterBar({
  categories,
  styles,
  selectedCategory,
  selectedStyle,
  search,
  onCategoryChange,
  onStyleChange,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center">
      <input
        type="search"
        placeholder="搜尋介面名稱、行業、風格…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
      />

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none"
      >
        <option value="">所有行業</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={selectedStyle}
        onChange={(e) => onStyleChange(e.target.value)}
        className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none"
      >
        <option value="">所有風格</option>
        {styles.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
