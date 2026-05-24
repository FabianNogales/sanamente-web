import type { Metadata } from "next";
import "./globals.css";
import { AppDownloadButton } from "@/components/AppDownloadButton";
import { ChatWidgetLoader } from "@/components/ChatWidgetLoader";

export const metadata: Metadata = {
  title: "Sanamente — Atención psicológica profesional",
  description:
    "Conecta con psicólogos verificados. Agenda sesiones, recibe atención profesional y cuida tu salud mental desde cualquier dispositivo.",
  keywords: ["psicólogos", "salud mental", "terapia online", "videollamada", "bienestar"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
        <AppDownloadButton />
        <ChatWidgetLoader />
      </body>
    </html>
  );
}
