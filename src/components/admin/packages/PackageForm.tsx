import { Save, X } from "lucide-react";
import type { AdminPackagePayload } from "@/lib/admin-types";

type Props = {
  form: AdminPackagePayload;
  editingId: string | null;
  saving: boolean;
  usdRate: number;
  onChange: (form: AdminPackagePayload) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function PackageForm({ form, editingId, saving, usdRate, onChange, onSubmit, onCancel }: Props) {
  const priceUsd = form.price > 0 ? (form.price / usdRate).toFixed(2) : null;

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
      <h3 className="text-base font-bold text-slate-800">
        {editingId ? "Editar paquete" : "Nuevo paquete"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Nombre
          <input
            className="h-10 rounded-xl border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            placeholder="Ej: Básico"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Créditos
          <input
            type="number"
            min={1}
            className="h-10 rounded-xl border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.credits}
            onChange={(e) => onChange({ ...form, credits: Math.floor(Number(e.target.value)) })}
            placeholder="100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Precio (BOB)
          <input
            type="number"
            min={0.01}
            step={0.01}
            className="h-10 rounded-xl border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.price}
            onChange={(e) => onChange({ ...form, price: Number(e.target.value) })}
            placeholder="70.00"
          />
          {priceUsd && (
            <span className="text-xs text-slate-500">
              ≈ ${priceUsd} USD (tasa: {usdRate})
            </span>
          )}
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => onChange({ ...form, isActive: e.target.checked })}
          className="rounded"
        />
        Paquete activo (visible para usuarios)
      </label>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          disabled={saving}
          onClick={onSubmit}
          className="h-9 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2"
        >
          <Save size={14} />
          {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear paquete"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <X size={14} /> Cancelar
        </button>
      </div>
    </div>
  );
}
