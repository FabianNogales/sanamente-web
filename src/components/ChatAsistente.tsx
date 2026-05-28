"use client";

import { useEffect, useRef, useState } from "react";

type Role = "paciente" | "psicologo";

interface ChatVideo {
  descripcion: string;
  video: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  imagenes?: string[];
  videos?: ChatVideo[];
}

interface Props {
  role: Role;
  welcomeMessage: string;
  sugerencias?: string[];
}

export function ChatAsistente({ role, welcomeMessage, sugerencias = [] }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useRef<string>(crypto.randomUUID());
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), sessionId: sessionId.current }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Sin respuesta",
          imagenes: (data.imagenes ?? [])
            .map((img: unknown) =>
              typeof img === "string"
                ? img
                : (img as Record<string, string>).imagen ?? (img as Record<string, string>).url ?? ""
            )
            .filter(Boolean),
          videos: data.videos ?? [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hubo un error al contactar al asistente. Intenta nuevamente." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <div className="flex flex-col h-full text-slate-800 overflow-hidden bg-white">
      {/* Mensajes */}
      <div ref={messagesRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%] flex flex-col gap-2">
              <div
                className={`px-4 py-3 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#4F46E5] text-white rounded-br-sm"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm"
                }`}
              >
                {msg.content}
              </div>
              {msg.imagenes && msg.imagenes.length > 0 && (
                <div className="flex flex-col gap-2">
                  {msg.imagenes.map((url, ii) => (
                    <div key={ii} className="rounded-xl overflow-hidden border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full object-cover bg-black" />
                    </div>
                  ))}
                </div>
              )}
              {msg.videos && msg.videos.length > 0 && (
                <div className="flex flex-col gap-2">
                  {msg.videos.map((v, vi) => (
                    <div key={vi} className="rounded-xl overflow-hidden border border-white/10">
                      {v.descripcion && (
                        <p className="text-white/50 text-xs px-3 py-1.5 bg-white/5">{v.descripcion}</p>
                      )}
                      <video src={v.video} controls playsInline className="w-full max-h-48 object-contain bg-black">
                        <track kind="captions" />
                      </video>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="bg-white border border-slate-200 rounded-3xl rounded-bl-sm px-5 py-4 flex gap-1.5 items-center shadow-sm">
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {messages.length === 1 && sugerencias.length > 0 && !loading && (
          <div className="flex flex-wrap gap-2 pt-1">
            {sugerencias.map((s, i) => (
              <button
                key={i}
                onClick={() => void sendMessage(s)}
                className="text-xs px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-[#4F46E5]/20 hover:border-[#4F46E5]/40 hover:text-white transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-none px-4 py-3 border-t border-slate-100 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta..."
            rows={1}
            className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#4F46E5]/50 focus:bg-white transition-all max-h-28 overflow-y-auto"
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 112) + "px";
            }}
          />
          <button
            onClick={() => void sendMessage(input)}
            disabled={!input.trim() || loading}
            className="flex-none w-10 h-10 rounded-2xl bg-[#4F46E5] flex items-center justify-center hover:bg-[#4338CA] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-slate-300 text-[10px] mt-1.5">Enter para enviar · Shift+Enter para nueva línea</p>
      </div>
    </div>
  );
}
