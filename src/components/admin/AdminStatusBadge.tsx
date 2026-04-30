type Props = {
  label: string;
  tone?: "positive" | "danger" | "warning" | "neutral";
};

const stylesByTone: Record<NonNullable<Props["tone"]>, string> = {
  positive: "bg-emerald-100 text-emerald-700 border-emerald-200",
  danger: "bg-rose-100 text-rose-700 border-rose-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

export function AdminStatusBadge({ label, tone = "neutral" }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase ${stylesByTone[tone]}`}>
      {label}
    </span>
  );
}
