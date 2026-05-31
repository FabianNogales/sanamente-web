"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";
import { LINKS } from "@/lib/config";

// ── URLs de contenido — pon tus links aquí ───────────────────────────────────
const IMAGEN_HERO = "https://res.cloudinary.com/dcyx3nqj5/image/upload/v1779854486/ChatGPT_Image_26_may_2026_23_52_14_if4rqb.png";      // URL de imagen del hero (lado derecho)
const VIDEO_DESCARGA = "https://res.cloudinary.com/dnbklbswg/video/upload/v1780270322/WhatsApp_Video_2026-05-30_at_16.46.54_jgvf0a.mp4";   // URL video de cómo instalar la app
const VIDEO_SESION = "https://res.cloudinary.com/dnbklbswg/video/upload/v1780270324/WhatsApp_Video_2026-05-30_at_16.46.36_aacsj5.mp4";     // URL video de cómo agendar sesión

// ── Pasos instalación ─────────────────────────────────────────────────────────
const PASOS_DESCARGA = [
  {
    step: "01",
    title: "Busca en Google Play",
    desc: "Abre Google Play en tu celular Android, busca 'Sanamente' y toca el botón Instalar.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Instala la app",
    desc: "Google Play descarga e instala Sanamente automáticamente. No necesitas hacer nada más.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Abre y regístrate",
    desc: "Toca Abrir, crea tu cuenta en segundos y agenda tu primera sesión con un psicólogo verificado.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
      </svg>
    ),
  },
];

// ── Pasos agendar sesión ──────────────────────────────────────────────────────
const PASOS_SESION = [
  {
    step: "01",
    title: "Crea tu cuenta",
    desc: "Regístrate con tu correo electrónico en segundos. Completa tu perfil y cuéntanos qué tipo de apoyo estás buscando.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Elige tu psicólogo",
    desc: "Explora perfiles de psicólogos verificados. Filtra por especialidad, idioma y disponibilidad horaria.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Recarga tu wallet y agenda",
    desc: "Recarga saldo a tu wallet con QR Baneco o tarjeta (Stripe). Usa ese saldo para pagar sesiones y recibirás confirmación al instante.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
];

// ── Componente AutoplayVideo ──────────────────────────────────────────────────
function AutoplayVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? el.play().catch(() => {}) : el.pause(); },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <video ref={ref} src={src} className={className} muted loop playsInline preload="metadata" />;
}

// ── Step card con animación ───────────────────────────────────────────────────
function StepCard({ item, index, total }: { item: typeof PASOS_DESCARGA[0]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ opacity: 0, transform: "translateY(32px)", transition: `opacity 0.6s ease ${index * 150}ms, transform 0.6s ease ${index * 150}ms` }}
      className="flex items-start gap-5 group"
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 group-hover:scale-105 transition-all duration-300 text-white">
          {item.icon}
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border-2 border-indigo-200 text-indigo-600 text-[9px] font-black flex items-center justify-center">
            {item.step}
          </span>
        </div>
        {index < total - 1 && (
          <div className="w-px flex-1 mt-3 bg-linear-to-b from-indigo-300 to-indigo-100 min-h-10" />
        )}
      </div>
      <div className="pb-8 pt-1 flex-1">
        <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-1">Paso {item.step}</p>
        <h3 className="text-slate-900 text-2xl font-black mb-2 group-hover:text-indigo-700 transition-colors duration-200">{item.title}</h3>
        <p className="text-slate-500 text-base leading-relaxed max-w-md">{item.desc}</p>
      </div>
    </div>
  );
}

// ── Sección de pasos ──────────────────────────────────────────────────────────
function StepsSection({ title, subtitle, steps }: {
  title: string;
  subtitle: string;
  steps: typeof PASOS_DESCARGA;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-16 px-5 sm:px-8 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100/30 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <div
          ref={headerRef}
          style={{ opacity: 0, transform: "translateY(24px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-indigo-700 text-xs font-bold uppercase tracking-widest">{subtitle}</span>
          </div>
          <h2 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tight">{title}</h2>
        </div>

        <div className="flex flex-col">
          {steps.map((item, i) => (
            <StepCard key={item.step} item={item} index={i} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Sección de video ──────────────────────────────────────────────────────────
function VideoSection({ src, title }: { src?: string; title: string }) {
  return (
    <section className="py-10 px-5 sm:px-8 bg-slate-50">
      <div className="max-w-xs mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-5 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-indigo-700 text-xs font-bold uppercase tracking-widest">{title}</span>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-indigo-100">
          {src ? (
            <AutoplayVideo src={src} className="w-full rounded-2xl" />
          ) : (
            <div className="aspect-9/16 bg-linear-to-b from-indigo-50 to-slate-50 flex flex-col items-center justify-center gap-3 text-indigo-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.328l5.603 3.113Z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-indigo-400">Video próximamente</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function SoyNuevoPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col lg:flex-row items-center gap-10 px-5 sm:px-8 lg:px-20 xl:px-32 pt-28 pb-16 overflow-hidden bg-linear-to-b from-indigo-50 via-white to-white">
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-100 h-100 bg-indigo-200/60 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-200/40 rounded-full blur-[80px]" />
        </div>

        {/* Texto */}
        <div className="relative flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <div className="mb-5 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-indigo-700 text-xs font-bold uppercase tracking-widest">Para nuevos usuarios</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
            <span className="text-slate-900">Cuida tu</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-indigo-500 to-teal-500">
              salud mental
            </span>
            <br />
            <span className="text-slate-900">desde tu celular</span>
          </h1>

          <p className="text-slate-500 text-lg max-w-lg mb-8 leading-relaxed">
            Descarga Sanamente, crea tu cuenta y agenda tu primera sesión con un psicólogo verificado en minutos.
          </p>

          <a
            href={LINKS.appAndroid}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-slate-300 flex items-center gap-3 active:scale-95 w-fit"
          >
            <svg viewBox="0 0 512 512" className="w-6 h-6 shrink-0" fill="none">
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
        </div>

        {/* Imagen */}
        <div className="relative flex-1 flex justify-center lg:justify-end z-10">
          {IMAGEN_HERO ? (
            <img src={IMAGEN_HERO} alt="Sanamente app" className="w-full max-w-sm lg:max-w-md rounded-3xl object-cover shadow-2xl shadow-indigo-100" />
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

      {/* Bloque 1: Cómo descargar */}
      <StepsSection title="Cómo descargar la app" subtitle="Instalación rápida" steps={PASOS_DESCARGA} />
      <VideoSection src={VIDEO_DESCARGA || undefined} title="Mira cómo instalar la app" />

      {/* Bloque 2: Cómo agendar sesión */}
      <StepsSection title="Cómo agendar tu primera sesión" subtitle="Sin complicaciones" steps={PASOS_SESION} />
      <VideoSection src={VIDEO_SESION || undefined} title="Mira cómo agendar tu sesión" />

      <Footer />
    </div>
  );
}
