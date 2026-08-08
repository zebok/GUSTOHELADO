import React from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { LANGS } from "../i18n/translations";

export const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase transition-colors cursor-pointer ${
            lang === l ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
