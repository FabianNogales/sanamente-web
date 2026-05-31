import Link from "next/link";
import { LINKS } from "@/lib/config";
import { IMAGEN_HERO } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center gap-10 px-5 sm:px-8 lg:px-20 xl:px-32 pt-28 pb-20 overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">

      {/* Dot pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-200/70 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/50 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-indigo-100/60 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-teal-100/40 rounded-full blur-[80px]" />
      </div>

      {/* Left — texto */}
      <div className="relative flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">

        {/* Badge */}
        <div className="mb-3 inline-flex items-center gap-2.5 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-2">
          <div className="flex -space-x-1.5">
            {["A", "M", "C", "R"].map((l) => (
              <div key={l} className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 border-2 border-white flex items-center justify-center">
                <span className="text-white text-[8px] font-black">{l}</span>
              </div>
            ))}
          </div>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          <span className="text-indigo-700 text-xs font-semibold uppercase tracking-wider">Psicólogos disponibles ahora</span>
        </div>

        {/* Stats pills */}
        <div className="mb-6 flex flex-wrap justify-center lg:justify-start gap-3">
          {[
            { value: "+300", label: "psicólogos verificados" },
            { value: "+5,000", label: "sesiones realizadas" },
          ].map((s) => (
            <div key={s.label} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
              <span className="text-indigo-600 text-xs font-black">{s.value}</span>
              <span className="text-slate-500 text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-5">
          <span className="text-slate-900">Tu bienestar mental,</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500">
            en buenas manos
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-500 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
          Conecta con psicólogos verificados. Agenda sesiones, recibe atención profesional y cuida tu salud mental desde cualquier dispositivo.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mb-6">
          <a
            href={LINKS.appAndroid}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-black px-5 py-4 rounded-2xl transition-all shadow-lg shadow-slate-300 flex items-center justify-center gap-3 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0" viewBox="0 0 512 512" fill="none">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#00D8FF" />
              <path d="M47 0C34 6.8 25.3 19.2 25.3 35V477c0 15.8 8.7 28.2 21.7 35l242-242L47 0z" fill="#00F076" />
              <path d="M408.5 241.4l-60.9-35.1-67.7 67.7 67.7 67.7 61.7-35.4c17.6-10.1 17.6-34.7-.8-44.9z" fill="#FFCA28" />
              <path d="M104.6 499l220.7-220.7 60.1 60.1L104.6 499z" fill="#F4433C" />
            </svg>
            <span className="flex flex-col leading-tight text-left">
              <span className="text-white/60 text-[10px] uppercase tracking-widest leading-none">Disponible en</span>
              <span className="text-base leading-tight">Google Play</span>
            </span>
          </a>
          <Link
            href={LINKS.professional}
            className="border border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold text-sm px-5 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Soy profesional
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2">
          {["Seguro y privado", "Profesionales verificados", "100% confidencial", "Sin compromisos"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right — imagen */}
      <div className="relative flex-1 flex justify-center lg:justify-end z-10">
        {IMAGEN_HERO ? (
          <img
            src={IMAGEN_HERO}
            alt="Sanamente — psicología online"
            className="w-full max-w-sm lg:max-w-md rounded-3xl object-cover shadow-2xl shadow-indigo-100"
          />
        ) : (
          <div className="w-full max-w-sm lg:max-w-md aspect-square bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-indigo-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="text-sm font-medium">Imagen próximamente</p>
          </div>
        )}
      </div>
    </section>
  );
}
