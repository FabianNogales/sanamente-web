"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatAsistente } from "./ChatAsistente";

type WidgetState = "closed" | "selector" | "chat";
type Role = "paciente" | "psicologo";

const AUTO_MESSAGES = [
  "Hola 👋 ¿En qué puedo ayudarte hoy?",
  "Puedo orientarte sobre nuestros servicios ✨",
  "También puedes agendar una sesión con un psicólogo.",
];

export function ChatWidget() {
  const pathname = usePathname();
  const [state, setState] = useState<WidgetState>("closed");
  const [role, setRole] = useState<Role>("paciente");
  const [bubbles, setBubbles] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // No mostrar en páginas de admin
  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const delays = [3000, 8000, 14000];
    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        if (!dismissed) {
          setBubbles((prev) => [...prev, AUTO_MESSAGES[i]]);
        }
      }, delay);
      timers.current.push(t);
    });
    return () => timers.current.forEach(clearTimeout);
  }, [dismissed]);

  function dismiss() {
    setDismissed(true);
    setBubbles([]);
    timers.current.forEach(clearTimeout);
  }

  function selectRole(r: Role) {
    setRole(r);
    setState("chat");
    dismiss();
  }

  function openWidget() {
    setState("selector");
    dismiss();
  }

  return (
    <div className="fixed bottom-22 right-4 md:right-6 z-50 flex flex-col items-end gap-3">

      {/* Burbujas auto-desplegables */}
      {state === "closed" && bubbles.length > 0 && (
        <div className="flex flex-col items-end gap-2 mb-1 max-w-64">
          {bubbles.map((msg, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl rounded-br-sm px-4 py-2.5 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-start gap-2"
            >
              <p className="text-slate-700 text-sm leading-snug flex-1">{msg}</p>
              {i === bubbles.length - 1 && (
                <button
                  onClick={dismiss}
                  className="text-slate-300 hover:text-slate-500 transition-colors mt-0.5 shrink-0"
                  aria-label="Cerrar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Panel principal */}
      {state !== "closed" && (
        <div
          className="w-[calc(100vw-2rem)] sm:w-80 md:w-96 flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-300/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{ height: "min(760px, calc(100vh - 80px))" }}
        >
          {state === "selector" && (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[#4F46E5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">S</div>
                  <div>
                    <p className="text-white font-bold text-sm">Asistente SanaMente</p>
                    <p className="text-white/70 text-xs">¿Cómo puedo ayudarte?</p>
                  </div>
                </div>
                <button
                  onClick={() => setState("closed")}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 bg-slate-50">
                <p className="text-slate-500 text-sm text-center mb-2">¿Con quién me estoy comunicando?</p>

                <button
                  onClick={() => selectRole("paciente")}
                  className="w-full flex items-center gap-4 bg-white hover:bg-[#4F46E5]/5 border border-slate-200 hover:border-[#4F46E5]/40 rounded-2xl px-5 py-4 transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center flex-none text-lg">
                    🙋
                  </div>
                  <div className="text-left">
                    <p className="text-slate-800 font-bold text-sm">Busco un psicólogo</p>
                    <p className="text-slate-400 text-xs mt-0.5">Quiero agendar una sesión</p>
                  </div>
                </button>

                <button
                  onClick={() => selectRole("psicologo")}
                  className="w-full flex items-center gap-4 bg-white hover:bg-[#0D9488]/5 border border-slate-200 hover:border-[#0D9488]/40 rounded-2xl px-5 py-4 transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center flex-none text-lg">
                    👨‍⚕️
                  </div>
                  <div className="text-left">
                    <p className="text-slate-800 font-bold text-sm">Soy psicólogo</p>
                    <p className="text-slate-400 text-xs mt-0.5">Quiero trabajar en la plataforma</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {state === "chat" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className={`flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-none ${role === "paciente" ? "bg-[#4F46E5]" : "bg-[#0D9488]"}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">S</div>
                  <p className="text-white font-bold text-sm">
                    {role === "paciente" ? "Asistente para pacientes" : "Asistente para psicólogos"}
                  </p>
                </div>
                <button
                  onClick={() => setState("closed")}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <ChatAsistente
                  role={role}
                  welcomeMessage={
                    role === "paciente"
                      ? "¡Hola! 👋 Soy el asistente de SanaMente. ¿En qué puedo ayudarte hoy?"
                      : "¡Hola! 😊 Soy el asistente para psicólogos. ¿Tienes alguna duda sobre la plataforma?"
                  }
                  sugerencias={[]}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón flotante */}
      {state === "closed" && (
        <button
          onClick={openWidget}
          className="relative w-14 h-14 rounded-full bg-[#4F46E5] shadow-2xl shadow-[#4F46E5]/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          title="Habla con nuestro asistente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
          {/* Punto pulsante */}
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F46E5] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border-2 border-[#4F46E5]" />
          </span>
        </button>
      )}
    </div>
  );
}
