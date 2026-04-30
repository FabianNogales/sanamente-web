"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "./AdminShell";
import { AdminTable } from "./AdminTable";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { AdminEmptyState } from "./AdminEmptyState";
import {
  getAdminDeposits,
  getAdminPendingWithdrawalRequests,
  getAdminStats,
  getAdminWithdrawalHistory,
  getPromotionalCreditGrants,
  updateAdminDepositStatus,
  updateAdminWithdrawalStatus,
} from "@/lib/admin-api";
import { useAdminGuard } from "./useAdminGuard";

function fullName(person: { firstName?: string | null; lastName?: string | null }) {
  return [person?.firstName, person?.lastName].filter(Boolean).join(" ") || "Sin nombre";
}

function moneyBs(value: number) {
  return `Bs ${Number(value || 0).toFixed(2)}`;
}

export function AdminFinanceView() {
  const { loading: guardLoading, token } = useAdminGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);

  const [approvalTarget, setApprovalTarget] = useState<any | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [approvalReceipt, setApprovalReceipt] = useState<File | null>(null);
  const [approving, setApproving] = useState(false);

  const [rejectionTarget, setRejectionTarget] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [rejecting, setRejecting] = useState(false);

  async function loadData() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const [statsData, depositsData, withdrawalsData, withdrawalHistoryData] = await Promise.all([
        getAdminStats(token!),
        getAdminDeposits(token!, undefined, undefined, 30),
        getAdminPendingWithdrawalRequests(token!, undefined, undefined, 30),
        getAdminWithdrawalHistory(token!, undefined, undefined, 30),
      ]);
      setStats(statsData);
      setDeposits(depositsData.requests);
      setWithdrawals(withdrawalsData.data);
      setWithdrawalHistory(withdrawalHistoryData.data);
      await getPromotionalCreditGrants(token!, 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el panel financiero.");
    } finally {
      setLoading(false);
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

  async function handleDepositStatus(id: string, status: "APPROVED" | "REJECTED") {
    if (!token) return;
    try {
      await updateAdminDepositStatus(token!, id, status, status === "REJECTED" ? "Rechazado desde panel admin" : undefined);
      await loadData();
      window.alert(`Depósito actualizado a ${status}.`);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo actualizar el depósito.");
    }
  }

  async function handleApproveWithdrawal() {
    if (!token || !approvalTarget) return;
    if (!approvalReceipt) {
      window.alert("Debes adjuntar un comprobante para aprobar el retiro.");
      return;
    }
    try {
      setApproving(true);
      await updateAdminWithdrawalStatus(token!, approvalTarget.id, {
        status: "APPROVED",
        notes: approvalNotes.trim() || undefined,
        receipt: { file: approvalReceipt },
      });
      setApprovalTarget(null);
      setApprovalNotes("");
      setApprovalReceipt(null);
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

      <section className="grid grid-cols-2 xl:grid-cols-6 gap-3">
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Ingresos brutos</p><p className="text-xl font-black">{moneyBs(financial.gross)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Ganancia plataforma</p><p className="text-xl font-black">{moneyBs(financial.platform)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Pagado a profesionales</p><p className="text-xl font-black">{moneyBs(financial.professionalPaid)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Promocional</p><p className="text-xl font-black">{moneyBs(financial.promotional)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Referidos</p><p className="text-xl font-black">{moneyBs(financial.referrals)}</p></article>
        <article className="rounded-xl border border-slate-200 p-3"><p className="text-xs uppercase text-slate-500">Retiros pendientes</p><p className="text-xl font-black">{financial.withdrawalsPending}</p></article>
      </section>

      <section className="mt-5 space-y-2">
        <h3 className="text-lg font-bold">Depósitos recientes</h3>
        {deposits.length === 0 ? (
          <AdminEmptyState title="Sin depósitos" description="No hay solicitudes de depósito recientes." />
        ) : (
          <AdminTable
            rows={deposits}
            rowKey={(row) => row.id}
            columns={[
              { key: "user", title: "Usuario", render: (row) => <span className="font-semibold">{fullName(row.user)}</span> },
              { key: "package", title: "Paquete", render: (row) => row.packageNameAtMoment ?? "-" },
              { key: "amount", title: "Monto Bs", render: (row) => moneyBs(Number(row.amountBs ?? row.amount ?? 0)) },
              { key: "credits", title: "Créditos", render: (row) => Number(row.creditsToDeliver ?? 0).toFixed(2) },
              { key: "receipt", title: "Comprobante", render: (row) => row.receiptUrl ? <a href={row.receiptUrl} className="text-indigo-600 font-semibold" target="_blank" rel="noopener noreferrer">Ver</a> : "-" },
              {
                key: "status",
                title: "Estado",
                render: (row) => (
                  <AdminStatusBadge label={row.status} tone={row.status === "APPROVED" ? "positive" : row.status === "REJECTED" ? "danger" : "warning"} />
                ),
              },
              {
                key: "actions",
                title: "Acciones",
                render: (row) => (
                  <div className="flex gap-2">
                    <button type="button" className="h-8 rounded-md bg-emerald-100 px-3 text-xs font-semibold text-emerald-700" onClick={() => void handleDepositStatus(row.id, "APPROVED")}>
                      Aprobar
                    </button>
                    <button type="button" className="h-8 rounded-md bg-rose-100 px-3 text-xs font-semibold text-rose-700" onClick={() => void handleDepositStatus(row.id, "REJECTED")}>
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
        <h3 className="text-lg font-bold">Retiros pendientes</h3>
        {withdrawals.length === 0 ? (
          <AdminEmptyState title="Sin retiros pendientes" description="No hay solicitudes pendientes por procesar." />
        ) : (
          <AdminTable
            rows={withdrawals}
            rowKey={(row) => row.id}
            columns={[
              { key: "professional", title: "Profesional", render: (row) => <span className="font-semibold">{fullName(row.professional)}</span> },
              { key: "amount", title: "Retiro", render: (row) => `${Number(row.credits).toFixed(2)} cr` },
              { key: "bs", title: "Equiv. Bs", render: (row) => moneyBs(Number(row.amountBs ?? row.soles ?? 0)) },
              { key: "account", title: "Cuenta", render: (row) => `${row.bankName} - ${row.accountNumber}${row.accountHolderName ? ` (${row.accountHolderName})` : ""}` },
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
              { key: "credits", title: "Créditos", render: (row) => Number(row.credits).toFixed(2) },
              { key: "bs", title: "Bs", render: (row) => moneyBs(Number(row.amountBs ?? row.soles ?? 0)) },
              {
                key: "status",
                title: "Estado",
                render: (row) => (
                  <AdminStatusBadge label={row.status} tone={row.status === "APPROVED" ? "positive" : row.status === "REJECTED" ? "danger" : "warning"} />
                ),
              },
              { key: "reason", title: "Motivo rechazo", render: (row) => row.rejectionReason ?? "-" },
              { key: "receipt", title: "Comprobante", render: (row) => row.receiptUrl ? <a href={row.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold">Ver</a> : "-" },
              { key: "updated", title: "Actualizado", render: (row) => new Date(row.updatedAt ?? row.createdAt).toLocaleString() },
            ]}
          />
        )}
      </section>

      {approvalTarget ? (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h3 className="text-lg font-bold">Aprobar retiro</h3>
            <p className="text-sm text-slate-600">
              {fullName(approvalTarget.professional)} - {moneyBs(Number(approvalTarget.amountBs ?? approvalTarget.soles ?? 0))}
            </p>
            <textarea
              value={approvalNotes}
              onChange={(event) => setApprovalNotes(event.target.value)}
              className="min-h-[84px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Nota interna (opcional)"
            />
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(event) => setApprovalReceipt(event.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />
            <div className="flex items-center justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold" onClick={() => setApprovalTarget(null)}>
                Cancelar
              </button>
              <button type="button" className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white disabled:opacity-60" onClick={() => void handleApproveWithdrawal()} disabled={approving}>
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
              {fullName(rejectionTarget.professional)} - {moneyBs(Number(rejectionTarget.amountBs ?? rejectionTarget.soles ?? 0))}
            </p>
            <textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              className="min-h-[84px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Motivo de rechazo (obligatorio)"
            />
            <textarea
              value={rejectionNotes}
              onChange={(event) => setRejectionNotes(event.target.value)}
              className="min-h-[84px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
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


