"use client";

import { AdminShell } from "./AdminShell";
import { AdminEmptyState } from "./AdminEmptyState";

export function AdminPackagesView() {
  return (
    <AdminShell
      title="Paquetes (legacy)"
      subtitle="La gestión de paquetes fue reemplazada por el sistema de sesiones y reservas."
    >
      <AdminEmptyState
        title="Módulo descontinuado"
        description="La gestión de paquetes fue reemplazada por el sistema de sesiones y reservas."
      />
    </AdminShell>
  );
}
