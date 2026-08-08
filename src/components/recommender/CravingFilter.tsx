import React from "react";
import { Antojo } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";

interface CravingFilterProps {
  selectedAntojos: Antojo[];
  onAntojosChange: (antojos: Antojo[]) => void;
}

const clasicos: { value: Antojo }[] = [
  { value: "CHOCOLATE" },
  { value: "DULCE DE LECHE" },
  { value: "CREMA" },
  { value: "FRUTA" },
];

const especiales: { value: Antojo }[] = [{ value: "AUTOR" }];

export const CravingFilter: React.FC<CravingFilterProps> = ({
  selectedAntojos,
  onAntojosChange,
}) => {
  const { t } = useLanguage();

  const handleToggle = (val: Antojo) => {
    const isSelected = selectedAntojos.includes(val);
    if (isSelected) {
      onAntojosChange(selectedAntojos.filter((a) => a !== val));
    } else {
      onAntojosChange([...selectedAntojos, val]);
    }
  };

  const renderButton = (item: { value: Antojo }) => {
    const isSelected = selectedAntojos.includes(item.value);
    return (
      <button
        key={item.value}
        onClick={() => handleToggle(item.value)}
        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
          isSelected
            ? "bg-slate-800 text-white border-slate-800"
            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
        }`}
      >
        {t(`craving.${item.value}`)}
      </button>
    );
  };

  return (
    <div className="panel p-4 space-y-4">
      <div>
        <h3 className="panel-label text-slate-700 font-semibold text-xs uppercase tracking-wider">
          {t("craving.title")}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{t("craving.subtitle")}</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            {t("craving.classicLine")}
          </p>
          <div className="flex flex-wrap gap-2">
            {clasicos.map(renderButton)}
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            {t("craving.specials")}
          </p>
          <div className="flex flex-wrap gap-2">
            {especiales.map(renderButton)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CravingFilter;
