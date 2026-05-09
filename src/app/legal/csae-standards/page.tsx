import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/config";

const supportEmail =
  process.env.NEXT_PUBLIC_CSAE_CONTACT_EMAIL ||
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
  SITE.supportEmail ||
  "soporte@sanamente.app";

const lastUpdated = "9 de mayo de 2026";

export const metadata: Metadata = {
  title: "Estándares CSAE — Sanamente",
  description:
    "Estándares de seguridad de Sanamente contra la explotación y abuso sexual infantil (CSAE).",
};

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-slate-900 text-xl font-black">
        {number}. {title}
      </h2>
      <div className="text-slate-600 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function CsaeStandardsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </div>
            <span className="text-slate-900 font-black text-lg">Sanamente</span>
          </Link>
          <Link href="/" className="text-slate-500 hover:text-indigo-600 text-sm font-semibold flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-28 pb-20">
        <div className="mb-10">
          <span className="inline-flex items-center bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            Legal
          </span>
          <h1 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Estándares de seguridad contra la explotación y abuso sexual infantil (CSAE)
          </h1>
          <p className="text-slate-400 text-sm">Última actualización: {lastUpdated}</p>
        </div>

        <div className="space-y-10">
          <p className="text-slate-700 text-sm leading-relaxed">
            SanaMente mantiene una política de tolerancia cero frente a cualquier contenido, conducta o actividad
            relacionada con explotación y abuso sexual infantil.
          </p>

          <Section number="1" title="Tolerancia cero">
            <p>
              Está prohibido cualquier contenido, mensaje, imagen, video, conducta o actividad que promueva, facilite,
              solicite, distribuya o normalice la explotación o abuso sexual infantil.
            </p>
          </Section>

          <Section number="2" title="Prevención y moderación">
            <p>
              La plataforma puede revisar reportes, bloquear cuentas, eliminar contenido y tomar medidas de seguridad
              adicionales ante comportamientos sospechosos o denunciados.
            </p>
          </Section>

          <Section number="3" title="Reportes de usuarios">
            <p>
              Los usuarios pueden reportar comportamientos o contenido inapropiado mediante los canales de soporte de
              la app o por correo electrónico.
            </p>
          </Section>

          <Section number="4" title="Cooperación con autoridades">
            <p>
              SanaMente puede cooperar con autoridades competentes cuando exista sospecha o reporte de abuso,
              explotación o riesgo para menores, conforme al marco legal aplicable.
            </p>
          </Section>

          <Section number="5" title="Protección de menores">
            <p>
              La plataforma busca proteger la seguridad de los usuarios y prevenir el uso indebido del servicio,
              reforzando controles para detectar y detener conductas de riesgo.
            </p>
          </Section>

          <Section number="6" title="Contacto">
            <p>
              Para reportes o consultas sobre estos estándares, escríbenos a{" "}
              <a href={`mailto:${supportEmail}`} className="text-indigo-600 underline hover:text-indigo-800">
                {supportEmail}
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
