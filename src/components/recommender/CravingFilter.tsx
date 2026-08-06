import React from "react";
import { Antojo } from "../../types";

interface CravingFilterProps {
  selectedAntojos: Antojo[];
  onAntojosChange: (antojos: Antojo[]) => void;
}

const antojos: { value: Antojo; label: string }[] = [
  { value: "CHOCOLATE", label: "Chocolate" },
  { value: "DULCE DE LECHE", label: "Dulce de leche" },
  { value: "CREMA", label: "Crema" },
  { value: "FRUTA", label: "Fruta" },
  { value: "AUTOR", label: "De autor" },
];

export const CravingFilter: React.FC<CravingFilterProps> = ({
  selectedAntojos,
  onAntojosChange,
}) => {
  return (
    <div className="panel p-4 space-y-3">
      <h3 className="panel-label">Gusto</h3>
      <div className="flex flex-wrap gap-2">
        {antojos.map((antojo) => {
          const isSelected = selectedAntojos.includes(antojo.value);
          return (
            <button
              key={antojo.value}
              onClick={() => {
                if (isSelected) {
                  if (selectedAntojos.length > 1) {
                    onAntojosChange(selectedAntojos.filter((a) => a !== antojo.value));
                  }
                } else {
                  onAntojosChange([...selectedAntojos, antojo.value]);
                }
              }}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-pointer ${
                isSelected
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {antojo.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CravingFilter;
