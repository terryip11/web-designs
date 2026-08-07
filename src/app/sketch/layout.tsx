export default function SketchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sketch-fullpage flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden">
      {children}
    </div>
  );
}
