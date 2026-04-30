"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminEmptyState } from "./AdminEmptyState";
import { createAdminSpecialty, deactivateAdminSpecialty, getAdminSpecialties, getAdminStats, updateAdminSpecialty } from "@/lib/admin-api";
import type { AdminSpecialty } from "@/lib/admin-types";
import { useAdminGuard } from "./useAdminGuard";

function subsectionListFromDescription(name: string, description?: string | null) {
  if (!description) return [name];
  const parsed = description.split(/[,.;]/).map((item) => item.trim()).filter(Boolean).slice(0, 7);
  return parsed.length > 0 ? parsed : [name];
}

export function AdminSectionsView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<AdminSpecialty[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  async function load() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const [data, statsData] = await Promise.all([getAdminSpecialties(token!, true, search || undefined), getAdminStats(token!)]);
      setRows(data);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar secciones/especialidades.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search]);

  async function handleCreate() {
    if (!token) return;
    if (!newName.trim()) return window.alert("Ingresa un nombre para la sección.");
    try {
      await createAdminSpecialty(token!, { name: newName.trim(), description: newDescription.trim() || undefined });
      setNewName("");
      setNewDescription("");
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo crear.");
    }
  }

  function openEdit(row: AdminSpecialty) {
    setEditingId(row.id);
    setEditName(row.name);
    setEditDescription(row.description ?? "");
  }

  async function handleSaveEdit() {
    if (!token || !editingId) return;
    try {
      await updateAdminSpecialty(token!, editingId, { name: editName.trim(), description: editDescription.trim() || undefined });
      setEditingId(null);
      setEditName("");
      setEditDescription("");
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar.");
    }
  }

  async function handleDeactivate(id: string) {
    if (!token) return;
    if (!window.confirm("¿Desactivar esta sección?")) return;
    try {
      await deactivateAdminSpecialty(token!, id);
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo desactivar.");
    }
  }

  async function handleActivate(id: string) {
    if (!token) return;
    try {
      await updateAdminSpecialty(token!, id, { isActive: true });
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo activar.");
    }
  }

  const activeCount = useMemo(() => rows.filter((row) => row.isActive).length, [rows]);

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Secciones y subsecciones" subtitle="Taxonomía de especialidades de la plataforma">
      {loading ? <p className="text-sm text-slate-500">Cargando secciones...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Secciones activas</p><p className="text-2xl font-black">{activeCount}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Subsecciones totales</p><p className="text-2xl font-black">{rows.length}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Profesionales</p><p className="text-2xl font-black">{Number(stats?.professionals?.total ?? 0)}</p></article>
      </section>

      <section className="rounded-xl border border-slate-200 p-4 mt-5 space-y-3">
        <h3 className="text-lg font-bold">Crear sección</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Nombre (ej: Psicología)" />
          <input value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm md:col-span-2" placeholder="Subsecciones separadas por coma" />
          <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white" onClick={() => void handleCreate()}>
            Agregar
          </button>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm w-full" placeholder="Buscar secciones..." />
      </section>

      <section className="mt-5 space-y-3">
        {!loading && rows.length === 0 ? (
          <AdminEmptyState title="Sin secciones" description="No hay especialidades registradas aún." />
        ) : (
          rows.map((row) => (
            <article key={row.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-xl font-black text-slate-900">{row.name}</h4>
                  <p className="text-sm text-slate-500">{row.isActive ? "Activa" : "Inactiva"} · {subsectionListFromDescription(row.name, row.description).length} subsecciones</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="h-9 rounded-md bg-slate-100 px-3 text-xs font-semibold" onClick={() => openEdit(row)}>
                    Editar
                  </button>
                  {row.isActive ? (
                    <button type="button" className="h-9 rounded-md bg-rose-100 px-3 text-xs font-semibold text-rose-700" onClick={() => void handleDeactivate(row.id)}>
                      Eliminar
                    </button>
                  ) : (
                    <button type="button" className="h-9 rounded-md bg-emerald-100 px-3 text-xs font-semibold text-emerald-700" onClick={() => void handleActivate(row.id)}>
                      Activar
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {subsectionListFromDescription(row.name, row.description).map((subsection, index) => (
                  <span key={`${row.id}-${index}`} className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    {subsection}
                  </span>
                ))}
              </div>
            </article>
          ))
        )}
      </section>

      {editingId ? (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="text-lg font-bold">Editar sección</h3>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm w-full" placeholder="Nombre" />
            <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm w-full" placeholder="Descripción" />
            <div className="flex justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold" onClick={() => setEditingId(null)}>
                Cancelar
              </button>
              <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white" onClick={() => void handleSaveEdit()}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}


