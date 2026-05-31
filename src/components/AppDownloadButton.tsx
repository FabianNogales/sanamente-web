"use client";

import { useEffect, useRef, useState } from "react";
import { LINKS } from "@/lib/config";

const GooglePlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 shrink-0" viewBox="0 0 512 512" fill="none">
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#00D8FF" />
    <path d="M47 0C34 6.8 25.3 19.2 25.3 35V477c0 15.8 8.7 28.2 21.7 35l242-242L47 0z" fill="#00F076" />
    <path d="M408.5 241.4l-60.9-35.1-67.7 67.7 67.7 67.7 61.7-35.4c17.6-10.1 17.6-34.7-.8-44.9z" fill="#FFCA28" />
    <path d="M104.6 499l220.7-220.7 60.1 60.1L104.6 499z" fill="#F4433C" />
  </svg>
);

export function AppDownloadButton() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 50) {
        setVisible(true);
      } else {
        setVisible(y < lastY.current);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transitionClass = visible
    ? "opacity-100 translate-y-0"
    : "opacity-0 pointer-events-none translate-y-3";

  return (
    <>
      {/* Mobile: ícono redondo */}
      <a
        href={LINKS.appAndroid}
        target="_blank"
        rel="noopener noreferrer"
        title="Disponible en Google Play"
        className={`fixed z-40 md:hidden bottom-4 left-4 w-14 h-14 rounded-full bg-[#1a1a2e] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all duration-300 ${transitionClass}`}
      >
        <GooglePlayIcon />
      </a>

      {/* Desktop: badge completo */}
      <a
        href={LINKS.appAndroid}
        target="_blank"
        rel="noopener noreferrer"
        title="Disponible en Google Play"
        className={`fixed z-40 hidden md:flex items-center gap-3 right-6 bottom-6 bg-[#1a1a2e] hover:bg-[#2a2a4e] border border-white/10 rounded-xl px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.45)] transition-all duration-300 ${transitionClass}`}
      >
        <GooglePlayIcon />
        <div className="flex flex-col leading-tight">
          <span className="text-white/60 text-[10px] font-medium uppercase tracking-widest">
            Disponible en
          </span>
          <span className="text-white font-bold text-[15px] leading-tight">
            Google Play
          </span>
        </div>
      </a>
    </>
  );
}
