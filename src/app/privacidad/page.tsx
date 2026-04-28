import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Sanamente",
  description: "Política de privacidad y protección de datos de la plataforma Sanamente.",
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

export default function PrivacidadPage() {
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
          <h1 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Política de Privacidad
          </h1>
          <p className="text-slate-400 text-sm">Última actualización: abril 2025</p>
        </div>

        <div className="space-y-10">

          <Section number="1" title="Responsable del tratamiento">
            <p>
              <strong className="text-slate-800">Sanamente</strong> es responsable del tratamiento de los datos personales recabados a través de su plataforma web y aplicación móvil. Para consultas, contacta a <a href="mailto:hola@sanamente.app" className="text-indigo-600 underline hover:text-indigo-800">hola@sanamente.app</a>.
            </p>
          </Section>

          <Section number="2" title="Datos que recopilamos">
            <p>Recopilamos los siguientes tipos de información:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-slate-700">Datos de registro:</strong> nombre, correo electrónico, número de teléfono.</li>
              <li><strong className="text-slate-700">Datos de perfil:</strong> información opcional como edad, motivo de consulta y preferencias de sesión.</li>
              <li><strong className="text-slate-700">Datos de uso:</strong> historial de sesiones, interacciones con la plataforma.</li>
              <li><strong className="text-slate-700">Datos de pago:</strong> procesados de forma segura por pasarelas de pago certificadas. No almacenamos datos de tarjeta completos.</li>
              <li><strong className="text-slate-700">Datos técnicos:</strong> dirección IP, tipo de dispositivo, sistema operativo y cookies técnicas.</li>
            </ul>
          </Section>

          <Section number="3" title="Finalidad del tratamiento">
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Gestionar tu cuenta y acceso a la plataforma</li>
              <li>Facilitar la conexión con psicólogos y el agendamiento de sesiones</li>
              <li>Procesar pagos y gestionar créditos</li>
              <li>Enviarte notificaciones relacionadas con tu cuenta o sesiones</li>
              <li>Mejorar la calidad del servicio y la experiencia de usuario</li>
              <li>Cumplir obligaciones legales aplicables</li>
            </ul>
          </Section>

          <Section number="4" title="Confidencialidad de las sesiones">
            <p>
              El contenido de las sesiones entre usuarios y profesionales es <strong className="text-slate-800">estrictamente confidencial</strong>. Sanamente no accede al contenido de las conversaciones terapéuticas. La relación profesional-paciente está protegida por el secreto profesional aplicable en la jurisdicción correspondiente.
            </p>
          </Section>

          <Section number="5" title="Base legal del tratamiento">
            <p>El tratamiento de datos se realiza sobre las siguientes bases legales:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Ejecución de un contrato (prestación del servicio)</li>
              <li>Consentimiento del usuario (datos opcionales y comunicaciones)</li>
              <li>Interés legítimo (seguridad y prevención de fraude)</li>
              <li>Cumplimiento de obligaciones legales</li>
            </ul>
          </Section>

          <Section number="6" title="Compartición de datos">
            <p>
              Sanamente no vende ni cede datos personales a terceros con fines comerciales. Solo compartimos datos con:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Profesionales de salud mental con quienes el usuario agenda sesiones</li>
              <li>Proveedores de servicios técnicos (infraestructura, pago, comunicaciones) bajo acuerdos de confidencialidad</li>
              <li>Autoridades competentes cuando la ley lo exija</li>
            </ul>
          </Section>

          <Section number="7" title="Tus derechos">
            <p>Tienes derecho a:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar datos inexactos</li>
              <li>Solicitar la eliminación de tu cuenta y datos</li>
              <li>Oponerte al tratamiento en casos específicos</li>
              <li>Solicitar la portabilidad de tus datos</li>
            </ul>
            <p>Para ejercer estos derechos, escríbenos a <a href="mailto:soporte@sanamente.app" className="text-indigo-600 underline hover:text-indigo-800">soporte@sanamente.app</a>.</p>
          </Section>

          <Section number="8" title="Retención de datos">
            <p>
              Conservamos los datos de cuenta mientras la cuenta esté activa. Al solicitar la eliminación de la cuenta, los datos se eliminarán en un plazo máximo de 30 días, salvo obligación legal de conservación.
            </p>
          </Section>

          <Section number="9" title="Cookies">
            <p>
              Usamos cookies técnicas necesarias para el funcionamiento de la plataforma y cookies analíticas para mejorar el servicio. Puedes gestionar tus preferencias de cookies en cualquier momento. Consulta nuestra <Link href="/cookies" className="text-indigo-600 underline hover:text-indigo-800">Política de Cookies</Link>.
            </p>
          </Section>

          <Section number="10" title="Seguridad">
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos, incluyendo cifrado en tránsito (HTTPS/TLS), control de acceso y almacenamiento seguro.
            </p>
          </Section>

          <Section number="11" title="Cambios en esta política">
            <p>
              Podemos actualizar esta política en cualquier momento. Te notificaremos por correo electrónico ante cambios sustanciales con al menos 15 días de anticipación.
            </p>
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
            <Link href="/terminos" className="hover:text-indigo-600 transition-colors">Términos y Condiciones</Link>
            <span>·</span>
            <Link href="/contacto" className="hover:text-indigo-600 transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
