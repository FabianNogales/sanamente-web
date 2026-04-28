export function SectionLabel({
  children,
  accent = "indigo",
}: {
  children: React.ReactNode;
  accent?: "indigo" | "teal";
}) {
  const colors =
    accent === "teal"
      ? "bg-teal-50 text-teal-700 border-teal-200"
      : "bg-indigo-50 text-indigo-700 border-indigo-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${colors} border rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest`}
    >
      {children}
    </span>
  );
}
