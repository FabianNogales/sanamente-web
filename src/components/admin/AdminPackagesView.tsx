"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminTable } from "./AdminTable";
import { AdminEmptyState } from "./AdminEmptyState";
import { createAdminPackage, deleteAdminPackage, getAdminPackages, updateAdminPackage } from "@/lib/admin-api";
import type { AdminPackage } from "@/lib/admin-types";
import { useAdminGuard } from "./useAdminGuard";

export function AdminPackagesView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminPackage[]>([]);

  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [price, setPrice] = useState("");

  const [editing, setEditing] = useState<AdminPackage | null>(null);
  const [editName, setEditName] = useState("");
  const [editCredits, setEditCredits] = useState("");
  const [editPrice, setEditPrice] = useState("");

  async function load() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminPackages(token!);
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar los paquetes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleCreate() {
    if (!token) return;
    const parsedCredits = Number(credits);
    const parsedPrice = Number(price);
    if (!name.trim()) return window.alert("Ingresa un nombre de paquete.");
    if (!Number.isInteger(parsedCredits) || parsedCredits <= 0) return window.alert("Los créditos deben ser un entero mayor a 0.");
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) return window.alert("El precio en Bs debe ser mayor a 0.");

    try {
      await createAdminPackage(token!, { name: name.trim(), credits: parsedCredits, price: parsedPrice, isActive: true });
      setName("");
      setCredits("");
      setPrice("");
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo crear.");
    }
  }

  function openEdit(row: AdminPackage) {
    setEditing(row);
    setEditName(row.name);
    setEditCredits(String(row.credits));
    setEditPrice(String(row.price));
  }

  async function handleSaveEdit() {
    if (!token || !editing) return;
    const parsedCredits = Number(editCredits);
    const parsedPrice = Number(editPrice);
    if (!editName.trim()) return window.alert("Ingresa un nombre de paquete.");
    if (!Number.isInteger(parsedCredits) || parsedCredits <= 0) return window.alert("Los créditos deben ser un entero mayor a 0.");
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) return window.alert("El precio en Bs debe ser mayor a 0.");

    try {
      await updateAdminPackage(token!, editing.id, {
        name: editName.trim(),
        credits: parsedCredits,
        price: parsedPrice,
      });
      setEditing(null);
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar.");
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("¿Eliminar paquete?")) return;
    try {
      await deleteAdminPackage(token!, id);
      await load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo eliminar.");
    }
  }

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Paquetes" subtitle="CRUD de paquetes de créditos para recargas">
      {loading ? <p className="text-sm text-slate-500">Cargando paquetes...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <section className="rounded-xl border border-slate-200 p-4 space-y-3">
        <h3 className="text-lg font-bold">Crear paquete</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm md:col-span-2" placeholder="Nombre" />
          <input value={credits} onChange={(e) => setCredits(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Créditos" />
          <input value={price} onChange={(e) => setPrice(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Precio Bs" />
        </div>
        <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white" onClick={() => void handleCreate()}>
          Agregar
        </button>
      </section>

      <section className="mt-5">
        {rows.length === 0 && !loading ? (
          <AdminEmptyState title="Sin paquetes" description="No hay paquetes activos configurados." />
        ) : (
          <AdminTable
            rows={rows}
            rowKey={(row) => row.id}
            columns={[
              { key: "name", title: "Nombre", render: (row) => <span className="font-semibold">{row.name}</span> },
              { key: "credits", title: "Créditos", render: (row) => row.credits },
              { key: "price", title: "Precio", render: (row) => `Bs ${row.price.toFixed(2)}` },
              {
                key: "actions",
                title: "Acciones",
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <button type="button" className="h-8 rounded-md bg-slate-100 px-3 text-xs font-semibold" onClick={() => openEdit(row)}>
                      Editar
                    </button>
                    <button type="button" className="h-8 rounded-md bg-rose-100 px-3 text-xs font-semibold text-rose-700" onClick={() => void handleDelete(row.id)}>
                      Eliminar
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </section>

      {editing ? (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="text-lg font-bold">Editar paquete</h3>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm w-full" placeholder="Nombre" />
            <input value={editCredits} onChange={(e) => setEditCredits(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm w-full" placeholder="Créditos" />
            <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm w-full" placeholder="Precio Bs" />
            <div className="flex justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold" onClick={() => setEditing(null)}>
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


