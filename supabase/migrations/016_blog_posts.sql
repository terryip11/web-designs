-- DesignPick: Blog 文章（後台管理、前台公開已發布）

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  content jsonb not null default '[]'::jsonb,
  tags text[] not null default array[]::text[],
  reading_minutes integer not null default 5 check (reading_minutes > 0),
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published, published_at desc nulls last);

create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

alter table public.blog_posts enable row level security;

create policy "Public read published blog posts"
  on public.blog_posts for select
  using (published = true);

comment on table public.blog_posts is 'Blog 文章；後台以 service role 管理，前台僅顯示 published=true';

-- 種子資料（與原靜態文章一致，可略過若已存在）
insert into public.blog_posts (
  slug, title, description, content, tags, reading_minutes, published, published_at
) values
(
  'hong-kong-sme-website-cost-2026',
  '香港中小企做網站要幾多錢？2026 參考指南',
  '整理香港市場網站設計常見報價區間、影響價格的因素，以及如何用 DesignPick 快速估算預算。',
  '["很多香港中小企老闆第一個問題係：「做一個公司網站要幾多錢？」答案視乎頁數、功能、設計深度同後期維護，但大致可以分為幾個區間。","**基本型官網（5–8 頁）**：通常包含首頁、關於、服務、聯絡等，參考行情約 HKD 8,000–18,000。適合新成立公司、服務業小店，重點係清晰展示同可信聯絡方式。","**行業型網站（含預約、表單、相簿）**：如餐飲訂位、診所預約、物業樓盤展示，因為需要更多互動功能，常見區間約 HKD 15,000–35,000。","**電商或會員系統**：涉及商品管理、付款、登入等，開發同測試成本較高，往往由 HKD 30,000 起，視乎 SKU 數量同金流整合。","影響報價嘅關鍵因素包括：是否客製設計、是否需要多語言、SEO 設定、內容誰來撰寫、域名同主機由邊度管理、以及上線後有否保養合約。","DesignPick 提供模板選配同功能模組參考價，你可以先喺平台揀介面、勾功能，再提交詢價。咁做可以減少來回溝通，亦方便比較唔同方案嘅預算差距。","建議：不要只睇最平報價。一個包含 HTTPS、行動版、基本 SEO、聯絡表單同清晰交付範圍嘅方案，長遠往往更省時間同金錢。"]'::jsonb,
  array['報價', '中小企', '香港'],
  6, true, '2026-08-01 00:00:00+08'::timestamptz
),
(
  'how-to-choose-website-template',
  '如何為你的業務選擇合適的網站模板？',
  '從行業、目標客群、功能需求同品牌風格四個角度，教你快速篩選適合的網站介面。',
  '["揀模板唔係揀「最好睇」嗰個，而係揀「最符合你業務目標」嗰個。以下四步可以幫你快速決定。","**第一步：對準行業**。餐飲重視菜單同訂位；醫療重視信任感同預約；物業重視樓盤展示；B2B 顧問重視案例同專業形象。DesignPick 展示站已按行業分類，可以直接預覽交付效果。","**第二步：定義主要轉換目標**。你想客人打電話、填表、WhatsApp 你、定係直接購買？如果 80% 查詢來自 WhatsApp，就要確保每頁都有明顯 CTA，而唔係只做靚 homepage。","**第三步：列出必要功能**。例如 Google 地圖、多語言、Blog、會員登入、電商購物車。功能越多，開發同測試時間越長，模板選配時應分清「上線必需」同「第二階段再做」。","**第四步：對比品牌風格**。深色高端、溫暖餐飲、明亮教育、簡約 NGO——風格要同你現有 Logo、名片、社交媒體一致，客戶先會覺得係同一個品牌。","DesignPick 支援由模板到功能一次選配，並可儲存方案。建議先揀 2–3 個候選模板，同團隊或合作夥伴一齊睇 Demo，再決定最終方向。"]'::jsonb,
  array['模板', '選配', '設計'],
  5, true, '2026-08-05 00:00:00+08'::timestamptz
),
(
  'website-seo-basics-hong-kong',
  '新網站上線後，SEO 要多久才有流量？',
  '解釋 Google 索引時間、Search Console 設定，以及新站獲取自然搜尋流量的現實時間表。',
  '["好多客戶問：「個網站做好，Google 幾時搵到？」現實答案係：技術 SEO 可以即日完成，但自然流量通常需要數週至數月。","上線初期應完成：sitemap 提交、Search Console 驗證、每頁 title/description、canonical 網址、HTTPS、行動版友好。DesignPick 正式站已包含以上基礎設定。","Google 索引首頁往往只需數小時至數天，但全站所有 Demo 同內頁被索引，常見需要 1–4 週。期間可在 Search Console 用「網址審查」手動提交重要頁面。","「有索引」不等於「有流量」。要出現在搜尋結果前列，還需要關鍵字競爭、內容深度、外部連結同品牌搜尋量。新站可以先用品牌名、地區+服務（如「香港 網站設計 公司」）作長尾關鍵字。","Blog 文章（例如你而家睇緊呢篇）可以針對客戶常見問題寫內容，長遠有助建立主題權威。配合 GA4 同 Search Console，可以睇邊篇文章帶來曝光同點擊。","SEO 係長線投資。短期可配合 WhatsApp 分享、社群貼文、合作轉介；中期靠內容同案例累積；長期先會見到穩定自然流量。"]'::jsonb,
  array['SEO', 'Google', '流量'],
  5, true, '2026-08-08 00:00:00+08'::timestamptz
),
(
  'whatsapp-vs-contact-form',
  'WhatsApp 同網站表單，邊個更易接到客？',
  '分析香港 B2B 市場中 WhatsApp 與表單詢價的優缺點，以及如何兩者並用提高轉換。',
  '["喺香港，WhatsApp 幾乎係 B2B 同 B2C 嘅共通語言。好多客戶寧願直接 message，都唔想填長表單。","WhatsApp 嘅優點係即時、低門檻、對話感強，適合初步查詢同報價跟進。DesignPick 已支援一鍵 WhatsApp，並可預填已選方案摘要，減少客戶重複解釋。","表單嘅優點係結構化：你可以固定收集姓名、Email、公司、預算、需求描述，方便後台 CRM 管理，亦適合非 WhatsApp 用戶。","最佳做法係**兩者並用**：表單負責正式詢價同留低 Email 紀錄；WhatsApp 負責快速回應同建立信任。提交表單成功後再引導 WhatsApp 跟進，轉換率通常更高。","無論用邊種渠道，記住 24 小時內回覆。對中小企服務而言，速度往往比完美設計更能贏得第一個客戶。"]'::jsonb,
  array['WhatsApp', '詢價', '轉換'],
  4, true, '2026-08-10 00:00:00+08'::timestamptz
),
(
  'when-to-redesign-company-website',
  '什麼時候該重做公司網站？5 個警號',
  '若網站有這五個問題，可能已影響品牌形象同查詢量，是時候考慮 redesign。',
  '["網站唔需要年年換，但如果出現以下情況，重做可能比修修补补更划算。","**1. 手機版難以使用**：超過一半流量來自手機，若按鈕太細、文字要縮放、表單難填，你就可能失去大量查詢。","**2. 載入速度慢**：圖片未壓縮、舊式插件過多，會影響 SEO 同用戶耐心。現代 Next.js 網站通常有更好的性能表現。","**3. 品牌形象已升級，網站仍停留五年前**：Logo、服務範圍、客群定位變了，但網站仍是舊配色同舊文案，會令客戶懷疑你嘅專業度。","**4. 無法自行更新內容**：若每次改價、加案例都要找開發者，長期成本高。可以考慮 CMS 或模組化後台。","**5. 沒有 HTTPS 或經常出錯**：安全同穩定係基本門檻。Chrome 會標示「不安全」，直接影響信任。","DesignPick 展示站可以俾你預覽現代化設計同行業功能。可先選配方案、估價，再決定係全面重做定分階段上線。"]'::jsonb,
  array['重做網站', '品牌', '設計'],
  4, true, '2026-08-12 00:00:00+08'::timestamptz
)
on conflict (slug) do nothing;
