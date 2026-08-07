"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Template } from "@/types";
import { formatPrice } from "@/lib/data";
import DevicePreview from "./DevicePreview";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/templates/${template.id}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10"
      >
        <div className="relative overflow-hidden p-3 pb-0">
        <DevicePreview
          template={template}
          device="desktop"
          catalogMode
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
          {template.featured && (
            <span className="absolute right-5 top-5 rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-medium text-white">
              精選
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-white transition-colors group-hover:text-violet-300">
                {template.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">{template.suitableFor}</p>
            </div>
            <span className="shrink-0 text-sm font-medium text-violet-400">
              {formatPrice(template.basePrice)} 起 · 香港參考價
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              {template.category}
            </span>
            {template.style.map((s) => (
              <span
                key={s}
                className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-1.5 pt-1">
            {template.colors.map((color) => (
              <div
                key={color}
                className="h-4 w-4 rounded-full ring-1 ring-zinc-700"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
