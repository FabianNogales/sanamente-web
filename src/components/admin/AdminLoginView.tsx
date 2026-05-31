"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, type LoginResponse } from "@/lib/api-client";
import { getAdminToken, saveAdminSession } from "@/lib/admin-session";
import { MOBILE_APP_URL } from "@/lib/runtime-config";

type Props = {
  title: string;
  subtitle: string;
};

export function AdminLoginView({ title, subtitle }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function validateExistingSession() {
      const token = getAdminToken();
      if (!token) return;
      try {
        const profile = await apiRequest<{ role: string }>("/users/profile", {
          method: "GET",
          token,
        });
        if (!active) return;
        if (profile.role === "ADMIN") router.replace("/admin");
      } catch {
        // sesión inválida: api-client ya limpia storage en 401
      }
    }
    void validateExistingSession();
    return () => {
      active = false;
    };
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (response.user.role !== "ADMIN") {
        setError("Esta cuenta no tiene acceso al panel web.");
        return;
      }

      saveAdminSession(response.access_token, response.user);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 px-5 py-12 flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="admin@ejemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-6 space-y-2 text-xs text-slate-500">
          <p>El acceso web está habilitado para administración.</p>
          <p>
            Si eres usuario o profesional, usa la app móvil:{" "}
            <a href={MOBILE_APP_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Disponible en Google Play
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
