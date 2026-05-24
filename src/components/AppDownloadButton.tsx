"use client";

import { useEffect, useRef, useState } from "react";
import { LINKS } from "@/lib/config";

const AndroidIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="white">
    <path d="M17.523 15.341a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-11.046 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM2.1 8.4h19.8A1.1 1.1 0 0 1 23 9.5v6a1.1 1.1 0 0 1-1.1 1.1H21v2.65a.75.75 0 0 1-1.5 0V16.6H4.5v2.65a.75.75 0 0 1-1.5 0V16.6h-.9A1.1 1.1 0 0 1 1 15.5v-6A1.1 1.1 0 0 1 2.1 8.4Zm.9 1.5v5h18v-5H3ZM8.22 2.47a.75.75 0 0 1 1.02-.28L12 3.8l2.76-1.61a.75.75 0 1 1 .75 1.3L13.5 4.8V7.4h-3V4.8L8.5 3.49a.75.75 0 0 1-.28-1.02Z" />
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

  const baseClasses = [
    "fixed z-40",
    "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]",
    "text-white font-black",
    "transition-all duration-300",
    "shadow-[0_4px_24px_rgba(79,70,229,0.5)] hover:shadow-[0_6px_32px_rgba(79,70,229,0.65)]",
    visible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3",
  ];

  const mobile = [
    "md:hidden",
    "bottom-4 left-4",
    "w-14 h-14 rounded-full",
    "flex items-center justify-center",
  ];

  const desktop = [
    "hidden md:flex",
    "items-center gap-3",
    "right-6 bottom-6",
    "w-auto h-auto px-6 py-3.5 rounded-2xl",
  ];

  return (
    <>
      <a
        href={LINKS.appAndroid}
        download
        title="Descargar app Android"
        className={[...baseClasses, ...mobile].join(" ")}
      >
        <AndroidIcon />
      </a>

      <a
        href={LINKS.appAndroid}
        download
        title="Descargar aplicación Android"
        className={[...baseClasses, ...desktop].join(" ")}
      >
        <AndroidIcon />
        <span className="flex flex-col leading-tight">
          <span className="text-white/65 text-[10px] font-semibold uppercase tracking-widest leading-none">
            Descargar app
          </span>
          <span className="text-sm leading-tight">Android .apk</span>
        </span>
      </a>
    </>
  );
}