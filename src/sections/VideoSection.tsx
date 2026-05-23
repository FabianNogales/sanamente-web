"use client";

import { useEffect, useRef } from "react";
import { VIDEO_INICIO } from "@/lib/content";

function AutoplayVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

export function VideoSection() {
  return (
    <section className="relative py-14 px-5 sm:px-8 bg-gradient-to-b from-white via-indigo-50/40 to-white overflow-hidden">

      {/* Dot pattern + glows */}
      <div className="absolute inset-0 bg-dot-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/60 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-teal-200/40 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-indigo-100/40 rounded-full blur-[60px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-indigo-700 text-xs font-bold uppercase tracking-widest">Para nuevos usuarios</span>
          </div>
          <h2 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Así funciona{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">
              Sanamente
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            En minutos puedes agendar tu primera sesión con un psicólogo verificado.
          </p>
        </div>

        {/* Video container */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-xs">
            {/* Glow detrás del video */}
            <div className="absolute -inset-4 bg-indigo-200/40 rounded-3xl blur-2xl" />

            <div className="relative rounded-3xl overflow-hidden border border-indigo-100 shadow-2xl shadow-indigo-200/60">
              {VIDEO_INICIO ? (
                <AutoplayVideo src={VIDEO_INICIO} className="w-full" />
              ) : (
                <div className="aspect-9/16 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-indigo-50 to-slate-50 text-indigo-300">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.328l5.603 3.113Z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-indigo-400">Video próximamente</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
