import React from "react";
import { useLanguage } from "../../i18n/LanguageContext";

interface DistanceSliderProps {
  maxDistanceMeters: number;
  onDistanceChange: (distance: number) => void;
}

export const DistanceSlider: React.FC<DistanceSliderProps> = ({
  maxDistanceMeters,
  onDistanceChange,
}) => {
  const { t } = useLanguage();
  const min = 500;
  const max = 5000;
  const percentage = ((maxDistanceMeters - min) / (max - min)) * 100;
  const walkingMinutes = Math.round(maxDistanceMeters / 83);

  return (
    <div className="panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="panel-label">{t("distance.title")}</h3>
        <span className="text-sm font-mono font-medium text-slate-700">
          {maxDistanceMeters >= 1000
            ? `${(maxDistanceMeters / 1000).toFixed(1)} km`
            : `${maxDistanceMeters} m`}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step="250"
        value={maxDistanceMeters}
        onChange={(e) => onDistanceChange(parseInt(e.target.value))}
        style={{
          background: `linear-gradient(to right, #334155 0%, #334155 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
        }}
        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
      />

      <p className="text-xs text-slate-400">
        {t("distance.walking", { n: walkingMinutes })}
      </p>
    </div>
  );
};

export default DistanceSlider;
