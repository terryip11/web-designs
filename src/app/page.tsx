import { getFeaturedTemplates } from "@/lib/data";
import HomeContent from "@/components/HomeContent";

export default function HomePage() {
  const featured = getFeaturedTemplates();
  return <HomeContent featured={featured} />;
}
