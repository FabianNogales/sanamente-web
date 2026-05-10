"use client";

import { useEffect } from "react";
import { X, Save, Package, Coins, DollarSign, Tag, Sparkles, ArrowRight } from "lucide-react";
import type { AdminPackagePayload } from "@/lib/admin-types";

type Props = {
  open: boolean;
  editingId: string | null;
  form: AdminPackagePayload;
  saving: boolean;
  usdRate: number;
  onChange: (form: AdminPackagePayload) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function PackageModal({
  open,
  editingId,
  form,
  saving,
  usdRate,
  onChange,
  onSubmit,
  onClose,
}: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const priceUsd = form.price > 0 ? (form.price / usdRate).toFixed(2) : null;
  const isEditing = !!editingId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay con blur */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden">

        {/* Línea decorativa superior */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

        {/* Header */}
        <div className="px-7 pt-6 pb-5 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              {isEditing
                ? <Package size={22} color="white" />
                : <Sparkles size={22} color="white" />
              }
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isEditing ? "Editar paquete" : "Nuevo paquete"}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {isEditing ? "Modifica los datos del paquete" : "Completa los datos para crear"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors mt-0.5"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-7 h-px bg-slate-100" />

        {/* Body */}
        <div className="px-7 py-6 space-y-5">

          {/* Nombre */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Tag size={12} /> Nombre del paquete
            </label>
            <input
              className="w-full h-12 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              placeholder="Ej: Básico, Estándar, Premium..."
              autoFocus
            />
          </div>

          {/* Créditos y Precio */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Coins size={12} /> Créditos
              </label>
              <input
                type="number"
                min={1}
                className="w-full h-12 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                value={form.credits}
                onChange={(e) => onChange({ ...form, credits: Math.floor(Number(e.target.value)) })}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <DollarSign size={12} /> Precio BOB
              </label>
              <input
                type="number"
                min={0.01}
                step={0.01}
                className="w-full h-12 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
                value={form.price}
                onChange={(e) => onChange({ ...form, price: Number(e.target.value) })}
                placeholder="70.00"
              />
            </div>
          </div>

          {/* Preview USD */}
          {priceUsd ? (
            <div className="rounded-2xl overflow-hidden border border-indigo-100">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Conversión en tiempo real</span>
                <span className="text-xs text-white/60">Tasa: 1 USD = Bs {usdRate}</span>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-medium mb-0.5">Precio BOB</p>
                    <p className="text-lg font-black text-slate-700">Bs {form.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-8 h-px bg-indigo-300" />
                    <ArrowRight size={14} className="text-indigo-400" />
                    <div className="w-8 h-px bg-indigo-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-indigo-400 font-medium mb-0.5">Precio USD</p>
                    <p className="text-lg font-black text-indigo-700">${priceUsd}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  <DollarSign size={18} className="text-indigo-500" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <DollarSign size={16} className="text-slate-300" />
              </div>
              <p className="text-sm text-slate-400">Ingresa el precio para ver el equivalente en USD</p>
            </div>
          )}

          {/* Toggle activo */}
          <label className="flex items-center justify-between rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3.5 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group">
            <div>
              <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                Paquete activo
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Visible para los usuarios en la app</p>
            </div>
            <div
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                form.isActive ? "bg-indigo-500" : "bg-slate-200"
              }`}
              onClick={() => onChange({ ...form, isActive: !form.isActive })}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                form.isActive ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </div>
          </label>
        </div>

        {/* Divider */}
        <div className="mx-7 h-px bg-slate-100" />

        {/* Footer */}
        <div className="px-7 py-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl border-2 border-slate-200 bg-white text-sm font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onSubmit}
            className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/60"
          >
            <Save size={15} />
            {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear paquete"}
          </button>
        </div>
      </div>
    </div>
  );
}
