import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies — Sanamente",
  description: "Política de uso de cookies de la plataforma Sanamente.",
};

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-slate-900 text-xl font-black">{number}. {title}</h2>
      <div className="text-slate-600 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function CookiesPage() {
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
          <span className="inline-flex items-center bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">Legal</span>
          <h1 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mb-3">Política de Cookies</h1>
          <p className="text-slate-400 text-sm">Última actualización: abril 2025</p>
        </div>

        <div className="space-y-10">
          <Section number="1" title="¿Qué son las cookies?">
            <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Permiten que el sitio recuerde información sobre tu visita para mejorar tu experiencia.</p>
          </Section>

          <Section number="2" title="Cookies que utilizamos">
            <p>Sanamente utiliza los siguientes tipos de cookies:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-slate-700">Cookies esenciales:</strong> Necesarias para el funcionamiento básico de la plataforma (autenticación, seguridad de sesión). No pueden desactivarse sin afectar el servicio.</li>
              <li><strong className="text-slate-700">Cookies de preferencias:</strong> Recuerdan tus configuraciones y preferencias de uso (idioma, tema).</li>
              <li><strong className="text-slate-700">Cookies analíticas:</strong> Nos ayudan a entender cómo se usa la plataforma para mejorarla. La información es anónima y agregada.</li>
            </ul>
          </Section>

          <Section number="3" title="Cookies de terceros">
            <p>Podemos usar servicios de terceros que establecen sus propias cookies, como herramientas de análisis o pasarelas de pago. Estos servicios tienen sus propias políticas de privacidad.</p>
          </Section>

          <Section number="4" title="Cómo gestionar las cookies">
            <p>Puedes controlar y eliminar cookies desde la configuración de tu navegador. Ten en cuenta que deshabilitar cookies esenciales puede afectar el funcionamiento de la plataforma.</p>
            <p>La mayoría de los navegadores permiten:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Ver las cookies almacenadas y eliminarlas individualmente</li>
              <li>Bloquear cookies de terceros</li>
              <li>Bloquear cookies de sitios específicos</li>
              <li>Bloquear todas las cookies</li>
            </ul>
          </Section>

          <Section number="5" title="Contacto">
            <p>Para preguntas sobre nuestra política de cookies, escríbenos a <a href="mailto:hola@sanamente.app" className="text-indigo-600 underline hover:text-indigo-800">hola@sanamente.app</a>.</p>
          </Section>
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
