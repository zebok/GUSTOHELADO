import React from "react";
import { Antojo } from "../../types";

interface CravingFilterProps {
  selectedAntojos: Antojo[];
  onAntojosChange: (antojos: Antojo[]) => void;
}

const clasicos: { value: Antojo; label: string }[] = [
  { value: "CHOCOLATE", label: "Chocolate" },
  { value: "DULCE DE LECHE", label: "Dulce de leche" },
  { value: "CREMA", label: "Crema" },
  { value: "FRUTA", label: "Fruta" },
];

const especiales: { value: Antojo; label: string }[] = [
  { value: "AUTOR", label: "Sabores de autor" },
];

export const CravingFilter: React.FC<CravingFilterProps> = ({
  selectedAntojos,
  onAntojosChange,
}) => {
  const handleToggle = (val: Antojo) => {
    const isSelected = selectedAntojos.includes(val);
    if (isSelected) {
      onAntojosChange(selectedAntojos.filter((a) => a !== val));
    } else {
      onAntojosChange([...selectedAntojos, val]);
    }
  };

  const renderButton = (item: { value: Antojo; label: string }) => {
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
        {item.label}
      </button>
    );
  };

  return (
    <div className="panel p-4 space-y-4">
      <div>
        <h3 className="panel-label text-slate-700 font-semibold text-xs uppercase tracking-wider">
          Experiencia deseada
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Selecciona las categorías que te interesan hoy.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Línea clásica
          </p>
          <div className="flex flex-wrap gap-2">
            {clasicos.map(renderButton)}
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            Especiales
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
