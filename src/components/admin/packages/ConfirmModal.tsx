"use client";

import { useEffect } from "react";
import { AlertTriangle, X, CheckCircle, LucideIcon } from "lucide-react";

type Variant = "danger" | "warning" | "info";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  icon?: LucideIcon;
  loading?: boolean;
  success?: boolean;
  successTitle?: string;
  successDescription?: string;
  onConfirm: () => void;
  onClose: () => void;
};

const VARIANT_STYLES: Record<Variant, {
  iconBg: string;
  iconColor: string;
  confirmBtn: string;
  topBar: string;
}> = {
  danger: {
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    confirmBtn: "bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-200/60",
    topBar: "from-rose-400 to-red-500",
  },
  warning: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    confirmBtn: "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-200/60",
    topBar: "from-amber-400 to-orange-500",
  },
  info: {
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    confirmBtn: "bg-gradient-to-r from-indigo-500 to-violet-600 shadow-indigo-200/60",
    topBar: "from-indigo-400 to-violet-500",
  },
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  icon: Icon = AlertTriangle,
  loading = false,
  success = false,
  successTitle = "¡Listo!",
  successDescription = "La acción se completó correctamente.",
  onConfirm,
  onClose,
}: Props) {
  // Cerrar con Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, loading, onClose]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Auto cerrar al mostrar success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => onClose(), 1500);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  if (!open) return null;

  const styles = VARIANT_STYLES[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={() => !loading && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden">

        {/* Línea top */}
        <div className={`h-1 w-full bg-gradient-to-r ${success ? "from-emerald-400 to-green-500" : styles.topBar}`} />

        {/* Botón cerrar */}
        {!loading && !success && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={14} className="text-slate-500" />
          </button>
        )}

        {/* Body — estado success */}
        {success ? (
          <div className="px-7 pt-8 pb-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={34} className="text-emerald-500" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">{successTitle}</h3>
              <p className="text-sm text-slate-500">{successDescription}</p>
            </div>
            {/* Barra de progreso */}
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full animate-[shrink_1.5s_linear_forwards]" />
            </div>
          </div>
        ) : (
          <>
            {/* Body — estado confirmación */}
            <div className="px-7 pt-8 pb-6 flex flex-col items-center text-center gap-4">
              <div className={`w-16 h-16 rounded-3xl ${styles.iconBg} flex items-center justify-center`}>
                <Icon size={30} className={styles.iconColor} strokeWidth={1.5} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-7 h-px bg-slate-100" />

            {/* Footer */}
            <div className="px-7 py-5 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-11 rounded-2xl border-2 border-slate-200 bg-white text-sm font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60 transition-all"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 h-11 rounded-2xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg ${styles.confirmBtn}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Procesando...
                  </>
                ) : confirmLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
