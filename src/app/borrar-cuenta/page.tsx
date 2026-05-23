import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eliminar cuenta — Sanamente",
  description: "Solicita la eliminación de tu cuenta y datos personales en la aplicación Sanamente.",
};

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 border-2 border-red-200 flex items-center justify-center">
        <span className="text-red-700 font-black text-sm">{number}</span>
      </div>
      <div className="pt-1.5 space-y-1">
        <p className="text-slate-900 font-bold text-sm">{title}</p>
        <div className="text-slate-500 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function DataRow({ label, action, period }: { label: string; action: "elimina" | "conserva"; period?: string }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-3 pr-4 text-slate-700 text-sm">{label}</td>
      <td className="py-3 pr-4">
        {action === "elimina" ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Se elimina
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-amber-700 text-xs font-semibold bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            Se conserva
          </span>
        )}
      </td>
      <td className="py-3 text-slate-400 text-xs">{period ?? "—"}</td>
    </tr>
  );
}

export default function BorrarCuentaPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Navbar */}
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

      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-28 pb-20 space-y-14">

        {/* Header */}
        <div>
          <span className="inline-flex items-center bg-red-50 text-red-700 border border-red-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            Gestión de cuenta
          </span>
          <h1 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Eliminar mi cuenta
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-xl">
            Esta página pertenece a la aplicación <strong className="text-slate-800">Sanamente</strong>, desarrollada y operada por <strong className="text-slate-800">Sanamente</strong>. Aquí puedes solicitar la eliminación permanente de tu cuenta y de los datos personales asociados a ella.
          </p>
        </div>

        {/* Warning banner */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="text-red-700 text-sm leading-relaxed">
            <strong>Esta acción es irreversible.</strong> Una vez procesada tu solicitud, no podrás recuperar tu historial de sesiones, créditos ni información de perfil. Asegúrate de haber descargado cualquier información que necesites antes de proceder.
          </p>
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-slate-900 text-2xl font-black mb-7">Pasos para solicitar la eliminación</h2>
          <div className="space-y-8">
            <Step number={1} title="Inicia sesión en la aplicación Sanamente">
              Abre la app <strong>Sanamente</strong> en tu dispositivo móvil e inicia sesión con tu cuenta.
            </Step>
            <Step number={2} title="Ve a Configuración de cuenta">
              Desde el menú principal, accede a <strong>Mi perfil</strong> y luego a <strong>Configuración</strong>.
            </Step>
            <Step number={3} title='Selecciona "Eliminar cuenta"'>
              Dentro de Configuración, desplázate hasta la sección <strong>Zona de peligro</strong> y pulsa <strong>Eliminar cuenta</strong>.
            </Step>
            <Step number={4} title="Confirma tu identidad">
              Se te pedirá que ingreses tu contraseña o confirmes tu identidad para continuar.
            </Step>
            <Step number={5} title="Confirma la eliminación">
              Lee el resumen de lo que se borrará y pulsa <strong>Confirmar eliminación</strong>. Recibirás un correo de confirmación.
            </Step>
          </div>

          {/* Alternative via email */}
          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <p className="text-slate-700 text-sm font-bold mb-2">¿No tienes acceso a la app?</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Puedes solicitar la eliminación de tu cuenta enviando un correo a{" "}
              <a href="mailto:soporte@sanamente.app" className="text-indigo-600 underline hover:text-indigo-800 font-semibold">
                soporte@sanamente.app
              </a>{" "}
              desde la dirección de correo asociada a tu cuenta. Incluye el asunto{" "}
              <strong className="text-slate-700">"Solicitud de eliminación de cuenta"</strong>. Procesaremos tu solicitud en un plazo máximo de <strong className="text-slate-700">30 días hábiles</strong>.
            </p>
          </div>
        </div>

        {/* Data table */}
        <div>
          <h2 className="text-slate-900 text-2xl font-black mb-2">Qué datos se eliminan y qué se conserva</h2>
          <p className="text-slate-500 text-sm mb-6">
            Al eliminar tu cuenta se procesan los siguientes datos de acuerdo con nuestras obligaciones legales y técnicas.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="py-3 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Tipo de dato</th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Acción</th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Periodo de retención</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 px-4">
                <DataRow label="Nombre, correo electrónico y teléfono" action="elimina" period="Inmediato al procesar la solicitud" />
                <DataRow label="Foto de perfil y datos de preferencias" action="elimina" period="Inmediato al procesar la solicitud" />
                <DataRow label="Historial de sesiones y mensajes" action="elimina" period="Máximo 30 días tras la solicitud" />
                <DataRow label="Créditos y saldo de billetera no utilizados" action="elimina" period="Máximo 30 días (sin reembolso automático)" />
                <DataRow label="Registros de transacciones y pagos" action="conserva" period="5 años (obligación fiscal y legal)" />
                <DataRow label="Registros de actividad técnica (logs)" action="conserva" period="12 meses (seguridad y auditoría)" />
                <DataRow label="Datos anonimizados de uso agregado" action="conserva" period="Indefinido (no identificables)" />
              </tbody>
            </table>
          </div>
          <p className="text-slate-400 text-xs mt-3">
            Los datos conservados por obligación legal no pueden ser eliminados anticipadamente. Los datos anonimizados no permiten identificar a ninguna persona.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <div>
            <p className="text-slate-800 font-bold text-sm mb-1">¿Tienes preguntas sobre tus datos?</p>
            <p className="text-slate-500 text-sm">
              Contacta a nuestro equipo de privacidad en{" "}
              <a href="mailto:soporte@sanamente.app" className="text-indigo-600 underline hover:text-indigo-800 font-semibold">
                soporte@sanamente.app
              </a>
            </p>
          </div>
          <a
            href="mailto:soporte@sanamente.app?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta"
            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            Enviar solicitud por correo
          </a>
        </div>

        {/* Footer links */}
        <div className="border-t border-slate-100 pt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio
          </Link>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link href="/privacidad" className="hover:text-indigo-600 transition-colors">Política de Privacidad</Link>
            <span>·</span>
            <Link href="/terminos" className="hover:text-indigo-600 transition-colors">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
