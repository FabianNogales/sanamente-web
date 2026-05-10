import { PackageOpen } from "lucide-react";

export function PackagesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
      <PackageOpen size={48} strokeWidth={1.5} />
      <p className="text-sm font-medium">No hay paquetes creados aún.</p>
      <p className="text-xs">Crea el primer paquete con el botón de arriba.</p>
    </div>
  );
}
