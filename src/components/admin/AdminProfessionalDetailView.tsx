"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { editAdminProfessional, getAdminProfessionalById, updateAdminProfessionalProfile, updateAdminProfessionalStatus } from "@/lib/admin-api";
import type { AdminProfessionalRecord } from "@/lib/admin-types";
import { useAdminGuard } from "./useAdminGuard";

type Props = {
  professionalId: string;
};

function fullName(row: AdminProfessionalRecord) {
  return [row.firstName, row.lastName].filter(Boolean).join(" ") || "Sin nombre";
}

export function AdminProfessionalDetailView({ professionalId }: Props) {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [row, setRow] = useState<AdminProfessionalRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");

  useEffect(() => {
    if (!token) return;
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const detail = await getAdminProfessionalById(token!, professionalId);
        if (!active) return;
        setRow(detail);
        setEditPhone(detail.phoneNumber ?? "");
        setEditEmail(detail.email ?? "");
        setEditUsername(detail.professionalProfile?.username ?? "");
        setEditBio(detail.professionalProfile?.bio ?? "");
        setEditFirstName(detail.firstName ?? "");
        setEditLastName(detail.lastName ?? "");
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar el profesional.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [token, professionalId]);

  async function toggleStatus(next: boolean) {
    if (!token || !row) return;
    try {
      await updateAdminProfessionalStatus(
        token!,
        row.id,
        next,
        next ? "APPROVED" : "REJECTED",
      );
      setRow((prev) => (prev ? { ...prev, isActive: next } : prev));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo actualizar estado.");
    }
  }

  async function saveEdit() {
    if (!token || !row) return;
    try {
      setSaving(true);
      await editAdminProfessional(token!, row.id, {
        phoneNumber: editPhone.trim() || undefined,
        email: editEmail.trim() || undefined,
        username: editUsername.trim() || undefined,
        bio: editBio.trim() || undefined,
      });
      await updateAdminProfessionalProfile(token!, row.id, {
        firstName: editFirstName.trim() || undefined,
        lastName: editLastName.trim() || undefined,
        username: editUsername.trim() || undefined,
        bio: editBio.trim() || undefined,
      });
      window.alert("Profesional actualizado.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Detalle de profesional" subtitle="Revisión KYC, estado y perfil editable">
      <div className="mb-3">
        <Link href="/admin/professionals" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          ← Volver a profesionales
        </Link>
      </div>

      {loading ? <p className="text-sm text-slate-500">Cargando profesional...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {row ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-xl border border-slate-200 p-4 space-y-3">
            <h3 className="text-lg font-bold">{fullName(row)}</h3>
            <div>
              <AdminStatusBadge label={row.isActive ? "APROBADO" : "REVISIÓN"} tone={row.isActive ? "positive" : "warning"} />
            </div>
            <p className="text-sm"><strong>Email:</strong> {row.email ?? "-"}</p>
            <p className="text-sm"><strong>Teléfono:</strong> {row.phoneNumber}</p>
            <p className="text-sm"><strong>Username:</strong> {row.professionalProfile?.username ?? "-"}</p>
            <p className="text-sm"><strong>Bio:</strong> {row.professionalProfile?.bio ?? "-"}</p>

            <div className="pt-2 flex flex-wrap gap-2">
              {row.isActive ? (
                <button type="button" className="h-9 rounded-lg bg-rose-100 px-3 text-sm font-semibold text-rose-700" onClick={() => void toggleStatus(false)}>
                  Rechazar
                </button>
              ) : (
                <button type="button" className="h-9 rounded-lg bg-emerald-100 px-3 text-sm font-semibold text-emerald-700" onClick={() => void toggleStatus(true)}>
                  Aprobar
                </button>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 p-4 space-y-2">
            <h3 className="text-lg font-bold">Cotejo y documentos</h3>
            <p className="text-sm">
              <strong>Face match:</strong> {row.professionalProfile?.kycFaceMatchStatus ?? "PENDING"} ·{" "}
              {row.professionalProfile?.kycFaceMatchScore != null ? `${Number(row.professionalProfile.kycFaceMatchScore).toFixed(1)}%` : "N/A"}
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Documento de identidad", url: row.professionalProfile?.idDocUrl },
                { label: "Video de rostro", url: row.professionalProfile?.kycVideoUrl },
                { label: "Matrícula profesional", url: row.professionalProfile?.matriculaUrl },
                { label: "Título profesional", url: row.professionalProfile?.tituloProfesionalUrl },
              ].map((doc) => (
                <li key={doc.label} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2">
                  <span>{doc.label}</span>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold">
                      Ver documento
                    </a>
                  ) : (
                    <span className="text-slate-500">No cargado</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 p-4 space-y-2 xl:col-span-2">
            <h3 className="text-lg font-bold">Editar profesional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={editFirstName} onChange={(event) => setEditFirstName(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Nombre" />
              <input value={editLastName} onChange={(event) => setEditLastName(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Apellido" />
              <input value={editPhone} onChange={(event) => setEditPhone(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Teléfono" />
              <input value={editEmail} onChange={(event) => setEditEmail(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Email" />
              <input value={editUsername} onChange={(event) => setEditUsername(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Username" />
            </div>
            <textarea value={editBio} onChange={(event) => setEditBio(event.target.value)} className="min-h-25 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Bio" />
            <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-60" onClick={() => void saveEdit()} disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </section>
        </div>
      ) : null}
    </AdminShell>
  );
}

