import Link from "next/link";

const GEO_BLOG_LINKS = [
  {
    slug: "what-is-designpick-hong-kong",
    title: "desigpick-digital 是什麼？",
  },
  {
    slug: "restaurant-website-hong-kong-checklist",
    title: "餐廳網站清單",
  },
  {
    slug: "education-tuition-website-hong-kong",
    title: "補習社／教育中心指南",
  },
  {
    slug: "medical-clinic-website-hong-kong",
    title: "診所／牙科網站指南",
  },
  {
    slug: "ecommerce-website-hong-kong-guide",
    title: "小規模電商指南",
  },
  {
    slug: "website-delivery-scope-hong-kong",
    title: "報價交付範圍對照",
  },
  {
    slug: "how-to-choose-web-design-company-hong-kong",
    title: "點揀網頁設計公司",
  },
  {
    slug: "wix-vs-custom-website-hong-kong",
    title: "Wix vs 模板選配",
  },
  {
    slug: "domain-hosting-ssl-cost-hong-kong",
    title: "域名主機 SSL 費用",
  },
] as const;

export default function BlogGeoLinks({ currentSlug }: { currentSlug: string }) {
  const links = GEO_BLOG_LINKS.filter((item) => item.slug !== currentSlug);

  return (
    <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
      <p className="text-sm font-medium text-white">延伸閱讀</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/blog/${item.slug}`}
              className="inline-block rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
            >
              {item.title}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/faq"
            className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300 transition-colors hover:bg-violet-500/15"
          >
            常見問題
          </Link>
        </li>
      </ul>
    </div>
  );
}
