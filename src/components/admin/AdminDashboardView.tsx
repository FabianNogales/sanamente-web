"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminEmptyState } from "./AdminEmptyState";
import { getAdminPendingWithdrawalRequests, getAdminProfessionals, getAdminStats, getAdminWithdrawalHistory } from "@/lib/admin-api";
import type { AdminProfessionalRecord, AdminStatsResponse, AdminWithdrawalRecord } from "@/lib/admin-types";
import { useAdminGuard } from "./useAdminGuard";

function fullName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ") || "Sin nombre";
}

function money(value: number) {
  return `Bs ${Math.round(value).toLocaleString()}`;
}

export function AdminDashboardView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [pendingProfessionals, setPendingProfessionals] = useState<AdminProfessionalRecord[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<AdminWithdrawalRecord[]>([]);
  const [paidToProfessionals, setPaidToProfessionals] = useState(0);

  useEffect(() => {
    if (!token) return;
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [statsResult, professionalsResult, withdrawalsResult, withdrawalHistoryResult] = await Promise.allSettled([
          getAdminStats(token!),
          getAdminProfessionals(token!, undefined, undefined, 50),
          getAdminPendingWithdrawalRequests(token!, undefined, undefined, 8),
          getAdminWithdrawalHistory(token!, undefined, undefined, 100),
        ]);

        const failures: string[] = [];

        if (statsResult.status === "fulfilled") setStats(statsResult.value);
        else failures.push("stats");

        if (professionalsResult.status === "fulfilled") {
          setPendingProfessionals(professionalsResult.value.data.filter((p) => !p.isActive).slice(0, 6));
        } else {
          failures.push("professionals");
        }

        if (withdrawalsResult.status === "fulfilled") {
          setPendingWithdrawals(withdrawalsResult.value.data.slice(0, 6));
        } else {
          failures.push("withdrawals");
        }

        if (withdrawalHistoryResult.status === "fulfilled") {
          setPaidToProfessionals(
            withdrawalHistoryResult.value.data.reduce((acc, row) => acc + Number(row.amountBs ?? row.soles ?? 0), 0),
          );
        } else {
          failures.push("withdrawals_history");
        }

        if (!active) return;
        if (failures.length > 0) setError(`Dashboard cargado parcialmente. Falló: ${failures.join(", ")}`);
      } catch {
        if (!active) return;
        setError("No se pudo cargar el dashboard principal.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [token]);

  const kpis = useMemo(() => {
    if (!stats) return [];
    const gross = Number(stats?.deposits?.totalRevenue ?? 0);
    const platform = Number((stats as any)?.finance?.platformEarnings ?? gross * 0.45);
    const paid = Number(paidToProfessionals ?? 0);
    const newUsers = Number(stats?.clients?.newThisMonth ?? 0);
    const newProfessionals = Math.max(Number(stats?.professionals?.inactive ?? 0), 0);
    const referrals = Number((stats as any)?.finance?.referralRewards ?? 0);
    return [
      { label: "Ingresos brutos", value: money(gross) },
      { label: "Ganancia plataforma", value: money(platform) },
      { label: "Pagado a profesionales", value: money(paid) },
      { label: "Por referidos", value: money(referrals) },
      { label: "Nuevos usuarios", value: String(newUsers) },
      { label: "Nuevos profesionales", value: String(newProfessionals) },
    ];
  }, [stats, paidToProfessionals]);

  if (guardLoading) {
    return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;
  }

  return (
    <AdminShell title="Dashboard principal" subtitle="Datos operativos en tiempo real">
      {loading ? <p className="text-sm text-slate-500">Cargando dashboard...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-xl font-black text-slate-900">{kpi.value}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
        <article className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-bold">Profesionales en revisión</h3>
          <p className="text-sm text-slate-500 mt-1">Cuentas pendientes de validación administrativa.</p>
          <div className="mt-3 space-y-2">
            {pendingProfessionals.length === 0 ? (
              <AdminEmptyState title="Sin pendientes" description="No hay profesionales en revisión." />
            ) : (
              pendingProfessionals.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="font-semibold text-slate-900">{fullName(item.firstName, item.lastName)}</p>
                  <p className="text-sm text-slate-500">{item.email ?? item.phoneNumber}</p>
                  <div className="mt-2">
                    <AdminStatusBadge label={item.isActive ? "ACTIVO" : "REVISIÓN"} tone={item.isActive ? "positive" : "warning"} />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-bold">Retiros pendientes</h3>
          <p className="text-sm text-slate-500 mt-1">Solicitudes en espera de aprobación financiera.</p>
          <div className="mt-3 space-y-2">
            {pendingWithdrawals.length === 0 ? (
              <AdminEmptyState title="Sin retiros pendientes" description="No hay solicitudes en espera." />
            ) : (
              pendingWithdrawals.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="font-semibold text-slate-900">{fullName(item.professional?.firstName, item.professional?.lastName)}</p>
                  <p className="text-sm text-slate-500">
                    {Number(item.credits).toFixed(2)} cr · Bs {Number(item.amountBs ?? item.soles ?? 0).toFixed(2)}
                  </p>
                  <div className="mt-2">
                    <AdminStatusBadge label="PENDIENTE" tone="warning" />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </AdminShell>
  );
}

