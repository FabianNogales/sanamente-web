import { Pencil, Trash2, Coins, TrendingUp, DollarSign } from "lucide-react";
import type { AdminPackage } from "@/lib/admin-types";

const CARD_ACCENTS = [
  { from: "#6366F1", to: "#4F46E5", light: "#EEF2FF", text: "#4F46E5" },
  { from: "#8B5CF6", to: "#7C3AED", light: "#F5F3FF", text: "#7C3AED" },
  { from: "#0EA5E9", to: "#0284C7", light: "#F0F9FF", text: "#0284C7" },
  { from: "#10B981", to: "#059669", light: "#ECFDF5", text: "#059669" },
  { from: "#F59E0B", to: "#D97706", light: "#FFFBEB", text: "#D97706" },
];

type Props = {
  pkg: AdminPackage;
  index: number;
  priceUsd: (priceBob: number) => string;
  onEdit: () => void;
  onDelete: () => void;
};

export function PackageCard({ pkg, index, priceUsd, onEdit, onDelete }: Props) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  return (
    <div className="group rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      {/* Header */}
      <div
        className="relative px-6 pt-6 pb-10 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute top-4 -right-2 w-16 h-16 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/10" />

        <div className="relative flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
            pkg.isActive ? "bg-white/20 text-white" : "bg-black/20 text-white/70"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pkg.isActive ? "bg-green-300" : "bg-white/40"}`} />
            {pkg.isActive ? "Activo" : "Inactivo"}
          </span>
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Coins size={20} color="white" />
          </div>
        </div>

        <div className="relative">
          <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">Paquete</p>
          <h3 className="text-white text-2xl font-black tracking-tight">{pkg.name}</h3>
        </div>
      </div>

      {/* Chip créditos flotante */}
      <div className="relative px-6">
        <div
          className="absolute -top-5 left-6 right-6 rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg"
          style={{ backgroundColor: accent.light, border: `1px solid ${accent.text}20` }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={16} color={accent.text} />
            <span className="text-xs font-semibold" style={{ color: accent.text }}>Créditos incluidos</span>
          </div>
          <span className="text-lg font-black" style={{ color: accent.text }}>
            {pkg.credits.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Precios */}
      <div className="px-6 pt-10 pb-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-400 font-medium mb-1">Precio BOB</p>
            <p className="text-xl font-black text-slate-800">Bs {Number(pkg.price).toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign size={11} className="text-slate-400" />
              <p className="text-xs text-slate-400 font-medium">Precio USD</p>
            </div>
            <p className="text-xl font-black text-slate-800">${priceUsd(Number(pkg.price))}</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 h-10 rounded-2xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-1.5"
          >
            <Pencil size={13} /> Editar
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 h-10 rounded-2xl border-2 border-rose-100 bg-rose-50 text-xs font-bold text-rose-500 hover:border-rose-300 hover:bg-rose-100 transition-all flex items-center justify-center gap-1.5"
          >
            <Trash2 size={13} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
