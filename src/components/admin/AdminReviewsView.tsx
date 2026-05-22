"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminTable } from "@/components/admin/AdminTable";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { ConfirmModal } from "./packages/ConfirmModal";
import { getAdminReviews, deleteAdminReview } from "@/lib/admin-api";
import type { AdminReviewRecord } from "@/lib/admin-types";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i <= rating ? "text-amber-400" : "text-slate-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  const initial = name.charAt(0).toUpperCase();
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={name} className="h-7 w-7 rounded-full object-cover" />
  ) : (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
      {initial}
    </span>
  );
}

export function AdminReviewsView() {
  const { loading: guardLoading, token } = useAdminGuard();

  const [rows, setRows] = useState<AdminReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [pendingDelete, setPendingDelete] = useState<AdminReviewRecord | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  async function load(searchValue?: string) {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminReviews(token, 1, 50, searchValue || undefined);
      setRows(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las reseñas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput.trim());
  }

  function handleDeleteRequest(review: AdminReviewRecord) {
    setPendingDelete(review);
    setConfirmDeleteOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!token || !pendingDelete) return;
    try {
      setDeleting(true);
      await deleteAdminReview(token, pendingDelete.id);
      setDeleteSuccess(true);
      await load(search);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo eliminar la reseña.");
    } finally {
      setDeleting(false);
    }
  }

  if (guardLoading) return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;

  return (
    <AdminShell title="Reseñas" subtitle="Gestión de reseñas de sesiones">
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      <form onSubmit={handleSearchSubmit} className="mb-5 flex gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre de cliente o profesional..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400"
        />
        <button
          type="submit"
          className="h-9 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Buscar
        </button>
        {search ? (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Limpiar
          </button>
        ) : null}
      </form>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando reseñas...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-500">{search ? "Sin resultados para la búsqueda." : "No hay reseñas registradas."}</p>
      ) : (
        <AdminTable
          rows={rows}
          rowKey={(row) => row.id}
          columns={[
            {
              key: "professional",
              title: "Profesional",
              render: (row) => (
                <div className="flex items-center gap-2">
                  <Avatar name={row.professional.name} url={row.professional.avatarUrl} />
                  <span className="font-medium">{row.professional.name}</span>
                </div>
              ),
            },
            {
              key: "client",
              title: "Cliente",
              render: (row) => (
                <div className="flex items-center gap-2">
                  <Avatar name={row.client.name} url={row.client.avatarUrl} />
                  <span>{row.client.name}</span>
                </div>
              ),
            },
            {
              key: "rating",
              title: "Calificación",
              render: (row) => <StarRating rating={row.rating} />,
            },
            {
              key: "comment",
              title: "Comentario",
              className: "max-w-xs",
              render: (row) =>
                row.comment ? (
                  <span className="text-slate-600">
                    {row.comment.length > 60 ? `${row.comment.slice(0, 60)}…` : row.comment}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Sin comentario</span>
                ),
            },
            {
              key: "date",
              title: "Fecha",
              render: (row) => new Date(row.createdAt).toLocaleDateString("es-ES"),
            },
            {
              key: "actions",
              title: "Acciones",
              render: (row) => (
                <button
                  type="button"
                  onClick={() => handleDeleteRequest(row)}
                  className="h-7 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  Eliminar
                </button>
              ),
            },
          ]}
        />
      )}

      <ConfirmModal
        open={confirmDeleteOpen}
        variant="danger"
        title="¿Eliminar esta reseña?"
        description={`Se eliminará la reseña de ${pendingDelete?.client.name} para ${pendingDelete?.professional.name}. Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        loading={deleting}
        success={deleteSuccess}
        successTitle="¡Reseña eliminada!"
        successDescription="La reseña fue eliminada correctamente."
        onConfirm={() => void handleDeleteConfirmed()}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setDeleteSuccess(false);
          setPendingDelete(null);
        }}
      />
    </AdminShell>
  );
}
