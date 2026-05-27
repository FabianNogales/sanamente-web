"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LINKS } from "@/lib/config";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navLink = (href: string) =>
    `hover:text-indigo-600 transition-colors ${pathname === href ? "text-indigo-600 font-semibold" : ""}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </div>
          <span className="text-slate-900 font-black text-lg tracking-tight hidden sm:block">Sanamente</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 text-base text-slate-500 font-medium">
          <Link href="/" className={navLink("/")}>Inicio</Link>
          <Link href="/soy-nuevo" className={navLink("/soy-nuevo")}>Quiero hablar con un psicólogo</Link>
          <Link href="/trabaja-con-nosotros" className={navLink("/trabaja-con-nosotros")}>Soy psicólogo profesional</Link>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href={LINKS.login}
            className="text-slate-600 hover:text-indigo-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all"
          >
            Iniciar sesión
          </Link>
          <Link
            href={LINKS.register}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200"
          >
            Comenzar gratis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-5 py-4 flex flex-col gap-1">
          <a href="/" onClick={() => setOpen(false)} className="py-3 text-slate-600 font-medium text-sm border-b border-slate-50 hover:text-indigo-600 transition-colors">Inicio</a>
          <a href="/soy-nuevo" onClick={() => setOpen(false)} className="py-3 text-slate-600 font-medium text-sm border-b border-slate-50 hover:text-indigo-600 transition-colors">Quiero hablar con un psicólogo</a>
          <a href="/trabaja-con-nosotros" onClick={() => setOpen(false)} className="py-3 text-slate-600 font-medium text-sm border-b border-slate-50 hover:text-indigo-600 transition-colors">Soy psicólogo profesional</a>
          <div className="flex flex-col gap-2 pt-3">
            <Link href={LINKS.login} onClick={() => setOpen(false)} className="w-full text-center border border-slate-200 text-slate-700 font-semibold text-sm py-3 rounded-xl hover:bg-slate-50 transition-colors">
              Iniciar sesión
            </Link>
            <Link href={LINKS.register} onClick={() => setOpen(false)} className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-colors">
              Comenzar gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
