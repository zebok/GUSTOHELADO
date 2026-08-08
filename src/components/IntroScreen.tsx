import React, { useState } from "react";
import { IceCreamCone, Compass } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";

interface IntroScreenProps {
  onClose: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onClose }) => {
  const [closing, setClosing] = useState(false);
  const { t } = useLanguage();

  const handleEnter = () => {
    setClosing(true);
    setTimeout(onClose, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-slate-50 transition-opacity duration-300 ${
        closing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="h-screen max-w-xl md:max-w-3xl mx-auto px-6 md:px-10 py-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <IceCreamCone className="w-4.5 h-4.5 text-slate-700" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                GustoHelado
              </h1>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">{t("intro.tagline")}</p>
            </div>
          </div>
          <LanguageToggle />
        </div>

        {/* Contenido editorial */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="space-y-3.5 text-left animate-fade-in">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">
              {t("intro.kicker")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug tracking-tight">
              {t("intro.headline")}
            </h2>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">{t("intro.story1")}</p>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">{t("intro.story2")}</p>
          </div>

          {/* Blend Score */}
          <div className="border-t border-slate-200 pt-4 animate-fade-in">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Compass className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {t("intro.blend.label")}
              </span>
            </div>
            <div className="flex justify-between text-xs md:text-sm text-slate-600 font-medium mt-1.5">
              <span>{t("intro.blend.quality")}</span>
              <span>+</span>
              <span>{t("intro.blend.proximity")}</span>
            </div>
            <code className="block text-center text-[10px] md:text-xs font-mono text-slate-500 bg-slate-50 border border-slate-100 rounded py-1 mt-1.5">
              {t("intro.blend.formula")}
            </code>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleEnter}
          className="w-full py-3.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          {t("intro.cta")}
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
