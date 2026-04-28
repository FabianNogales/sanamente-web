import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { SectionLabel } from "@/components/SectionLabel";
import { LINKS } from "@/lib/config";

const PROF_FEATURES = [
  {
    title: "Registro rápido",
    desc: "Completa tu perfil profesional en minutos. Sube tus credenciales y empieza a recibir consultas.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
      </svg>
    ),
  },
  {
    title: "Tú fijas tus tarifas",
    desc: "Define el precio por minuto o por sesión. Tienes control total sobre tu oferta de servicios.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Agenda flexible",
    desc: "Establece tu horario disponible. Los pacientes reservan en los horarios que tú habilitas.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: "Videollamada, llamada y chat",
    desc: "Atiende a tus pacientes por el canal que prefieran. Integrado directamente en la plataforma.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    title: "Cobros automáticos",
    desc: "Los créditos del paciente se descuentan al inicio de la sesión. Tu pago se procesa de forma automática y segura.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Mayor visibilidad",
    desc: "Tu perfil aparece en búsquedas de pacientes activos. Gana reseñas y construye tu reputación profesional online.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

export function Profesionales() {
  return (
    <section id="profesionales" className="py-24 px-5 sm:px-8 bg-[#0F1629]">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <SectionLabel accent="teal">Para profesionales</SectionLabel>
          <h2 className="text-white text-4xl sm:text-5xl font-black tracking-tight mt-4 mb-4">
            Haz crecer tu práctica{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
              profesional
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Únete a la red de psicólogos de Sanamente. Atiende pacientes de forma remota, gestiona tu agenda y monetiza tu experiencia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {PROF_FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-teal-500/30 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center mb-4 group-hover:bg-teal-500/25 transition-colors text-teal-400">
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-1.5">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA for professionals */}
        <div className="text-center">
          <Link
            href={LINKS.professional}
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-black text-base
              px-8 py-4 rounded-2xl transition-all shadow-lg shadow-teal-500/20 active:scale-95"
          >
            Registrarme como profesional
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <p className="text-slate-500 text-xs mt-4">
            Sin costo de suscripción · Solo pagas cuando atiendes
          </p>
        </div>
      </div>
    </section>
  );
}
