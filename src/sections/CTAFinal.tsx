import Link from "next/link";
import { LINKS } from "@/lib/config";

export function CTAFinal() {
  return (
    <section className="py-24 px-5 sm:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-3xl p-10 sm:p-14 text-center">

          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/10" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-teal-400/10" />

          <div className="relative">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </div>

            <h2 className="text-white text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
              Empieza hoy tu camino<br />al bienestar
            </h2>
            <p className="text-indigo-200 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Dar el primer paso es lo más difícil. En Sanamente, un profesional verificado te acompaña desde el día uno.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={LINKS.register}
                className="w-full sm:w-auto bg-white hover:bg-indigo-50 text-indigo-700 font-black text-base
                  px-8 py-4 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                Crear cuenta gratis
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href={LINKS.professional}
                className="w-full sm:w-auto border-2 border-white/30 hover:border-white/60 hover:bg-white/5 text-white font-bold text-base
                  px-8 py-4 rounded-2xl transition-all flex items-center justify-center"
              >
                Registrarme como profesional
              </Link>
            </div>

            <p className="text-indigo-300/60 text-xs mt-6">
              Sin tarjeta de crédito requerida · Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
