"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "./AdminShell";
import { getAdminConfig, updateAdminConfig } from "@/lib/admin-api";
import { useAdminGuard } from "./useAdminGuard";

export function AdminConfigView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [platformFeePercent, setPlatformFeePercent] = useState("50");
  const [usdExchangeRate, setUsdExchangeRate] = useState("6.96");
  const [referralPercentage, setReferralPercentage] = useState("2.5");
  const [referralEnabled, setReferralEnabled] = useState(true);
  const [referralValidPurchasesRequired, setReferralValidPurchasesRequired] = useState("1");
  const [referralThreshold, setReferralThreshold] = useState("10");
  const [referralClientDiscountPercent, setReferralClientDiscountPercent] = useState("5");
  const [referralClientDiscountSessions, setReferralClientDiscountSessions] = useState("10");
  const [referralProfessionalRewardPercent, setReferralProfessionalRewardPercent] = useState("5");
  const [withdrawalsEnabled, setWithdrawalsEnabled] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  async function loadData() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const config = await getAdminConfig(token);
      setPlatformFeePercent(String(config.platformFeePercent));
      setUsdExchangeRate(String(config.usdExchangeRate ?? 6.96));
      setReferralPercentage(String(config.referralPercentage ?? 2.5));
      setReferralEnabled(Boolean(config.referralEnabled));
      setReferralValidPurchasesRequired(String(config.referralValidPurchasesRequired ?? 1));
      setReferralThreshold(String(config.referralThreshold ?? 10));
      setReferralClientDiscountPercent(String(config.referralClientDiscountPercent ?? 5));
      setReferralClientDiscountSessions(String(config.referralClientDiscountSessions ?? 10));
      setReferralProfessionalRewardPercent(String(config.referralProfessionalRewardPercent ?? 5));
      setWithdrawalsEnabled(Boolean(config.withdrawalsEnabled));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la configuracion del sistema.");
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
    const usdRate = Number(usdExchangeRate);
    const refPct = Number(referralPercentage);
    const validPurchases = Number(referralValidPurchasesRequired);
    const threshold = Number(referralThreshold);
    const clientDiscountPercent = Number(referralClientDiscountPercent);
    const clientDiscountSessions = Number(referralClientDiscountSessions);
    const professionalRewardPercent = Number(referralProfessionalRewardPercent);

    if (!Number.isFinite(platform) || platform < 0 || platform > 100) return window.alert("Comision de plataforma entre 0 y 100.");
    if (!Number.isFinite(usdRate) || usdRate <= 0) return window.alert("Tipo de cambio USD invalido.");
    if (!Number.isFinite(refPct) || refPct < 0 || refPct > 100) return window.alert("Porcentaje de referidos entre 0 y 100.");
    if (!Number.isFinite(validPurchases) || validPurchases < 0) return window.alert("Compras validas requeridas debe ser 0 o mayor.");
    if (!Number.isFinite(threshold) || threshold < 1) return window.alert("Umbral de referidos debe ser 1 o mayor.");
    if (!Number.isFinite(clientDiscountPercent) || clientDiscountPercent < 0 || clientDiscountPercent > 100) return window.alert("Descuento cliente entre 0 y 100.");
    if (!Number.isFinite(clientDiscountSessions) || clientDiscountSessions < 1) return window.alert("Sesiones con descuento debe ser 1 o mayor.");
    if (!Number.isFinite(professionalRewardPercent) || professionalRewardPercent < 0 || professionalRewardPercent > 100) return window.alert("Recompensa profesional entre 0 y 100.");

    try {
      setSavingConfig(true);
      await updateAdminConfig(token, {
        platformFeePercent: platform,
        usdExchangeRate: usdRate,
        referralPercentage: refPct,
        referralEnabled,
        referralValidPurchasesRequired: Math.trunc(validPurchases),
        referralThreshold: Math.trunc(threshold),
        referralClientDiscountPercent: clientDiscountPercent,
        referralClientDiscountSessions: Math.trunc(clientDiscountSessions),
        referralProfessionalRewardPercent: professionalRewardPercent,
        withdrawalsEnabled,
      });
      window.alert("Parametros globales actualizados.");
      await loadData();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSavingConfig(false);
    }
  }

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesion admin...</main>;

  return (
    <AdminShell title="Configuracion" subtitle="Parametros globales del sistema">
      {loading ? <p className="text-sm text-slate-500">Cargando configuracion...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <section className="rounded-xl border border-slate-200 p-4 space-y-4">
        <h3 className="text-lg font-bold">Parametros globales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">Comision de plataforma (%)
            <input value={platformFeePercent} onChange={(e) => setPlatformFeePercent(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Tipo de cambio USD a Bs
            <input value={usdExchangeRate} onChange={(e) => setUsdExchangeRate(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Porcentaje legacy de referidos (%)
            <input value={referralPercentage} onChange={(e) => setReferralPercentage(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Compras validas requeridas para activar un referido
            <input value={referralValidPurchasesRequired} onChange={(e) => setReferralValidPurchasesRequired(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
            <span className="mt-1 block text-xs text-slate-500">Cuenta recargas de saldo y sesiones pagadas.</span>
          </label>
          <label className="text-sm">Umbral de referidos validos
            <input value={referralThreshold} onChange={(e) => setReferralThreshold(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Descuento cliente (%)
            <input value={referralClientDiscountPercent} onChange={(e) => setReferralClientDiscountPercent(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Sesiones con descuento por ciclo
            <input value={referralClientDiscountSessions} onChange={(e) => setReferralClientDiscountSessions(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="text-sm">Recompensa profesional permanente (%)
            <input value={referralProfessionalRewardPercent} onChange={(e) => setReferralProfessionalRewardPercent(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2"><input type="checkbox" checked={referralEnabled} onChange={(e) => setReferralEnabled(e.target.checked)} />Programa de referidos habilitado</label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2"><input type="checkbox" checked={withdrawalsEnabled} onChange={(e) => setWithdrawalsEnabled(e.target.checked)} />Retiros habilitados</label>
        </div>

        <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={savingConfig} onClick={() => void handleSaveConfig()}>
          {savingConfig ? "Guardando..." : "Guardar parametros globales"}
        </button>
      </section>
    </AdminShell>
  );
}
