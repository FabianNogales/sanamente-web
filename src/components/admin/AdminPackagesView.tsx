"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { PackageCard } from "./packages/PackageCard";
import { PackageModal } from "./packages/PackageModal";
import { PackagesEmptyState } from "./packages/PackagesEmptyState";
import { ConfirmModal } from "./packages/ConfirmModal";
import {
  getAdminPackages,
  createAdminPackage,
  updateAdminPackage,
  deleteAdminPackage,
  getAdminConfig,
} from "@/lib/admin-api";
import type { AdminPackage, AdminPackagePayload } from "@/lib/admin-types";

const EMPTY_FORM: AdminPackagePayload = { name: "", credits: 0, price: 0, isActive: true };

export function AdminPackagesView() {
  const { loading: guardLoading, token } = useAdminGuard();

  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [usdRate, setUsdRate] = useState(6.96);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "active" | "inactive">("all");

  // Modal crear/editar
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminPackagePayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Modal confirmar editar
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  // Modal confirmar eliminar
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminPackage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  async function loadData() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const [pkgs, config] = await Promise.all([
        getAdminPackages(token),
        getAdminConfig(token),
      ]);
      setPackages(pkgs);
      setUsdRate(config.usdExchangeRate ?? 6.96);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los paquetes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Flujo editar: abrir modal directamente
  function handleEditRequest(pkg: AdminPackage) {
    setEditingId(pkg.id);
    setForm({ name: pkg.name, credits: pkg.credits, price: pkg.price, isActive: pkg.isActive });
    setModalOpen(true);
  }

  // Flujo guardar: confirmar antes de guardar
  function handleSaveRequest() {
    if (!token) return;
    if (form.name.trim().length < 3) return window.alert("El nombre debe tener al menos 3 caracteres.");
    if (form.price <= 0) return window.alert("El precio debe ser mayor a 0.");
    if (editingId) {
      setConfirmEditOpen(true);
    } else {
      void handleSubmit();
    }
  }

  // Flujo eliminar: confirmar y ejecutar
  function handleDeleteRequest(pkg: AdminPackage) {
    setPendingDelete(pkg);
    setConfirmDeleteOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!token || !pendingDelete) return;
    try {
      setDeleting(true);
      await deleteAdminPackage(token, pendingDelete.id);
      setDeleteSuccess(true);
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo eliminar el paquete.");
    } finally {
      setDeleting(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit() {
    if (!token) return;
    try {
      setSaving(true);
      if (editingId) {
        await updateAdminPackage(token, editingId, form);
        setEditSuccess(true);
      } else {
        await createAdminPackage(token, form);
        closeModal();
      }
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar el paquete.");
    } finally {
      setSaving(false);
    }
  }

  const priceUsd = (priceBob: number) => (priceBob / usdRate).toFixed(2);

  const activeCount = packages.filter((p) => p.isActive).length;
  const inactiveCount = packages.filter((p) => !p.isActive).length;
  const filteredPackages =
    tab === "active" ? packages.filter((p) => p.isActive) :
    tab === "inactive" ? packages.filter((p) => !p.isActive) :
    packages;

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Paquetes" subtitle="Gestión de paquetes para recargar billetera de usuarios">
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 rounded-2xl p-1 w-full sm:w-auto">
          {([
            { key: "all",      label: "Todos",     count: packages.length },
            { key: "active",   label: "Activos",   count: activeCount },
            { key: "inactive", label: "Inactivos", count: inactiveCount },
          ] as const).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
              <span className={`text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-full ${
                tab === t.key
                  ? t.key === "active"   ? "bg-emerald-100 text-emerald-700"
                  : t.key === "inactive" ? "bg-rose-100 text-rose-600"
                  : "bg-indigo-100 text-indigo-700"
                  : "bg-slate-200 text-slate-500"
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Botón nuevo */}
        <button
          type="button"
          onClick={openCreate}
          className="w-full sm:w-auto h-10 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <Plus size={16} /> Nuevo paquete
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando paquetes...</p>
      ) : filteredPackages.length === 0 ? (
        <PackagesEmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackages.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={index}
              priceUsd={priceUsd}
              onEdit={() => handleEditRequest(pkg)}
              onDelete={() => handleDeleteRequest(pkg)}
            />
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      <PackageModal
        open={modalOpen}
        editingId={editingId}
        form={form}
        saving={saving}
        usdRate={usdRate}
        onChange={setForm}
        onSubmit={() => handleSaveRequest()}
        onClose={closeModal}
      />

      {/* Confirmar guardar cambios */}
      <ConfirmModal
        open={confirmEditOpen}
        variant="info"
        title="¿Guardar los cambios?"
        description={`Los cambios en el paquete "${form.name}" se reflejarán de inmediato en la app.`}
        confirmLabel="Sí, guardar"
        loading={saving}
        success={editSuccess}
        successTitle="¡Cambios guardados!"
        successDescription={`El paquete "${form.name}" fue actualizado correctamente.`}
        onConfirm={() => void handleSubmit()}
        onClose={() => {
          setConfirmEditOpen(false);
          setEditSuccess(false);
          if (editSuccess) closeModal();
        }}
      />

      {/* Confirmar eliminar */}
      <ConfirmModal
        open={confirmDeleteOpen}
        variant="danger"
        title="¿Eliminar este paquete?"
        description={`Estás a punto de eliminar "${pendingDelete?.name}". Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        loading={deleting}
        success={deleteSuccess}
        successTitle="¡Paquete eliminado!"
        successDescription={`"${pendingDelete?.name}" fue eliminado correctamente.`}
        onConfirm={() => void handleDeleteConfirmed()}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setDeleteSuccess(false);
          setPendingDelete(null);
        }}
      />
    </AdminShell>
  );
}
