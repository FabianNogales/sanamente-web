import { LINKS } from "@/lib/config";

function StoreButton({
  href,
  icon,
  store,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  store: string;
  sub: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white px-6 py-3.5 rounded-2xl transition-all shadow-lg group"
    >
      <span className="shrink-0 text-white">{icon}</span>
      <div className="text-left">
        <p className="text-xs text-slate-400 leading-none mb-0.5">{sub}</p>
        <p className="text-base font-bold leading-none">{store}</p>
      </div>
    </a>
  );
}

const GooglePlayIcon = () => (
  <svg viewBox="0 0 512 512" className="w-7 h-7" fill="none">
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#00D8FF" />
    <path d="M47 0C34 6.8 25.3 19.2 25.3 35V477c0 15.8 8.7 28.2 21.7 35l242-242L47 0z" fill="#00F076" />
    <path d="M408.5 241.4l-60.9-35.1-67.7 67.7 67.7 67.7 61.7-35.4c17.6-10.1 17.6-34.7-.8-44.9z" fill="#FFCA28" />
    <path d="M104.6 499l220.7-220.7 60.1 60.1L104.6 499z" fill="#F4433C" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

export function Descargar() {
  return (
    <section
      id="descargar"
      className="py-24 px-5 sm:px-8 bg-gradient-to-b from-indigo-50/60 to-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-3xl px-8 sm:px-14 py-14 sm:py-20">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-black/10" />
          <div className="absolute top-1/2 right-1/3 w-40 h-40 rounded-full bg-teal-400/10" />

          <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text side */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-white/90 text-xs font-bold uppercase tracking-widest">App disponible</span>
              </div>

              <h2 className="text-white text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
                Lleva Sanamente<br />
                <span className="text-teal-300">en tu bolsillo</span>
              </h2>

              <p className="text-indigo-200 text-base sm:text-lg mb-10 max-w-md leading-relaxed">
                Agenda sesiones, chatea con tu psicólogo y accede a tu historial de atención desde la app. Disponible para Android e iOS.
              </p>

              {/* Store buttons */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
                <StoreButton
                  href={LINKS.appAndroid}
                  icon={<GooglePlayIcon />}
                  sub="Disponible en"
                  store="Google Play"
                />
                <StoreButton
                  href={LINKS.appIos}
                  icon={<AppleIcon />}
                  sub="Próximamente en"
                  store="App Store"
                />
              </div>

              {/* Trust */}
              <p className="mt-6 text-indigo-300/60 text-xs text-center lg:text-left">
                Gratis · Sin suscripción obligatoria · Datos protegidos
              </p>
            </div>

            {/* Phone mockup side */}
            <div className="shrink-0 flex items-end justify-center gap-4">
              {/* Main phone */}
              <div className="relative w-44 sm:w-52">
                <div className="w-full aspect-[9/19] bg-white/10 border-2 border-white/20 rounded-[2.5rem] flex flex-col items-center justify-between py-4 px-3 shadow-2xl backdrop-blur-sm">
                  {/* Notch */}
                  <div className="w-16 h-4 bg-black/30 rounded-full" />

                  {/* Screen content mockup */}
                  <div className="w-full flex-1 flex flex-col gap-2 mt-3">
                    <div className="w-full h-16 bg-white/10 rounded-2xl flex items-center justify-center gap-2 px-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-300/40 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2 bg-white/30 rounded-full w-3/4" />
                        <div className="h-1.5 bg-white/20 rounded-full w-1/2" />
                      </div>
                    </div>
                    <div className="w-full h-16 bg-white/10 rounded-2xl flex items-center justify-center gap-2 px-3">
                      <div className="w-9 h-9 rounded-full bg-teal-300/40 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2 bg-white/30 rounded-full w-2/3" />
                        <div className="h-1.5 bg-white/20 rounded-full w-2/5" />
                      </div>
                    </div>
                    <div className="w-full h-24 bg-white/10 rounded-2xl p-3">
                      <div className="h-2 bg-white/30 rounded-full w-1/2 mb-2" />
                      <div className="h-1.5 bg-white/20 rounded-full w-full mb-1.5" />
                      <div className="h-1.5 bg-white/20 rounded-full w-3/4 mb-1.5" />
                      <div className="h-1.5 bg-white/20 rounded-full w-5/6" />
                    </div>
                    <div className="w-full h-10 bg-indigo-400/40 rounded-2xl flex items-center justify-center">
                      <div className="h-2 bg-white/50 rounded-full w-1/3" />
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="flex gap-4 mt-2">
                    <div className="w-4 h-4 rounded-full bg-white/20" />
                    <div className="w-8 h-1.5 rounded-full bg-white/30" />
                    <div className="w-4 h-4 rounded-full bg-white/20" />
                  </div>
                </div>

                {/* Glow under phone */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-indigo-400/30 blur-2xl rounded-full" />
              </div>

              {/* Floating notification badge */}
              <div className="absolute right-8 top-8 lg:right-auto lg:top-auto lg:relative flex flex-col gap-2">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2 w-44">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-800 text-xs font-bold leading-tight">Sesión confirmada</p>
                    <p className="text-slate-400 text-xs leading-tight">Hoy, 4:00 PM</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2 w-44">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-800 text-xs font-bold leading-tight">Nuevo mensaje</p>
                    <p className="text-slate-400 text-xs leading-tight">Tu psicóloga escribió</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
