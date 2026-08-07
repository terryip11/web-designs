"use client";

import OrderSummary from "@/components/OrderSummary";
import { useConfiguratorStore } from "@/store/configurator-store";

export default function SummarySidebar() {
  const template = useConfiguratorStore((s) => s.getTemplate());
  const selectedFeatureIds = useConfiguratorStore((s) => s.selectedFeatureIds);
  const totalPrice = useConfiguratorStore((s) => s.getTotalPrice());

  return (
    <OrderSummary
      template={template}
      selectedFeatureIds={selectedFeatureIds}
      totalPrice={totalPrice}
      showActions={false}
    />
  );
}
