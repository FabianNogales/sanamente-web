"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { editAdminProfessional, getAdminProfessionalById, updateAdminProfessionalKycDoc, updateAdminProfessionalProfile, updateAdminProfessionalStatus } from "@/lib/admin-api";
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
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");

  // El estado de aprobación se decide por reviewStatus (lo que filtra el feed),
  // no por isActive (que solo indica si la cuenta está activa). Así una cuenta
  // que además es cliente puede quedar "en revisión" sin apagar su acceso.
  const reviewStatus = row?.professionalProfile?.reviewStatus ?? "PENDING";
  const isApproved = reviewStatus === "APPROVED";

  // Tipo de documento con el que se verifica. CI => solo sesiones gratuitas;
  // TITULO/MATRICULA => al aprobar se habilita el cobro (canCharge en backend).
  const verificationDocType = row?.professionalProfile?.verificationDocType ?? null;
  const docTypeLabel =
    verificationDocType === "CI"
      ? "Carnet de identidad (CI)"
      : verificationDocType === "MATRICULA"
        ? "Matrícula profesional"
        : verificationDocType === "TITULO"
          ? "Título en provisión nacional"
          : "Sin especificar";
  const willCharge = verificationDocType === "TITULO" || verificationDocType === "MATRICULA";
  const canCharge = Boolean(row?.professionalProfile?.canCharge);
  const chargeVerificationPending = Boolean(row?.professionalProfile?.chargeVerificationPending);

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
      setRow((prev) =>
        prev
          ? {
              ...prev,
              isActive: next,
              professionalProfile: prev.professionalProfile
                ? { ...prev.professionalProfile, reviewStatus: next ? "APPROVED" : "REJECTED" }
                : prev.professionalProfile,
            }
          : prev,
      );
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo actualizar estado.");
    }
  }

  async function setCharge(next: boolean) {
    if (!token || !row) return;
    try {
      await updateAdminProfessionalProfile(token, row.id, { canCharge: next });
      setRow((prev) =>
        prev
          ? {
              ...prev,
              professionalProfile: prev.professionalProfile
                ? {
                    ...prev.professionalProfile,
                    canCharge: next,
                    chargeVerificationPending: false,
                    verificationDocType: next ? "TITULO" : prev.professionalProfile.verificationDocType,
                  }
                : prev.professionalProfile,
            }
          : prev,
      );
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo actualizar el cobro.");
    }
  }

  async function handleUploadDoc(
    field: "idDocUrl" | "kycVideoUrl" | "matriculaUrl" | "tituloProfesionalUrl",
    file: File,
  ) {
    if (!token || !row) return;
    try {
      setUploadingField(field);
      const updated = await updateAdminProfessionalKycDoc(token, row.id, field, file);
      setRow(updated as AdminProfessionalRecord);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo subir el documento.");
    } finally {
      setUploadingField(null);
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
              <AdminStatusBadge
                label={isApproved ? "APROBADO" : reviewStatus === "REJECTED" ? "RECHAZADO" : "REVISIÓN"}
                tone={isApproved ? "positive" : reviewStatus === "REJECTED" ? "danger" : "warning"}
              />
            </div>
            <p className="text-sm"><strong>Email:</strong> {row.email ?? "-"}</p>
            <p className="text-sm"><strong>Teléfono:</strong> {row.phoneNumber}</p>
            <p className="text-sm"><strong>Username:</strong> {row.professionalProfile?.username ?? "-"}</p>
            <p className="text-sm"><strong>Bio:</strong> {row.professionalProfile?.bio ?? "-"}</p>

            <div className="pt-2 flex flex-wrap gap-2">
              {isApproved ? (
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
            <h3 className="text-lg font-bold">Verificación y documentos</h3>
            <div className={`rounded-lg border px-3 py-2 text-sm ${willCharge ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
              <p><strong>Documento elegido:</strong> {docTypeLabel}</p>
              <p>
                <strong>Al aprobar:</strong>{" "}
                {willCharge ? "podrá COBRAR por sus sesiones." : "solo podrá ofrecer sesiones GRATUITAS (sin cobro)."}
              </p>
              <p><strong>Cobro habilitado actualmente:</strong> {canCharge ? "Sí" : "No"}</p>
              {chargeVerificationPending && (
                <p className="mt-1 font-semibold text-amber-700">
                  ⚠️ Subió su título y espera revisión para habilitar el cobro.
                </p>
              )}
              <div className="pt-2">
                {canCharge ? (
                  <button
                    type="button"
                    className="h-8 rounded-lg bg-rose-100 px-3 text-xs font-semibold text-rose-700"
                    onClick={() => void setCharge(false)}
                  >
                    Deshabilitar cobro
                  </button>
                ) : (
                  <button
                    type="button"
                    className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white"
                    onClick={() => void setCharge(true)}
                  >
                    Habilitar cobro (título verificado)
                  </button>
                )}
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              {(
                [
                  { label: "Documento de identidad", field: "idDocUrl", url: row.professionalProfile?.idDocUrl },
                  { label: "Video de rostro", field: "kycVideoUrl", url: row.professionalProfile?.kycVideoUrl },
                  { label: "Matrícula profesional", field: "matriculaUrl", url: row.professionalProfile?.matriculaUrl },
                  { label: "Título profesional", field: "tituloProfesionalUrl", url: row.professionalProfile?.tituloProfesionalUrl },
                ] as { label: string; field: "idDocUrl" | "kycVideoUrl" | "matriculaUrl" | "tituloProfesionalUrl"; url?: string | null }[]
              ).map((doc) => (
                <li key={doc.field} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2">
                  <span className="flex-1">{doc.label}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.url && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold text-xs">
                        Ver
                      </a>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[doc.field] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleUploadDoc(doc.field, file);
                        e.target.value = "";
                      }}
                    />
                    <button
                      type="button"
                      disabled={uploadingField === doc.field}
                      onClick={() => fileInputRefs.current[doc.field]?.click()}
                      className={`h-7 rounded-md px-2.5 text-xs font-semibold disabled:opacity-50 ${
                        doc.url
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {uploadingField === doc.field ? "Subiendo..." : doc.url ? "Reemplazar" : "Agregar"}
                    </button>
                  </div>
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

