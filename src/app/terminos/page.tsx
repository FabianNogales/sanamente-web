import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Sanamente",
  description: "Términos y condiciones de uso de la plataforma Sanamente.",
};

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-slate-900 text-xl font-black">
        {number}. {title}
      </h2>
      <div className="text-slate-600 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Minimal nav */}
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

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-28 pb-20">

        <div className="mb-10">
          <span className="inline-flex items-center bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">Legal</span>
          <h1 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Términos y Condiciones
          </h1>
          <p className="text-slate-400 text-sm">Última actualización: abril 2025</p>
        </div>

        <div className="space-y-10">

          <Section number="1" title="Descripción del servicio">
            <p>
              <strong className="text-slate-800">Sanamente</strong> es una plataforma digital que conecta a usuarios con psicólogos y profesionales de salud mental verificados, facilitando sesiones por videollamada, llamada de voz y chat.
            </p>
            <p>
              Sanamente actúa como intermediario tecnológico. La relación terapéutica se establece directamente entre el usuario y el profesional de salud mental.
            </p>
          </Section>

          <Section number="2" title="Edad mínima">
            <p>
              El uso de la plataforma está permitido únicamente para personas <strong className="text-slate-800">mayores de 18 años</strong>. Al registrarse, el usuario declara cumplir con este requisito. Menores de edad podrán usar el servicio solo con el consentimiento expreso de un tutor legal.
            </p>
          </Section>

          <Section number="3" title="Registro y cuenta">
            <p>Para utilizar los servicios de Sanamente, el usuario debe crear una cuenta proporcionando información verídica y actualizada. El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.</p>
            <p>Sanamente se reserva el derecho de suspender o cancelar cuentas que incumplan estos términos o que muestren conductas fraudulentas.</p>
          </Section>

          <Section number="4" title="Sistema de créditos">
            <p>
              Las sesiones se abonan mediante un sistema de créditos. Los créditos se adquieren a través de la plataforma y se descuentan al inicio de cada sesión según la tarifa establecida por el profesional.
            </p>
            <p>Los créditos no tienen fecha de caducidad y no son reembolsables, excepto en los casos expresamente previstos en la Política de Reembolsos. Los créditos no son transferibles a terceros.</p>
          </Section>

          <Section number="5" title="Responsabilidad de los profesionales">
            <p>
              Los psicólogos y profesionales que operan en Sanamente son independientes. Sanamente verifica sus credenciales académicas y habilitación profesional, pero no es responsable por el contenido ni los resultados de las sesiones terapéuticas.
            </p>
            <p>Cada profesional es responsable del ejercicio ético de su práctica conforme a las normas colegiales y legales de su jurisdicción.</p>
          </Section>

          <Section number="6" title="Conducta del usuario">
            <p>El usuario se compromete a:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Proporcionar información veraz en su perfil</li>
              <li>Tratar a los profesionales con respeto</li>
              <li>No grabar sesiones sin consentimiento expreso</li>
              <li>No compartir datos de terceros sin autorización</li>
              <li>No usar la plataforma para fines ilegales</li>
            </ul>
          </Section>

          <Section number="7" title="Privacidad y confidencialidad">
            <p>
              Sanamente protege la información de salud de sus usuarios conforme a lo establecido en la <Link href="/privacidad" className="text-indigo-600 underline hover:text-indigo-800">Política de Privacidad</Link>. El contenido de las sesiones es estrictamente confidencial entre el usuario y el profesional.
            </p>
          </Section>

          <Section number="8" title="Limitación de responsabilidad">
            <p>
              Sanamente no garantiza resultados terapéuticos específicos. La plataforma se ofrece "tal cual" y no asume responsabilidad por interrupciones del servicio, fallos técnicos o decisiones tomadas por los usuarios o profesionales durante las sesiones.
            </p>
          </Section>

          <Section number="9" title="Modificaciones de los términos">
            <p>
              Sanamente puede actualizar estos términos en cualquier momento. Los cambios sustanciales serán notificados con al menos 15 días de anticipación por correo electrónico. El uso continuado de la plataforma tras la notificación implica la aceptación de los nuevos términos.
            </p>
          </Section>

          <Section number="10" title="Contacto">
            <p>
              Para consultas sobre estos términos, escríbenos a <a href="mailto:hola@sanamente.app" className="text-indigo-600 underline hover:text-indigo-800">hola@sanamente.app</a>.
            </p>
          </Section>
        </div>

        {/* Back link */}
        <div className="mt-14 pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio
          </Link>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link href="/privacidad" className="hover:text-indigo-600 transition-colors">Política de Privacidad</Link>
            <span>·</span>
            <Link href="/contacto" className="hover:text-indigo-600 transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
