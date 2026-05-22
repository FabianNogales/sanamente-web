import { Navbar } from "@/sections/Navbar";
import { Hero } from "@/sections/Hero";
import { ComoFunciona } from "@/sections/ComoFunciona";
import { VideoSection } from "@/sections/VideoSection";
import { ContactoSection } from "@/sections/ContactoSection";
import { Footer } from "@/sections/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <ComoFunciona />
      <VideoSection />
      <ContactoSection />
      <Footer />
    </main>
  );
}
