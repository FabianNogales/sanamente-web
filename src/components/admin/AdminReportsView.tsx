"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "./AdminShell";
import { getAdminPendingWithdrawalRequests, getAdminStats, getAdminWithdrawalHistory } from "@/lib/admin-api";
import { useAdminGuard } from "./useAdminGuard";

function money(value: number) {
  return `Bs ${Number(value || 0).toFixed(2)}`;
}

function moneyByCurrency(value: number, currency?: string | null) {
  if ((currency ?? "").toUpperCase() === "USD") {
    return `$ ${Number(value || 0).toFixed(2)} USD`;
  }
  return `Bs ${Number(value || 0).toFixed(2)} BOB`;
}

export function AdminReportsView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [statsData, pendingData, historyData] = await Promise.all([
          getAdminStats(token!),
          getAdminPendingWithdrawalRequests(token!, undefined, undefined, 10),
          getAdminWithdrawalHistory(token!, undefined, undefined, 10),
        ]);
        if (!active) return;
        setStats(statsData);
        setPendingWithdrawals(pendingData.data);
        setHistory(historyData.data);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar reportes.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [token]);

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesion admin...</main>;

  return (
    <AdminShell title="Reportes" subtitle="Resumen operativo consolidado">
      {loading ? <p className="text-sm text-slate-500">Cargando reportes...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <article className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs uppercase text-slate-500">Ingresos brutos</p>
          <p className="text-2xl font-black">{money(Number(stats?.deposits?.totalRevenue ?? 0))}</p>
        </article>
        <article className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs uppercase text-slate-500">Depositos pendientes</p>
          <p className="text-2xl font-black">{Number(stats?.deposits?.pending ?? 0)}</p>
        </article>
        <article className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs uppercase text-slate-500">Retiros pendientes</p>
          <p className="text-2xl font-black">{Number(stats?.withdrawals?.pending ?? 0)}</p>
        </article>
        <article className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs uppercase text-slate-500">Mensajes actividad</p>
          <p className="text-2xl font-black">{Number(stats?.activity?.messages ?? 0)}</p>
        </article>
      </section>

      <section className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <article className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-bold">Ultimos retiros pendientes</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pendingWithdrawals.slice(0, 6).map((row) => (
              <li key={row.id} className="rounded-lg border border-slate-200 px-3 py-2">
                {row.professional?.firstName} {row.professional?.lastName} · {moneyByCurrency(Number(row.amountBs ?? row.soles ?? 0), row.currency)}
              </li>
            ))}
            {pendingWithdrawals.length === 0 ? <li className="text-slate-500">Sin retiros pendientes.</li> : null}
          </ul>
          <Link href="/admin/finance" className="inline-block mt-3 text-sm font-semibold text-indigo-600">
            Ver modulo de finanzas
          </Link>
        </article>

        <article className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-lg font-bold">Historial reciente de retiros</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {history.slice(0, 6).map((row) => (
              <li key={row.id} className="rounded-lg border border-slate-200 px-3 py-2">
                {row.professional?.firstName} {row.professional?.lastName} · {row.status} · {moneyByCurrency(Number(row.amountBs ?? row.soles ?? 0), row.currency)}
              </li>
            ))}
            {history.length === 0 ? <li className="text-slate-500">Sin historial.</li> : null}
          </ul>
        </article>
      </section>
    </AdminShell>
  );
}
