"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminTable } from "./AdminTable";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminEmptyState } from "./AdminEmptyState";
import { getAdminClientById, getAdminClients, updateAdminClientStatus } from "@/lib/admin-api";
import type { AdminUserRecord } from "@/lib/admin-types";
import { useAdminGuard } from "./useAdminGuard";

type StatusFilter = "all" | "active" | "blocked" | "inactive";
type RegionFilter = "all" | "BOLIVIA" | "INTERNATIONAL";

const statusTabs: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "active", label: "Activo" },
  { key: "blocked", label: "Bloqueado" },
  { key: "inactive", label: "Inactivo" },
];

function fullName(row: AdminUserRecord) {
  return [row.firstName, row.lastName].filter(Boolean).join(" ") || "Sin nombre";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

export function AdminUsersView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [rows, setRows] = useState<AdminUserRecord[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  async function load(initial = false) {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const result = await getAdminClients(
        token!,
        search || undefined,
        initial ? undefined : nextCursor ?? undefined,
        20,
        region === "all" ? undefined : region,
      );
      if (initial) setRows(result.data);
      else setRows((prev) => [...prev, ...result.data]);
      setNextCursor(result.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el listado de usuarios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search, region]);

  const filtered = useMemo(() => {
    if (status === "all") return rows;
    if (status === "active") return rows.filter((row) => row.isActive);
    return rows.filter((row) => !row.isActive);
  }, [rows, status]);

  const metrics = useMemo(() => {
    const active = rows.filter((row) => row.isActive).length;
    const blocked = rows.filter((row) => !row.isActive).length;
    const inactive = blocked;
    const today = rows.filter((row) => {
      const date = new Date(row.createdAt);
      const now = new Date();
      return date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    return { active, blocked, inactive, today };
  }, [rows]);

  async function handleToggle(row: AdminUserRecord) {
    if (!token) return;
    try {
      await updateAdminClientStatus(token!, row.id, !row.isActive);
      setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, isActive: !item.isActive } : item)));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo actualizar el estado del usuario.");
    }
  }

  async function handleOpenDetail(id: string) {
    if (!token) return;
    try {
      setLoadingDetail(true);
      const detail = await getAdminClientById(token!, id);
      setSelectedUser(detail);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo obtener detalle del usuario.");
    } finally {
      setLoadingDetail(false);
    }
  }

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Gestión de usuarios" subtitle={`Total: ${rows.length.toLocaleString()} usuarios registrados`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") setSearch(searchInput.trim());
            }}
            placeholder="Buscar por nombre o email..."
            className="h-10 w-full sm:min-w-52 flex-1 rounded-lg border border-slate-300 px-3 text-sm"
          />
          <button
            type="button"
            className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white"
            onClick={() => setSearch(searchInput.trim())}
          >
            Buscar
          </button>
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value as RegionFilter)}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="all">Todas las regiones</option>
            <option value="BOLIVIA">Bolivia</option>
            <option value="INTERNATIONAL">Internacional</option>
          </select>
          {statusTabs.map((tab) => {
            const active = status === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`h-9 rounded-full px-3 text-xs font-bold border ${
                  active ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-300 text-slate-700"
                }`}
                onClick={() => setStatus(tab.key)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500 uppercase">Activos</p>
            <p className="text-2xl font-black text-emerald-600">{metrics.active.toLocaleString()}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500 uppercase">Bloqueados</p>
            <p className="text-2xl font-black text-rose-600">{metrics.blocked.toLocaleString()}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500 uppercase">Inactivos</p>
            <p className="text-2xl font-black text-slate-900">{metrics.inactive.toLocaleString()}</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500 uppercase">Nuevos hoy</p>
            <p className="text-2xl font-black text-indigo-600">{metrics.today.toLocaleString()}</p>
          </article>
        </div>

        {loading ? <p className="text-sm text-slate-500">Cargando usuarios...</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        {!loading && filtered.length === 0 ? (
          <AdminEmptyState title="Sin resultados" description="No encontramos usuarios para este filtro." />
        ) : (
          <AdminTable
            rows={filtered}
            rowKey={(row) => row.id}
            columns={[
              { key: "name", title: "Usuario", render: (row) => <span className="font-semibold">{fullName(row)}</span> },
              { key: "contact", title: "Email/Teléfono", render: (row) => row.email ?? row.phoneNumber },
              {
                key: "region",
                title: "Region/Pais",
                render: (row) => `${row.billingRegion ?? "-"} · ${row.phoneCountryIso ?? "-"}`,
              },
              {
                key: "status",
                title: "Estado",
                render: (row) => (
                  <AdminStatusBadge label={row.isActive ? "ACTIVO" : "BLOQUEADO"} tone={row.isActive ? "positive" : "danger"} />
                ),
              },
              { key: "joined", title: "Registro", render: (row) => formatDate(row.createdAt) },
              {
                key: "actions",
                title: "Acciones",
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <button type="button" className="h-8 rounded-md bg-slate-100 px-3 text-xs font-semibold" onClick={() => void handleOpenDetail(row.id)}>
                      Ver
                    </button>
                    <button
                      type="button"
                      className={`h-8 rounded-md px-3 text-xs font-semibold ${
                        row.isActive ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      }`}
                      onClick={() => void handleToggle(row)}
                    >
                      {row.isActive ? "Bloquear" : "Desbloquear"}
                    </button>
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
            Cargar más
          </button>
        ) : null}
      </div>

      {selectedUser ? (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Detalle de usuario</h3>
              <button type="button" className="text-sm text-slate-600" onClick={() => setSelectedUser(null)}>
                Cerrar
              </button>
            </div>
            {loadingDetail ? (
              <p className="text-sm text-slate-500 mt-3">Cargando...</p>
            ) : (
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p><strong>Nombre:</strong> {fullName(selectedUser)}</p>
                <p><strong>Email:</strong> {selectedUser.email ?? "-"}</p>
                <p><strong>Teléfono:</strong> {selectedUser.phoneNumber}</p>
                <p><strong>Dial:</strong> {selectedUser.phoneDialCode ?? "-"}</p>
                <p><strong>Nacional:</strong> {selectedUser.phoneNationalNumber ?? "-"}</p>
                <p><strong>País ISO:</strong> {selectedUser.phoneCountryIso ?? "-"}</p>
                <p><strong>País:</strong> {selectedUser.phoneCountryName ?? "-"}</p>
                <p><strong>Billing region:</strong> {selectedUser.billingRegion ?? "-"}</p>
                <p><strong>Moneda preferida:</strong> {selectedUser.preferredCurrency ?? "-"}</p>
                <p><strong>Referral code:</strong> {selectedUser.referralCode ?? "-"}</p>
                <p><strong>Username:</strong> {selectedUser.userProfile?.userName ?? "-"}</p>
                <p><strong>Bio:</strong> {selectedUser.userProfile?.bio ?? "-"}</p>
                <p><strong>Registro:</strong> {formatDate(selectedUser.createdAt)}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}


