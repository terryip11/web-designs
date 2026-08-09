# DesignPick — 網站設計選配平台

繁中網站方案選配工具：介面庫、草圖板、功能選配、詢價提交、會員中心、管理後台。

## 功能概覽

- **介面庫** `/templates` — 瀏覽與預覽模板
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
| `ADMIN_EMAILS` | ✓ | 管理員 Email（逗號分隔） |
| `RESEND_API_KEY` | | Email 發送 |
| `EMAIL_FROM` | | 寄件者 |
| `NOTIFY_EMAIL` | | 新詢價通知收件者 |

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

## 授權

Private project
