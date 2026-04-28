import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { LINKS } from "@/lib/config";

const PLANES = [
  {
    name: "Básico",
    credits: 500,
    price: "S/ 25",
    priceNote: "≈ 1–2 sesiones",
    highlight: false,
    features: ["500 créditos", "Sesiones de chat", "Soporte básico"],
  },
  {
    name: "Estándar",
    credits: 1500,
    price: "S/ 60",
    priceNote: "≈ 3–5 sesiones",
    highlight: true,
    features: ["1,500 créditos", "Sesiones de videollamada y chat", "Llamadas de voz", "Soporte prioritario"],
  },
  {
    name: "Completo",
    credits: 3500,
    price: "S/ 120",
    priceNote: "≈ 8–12 sesiones",
    highlight: false,
    features: ["3,500 créditos", "Todas las modalidades", "Sin caducidad", "Soporte premium"],
  },
];

export function Creditos() {
  return (
    <section id="creditos" className="py-24 px-5 sm:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">
          <SectionLabel>Planes de créditos</SectionLabel>
          <h2 className="text-slate-900 text-4xl sm:text-5xl font-black tracking-tight mt-4 mb-4">
            Simple y sin sorpresas
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Compra créditos una sola vez y úsalos cuando quieras. Cada profesional define su tarifa por sesión en créditos. Sin suscripciones ni pagos recurrentes.
          </p>
        </div>

        {/* How credits work */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </div>
          <p className="text-indigo-800 text-sm leading-relaxed">
            <strong>¿Cómo funcionan los créditos?</strong> Cada psicólogo define su tarifa en créditos por minuto o por sesión. Al iniciar una sesión, los créditos se descuentan automáticamente de tu saldo. Puedes recargar en cualquier momento.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {PLANES.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-7 flex flex-col gap-4 transition-all ${
                plan.highlight
                  ? "bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-200 scale-105"
                  : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Más popular
                </div>
              )}

              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>
                  {plan.name}
                </p>
                <p className={`text-3xl font-black ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                  {plan.price}
                </p>
                <p className={`text-xs mt-1 ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}>
                  {plan.priceNote}
                </p>
              </div>

              <ul className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? "text-indigo-100" : "text-slate-600"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-teal-300" : "text-indigo-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={LINKS.register}
                className={`mt-auto text-center font-black text-sm py-3 rounded-xl transition-all ${
                  plan.highlight
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                Comenzar con este plan
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-xs">
          Los precios mostrados son referenciales. Cada profesional define su tarifa. Los créditos no tienen fecha de caducidad.
        </p>
      </div>
    </section>
  );
}
