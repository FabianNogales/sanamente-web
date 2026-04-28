import { SectionLabel } from "@/components/SectionLabel";

const STEPS = [
  {
    step: "01",
    title: "Crea tu cuenta",
    desc: "Regístrate en minutos con tu correo electrónico. Completa tu perfil y cuéntanos qué tipo de apoyo estás buscando.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Encuentra tu profesional",
    desc: "Explora perfiles de psicólogos verificados. Filtra por especialidad, idioma, precio y disponibilidad horaria.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Agenda tu sesión",
    desc: "Elige fecha y horario. Añade créditos a tu cuenta y confirma tu cita en segundos.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Recibe atención profesional",
    desc: "Conéctate por videollamada, llamada o chat. Tu sesión comienza puntual y en un entorno seguro y privado.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="py-24 px-5 sm:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-16">
          <SectionLabel>Proceso simple</SectionLabel>
          <h2 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mt-4 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Acceder a atención psicológica profesional nunca fue tan fácil.
            Cuatro pasos y empiezas tu proceso.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connector (desktop) */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-300 via-indigo-200 to-transparent hidden sm:block" />

          <div className="flex flex-col gap-10">
            {STEPS.map((item) => (
              <div key={item.step} className="flex items-start gap-6 group">
                <div className="relative shrink-0 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    {item.icon}
                  </div>
                </div>
                <div className="pt-2 bg-white rounded-2xl border border-slate-100 px-6 py-5 flex-1 shadow-sm group-hover:border-indigo-200 transition-colors">
                  <p className="text-indigo-500 text-xs font-black uppercase tracking-widest mb-1">Paso {item.step}</p>
                  <h3 className="text-slate-900 text-xl font-black mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
