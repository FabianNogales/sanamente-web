"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminTable } from "./AdminTable";
import { useAdminGuard } from "./useAdminGuard";
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

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminPackagePayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(pkg: AdminPackage) {
    setEditingId(pkg.id);
    setForm({ name: pkg.name, credits: pkg.credits, price: pkg.price, isActive: pkg.isActive });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit() {
    if (!token) return;
    if (form.name.trim().length < 3) return window.alert("El nombre debe tener al menos 3 caracteres.");
    if (form.credits <= 0) return window.alert("Los créditos deben ser mayor a 0.");
    if (form.price <= 0) return window.alert("El precio debe ser mayor a 0.");

    try {
      setSaving(true);
      if (editingId) {
        await updateAdminPackage(token, editingId, form);
      } else {
        await createAdminPackage(token, form);
      }
      cancelForm();
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar el paquete.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!token) return;
    if (!window.confirm(`¿Eliminar el paquete "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      setDeletingId(id);
      await deleteAdminPackage(token, id);
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo eliminar el paquete.");
    } finally {
      setDeletingId(null);
    }
  }

  const priceUsd = (priceBob: number) => (priceBob / usdRate).toFixed(2);

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Paquetes" subtitle="Gestión de paquetes de créditos para usuarios">
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {/* Formulario crear / editar */}
      {showForm ? (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
          <h3 className="text-base font-bold">{editingId ? "Editar paquete" : "Nuevo paquete"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="text-sm">
              Nombre
              <input
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Básico"
              />
            </label>

            <label className="text-sm">
              Créditos
              <input
                type="number"
                min={1}
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: Math.floor(Number(e.target.value)) })}
                placeholder="100"
              />
            </label>

            <label className="text-sm">
              Precio (BOB)
              <input
                type="number"
                min={0.01}
                step={0.01}
                className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                placeholder="70.00"
              />
              {form.price > 0 ? (
                <span className="mt-1 block text-xs text-slate-500">
                  ≈ ${priceUsd(form.price)} USD (tasa: {usdRate})
                </span>
              ) : null}
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Paquete activo (visible para usuarios)
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSubmit()}
              className="h-9 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear paquete"}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="h-9 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <button
            type="button"
            onClick={openCreate}
            className="h-9 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Nuevo paquete
          </button>
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <p className="text-sm text-slate-500">Cargando paquetes...</p>
      ) : packages.length === 0 ? (
        <p className="text-sm text-slate-500">No hay paquetes creados aún.</p>
      ) : (
        <AdminTable
          rows={packages}
          rowKey={(row) => row.id}
          columns={[
            {
              key: "name",
              title: "Nombre",
              render: (row) => <span className="font-semibold">{row.name}</span>,
            },
            {
              key: "credits",
              title: "Créditos",
              render: (row) => row.credits.toLocaleString(),
            },
            {
              key: "priceBob",
              title: "Precio BOB",
              render: (row) => `Bs ${Number(row.price).toFixed(2)}`,
            },
            {
              key: "priceUsd",
              title: "Precio USD",
              render: (row) => `$${priceUsd(Number(row.price))}`,
            },
            {
              key: "status",
              title: "Estado",
              render: (row) =>
                row.isActive ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Activo</span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">Inactivo</span>
                ),
            },
            {
              key: "actions",
              title: "Acciones",
              render: (row) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(row)}
                    className="h-7 rounded-lg border border-slate-300 bg-white px-2 text-xs font-semibold hover:bg-slate-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === row.id}
                    onClick={() => void handleDelete(row.id, row.name)}
                    className="h-7 rounded-lg border border-rose-200 bg-rose-50 px-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-60"
                  >
                    {deletingId === row.id ? "..." : "Eliminar"}
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}
    </AdminShell>
  );
}
