import { getFeaturedTemplates } from "@/lib/data";
import HomeContent from "@/components/HomeContent";
import JsonLdScript from "@/components/JsonLdScript";
import { buildHomeFaqPreviewGraph } from "@/lib/seo/geo/json-ld";

export default function HomePage() {
  const featured = getFeaturedTemplates();
  return (
    <>
      <JsonLdScript data={buildHomeFaqPreviewGraph()} />
      <HomeContent featured={featured} />
    </>
  );
}
