# DesignPick — 網站設計選配平台

繁中網站方案選配工具：介面庫、草圖板、功能選配、詢價提交、會員中心、管理後台。

## 功能概覽

- **介面庫** `/templates` — 瀏覽與預覽模板
- **展示站** `/demos` — 完整 Demo 網站（長期品牌展示）
- **介面草圖** `/sketch` — 多頁草圖編輯
- **方案選配** `/configure` — 版面、功能、動效選擇
- **聯絡提交** `/contact` — 詢價表單 + WhatsApp
- **會員中心** `/account` — 個人資料、已儲存方案、詢價紀錄
- **管理後台** `/admin` — 詢價管理（需管理員）

## 本地開發

```bash
cp .env.example .env.local
# 編輯 .env.local 填入 Supabase 等變數

npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

> 本機 `NEXT_PUBLIC_SITE_URL` 請用 `http://localhost:3000`（OAuth 回調用）

## 環境變數

見 [`.env.example`](./.env.example)

| 變數 | 必填 | 說明 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | anon key（`eyJ` 開頭） |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | 後台讀取全部詢價 |
| `NEXT_PUBLIC_SITE_URL` | ✓ | 網站 URL |
| `R2_ACCOUNT_ID` | ✓* | Cloudflare 帳戶 ID |
| `R2_ACCESS_KEY_ID` | ✓* | R2 API Token Access Key |
| `R2_SECRET_ACCESS_KEY` | ✓* | R2 API Token Secret |
| `R2_BUCKET_NAME` | ✓* | R2 Bucket 名稱 |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | ✓* | R2 公開網域（例 `https://images.desigpick-digital.com`） |
| `ADMIN_EMAILS` | ✓ | 管理員 Email（逗號分隔） |
| `NEXT_PUBLIC_DEMO_ROOT_DOMAIN` | | Demo 子網域根網域（見下方） |
| `RESEND_API_KEY` | | Email 發送 |
| `EMAIL_FROM` | | 寄件者 |
| `NOTIFY_EMAIL` | | 新詢價通知收件者 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | | GA4 Measurement ID（例 `G-XXXXXXXXXX`） |
| `ANALYTICS_IP_SALT` | | 後台 IP 雜湊鹽（選填） |

\* 圖片相關功能（Demo 展示圖、草圖上傳、客戶素材）需設定 R2。未設定 `NEXT_PUBLIC_R2_PUBLIC_URL` 時，Demo 圖會暫用 manifest 內的 Unsplash 來源作本機 fallback。

## Cloudflare R2 設定

### 1. 建立 Bucket

Cloudflare Dashboard → R2 → Create bucket（例：`designpick`）

### 2. 建立 API Token

R2 → Manage R2 API Tokens → 權限：Object Read & Write（限該 bucket）

### 3. 公開存取（擇一）

- **自訂網域（建議）**：R2 bucket → Settings → Custom Domains → 例 `images.desigpick-digital.com`
- **r2.dev**：Enable public access，取得 `https://pub-xxx.r2.dev`

### 4. 環境變數

```env
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=designpick
NEXT_PUBLIC_R2_PUBLIC_URL=https://images.desigpick-digital.com
```

### 5. 上傳 Demo 展示圖（一次性）

```bash
npm run sync-demo-images
```

會依 `src/lib/images/demo-image-manifest.json` 將所有 Demo 圖片同步至 R2。

### 上傳路徑

| 用途 | R2 前綴 |
|------|---------|
| Demo 展示圖 | `demos/...` |
| 客戶草圖 | `uploads/sketches/...` |
| 客戶參考素材 | `uploads/client-assets/...` |

## Supabase 設定

### 1. 執行 Migration（依序）

在 Supabase Dashboard → SQL Editor 執行：

```
supabase/migrations/001_inquiries.sql
002_add_currency.sql
003_add_design_selections.sql
004_sketch_uploads.sql
005_membership.sql
006_admin.sql
007_inquiry_status.sql
008_admin_notes.sql
009_client_assets.sql
010_page_views.sql
011_page_views_ip.sql
012_analytics_rpc.sql
013_revoke_legacy_storage_upload.sql
014_page_views_ip_full.sql
```

### 2. Auth URL Configuration

- **Site URL**：正式網域（如 `https://your-app.vercel.app`）
- **Redirect URLs**：
  - `http://localhost:3000/auth/callback`
  - `https://your-app.vercel.app/auth/callback`

### 3. Google OAuth

Google Cloud **Authorized redirect URI**：

```
https://<project-ref>.supabase.co/auth/v1/callback
```

## Vercel 部署

1. 連接 GitHub repo
2. 在 Environment Variables 填入 `.env.example` 中所有變數
3. `NEXT_PUBLIC_SITE_URL` 設為 Vercel 網域
4. Deploy

## 指令

```bash
npm run dev        # 開發
npm run build      # 建置
npm run start      # 正式模式（含 Service Worker）
npm run lint       # ESLint
npm run typecheck  # TypeScript 檢查
```

## 安全功能

- 詢價 API rate limit（每 IP 每小時 5 次）
- Honeypot 防 spam
- Zod 輸入驗證
- 管理員路由雙重驗證（proxy + page）
- Security headers（`next.config.ts`）

## PWA

- `manifest.webmanifest` + 192/512 icons
- Service Worker（僅 production 註冊）

## 模板展示站（長期品牌 Demo）

完整可瀏覽的 Demo 網站，供客戶預覽交付品質：

| Demo | 路徑 | 子網域（設定後） |
|------|------|------------------|
| 麗致物業 | `/demos/property-luxe-09` | `property-luxe-09.designpick.hk` |
| 信賴醫療中心 | `/demos/medical-trust-05` | `medical-trust-05.designpick.hk` |

- **展示站目錄** `/demos`
- 模板詳情頁嵌入 iframe 預覽 +「開啟 Demo 網站」按鈕
- Demo 頁可「全螢幕（無展示列）」分享予客戶

### 子網域設定（designpick.hk）

**1. Vercel → Project → Settings → Domains**

- 加入主網域：`designpick.hk`（或你的主站網域）
- 加入 wildcard：`*.designpick.hk`

**2. DNS（域名 registrar）**

| 類型 | 名稱 | 值 |
|------|------|-----|
| A | `@` | Vercel 提供的 IP |
| CNAME | `*` | `cname.vercel-dns.com` |

**3. Vercel 環境變數**

```
NEXT_PUBLIC_DEMO_ROOT_DOMAIN=designpick.hk
NEXT_PUBLIC_SITE_URL=https://designpick.hk
```

**4. 驗證**

- `https://property-luxe-09.designpick.hk` → 麗致物業 Demo
- `https://medical-trust-05.designpick.hk` → 信賴醫療 Demo

新增 Demo：在 `src/lib/demo-sites/registry.ts` 註冊 + `variants.ts` 指定類型 + 建立頁面元件。

## 授權

Private project
