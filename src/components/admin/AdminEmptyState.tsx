type Props = {
  title: string;
  description: string;
};

export function AdminEmptyState({ title, description }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="text-sm font-bold text-slate-700">{title}</p>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  );
}
