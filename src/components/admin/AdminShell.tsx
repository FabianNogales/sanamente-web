"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminSession } from "@/lib/admin-session";
import { useAdminGuard } from "./useAdminGuard";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/professionals", label: "Profesionales" },
  { href: "/admin/finance", label: "Finanzas" },
  { href: "/admin/referrals", label: "Referidos" },
  { href: "/admin/packages", label: "Paquetes" },
  { href: "/admin/sections", label: "Secciones" },
  { href: "/admin/config", label: "Configuración" },
  { href: "/admin/reports", label: "Reportes" },
];

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AdminShell({ title, subtitle, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, user } = useAdminGuard();

  function logout() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  if (loading) {
    return <main className="min-h-screen bg-slate-100 p-6 text-slate-700">Validando sesión admin...</main>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-[1400px] mx-auto px-4 py-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-4 h-fit">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">SanaMente</p>
              <h2 className="text-xl font-black tracking-tight">Panel Admin</h2>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      active ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-slate-200 pt-4 space-y-2">
              <p className="text-xs text-slate-500">{user?.email ?? "admin@sanamente.app"}</p>
              <button
                type="button"
                className="w-full h-9 rounded-lg border border-slate-300 bg-white text-sm font-semibold hover:bg-slate-50"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 lg:p-6">
            <header className="mb-5">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight">{title}</h1>
              <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
            </header>
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
