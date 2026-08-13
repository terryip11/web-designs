import JsonLdScript from "@/components/JsonLdScript";
import { buildOrganizationWebSiteGraph } from "@/lib/seo/geo/json-ld";

export default function SeoJsonLd() {
  return <JsonLdScript data={buildOrganizationWebSiteGraph()} />;
}
