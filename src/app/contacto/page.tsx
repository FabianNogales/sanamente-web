import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contacto — Sanamente",
  description: "Contacta con el equipo de Sanamente. Soporte técnico y consultas generales.",
};

export default function ContactoPage() {
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
        <div className="mb-12 text-center">
          <span className="inline-flex items-center bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">Contacto</span>
          <h1 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mb-4">
            ¿En qué podemos ayudarte?
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto">
            Nuestro equipo está disponible para responder tus dudas sobre la plataforma, soporte técnico o cualquier consulta general.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          <a href={`mailto:${SITE.email}`} className="group bg-indigo-50 border border-indigo-100 hover:border-indigo-300 hover:shadow-md rounded-2xl p-7 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Correo general</p>
            <p className="text-slate-900 font-bold text-base mb-1">{SITE.email}</p>
            <p className="text-slate-500 text-xs">Para consultas sobre la plataforma</p>
          </a>

          <a href={`mailto:${SITE.supportEmail}`} className="group bg-teal-50 border border-teal-100 hover:border-teal-300 hover:shadow-md rounded-2xl p-7 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors text-teal-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288" />
              </svg>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Soporte técnico</p>
            <p className="text-slate-900 font-bold text-base mb-1">{SITE.supportEmail}</p>
            <p className="text-slate-500 text-xs">Problemas técnicos o con tu cuenta</p>
          </a>
        </div>

        {/* Hours & response */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-800 font-bold text-base mb-2">Horario de atención</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Nuestro equipo atiende de <strong className="text-slate-700">lunes a viernes de 9:00 a 18:00 (hora Perú, UTC-5)</strong>. Respondemos correos en un plazo máximo de 24 horas hábiles. Para urgencias técnicas fuera de horario, escríbenos igualmente y te responderemos a la brevedad.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ shortcut */}
        <div className="text-center">
          <p className="text-slate-500 text-sm mb-4">¿Eres profesional y quieres unirte a la plataforma?</p>
          <Link
            href="/profesionales/registro"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Regístrate como profesional
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-14 pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio
          </Link>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link href="/terminos" className="hover:text-indigo-600 transition-colors">Términos</Link>
            <span>·</span>
            <Link href="/privacidad" className="hover:text-indigo-600 transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
