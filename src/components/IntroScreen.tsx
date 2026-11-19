import React, { useState, useEffect } from "react";
import {
  IceCreamCone,
  Sparkles,
  Globe2,
  Sliders,
  ArrowRight,
  CheckCircle2,
  Compass,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";

interface IntroScreenProps {
  onClose: () => void;
  totalShops?: number;
  totalOccurrences?: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onClose,
  totalShops = 560,
  totalOccurrences = 2528,
}) => {
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const { t, lang } = useLanguage();

  const stories = [t("intro.story1"), t("intro.story2"), t("intro.story3")];
  const currentFullText = stories[step];

  // Efecto máquina de escribir ágil y sin fricción
  useEffect(() => {
    setTypedText("");
    setIsTyping(true);
    let idx = 0;
    const interval = setInterval(() => {
      idx += 2;
      if (idx >= currentFullText.length) {
        setTypedText(currentFullText);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setTypedText(currentFullText.slice(0, idx));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [step, currentFullText]);

  const handleEnter = () => {
    setClosing(true);
    setTimeout(onClose, 320);
  };

  const handleTextClick = () => {
    if (isTyping) {
      setTypedText(currentFullText);
      setIsTyping(false);
    }
  };

  const cities =
    lang === "es"
      ? [
          "Buenos Aires (CABA & GBA)",
          "Berlín & Potsdam",
          "Aarhus & Copenhague",
          "Bariloche · Córdoba · Mendoza",
          "Ubatuba · Caraguatatuba · Río",
          "Montevideo & Colonia",
          "Ámsterdam · Madrid · Sevilla",
        ]
      : [
          "Buenos Aires (CABA & GBA)",
          "Berlin & Potsdam",
          "Aarhus & Copenhagen",
          "Bariloche · Córdoba · Mendoza",
          "Ubatuba · Caraguatatuba · Rio",
          "Montevideo & Colonia",
          "Amsterdam · Madrid · Seville",
        ];

  const subcats =
    lang === "es"
      ? [
          {
            code: "CLÁSICO",
            desc: "El gusto puro de la categoría sin agregados sólidos ni mezclas.",
            sample: "Chocolate Amargo · Pistacho · Frambuesa",
          },
          {
            code: "SPRINKLES",
            desc: "Base con agregados sólidos: chips, almendras, nueces, brownie o galletitas.",
            sample: "DDL Granizado · Choc. c/ Almendras · Tramontana",
          },
          {
            code: "FUSIÓN",
            desc: "Fusión con otra crema/salsa o gustos de 3+ componentes y pastelería.",
            sample: "Banana Split · Lemon Pie · Chocotorta · Gianduia",
          },
          {
            code: "LIGHT",
            desc: "Versiones sin azúcar, bajas calorías, sin TACC o veganas funcionales.",
            sample: "DDL Sin Azúcar · Sorbete 0%",
          },
        ]
      : [
          {
            code: "CLASSIC",
            desc: "Pure base flavor without solid mix-ins or multi-creams.",
            sample: "Dark Chocolate · Pistachio · Raspberry",
          },
          {
            code: "SPRINKLES",
            desc: "Base with solid mix-ins: chocolate chips, almonds, walnuts, brownie.",
            sample: "DDL Granizado · Choc. w/ Almonds · Tramontana",
          },
          {
            code: "FUSION",
            desc: "Fused with liquid/cream swirls or 3+ component pastry flavors.",
            sample: "Banana Split · Lemon Pie · Chocotorta · Gianduia",
          },
          {
            code: "LIGHT",
            desc: "Sugar-free, low-calorie, gluten-free or vegan functional versions.",
            sample: "Sugar-free DDL · 0% Sorbet",
          },
        ];

  const metrics = [
    {
      weight: "40%",
      title: lang === "es" ? "Disfrutabilidad" : "Enjoyability",
      desc:
        lang === "es"
          ? "100% subjetivo: qué tanto me gustó y lo disfruté en el momento."
          : "100% subjective: how much I truly enjoyed the flavor.",
      pct: 40,
      color: "bg-amber-500",
    },
    {
      weight: "25%",
      title:
        lang === "es"
          ? "Textura / Anticongelante"
          : "Texture / Thermal Preservation",
      desc:
        lang === "es"
          ? "Cremosidad, reactividad al derretirse y cero escarcha (ni en crema ni al agua)."
          : "Creaminess, melt reactivity, and zero ice crystals.",
      pct: 25,
      color: "bg-emerald-500",
    },
    {
      weight: "20%",
      title: lang === "es" ? "Fidelidad al Gusto" : "Flavor Fidelity",
      desc:
        lang === "es"
          ? "Honestidad del sabor: ¿sabe realmente a lo que dice o a esencia artificial?"
          : "Ingredient honesty: does it taste real or like artificial essence?",
      pct: 20,
      color: "bg-sky-500",
    },
    {
      weight: "15%",
      title:
        lang === "es"
          ? "Experiencia y Presentación"
          : "Experience & Presentation",
      desc:
        lang === "es"
          ? "Desde la batea hasta el formato: cucurucho rico, bochas bien servidas o pote térmico vs. telgopor que se rompe."
          : "Display, cone quality, neat scoops, or thermal tub vs. crumbling styrofoam.",
      pct: 15,
      color: "bg-rose-500",
    },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-[#faf8f5] transition-opacity duration-300 ${
        closing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient organic glows */}
      <div className="pointer-events-none fixed -top-28 -left-28 w-96 h-96 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="pointer-events-none fixed top-1/3 -right-28 w-96 h-96 rounded-full bg-rose-200/25 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-28 left-1/4 w-96 h-96 rounded-full bg-emerald-200/25 blur-3xl" />

      <div className="relative min-h-screen max-w-3xl mx-auto px-5 md:px-10 py-6 flex flex-col justify-between gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200/80 flex items-center justify-center shadow-sm">
              <IceCreamCone className="w-5 h-5 text-stone-800" strokeWidth={1.7} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-stone-900 tracking-tight leading-none">
                  GustoHelado
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200/60">
                  2010–2026
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                {t("intro.tagline")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={handleEnter}
              className="text-xs font-medium text-stone-500 hover:text-stone-900 px-2.5 py-1.5 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              {t("intro.skip")} →
            </button>
          </div>
        </div>

        {/* Center Storytelling Area */}
        <div className="my-auto space-y-5">
          {/* Kicker & Headline */}
          <div className="space-y-2">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 uppercase tracking-[0.16em]">
              <Sparkles className="w-3.5 h-3.5" />
              {t("intro.kicker")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight tracking-tight">
              {t("intro.headline")}
            </h2>
          </div>

          {/* Story Chapter Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { idx: 0 as const, label: t("intro.step1.label"), icon: <Globe2 className="w-3.5 h-3.5" /> },
              { idx: 1 as const, label: t("intro.step2.label"), icon: <IceCreamCone className="w-3.5 h-3.5" /> },
              { idx: 2 as const, label: t("intro.step3.label"), icon: <Sliders className="w-3.5 h-3.5" /> },
            ].map((item) => {
              const active = step === item.idx;
              return (
                <button
                  key={item.idx}
                  onClick={() => setStep(item.idx)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-stone-900 text-white shadow-sm scale-[1.02]"
                      : "bg-white/80 text-stone-600 border border-stone-200/80 hover:border-stone-300"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Live Typewriter Narrative Card */}
          <div
            onClick={handleTextClick}
            className="bg-white/90 backdrop-blur-sm border border-stone-200/90 rounded-3xl p-5 md:p-6 shadow-sm space-y-5 transition-all cursor-pointer"
          >
            <p className="text-sm md:text-base text-stone-700 leading-relaxed min-h-[3.8rem]">
              {typedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-4 ml-1 bg-amber-600 animate-pulse align-middle" />
              )}
            </p>

            {/* Dynamic Visual Payload per Chapter */}
            {step === 0 && (
              <div className="pt-2 border-t border-stone-100 space-y-3 animate-fade-in">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-stone-50/90 rounded-2xl p-3 border border-stone-200/60">
                    <p className="text-lg md:text-xl font-bold text-stone-900 font-mono">
                      {totalOccurrences.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {lang === "es" ? "Ocurrencias registradas" : "Logged occurrences"}
                    </p>
                  </div>
                  <div className="bg-stone-50/90 rounded-2xl p-3 border border-stone-200/60">
                    <p className="text-lg md:text-xl font-bold text-stone-900 font-mono">
                      {totalShops}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {lang === "es" ? "Heladerías visitadas" : "Visited gelaterias"}
                    </p>
                  </div>
                  <div className="bg-stone-50/90 rounded-2xl p-3 border border-stone-200/60">
                    <p className="text-lg md:text-xl font-bold text-stone-900 font-mono">
                      11
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {lang === "es" ? "Países en mi bitácora" : "Countries in my log"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cities.map((c) => (
                    <span
                      key={c}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50/70 text-stone-700 border border-amber-200/50"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="pt-2 border-t border-stone-100 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    {t("intro.taxonomy.label")}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    6 {lang === "es" ? "familias" : "families"} × 4 {lang === "es" ? "subcategorías" : "subcategories"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {subcats.map((sc) => (
                    <div
                      key={sc.code}
                      className="p-3 rounded-2xl bg-stone-50/90 border border-stone-200/70 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 tracking-wide">
                          {sc.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-snug">
                        {sc.desc}
                      </p>
                      <p className="text-[10px] font-mono text-amber-800 pt-0.5">
                        {sc.sample}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="pt-2 border-t border-stone-100 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    {t("intro.formula.label")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    {lang === "es" ? "+ ¿Volvería a pedir?" : "+ Would order again?"}
                  </span>
                </div>

                <div className="space-y-2">
                  {metrics.map((m) => (
                    <div
                      key={m.title}
                      className="p-2.5 rounded-2xl bg-stone-50/90 border border-stone-200/60 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800">
                          {m.title}
                        </span>
                        <span className="font-mono font-bold text-stone-900">
                          {m.weight}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${m.color}`}
                          style={{ width: `${m.pct * 2.2}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 leading-snug">
                        {m.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step footer controls inside card */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setStep(i as 0 | 1 | 2);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      step === i ? "w-6 bg-stone-900" : "w-2 bg-stone-300"
                    }`}
                    aria-label={`Paso ${i + 1}`}
                  />
                ))}
              </div>

              {step < 2 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStep((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : 0));
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  {t("intro.next")} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-500">
                  <Compass className="w-3.5 h-3.5" />
                  {t("intro.blend.formula")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleEnter}
            className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-2xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <span>{t("intro.cta")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
