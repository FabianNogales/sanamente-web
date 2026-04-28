import Link from "next/link";
import { LINKS } from "@/lib/config";

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <span className="text-indigo-600 font-black text-xl">{value}</span>
      <span className="text-slate-500 text-xs font-medium mt-0.5">{label}</span>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-24 pb-16 text-center overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-white">

      {/* Subtle bg blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-100/60 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-teal-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-[80px]" />
      </div>

      {/* Badge */}
      <div className="relative mb-7 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        <span className="text-indigo-700 text-xs font-bold uppercase tracking-widest">Plataforma de salud mental</span>
      </div>

      {/* Heading */}
      <h1 className="relative text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-5 max-w-4xl">
        <span className="text-slate-900">Tu bienestar mental,</span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500">
          en buenas manos
        </span>
      </h1>

      <p className="relative text-slate-500 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
        Conecta con psicólogos verificados. Agenda sesiones, recibe atención profesional y cuida tu salud mental desde cualquier dispositivo.
      </p>

      {/* CTA Buttons */}
      <div className="relative flex flex-col sm:flex-row items-center gap-3 mb-14">
        <Link
          href={LINKS.register}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-base
            px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          Encontrar un psicólogo
        </Link>
        <Link
          href={LINKS.professional}
          className="w-full sm:w-auto border border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold text-base
            px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          Soy profesional
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>

      {/* Stats */}
      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <StatBadge value="+300" label="Psicólogos verificados" />
        <StatBadge value="+5,000" label="Sesiones realizadas" />
        <StatBadge value="4.9★" label="Valoración promedio" />
      </div>

      {/* Trust line */}
      <p className="relative mt-6 text-slate-400 text-xs font-medium">
        Plataforma segura · Profesionales verificados · Sin compromisos
      </p>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
        <p className="text-slate-300 text-xs uppercase tracking-widest">Conoce más</p>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
}
