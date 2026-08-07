import SketchBoard from "@/components/SketchBoard";

export const metadata = {
  title: "介面草圖 | DesignPick",
  description: "快速勾勒網站介面草圖，作為選配前的視覺草稿",
};

export default function SketchPage() {
  return (
    <div className="flex h-full min-h-0 flex-col px-4 sm:px-6 lg:px-8">
      <SketchBoard />
    </div>
  );
}
