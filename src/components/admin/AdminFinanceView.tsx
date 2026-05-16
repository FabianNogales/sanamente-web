"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminTable } from "./AdminTable";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminEmptyState } from "./AdminEmptyState";
import {
  getAdminConfig,
  getAdminPendingWithdrawalRequests,
  getAdminStats,
  getAdminWithdrawalHistory,
  updateAdminConfig,
  updateAdminWithdrawalStatus,
} from "@/lib/admin-api";
import { useAdminGuard } from "./useAdminGuard";

function fullName(person: { firstName?: string | null; lastName?: string | null }) {
  return [person?.firstName, person?.lastName].filter(Boolean).join(" ") || "Sin nombre";
}

function moneyBs(value: number) {
  return `Bs ${Number(value || 0).toFixed(2)}`;
}

function moneyUsd(value: number) {
  return `$ ${Number(value || 0).toFixed(2)}`;
}

function moneyByCurrency(value: number, currency?: string | null) {
  return (currency ?? "BOB").toUpperCase() === "USD" ? `${moneyUsd(value)} USD` : `${moneyBs(value)} BOB`;
}

function isCrypto(row: any) {
  return row.method === "CRYPTO" || (row.currency ?? "BOB") === "USD";
}

function truncateAddress(addr: string) {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function DestinoBadge({ row }: { row: any }) {
  if (isCrypto(row)) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700 w-fit">
          ₿ BINANCE
        </span>
        <span className="text-xs text-slate-600">
          {row.cryptoCurrency ?? "USDT"} · {row.cryptoNetwork ?? "BEP20"}
        </span>
        {row.cryptoAddress ? (
          <span className="font-mono text-xs text-slate-500" title={row.cryptoAddress}>
            {truncateAddress(row.cryptoAddress)}
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-0.5">
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 w-fit">
        🏦 BANCO
      </span>
      <span className="text-xs text-slate-600">
        {row.bankName} · {row.accountNumber}
      </span>
      {row.accountHolderName ? (
        <span className="text-xs text-slate-500">{row.accountHolderName}</span>
      ) : null}
    </div>
  );
}

export function AdminFinanceView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);

  const [usdExchangeRate, setUsdExchangeRate] = useState<number>(6.96);
  const [usdRateInput, setUsdRateInput] = useState("6.96");
  const [savingRate, setSavingRate] = useState(false);

  const [approvalTarget, setApprovalTarget] = useState<any | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [approvalReceipt, setApprovalReceipt] = useState<File | null>(null);
  const [approvalTxId, setApprovalTxId] = useState("");
  const [approving, setApproving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [rejectionTarget, setRejectionTarget] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [rejecting, setRejecting] = useState(false);

  async function loadData() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const [statsData, withdrawalsData, withdrawalHistoryData, configData] = await Promise.all([
        getAdminStats(token!),
        getAdminPendingWithdrawalRequests(token!, undefined, undefined, 30),
        getAdminWithdrawalHistory(token!, undefined, undefined, 30),
        getAdminConfig(token!),
      ]);
      setStats(statsData);
      setWithdrawals(withdrawalsData.data);
      setWithdrawalHistory(withdrawalHistoryData.data);
      const rate = Number(configData.usdExchangeRate ?? 6.96);
      setUsdExchangeRate(rate);
      setUsdRateInput(String(rate));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el panel financiero.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveUsdRate() {
    if (!token) return;
    const rate = Number(usdRateInput);
    if (!Number.isFinite(rate) || rate <= 0) {
      window.alert("Ingresa un tipo de cambio válido mayor a 0.");
      return;
    }
    try {
      setSavingRate(true);
      await updateAdminConfig(token!, { usdExchangeRate: rate });
      setUsdExchangeRate(rate);
      window.alert(`Tipo de cambio actualizado: 1 USD = Bs ${rate.toFixed(4)}`);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo actualizar el tipo de cambio.");
    } finally {
      setSavingRate(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const financial = useMemo(() => {
    const gross = Number(stats?.finance?.grossRealRevenue ?? stats?.deposits?.totalRevenue ?? 0);
    const platform = Number(stats?.finance?.platformEarnings ?? 0);
    const professionalPaid = Number(stats?.finance?.professionalPaid ?? 0);
    const promotional = Number(stats?.finance?.promotionalGranted ?? 0);
    const referrals = Number(stats?.finance?.referralRewards ?? 0);
    const withdrawalsPending = Number(stats?.withdrawals?.pending ?? withdrawals.length);
    return { gross, platform, professionalPaid, promotional, referrals, withdrawalsPending };
  }, [stats, withdrawals.length]);

  async function handleApproveWithdrawal() {
    if (!token || !approvalTarget) return;
    if (isCrypto(approvalTarget) && !approvalTxId.trim()) {
      window.alert("Debes ingresar el TxID / Transaction Hash de Binance para aprobar.");
      return;
    }
    if (!isCrypto(approvalTarget) && !approvalReceipt) {
      window.alert("Debes adjuntar un comprobante para aprobar el retiro.");
      return;
    }
    try {
      setApproving(true);
      await updateAdminWithdrawalStatus(token!, approvalTarget.id, {
        status: "APPROVED",
        notes: approvalNotes.trim() || undefined,
        txId: approvalTxId.trim() || undefined,
        receipt: approvalReceipt ? { file: approvalReceipt } : undefined,
      });
      setApprovalTarget(null);
      setApprovalNotes("");
      setApprovalReceipt(null);
      setApprovalTxId("");
      await loadData();
      window.alert("Retiro aprobado con comprobante.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo aprobar.");
    } finally {
      setApproving(false);
    }
  }

  async function handleRejectWithdrawal() {
    if (!token || !rejectionTarget) return;
    if (!rejectionReason.trim()) {
      window.alert("Debes ingresar un motivo para rechazar el retiro.");
      return;
    }
    try {
      setRejecting(true);
      await updateAdminWithdrawalStatus(token!, rejectionTarget.id, {
        status: "REJECTED",
        rejectionReason: rejectionReason.trim(),
        notes: rejectionNotes.trim() || undefined,
      });
      setRejectionTarget(null);
      setRejectionReason("");
      setRejectionNotes("");
      await loadData();
      window.alert("Solicitud rechazada.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo rechazar.");
    } finally {
      setRejecting(false);
    }
  }

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Finanzas" subtitle="Ingresos, retiros y movimientos de caja">
      {loading ? <p className="text-sm text-slate-500">Cargando datos financieros...</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Ingresos brutos</p><p className="text-xl font-black">{moneyBs(financial.gross)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Ganancia plataforma</p><p className="text-xl font-black">{moneyBs(financial.platform)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Pagado a profesionales</p><p className="text-xl font-black">{moneyBs(financial.professionalPaid)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Promocional</p><p className="text-xl font-black">{moneyBs(financial.promotional)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Referidos</p><p className="text-xl font-black">{moneyBs(financial.referrals)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Retiros pendientes</p><p className="text-xl font-black">{financial.withdrawalsPending}</p></article>
      </section>

      <section className="mt-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Retiros pendientes</h3>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <span className="text-xs font-semibold text-amber-700">Tipo de cambio USD:</span>
            <span className="text-xs text-amber-600">1 USD =</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={usdRateInput}
              onChange={(e) => setUsdRateInput(e.target.value)}
              className="h-7 w-24 rounded-md border border-amber-300 bg-white px-2 text-xs font-semibold text-amber-900"
            />
            <span className="text-xs text-amber-600">Bs</span>
            <button
              type="button"
              disabled={savingRate}
              onClick={() => void handleSaveUsdRate()}
              className="h-7 rounded-md bg-amber-500 px-3 text-xs font-semibold text-white disabled:opacity-60"
            >
              {savingRate ? "..." : "Guardar"}
            </button>
          </div>
        </div>
        {withdrawals.some((w) => (w.currency ?? "BOB") === "USD") && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Hay retiros en USD. El monto a pagar en Bs se calcula con el tipo de cambio configurado (1 USD = Bs {usdExchangeRate.toFixed(4)}).
          </p>
        )}
        {withdrawals.length === 0 ? (
          <AdminEmptyState title="Sin retiros pendientes" description="No hay solicitudes pendientes por procesar." />
        ) : (
          <AdminTable
            rows={withdrawals}
            rowKey={(row) => row.id}
            columns={[
              { key: "professional", title: "Profesional", render: (row) => <span className="font-semibold">{fullName(row.professional)}</span> },
              {
                key: "currency",
                title: "Moneda",
                render: (row) => {
                  const isUsd = (row.currency ?? "BOB") === "USD";
                  return (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${isUsd ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                      {isUsd ? "USD" : "BOB"}
                    </span>
                  );
                },
              },
              {
                key: "monto",
                title: "Monto a pagar",
                render: (row) => {
                  const isUsd = (row.currency ?? "BOB") === "USD";
                  const base = Number(row.amountBs ?? row.soles ?? 0);
                  if (isUsd) {
                    const inBs = base * usdExchangeRate;
                    return (
                      <span>
                        <span className="font-semibold text-blue-700">{moneyUsd(base)}</span>
                        <span className="ml-1 text-xs text-slate-500">≈ {moneyBs(inBs)}</span>
                      </span>
                    );
                  }
                  return <span className="font-semibold">{moneyBs(base)}</span>;
                },
              },
              { key: "account", title: "Destino", render: (row) => <DestinoBadge row={row} /> },
              { key: "created", title: "Fecha", render: (row) => new Date(row.createdAt).toLocaleDateString() },
              { key: "status", title: "Estado", render: () => <AdminStatusBadge label="PENDING" tone="warning" /> },
              {
                key: "actions",
                title: "Acciones",
                render: (row) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="h-8 rounded-md bg-emerald-100 px-3 text-xs font-semibold text-emerald-700"
                      onClick={() => {
                        setApprovalTarget(row);
                        setApprovalNotes("");
                        setApprovalReceipt(null);
                      }}
                    >
                      Aprobar + comprobante
                    </button>
                    <button
                      type="button"
                      className="h-8 rounded-md bg-rose-100 px-3 text-xs font-semibold text-rose-700"
                      onClick={() => {
                        setRejectionTarget(row);
                        setRejectionReason("");
                        setRejectionNotes("");
                      }}
                    >
                      Rechazar
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </section>

      <section className="mt-5 space-y-2">
        <h3 className="text-lg font-bold">Historial de retiros</h3>
        {withdrawalHistory.length === 0 ? (
          <AdminEmptyState title="Sin historial" description="Aún no hay retiros procesados." />
        ) : (
          <AdminTable
            rows={withdrawalHistory}
            rowKey={(row) => row.id}
            columns={[
              { key: "professional", title: "Profesional", render: (row) => <span className="font-semibold">{fullName(row.professional)}</span> },
              {
                key: "currency",
                title: "Moneda",
                render: (row) => {
                  const isUsd = (row.currency ?? "BOB") === "USD";
                  return (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${isUsd ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                      {isUsd ? "USD" : "BOB"}
                    </span>
                  );
                },
              },
              {
                key: "monto",
                title: "Monto",
                render: (row) => {
                  const isUsd = (row.currency ?? "BOB") === "USD";
                  const base = Number(row.amountBs ?? row.soles ?? 0);
                  if (isUsd) return <span className="font-semibold text-blue-700">{moneyUsd(base)}</span>;
                  return moneyBs(base);
                },
              },
              {
                key: "status",
                title: "Estado",
                render: (row) => (
                  <AdminStatusBadge label={row.status} tone={row.status === "APPROVED" ? "positive" : row.status === "REJECTED" ? "danger" : "warning"} />
                ),
              },
              { key: "destino", title: "Destino", render: (row) => <DestinoBadge row={row} /> },
              { key: "reason", title: "Motivo rechazo", render: (row) => row.rejectionReason ?? "-" },
              { key: "receipt", title: "Comprobante", render: (row) => row.receiptUrl ? <a href={row.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold">Ver</a> : "-" },
              { key: "updated", title: "Actualizado", render: (row) => new Date(row.updatedAt ?? row.createdAt).toLocaleString() },
            ]}
          />
        )}
      </section>

      {approvalTarget ? (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Aprobar retiro</h3>
              {isCrypto(approvalTarget)
                ? <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">₿ Binance / Crypto</span>
                : <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">🏦 Transferencia bancaria</span>
              }
            </div>

            {/* Profesional y monto */}
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 space-y-0.5">
              <p className="text-sm font-semibold text-slate-800">{fullName(approvalTarget.professional)}</p>
              <p className="text-sm text-slate-600">
                {isCrypto(approvalTarget)
                  ? <>
                      <span className="font-bold text-blue-700">{moneyUsd(Number(approvalTarget.amountBs ?? approvalTarget.soles ?? 0))}</span>
                      <span className="ml-1 text-xs text-slate-400">≈ {moneyBs(Number(approvalTarget.amountBs ?? approvalTarget.soles ?? 0) * usdExchangeRate)}</span>
                      <span className="ml-1 text-xs text-amber-600">(TC: 1 USD = Bs {usdExchangeRate.toFixed(4)})</span>
                    </>
                  : <span className="font-bold">{moneyBs(Number(approvalTarget.amountBs ?? approvalTarget.soles ?? 0))}</span>
                }
              </p>
            </div>

            {/* Datos de destino */}
            {isCrypto(approvalTarget) ? (
              <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 space-y-2">
                <p className="text-xs font-bold text-orange-700 uppercase">Datos Binance — envía a esta dirección</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-slate-500">Moneda</span>
                  <span className="font-semibold">{approvalTarget.cryptoCurrency ?? "USDT"}</span>
                  <span className="text-slate-500">Red</span>
                  <span className="font-semibold">{approvalTarget.cryptoNetwork ?? "BEP20"}</span>
                </div>
                {approvalTarget.cryptoAddress ? (
                  <div className="flex items-center gap-2 rounded-md border border-orange-300 bg-white px-3 py-2">
                    <span className="font-mono text-xs text-slate-700 break-all flex-1">{approvalTarget.cryptoAddress}</span>
                    <button
                      type="button"
                      className={`shrink-0 rounded px-2 py-1 text-xs font-semibold text-white transition-colors ${copied ? "bg-emerald-500" : "bg-orange-500"}`}
                      onClick={() => {
                        void navigator.clipboard.writeText(approvalTarget.cryptoAddress);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 space-y-1">
                <p className="text-xs font-bold text-blue-700 uppercase">Datos bancarios — realiza la transferencia</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <span className="text-slate-500">Banco</span>
                  <span className="font-semibold">{approvalTarget.bankName}</span>
                  <span className="text-slate-500">Número de cuenta</span>
                  <span className="font-semibold font-mono">{approvalTarget.accountNumber}</span>
                  {approvalTarget.accountHolderName ? (
                    <>
                      <span className="text-slate-500">Titular</span>
                      <span className="font-semibold">{approvalTarget.accountHolderName}</span>
                    </>
                  ) : null}
                </div>
              </div>
            )}

            {/* TxID — solo para CRYPTO */}
            {isCrypto(approvalTarget) && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase">TxID / Transaction Hash <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={approvalTxId}
                  onChange={(e) => setApprovalTxId(e.target.value)}
                  placeholder="0xabc123..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                />
              </div>
            )}

            {/* Comprobante */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase">
                {isCrypto(approvalTarget) ? "Captura Binance (opcional)" : "Comprobante de transferencia (requerido)"}
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(event) => setApprovalReceipt(event.target.files?.[0] ?? null)}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              {approvalReceipt && (
                <p className="text-xs text-emerald-600">✓ {approvalReceipt.name}</p>
              )}
            </div>

            {/* Notas */}
            <textarea
              value={approvalNotes}
              onChange={(event) => setApprovalNotes(event.target.value)}
              className="min-h-16 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Nota interna (opcional)"
            />

            <div className="flex items-center justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold" onClick={() => { setApprovalTarget(null); setCopied(false); setApprovalTxId(""); }}>
                Cancelar
              </button>
              <button type="button" className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white disabled:opacity-60" onClick={() => void handleApproveWithdrawal()} disabled={approving}>
                {approving ? "Aprobando..." : "Confirmar aprobación"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {rejectionTarget ? (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="text-lg font-bold">Rechazar retiro</h3>
            <p className="text-sm text-slate-600">
              {fullName(rejectionTarget.professional)} - {moneyByCurrency(Number(rejectionTarget.amountBs ?? rejectionTarget.soles ?? 0), rejectionTarget.currency)}
            </p>
            <textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              className="min-h-21 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Motivo de rechazo (obligatorio)"
            />
            <textarea
              value={rejectionNotes}
              onChange={(event) => setRejectionNotes(event.target.value)}
              className="min-h-21 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Nota interna (opcional)"
            />
            <div className="flex items-center justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold" onClick={() => setRejectionTarget(null)}>
                Cancelar
              </button>
              <button type="button" className="h-10 rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white disabled:opacity-60" onClick={() => void handleRejectWithdrawal()} disabled={rejecting}>
                {rejecting ? "Rechazando..." : "Confirmar rechazo"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}


