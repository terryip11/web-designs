import { notFound } from "next/navigation";
import RestaurantReservationsPage from "@/components/demos/restaurant/RestaurantReservationsPage";
import { resolveLiveDemo } from "@/lib/demo-sites/resolve-demo";
import { RESTAURANT_BRAND } from "@/lib/demo-sites/restaurant-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (resolveLiveDemo(id)?.variant !== "restaurant") {
    return { title: "Demo — desigpick-digital" };
  }
  return { title: `網上訂位 — ${RESTAURANT_BRAND.name}` };
}

export default async function DemoReservationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ dish?: string }>;
}) {
  const { id } = await params;
  const { dish } = await searchParams;
  const resolved = resolveLiveDemo(id);
  if (!resolved || resolved.variant !== "restaurant") notFound();

  return (
    <RestaurantReservationsPage basePath={resolved.basePath} preselectedDish={dish} />
  );
}
