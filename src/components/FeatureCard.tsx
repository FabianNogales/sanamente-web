export function FeatureCard({
  icon,
  title,
  desc,
  accent = "indigo",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent?: "indigo" | "teal";
}) {
  const colors =
    accent === "teal"
      ? "bg-teal-50 border-teal-100 group-hover:border-teal-200"
      : "bg-indigo-50 border-indigo-100 group-hover:border-indigo-200";

  const iconColors =
    accent === "teal"
      ? "bg-teal-100 text-teal-600 group-hover:bg-teal-200"
      : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200";

  return (
    <div
      className={`${colors} border rounded-2xl p-6 transition-all duration-300 group hover:shadow-md`}
    >
      <div
        className={`${iconColors} w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors`}
      >
        {icon}
      </div>
      <h3 className="text-slate-900 font-bold text-base mb-1.5">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
