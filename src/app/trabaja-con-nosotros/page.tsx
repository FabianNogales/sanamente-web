"use client";

import { useEffect, useRef } from "react";
import { Navbar } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

// ── URLs de contenido — pon tus links aquí ───────────────────────────────────
const IMAGEN_HERO = "https://res.cloudinary.com/dcyx3nqj5/image/upload/v1779854485/ChatGPT_Image_26_may_2026_23_58_34_rxpk1x.png";      // URL de imagen del hero (lado derecho)
const VIDEO_REGISTRO = "https://res.cloudinary.com/dcyx3nqj5/video/upload/v1781716170/Como_registrarse_como_profesional_lc8wwj.mp4";   // URL video de cómo registrarse como psicólogo
const VIDEO_RETIRO = "https://res.cloudinary.com/dcyx3nqj5/video/upload/v1781839390/0618_ivdpap.mp4";
const VIDEO_TARIFAS = "https://res.cloudinary.com/dcyx3nqj5/video/upload/v1781716129/Como_crear_agendas_y_horarios_como_profesional_ird546.mp4";

const WHATSAPP_LINK =
  "https://wa.me/59177848691?text=Hola,%20me%20interesa%20registrarme%20como%20psic%C3%B3logo%20en%20Sanamente";

// ── Pasos registro profesional ────────────────────────────────────────────────
const PASOS_REGISTRO = [
  {
    step: "01",
    title: "Descarga la app",
    desc: "Busca 'Sanamente' en Google Play e instálala en tu Android. Solo toma unos segundos.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Regístrate como profesional",
    desc: "Abre la app, selecciona 'Soy psicólogo' y completa tus datos personales y profesionales.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Verifica tu perfil",
    desc: "Sube tu título y cédula profesional. Nuestro equipo revisará y validará tu cuenta en poco tiempo.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
];

// ── Pasos cobrar sesiones ─────────────────────────────────────────────────────
const PASOS_RETIRO = [
  {
    step: "01",
    title: "Registra tu cuenta bancaria",
    desc: "En la app ve a Ganancias y retiros → Cuentas. Agrega tu cuenta bancaria boliviana (BOB) o una dirección crypto USDT BEP20 para recibir tus pagos.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Solicita tu retiro",
    desc: "En la sección Ganancias, elige el monto a retirar (BOB o USD), selecciona tu cuenta bancaria o dirección crypto y confirma la solicitud.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Recibe tu dinero",
    desc: "Los retiros en BOB se procesan en hasta 48 horas hábiles por transferencia bancaria. Los retiros en USDT (BEP20) se acreditan en hasta 72 horas hábiles.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    ),
  },
];

// ── Pasos configurar tarifas ──────────────────────────────────────────────────
const PASOS_TARIFAS = [
  {
    step: "01",
    title: "Ve a Mis Sesiones",
    desc: "Accede a tu perfil en la app y toca 'Mis ofertas de sesión' para gestionar tus servicios.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Define precio y duración",
    desc: "Establece el precio y la duración de cada tipo de sesión. Tienes total libertad para fijar tus tarifas.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Empieza a recibir pacientes",
    desc: "Una vez activo tu perfil, los pacientes podrán encontrarte y agendar sesiones contigo directamente.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
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
function StepCard({ item, index, total }: { item: typeof PASOS_REGISTRO[0]; index: number; total: number }) {
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
  steps: typeof PASOS_REGISTRO;
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
export default function TrabajaConNosotrosPage() {
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
            <span className="text-indigo-700 text-xs font-bold uppercase tracking-widest">Para psicólogos</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
            <span className="text-slate-900">Ayuda a más</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-indigo-500 to-teal-500">
              pacientes
            </span>
            <br />
            <span className="text-slate-900">desde donde estés</span>
          </h1>

          <p className="text-slate-500 text-lg max-w-lg mb-8 leading-relaxed">
            Únete a Sanamente, gestiona tu agenda, fija tus tarifas y cobra tus sesiones de forma segura. Todo desde la app.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95"
            >
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              <span className="flex flex-col leading-tight text-left">
                <span className="text-white/70 text-[10px] uppercase tracking-widest leading-none">Contáctanos</span>
                <span className="text-base leading-tight">Postular por WhatsApp</span>
              </span>
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 mt-6">
            {["Perfil verificado", "Cobra sin comisiones ocultas", "100% confidencial", "Tú fijas tus horarios"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Imagen */}
        <div className="relative flex-1 flex justify-center lg:justify-end z-10">
          {IMAGEN_HERO ? (
            <img src={IMAGEN_HERO} alt="Sanamente — para psicólogos" className="w-full max-w-sm lg:max-w-md rounded-3xl object-cover shadow-2xl shadow-indigo-100" />
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

      {/* Bloque 1: Cómo registrarte */}
      <StepsSection title="Cómo registrarte como psicólogo" subtitle="Registro rápido" steps={PASOS_REGISTRO} />
      <VideoSection src={VIDEO_REGISTRO || undefined} title="Mira cómo registrarte" />

      {/* Bloque 2: Cómo retirar */}
      <StepsSection title="Cómo retirar tu dinero" subtitle="Cobros seguros" steps={PASOS_RETIRO} />
      <VideoSection src={VIDEO_RETIRO || undefined} title="Mira cómo retirar tu dinero" />

      {/* Bloque 3: Cómo configurar tarifas */}
      <StepsSection title="Cómo configurar tus tarifas" subtitle="Tú decides el precio" steps={PASOS_TARIFAS} />
      <VideoSection src={VIDEO_TARIFAS || undefined} title="Mira cómo configurar tus tarifas" />

      <Footer />
    </div>
  );
}