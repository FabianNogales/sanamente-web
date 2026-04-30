"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminTable } from "./AdminTable";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminEmptyState } from "./AdminEmptyState";
import {
  assignProfessionalSpecialtiesAdmin,
  editAdminProfessional,
  getAdminProfessionals,
  getAdminSpecialties,
  getProfessionalSpecialtiesAdmin,
  updateAdminProfessionalProfile,
  updateAdminProfessionalStatus,
} from "@/lib/admin-api";
import type { AdminProfessionalRecord, AdminSpecialty } from "@/lib/admin-types";
import { useAdminGuard } from "./useAdminGuard";

type ProfessionalFilter = "all" | "approved" | "review" | "rejected";

const filters: { key: ProfessionalFilter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "approved", label: "Aprobado" },
  { key: "review", label: "Revisión" },
  { key: "rejected", label: "Rechazado" },
];

function fullName(row: AdminProfessionalRecord) {
  return [row.firstName, row.lastName].filter(Boolean).join(" ") || "Sin nombre";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

export function AdminProfessionalsView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState<ProfessionalFilter>("all");
  const [rows, setRows] = useState<AdminProfessionalRecord[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<AdminSpecialty[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<AdminProfessionalRecord | null>(null);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<string[]>([]);
  const [savingSpecialties, setSavingSpecialties] = useState(false);
  const [specialtyNameByProfessionalId, setSpecialtyNameByProfessionalId] = useState<Record<string, string>>({});
  const [editingProfessional, setEditingProfessional] = useState<AdminProfessionalRecord | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editRate, setEditRate] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");

  async function load(initial = false) {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      const [professionals, specialtyList] = await Promise.all([
        getAdminProfessionals(token!, search || undefined, initial ? undefined : nextCursor ?? undefined, 20),
        getAdminSpecialties(token!, true),
      ]);

      if (initial) setRows(professionals.data);
      else setRows((prev) => [...prev, ...professionals.data]);
      setNextCursor(professionals.nextCursor);
      setSpecialties(specialtyList);

      const idsToResolve = professionals.data.map((p) => p.id);
      if (idsToResolve.length > 0) {
        const assigned = await Promise.all(
          idsToResolve.map(async (id) => {
            try {
              const list = await getProfessionalSpecialtiesAdmin(token!, id);
              const first = list?.[0]?.specialty?.name ?? "Sin asignar";
              return { id, name: first };
            } catch {
              return { id, name: "Sin asignar" };
            }
          }),
        );

        setSpecialtyNameByProfessionalId((prev) => {
          const next = { ...prev };
          assigned.forEach((item) => {
            next[item.id] = item.name;
          });
          return next;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la gestión de profesionales.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search]);

  async function handleToggleStatus(row: AdminProfessionalRecord, next: boolean) {
    if (!token) return;
    try {
      await updateAdminProfessionalStatus(token!, row.id, next);
      setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, isActive: next } : item)));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo actualizar el estado.");
    }
  }

  async function handleSelectProfessional(row: AdminProfessionalRecord) {
    if (!token) return;
    setSelectedProfessional(row);
    try {
      const assigned = await getProfessionalSpecialtiesAdmin(token!, row.id);
      const ids = assigned.map((item: any) => item?.specialty?.id).filter(Boolean);
      setSelectedSpecialtyIds(ids);
    } catch {
      setSelectedSpecialtyIds([]);
    }
  }

  function openEdit(row: AdminProfessionalRecord) {
    setEditingProfessional(row);
    setEditPhone(row.phoneNumber ?? "");
    setEditEmail(row.email ?? "");
    setEditUsername(row.professionalProfile?.username ?? "");
    setEditBio(row.professionalProfile?.bio ?? "");
    setEditRate(String(Number(row.professionalProfile?.rateCredits ?? 0)));
    setEditFirstName(row.firstName ?? "");
    setEditLastName(row.lastName ?? "");
  }

  async function handleSaveEdit() {
    if (!token || !editingProfessional) return;
    const rateCredits = Number(editRate);
    if (!Number.isFinite(rateCredits) || rateCredits < 0) {
      window.alert("La tarifa base debe ser un número mayor o igual a 0.");
      return;
    }
    try {
      setSavingEdit(true);
      await editAdminProfessional(token!, editingProfessional.id, {
        phoneNumber: editPhone.trim() || undefined,
        email: editEmail.trim() || undefined,
        username: editUsername.trim() || undefined,
        bio: editBio.trim() || undefined,
        rateCredits,
      });
      await updateAdminProfessionalProfile(token!, editingProfessional.id, {
        firstName: editFirstName.trim() || undefined,
        lastName: editLastName.trim() || undefined,
        username: editUsername.trim() || undefined,
        bio: editBio.trim() || undefined,
      });
      setEditingProfessional(null);
      await load(true);
      window.alert("Datos del profesional actualizados.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSavingEdit(false);
    }
  }

  function toggleSpecialty(id: string) {
    setSelectedSpecialtyIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  async function handleSaveSpecialties() {
    if (!token || !selectedProfessional) return;
    try {
      setSavingSpecialties(true);
      await assignProfessionalSpecialtiesAdmin(token!, selectedProfessional.id, selectedSpecialtyIds);
      const resolvedNames = specialties.filter((item) => selectedSpecialtyIds.includes(item.id)).map((item) => item.name);
      setSpecialtyNameByProfessionalId((prev) => ({
        ...prev,
        [selectedProfessional.id]: resolvedNames[0] ?? "Sin asignar",
      }));
      window.alert("Especialidades guardadas.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudieron guardar especialidades.");
    } finally {
      setSavingSpecialties(false);
    }
  }

  const metrics = useMemo(() => {
    const approved = rows.filter((row) => row.isActive).length;
    const review = rows.filter((row) => !row.isActive).length;
    const rejected = 0;
    const today = rows.filter((row) => {
      const date = new Date(row.createdAt);
      const now = new Date();
      return date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    return { approved, review, rejected, today };
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "approved") return rows.filter((row) => row.isActive);
    if (filter === "review") return rows.filter((row) => !row.isActive);
    return [];
  }, [rows, filter]);

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Gestión de profesionales" subtitle={`Total: ${rows.length} profesionales · ${metrics.review} pendientes`}>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500 uppercase">Aprobados</p>
            <p className="text-2xl font-black text-emerald-600">{metrics.approved}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500 uppercase">En revisión</p>
            <p className="text-2xl font-black text-amber-600">{metrics.review}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500 uppercase">Rechazados</p>
            <p className="text-2xl font-black text-rose-600">{metrics.rejected}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500 uppercase">Hoy</p>
            <p className="text-2xl font-black text-indigo-600">{metrics.today}</p>
          </article>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") setSearch(searchInput.trim());
            }}
            placeholder="Buscar por nombre, email o teléfono"
            className="h-10 min-w-[260px] flex-1 rounded-lg border border-slate-300 px-3 text-sm"
          />
          <button type="button" className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white" onClick={() => setSearch(searchInput.trim())}>
            Buscar
          </button>
          {filters.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`h-9 rounded-full px-3 text-xs font-bold border ${
                  active ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-700"
                }`}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {loading ? <p className="text-sm text-slate-500">Cargando profesionales...</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        {!loading && filteredRows.length === 0 ? (
          <AdminEmptyState title="Sin profesionales" description="No hay resultados para el filtro actual." />
        ) : (
          <AdminTable
            rows={filteredRows}
            rowKey={(row) => row.id}
            columns={[
              { key: "name", title: "Profesional", render: (row) => <span className="font-semibold">{fullName(row)}</span> },
              { key: "specialty", title: "Especialidad", render: (row) => specialtyNameByProfessionalId[row.id] ?? "Sin asignar" },
              {
                key: "state",
                title: "Estado",
                render: (row) => <AdminStatusBadge label={row.isActive ? "APROBADO" : "REVISIÓN"} tone={row.isActive ? "positive" : "warning"} />,
              },
              { key: "earnings", title: "Ganancias", render: (row) => <span className="font-semibold text-emerald-700">{Number(row.wallet?.balance ?? 0).toFixed(2)} cr</span> },
              {
                key: "docs",
                title: "Docs",
                render: (row) => {
                  const p = row.professionalProfile;
                  const count = [p?.idDocUrl, p?.kycVideoUrl, p?.matriculaUrl, p?.tituloProfesionalUrl].filter(Boolean).length;
                  return (
                    <div className="text-xs">
                      <p className={count >= 3 ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"}>{count}/4 docs</p>
                      <p className="text-slate-500">{p?.kycFaceMatchStatus ?? "PENDING"}</p>
                    </div>
                  );
                },
              },
              { key: "joined", title: "Registro", render: (row) => formatDate(row.createdAt) },
              {
                key: "actions",
                title: "Acciones",
                render: (row) => (
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/professionals/${row.id}`} className="h-8 rounded-md bg-slate-100 px-3 text-xs font-semibold inline-flex items-center">
                      Ver
                    </Link>
                    <button type="button" className="h-8 rounded-md bg-slate-100 px-3 text-xs font-semibold" onClick={() => openEdit(row)}>
                      Editar
                    </button>
                    <button type="button" className="h-8 rounded-md bg-slate-100 px-3 text-xs font-semibold" onClick={() => void handleSelectProfessional(row)}>
                      Especialidades
                    </button>
                    {row.isActive ? (
                      <button type="button" className="h-8 rounded-md bg-rose-100 px-3 text-xs font-semibold text-rose-700" onClick={() => void handleToggleStatus(row, false)}>
                        Rechazar
                      </button>
                    ) : (
                      <button type="button" className="h-8 rounded-md bg-emerald-100 px-3 text-xs font-semibold text-emerald-700" onClick={() => void handleToggleStatus(row, true)}>
                        Aprobar
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}

        {nextCursor ? (
          <button
            type="button"
            className="h-10 self-start rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-slate-50"
            onClick={() => void load(false)}
          >
            Cargar más profesionales
          </button>
        ) : null}

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-bold">Asignar especialidades</h3>
          <p className="text-sm text-slate-500 mt-1">Selecciona un profesional y marca sus especialidades visibles.</p>
          <p className="text-sm mt-2"><strong>Seleccionado:</strong> {selectedProfessional ? fullName(selectedProfessional) : "Ninguno"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {specialties.map((tag) => {
              const active = selectedSpecialtyIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    active ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-700"
                  }`}
                  onClick={() => toggleSpecialty(tag.id)}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-3 h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
            disabled={!selectedProfessional || savingSpecialties}
            onClick={() => void handleSaveSpecialties()}
          >
            {savingSpecialties ? "Guardando..." : "Guardar especialidades"}
          </button>
        </div>
      </div>

      {editingProfessional ? (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-bold">Editar profesional</h3>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <input value={editFirstName} onChange={(event) => setEditFirstName(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Nombre" />
              <input value={editLastName} onChange={(event) => setEditLastName(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Apellido" />
              <input value={editPhone} onChange={(event) => setEditPhone(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Teléfono" />
              <input value={editEmail} onChange={(event) => setEditEmail(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Email" />
              <input value={editUsername} onChange={(event) => setEditUsername(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Username" />
              <input value={editRate} onChange={(event) => setEditRate(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Tarifa base (cr)" />
              <textarea value={editBio} onChange={(event) => setEditBio(event.target.value)} className="min-h-[96px] rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Bio" />
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold" onClick={() => setEditingProfessional(null)}>
                Cancelar
              </button>
              <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={savingEdit} onClick={() => void handleSaveEdit()}>
                {savingEdit ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}

