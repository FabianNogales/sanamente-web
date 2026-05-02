"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminTable } from "./AdminTable";
import { AdminEmptyState } from "./AdminEmptyState";
import { deleteAdminBonusTier, getAdminBonusTiers, getAdminReferrals, reverseAdminReferralReward, upsertAdminBonusTier } from "@/lib/admin-api";
import type { AdminReferralRecord, BonusTier } from "@/lib/admin-types";
import { useAdminGuard } from "./useAdminGuard";

export function AdminReferralsView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminReferralRecord[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    active: 0,
    qualified: 0,
    rewarded: 0,
    totalRewardCredits: 0,
  });
  const [tiers, setTiers] = useState<BonusTier[]>([]);

  const [tierLabel, setTierLabel] = useState("");
  const [tierMin, setTierMin] = useState("5");
  const [tierBonus, setTierBonus] = useState("0.5");
  const [tierActive, setTierActive] = useState(true);
  const [savingTier, setSavingTier] = useState(false);

  async function loadData() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const [referrals, bonusTiers] = await Promise.all([
        getAdminReferrals(token!, { page: 1, limit: 20 }),
        getAdminBonusTiers(token!),
      ]);
      setRows(referrals.data);
      setSummary({
        total: Number(referrals.summary?.total ?? 0),
        pending: Number(referrals.summary?.pending ?? 0),
        active: Number((referrals.summary as any)?.active ?? 0),
        qualified: Number(referrals.summary?.qualified ?? 0),
        rewarded: Number(referrals.summary?.rewarded ?? 0),
        totalRewardCredits: Number(referrals.summary?.totalRewardCredits ?? 0),
      });
      setTiers(bonusTiers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar datos de referidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleAddTier() {
    if (!token) return;
    const min = Number(tierMin);
    const bonus = Number(tierBonus);
    if (!tierLabel.trim()) return window.alert("Nombre de tier requerido.");
    if (!Number.isFinite(min) || min < 1) return window.alert("Mínimo de referidos inválido.");
    if (!Number.isFinite(bonus) || bonus < 0) return window.alert("Bonus inválido.");

    try {
      setSavingTier(true);
      await upsertAdminBonusTier(token!, {
        label: tierLabel.trim(),
        minActiveReferrals: min,
        bonusPercent: bonus,
        isActive: tierActive,
      });
      setTierLabel("");
      setTierMin("5");
      setTierBonus("0.5");
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar el tier.");
    } finally {
      setSavingTier(false);
    }
  }

  async function handleDeleteTier(id: string) {
    if (!token) return;
    if (!window.confirm("¿Eliminar este tier?")) return;
    try {
      await deleteAdminBonusTier(token!, id);
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo eliminar el tier.");
    }
  }

  async function handleReverseReward(sourceTransactionId: string) {
    if (!token) return;
    if (!window.confirm("¿Revertir esta recompensa de referido?")) return;
    try {
      const result = await reverseAdminReferralReward(token!, sourceTransactionId);
      if (!result.reversed) window.alert(result.reason ?? "No había recompensa activa para revertir.");
      else window.alert("Recompensa revertida.");
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo revertir la recompensa.");
    }
  }

  const metrics = useMemo(() => {
    return {
      total: Number(summary.total ?? 0),
      pending: Number(summary.pending ?? 0),
      active: Number((summary as any).active ?? 0),
      qualified: Number(summary.qualified ?? 0),
      rewarded: Number(summary.rewarded ?? 0),
      rewards: Number(summary.totalRewardCredits ?? 0),
    };
  }, [summary]);

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Referidos" subtitle="Programa, recompensas y trazabilidad">
      {loading ? <p className="text-sm text-slate-500">Cargando referidos...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Referidos totales</p><p className="text-2xl font-black">{metrics.total}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Pendientes</p><p className="text-2xl font-black text-amber-600">{metrics.pending}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Activos</p><p className="text-2xl font-black">{metrics.active}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Calificados</p><p className="text-2xl font-black">{metrics.qualified}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Créditos pagados</p><p className="text-2xl font-black text-emerald-700">{metrics.rewards.toFixed(2)} cr</p></article>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 p-4 space-y-3">
        <h3 className="text-lg font-bold">Tiers de bono por volumen</h3>
        <p className="text-sm text-slate-500">El porcentaje adicional se suma al base cuando el referente supera el mínimo de activos.</p>

        <div className="space-y-2">
          {tiers.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 p-3">
              <div>
                <p className="font-semibold">{t.label}</p>
                <p className="text-sm text-slate-600">{t.minActiveReferrals} activos → +{Number(t.bonusPercent).toFixed(2)}% {t.isActive ? "(activo)" : "(desactivado)"}</p>
              </div>
              <button type="button" className="h-8 rounded-md bg-rose-100 px-3 text-xs font-semibold text-rose-700" onClick={() => void handleDeleteTier(t.id)}>
                Eliminar
              </button>
            </div>
          ))}
          {tiers.length === 0 ? <p className="text-sm text-slate-500">Sin tiers configurados.</p> : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input value={tierLabel} onChange={(e) => setTierLabel(e.target.value)} placeholder="Nombre (ej: Bronce)" className="h-10 rounded-lg border border-slate-300 px-3 text-sm md:col-span-2" />
          <input value={tierMin} onChange={(e) => setTierMin(e.target.value)} placeholder="Mín. referidos" className="h-10 rounded-lg border border-slate-300 px-3 text-sm" />
          <input value={tierBonus} onChange={(e) => setTierBonus(e.target.value)} placeholder="Bonus %" className="h-10 rounded-lg border border-slate-300 px-3 text-sm" />
          <label className="h-10 rounded-lg border border-slate-300 px-3 text-sm flex items-center gap-2">
            <input type="checkbox" checked={tierActive} onChange={(e) => setTierActive(e.target.checked)} />
            Activo
          </label>
        </div>
        <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={savingTier} onClick={() => void handleAddTier()}>
          {savingTier ? "Guardando..." : "Agregar tier"}
        </button>
      </section>

      <section className="mt-5">
        {rows.length === 0 ? (
          <AdminEmptyState title="Sin referidos" description="Aún no hay actividad del programa de referidos." />
        ) : (
          <AdminTable
            rows={rows}
            rowKey={(row) => row.id}
            columns={[
              { key: "code", title: "Código", render: (row) => <span className="font-semibold">{row.codeUsed}</span> },
              { key: "referred", title: "Usuario referido", render: (row) => row.referred.fullName || row.referred.email || "Usuario" },
              { key: "referrer", title: "Referrer", render: (row) => row.referrer.fullName || row.referrer.email || "Usuario" },
              {
                key: "status",
                title: "Estado",
                render: (row) => (
                  <span className={`font-bold text-xs ${
                    row.status === "REWARDED" ? "text-emerald-700" : row.status === "QUALIFIED" ? "text-blue-700" : "text-amber-700"
                  }`}>
                    {row.status}
                  </span>
                ),
              },
              { key: "reward", title: "Recompensa", render: (row) => `${Number(row.rewardCredits).toFixed(2)} cr` },
              { key: "date", title: "Fecha", render: (row) => new Date(row.createdAt).toLocaleDateString() },
              {
                key: "actions",
                title: "Acciones",
                render: (row) => {
                  const activeEvent = (row.rewardEvents ?? []).find((event) => !event.reversedAt);
                  if (!activeEvent?.sourceTransactionId) return <span className="text-slate-500 text-sm">Sin reward reversible</span>;
                  return (
                    <button type="button" className="h-8 rounded-md bg-rose-100 px-3 text-xs font-semibold text-rose-700" onClick={() => void handleReverseReward(activeEvent.sourceTransactionId)}>
                      Revertir reward
                    </button>
                  );
                },
              },
            ]}
          />
        )}
      </section>
    </AdminShell>
  );
}


