import { notFound } from "next/navigation";
import RestaurantMenuPage from "@/components/demos/restaurant/RestaurantMenuPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { RESTAURANT_BRAND } from "@/lib/demo-sites/restaurant-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (resolveLiveDemo(id)?.variant !== "restaurant") {
    return { title: "Demo — DesignPick" };
  }
  return { title: `菜單 — ${RESTAURANT_BRAND.name}` };
}

export default async function DemoMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "restaurant") notFound();

  return <RestaurantMenuPage basePath={resolved.basePath} />;
}
