"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminTable } from "./AdminTable";
import { AdminEmptyState } from "./AdminEmptyState";
import { getAdminConfig, getPromotionalCreditGrants, grantPromotionalCredits, updateAdminConfig } from "@/lib/admin-api";
import type { PromotionalGrantRecord } from "@/lib/admin-types";
import { useAdminGuard } from "./useAdminGuard";

export function AdminConfigView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grants, setGrants] = useState<PromotionalGrantRecord[]>([]);

  const [platformFeePercent, setPlatformFeePercent] = useState("50");
  const [creditValueBs, setCreditValueBs] = useState("1");
  const [referralPercentage, setReferralPercentage] = useState("2.5");
  const [referralRewardCredits, setReferralRewardCredits] = useState("10");
  const [referralMinDepositAmount, setReferralMinDepositAmount] = useState("0");
  const [referralEnabled, setReferralEnabled] = useState(true);
  const [paymentsEnabled, setPaymentsEnabled] = useState(true);
  const [withdrawalsEnabled, setWithdrawalsEnabled] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("20");
  const [reason, setReason] = useState("Crédito promocional administrativo");
  const [savingGrant, setSavingGrant] = useState(false);

  async function loadData() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const [config, grantsData] = await Promise.all([getAdminConfig(token!), getPromotionalCreditGrants(token!, 30)]);
      setPlatformFeePercent(String(config.platformFeePercent));
      setCreditValueBs(String(config.creditValueBs ?? config.creditToSolesRate));
      setReferralPercentage(String(config.referralPercentage ?? 2.5));
      setReferralRewardCredits(String(config.referralRewardCredits));
      setReferralMinDepositAmount(String(config.referralMinDepositAmount));
      setReferralEnabled(Boolean(config.referralEnabled));
      setPaymentsEnabled(Boolean(config.paymentsEnabled));
      setWithdrawalsEnabled(Boolean(config.withdrawalsEnabled));
      setGrants(grantsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la configuración del sistema.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleSaveConfig() {
    if (!token) return;
    const platform = Number(platformFeePercent);
    const creditValue = Number(creditValueBs);
    const refPct = Number(referralPercentage);
    const rewardCredits = Number(referralRewardCredits);
    const minDeposit = Number(referralMinDepositAmount);

    if (!Number.isFinite(platform) || platform < 0 || platform > 100) return window.alert("Comisión de plataforma entre 0 y 100.");
    if (!Number.isFinite(creditValue) || creditValue < 0) return window.alert("Valor de 1 crédito inválido.");
    if (!Number.isFinite(refPct) || refPct < 0 || refPct > 100) return window.alert("Porcentaje de referidos entre 0 y 100.");
    if (!Number.isFinite(rewardCredits) || rewardCredits < 0) return window.alert("Recompensa fija inválida.");
    if (!Number.isFinite(minDeposit) || minDeposit < 0) return window.alert("Mínimo de depósito inválido.");

    try {
      setSavingConfig(true);
      await updateAdminConfig(token!, {
        platformFeePercent: platform,
        creditValueBs: creditValue,
        referralPercentage: refPct,
        referralRewardCredits: rewardCredits,
        referralMinDepositAmount: minDeposit,
        referralEnabled,
        paymentsEnabled,
        withdrawalsEnabled,
      });
      window.alert("Parámetros globales actualizados.");
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSavingConfig(false);
    }
  }

  async function handleGrantCredits() {
    if (!token) return;
    const parsedAmount = Number(amount);
    if (!userId.trim()) return window.alert("Ingresa el ID del usuario destinatario.");
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return window.alert("Cantidad de créditos inválida.");
    try {
      setSavingGrant(true);
      await grantPromotionalCredits(token!, {
        userId: userId.trim(),
        amount: parsedAmount,
        reason: reason.trim() || undefined,
      });
      setUserId("");
      setReason("Crédito promocional administrativo");
      await loadData();
      window.alert("Créditos promocionales otorgados.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo otorgar créditos.");
    } finally {
      setSavingGrant(false);
    }
  }

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Configuración" subtitle="Parámetros del sistema y créditos promocionales">
      {loading ? <p className="text-sm text-slate-500">Cargando configuración...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <section className="rounded-xl border border-slate-200 p-4 space-y-4">
        <h3 className="text-lg font-bold">Parámetros globales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">Comisión de plataforma (%)
            <input value={platformFeePercent} onChange={(e) => setPlatformFeePercent(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Valor de 1 crédito (Bs)
            <input value={creditValueBs} onChange={(e) => setCreditValueBs(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Porcentaje de referidos (%)
            <input value={referralPercentage} onChange={(e) => setReferralPercentage(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Recompensa fija referidos (cr)
            <input value={referralRewardCredits} onChange={(e) => setReferralRewardCredits(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Mínimo depósito para referido (Bs)
            <input value={referralMinDepositAmount} onChange={(e) => setReferralMinDepositAmount(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2"><input type="checkbox" checked={referralEnabled} onChange={(e) => setReferralEnabled(e.target.checked)} />Programa de referidos habilitado</label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2"><input type="checkbox" checked={paymentsEnabled} onChange={(e) => setPaymentsEnabled(e.target.checked)} />Pagos habilitados</label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2"><input type="checkbox" checked={withdrawalsEnabled} onChange={(e) => setWithdrawalsEnabled(e.target.checked)} />Retiros habilitados</label>
        </div>

        <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={savingConfig} onClick={() => void handleSaveConfig()}>
          {savingConfig ? "Guardando..." : "Guardar parámetros globales"}
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 p-4 mt-5 space-y-3">
        <h3 className="text-lg font-bold">Créditos promocionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input value={userId} onChange={(e) => setUserId(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="User ID destinatario" />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" placeholder="Monto en créditos" />
          <input value={reason} onChange={(e) => setReason(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm md:col-span-2" placeholder="Motivo (opcional)" />
        </div>
        <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={savingGrant} onClick={() => void handleGrantCredits()}>
          {savingGrant ? "Guardando..." : "Otorgar créditos"}
        </button>
      </section>

      <section className="mt-5">
        <h3 className="text-lg font-bold mb-2">Últimos créditos promocionales otorgados</h3>
        {grants.length === 0 ? (
          <AdminEmptyState title="Sin grants recientes" description="Aún no hay créditos promocionales otorgados." />
        ) : (
          <AdminTable
            rows={grants}
            rowKey={(row) => row.id}
            columns={[
              {
                key: "recipient",
                title: "Usuario",
                render: (row) => [row.recipient?.firstName, row.recipient?.lastName].filter(Boolean).join(" ") || row.recipient?.email || "Usuario",
              },
              { key: "amount", title: "Monto", render: (row) => `${Number(row.amount ?? 0).toFixed(2)} cr` },
              { key: "reason", title: "Motivo", render: (row) => row.reason ?? "-" },
              {
                key: "admin",
                title: "Otorgado por",
                render: (row) => [row.admin?.firstName, row.admin?.lastName].filter(Boolean).join(" ") || row.admin?.email || "Admin",
              },
              { key: "date", title: "Fecha", render: (row) => new Date(row.createdAt).toLocaleDateString() },
            ]}
          />
        )}
      </section>
    </AdminShell>
  );
}


