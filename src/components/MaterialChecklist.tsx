const MATERIAL_ITEMS = [
  "Logo（PNG 或 SVG，透明底佳）",
  "主視覺 / 服務或產品照片",
  "各頁面文案（首頁、關於、服務等）",
  "聯絡資料（地址、電話、WhatsApp、營業時間）",
  "醫療 / 餐飲類：團隊或醫師資料（如有）",
];

export default function MaterialChecklist() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h3 className="text-sm font-medium text-white">建議準備的素材</h3>
      <p className="mt-1 text-xs text-zinc-500">
        提交後我們會與您確認；下方可選擇直接上傳 Logo 或參考圖。
      </p>
      <ul className="mt-3 space-y-1.5 text-xs text-zinc-400">
        {MATERIAL_ITEMS.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-zinc-600">□</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
