"use client";

import { useEffect, useRef } from "react";
import { SectionLabel } from "@/components/SectionLabel";

const STEPS = [
  {
    step: "01",
    title: "Crea tu cuenta",
    desc: "Regístrate en minutos con tu correo electrónico. Completa tu perfil y cuéntanos qué tipo de apoyo estás buscando.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Encuentra tu profesional",
    desc: "Explora perfiles de psicólogos verificados. Filtra por especialidad, idioma, precio y disponibilidad horaria.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Agenda tu sesión",
    desc: "Elige fecha y horario. Añade créditos a tu cuenta y confirma tu cita en segundos.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Recibe atención profesional",
    desc: "Conéctate por videollamada, llamada o chat. Tu sesión comienza puntual y en un entorno seguro y privado.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
];

function StepCard({ item, index }: { item: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 150}ms, transform 0.6s ease ${index * 150}ms`,
      }}
      className="flex items-start gap-5 group"
    >
      {/* Left: número + ícono + línea */}
      <div className="flex flex-col items-center shrink-0">
        {/* Círculo con gradiente */}
        <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 group-hover:scale-105 transition-all duration-300 text-white">
          {item.icon}
          {/* Número badge */}
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border-2 border-indigo-200 text-indigo-600 text-[9px] font-black flex items-center justify-center">
            {item.step}
          </span>
        </div>
        {/* Línea conectora */}
        {index < STEPS.length - 1 && (
          <div className="w-px flex-1 mt-3 bg-linear-to-b from-indigo-300 to-indigo-100 min-h-[40px]" />
        )}
      </div>

      {/* Right: texto */}
      <div className="pb-8 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Paso {item.step}</span>
        </div>
        <h3 className="text-slate-900 text-xl font-black mb-2 group-hover:text-indigo-700 transition-colors duration-200">
          {item.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg">{item.desc}</p>
      </div>
    </div>
  );
}

export function ComoFunciona() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="como-funciona" className="relative py-14 px-5 sm:px-8 bg-white overflow-hidden">
      {/* Dot pattern + glows */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100/30 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">

        {/* Header animado */}
        <div
          ref={headerRef}
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
          className="text-center mb-12"
        >
          <SectionLabel>Proceso simple</SectionLabel>
          <h2 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mt-4 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Acceder a atención psicológica profesional nunca fue tan fácil.
            Cuatro pasos y empiezas tu proceso.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col">
          {STEPS.map((item, index) => (
            <StepCard key={item.step} item={item} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
