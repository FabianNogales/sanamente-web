import { Navbar } from "@/sections/Navbar";
import { Hero } from "@/sections/Hero";
import { ComoFunciona } from "@/sections/ComoFunciona";
import { Features } from "@/sections/Features";
import { Profesionales } from "@/sections/Profesionales";
import { Creditos } from "@/sections/Creditos";
import { ContactoSection } from "@/sections/ContactoSection";
import { Descargar } from "@/sections/Descargar";
import { CTAFinal } from "@/sections/CTAFinal";
import { Footer } from "@/sections/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <ComoFunciona />
      <Features />
      <Profesionales />
      <Creditos />
      <Descargar />
      <ContactoSection />
      <CTAFinal />
      <Footer />
    </main>
  );
}
