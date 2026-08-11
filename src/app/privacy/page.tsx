import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import { SITE_CONTACT } from "@/lib/site-contact";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "私隱政策",
  description: "DesignPick 如何收集、使用與保護您提交的個人資料與方案選配資訊。",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <h1 className="text-3xl font-bold text-white">私隱政策</h1>
        <p className="mt-2 text-sm text-zinc-500">最後更新：2026 年 8 月</p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.05}>
        <div className="prose prose-invert mt-10 max-w-none space-y-6 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="text-lg font-semibold text-white">1. 收集的資料</h2>
            <p>
              當您透過 DesignPick 提交方案需求時，我們可能收集：姓名、Email、電話、公司／品牌名稱、補充說明，以及您選配的介面模板、功能模組、設計選項、草圖圖片與參考報價等資訊。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. 使用目的</h2>
            <p>上述資料僅用於：</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>回覆您的網站設計查詢與報價</li>
              <li>依您的選配方案提供設計建議</li>
              <li>必要時透過 Email 或 WhatsApp 與您聯繫</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. 資料儲存</h2>
            <p>
              需求資料儲存於 Supabase 雲端資料庫；草圖 PNG 及客戶參考素材上傳至 Cloudflare R2 物件儲存。我們採取合理技術措施保護資料安全，但不保證絕對安全。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. 資料分享</h2>
            <p>
              我們不會出售您的個人資料。除法律要求或為完成您所請求之服務（如 Email 發送服務 Resend）外，不會向第三方披露。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. 您的權利</h2>
            <p>
              您可要求查閱、更正或刪除我們持有的個人資料。請透過{" "}
              <Link href="/contact" className="text-violet-400 hover:underline">
                聯絡頁
              </Link>{" "}
              或 WhatsApp {SITE_CONTACT.contactName}（{SITE_CONTACT.phoneDisplay}）與我們聯繫。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Cookie 與本地儲存</h2>
            <p>
              本網站使用 localStorage 儲存您的草圖與選配進度，以便您下次瀏覽時繼續編輯。此資料保存在您的瀏覽器本機，不會自動上傳，除非您主動提交需求表單。
            </p>
            <p className="mt-3">
              為改善網站體驗與後台統計，我們亦會記錄瀏覽紀錄（頁面路徑、時間、不重複訪客識別碼及
              IP 位址）。IP 僅供網站管理員在後台查看，不會向公眾或第三方披露；紀錄保留約 30
              天後自動刪除。
            </p>
            <p className="mt-3">
              若網站管理員已設定 Google Analytics 4（GA4），Google 可能透過 Cookie
              收集匿名使用資料（例如頁面瀏覽、裝置類型、大致地區），用於分析搜尋與流量來源。您可透過瀏覽器封鎖
              Cookie，或使用{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                className="text-violet-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics 停用外掛
              </a>{" "}
              選擇退出。詳見{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-violet-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google 私隱政策
              </a>
              。
            </p>
          </section>

          <p className="border-t border-zinc-800 pt-6 text-zinc-500">
            <Link href="/contact" className="text-violet-400 hover:underline">
              ← 返回提交需求
            </Link>
          </p>
        </div>
      </RevealOnScroll>
    </div>
  );
}
