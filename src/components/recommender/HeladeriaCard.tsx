import React from "react";
import { ResultadoRankeado, Antojo } from "../../types";
import { MapPin, Footprints } from "lucide-react";

interface HeladeriaCardProps {
  result: ResultadoRankeado;
  rank: number;
  selectedAntojos: Antojo[];
}

export const HeladeriaCard: React.FC<HeladeriaCardProps> = ({
  result,
  rank,
  selectedAntojos,
}) => {
  const { heladeria, distanciaMetros, scoreFinal } = result;
  const isTop = rank === 1;

  return (
    <div
      className={`panel p-4 space-y-3 transition-shadow hover:shadow-md ${
        isTop ? "ring-2 ring-amber-400/60" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
            isTop
              ? "bg-amber-100 text-amber-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {rank}
        </span>
        <span className="text-sm font-mono font-semibold text-slate-700">
          {(scoreFinal * 10).toFixed(1)}
        </span>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900">{heladeria.nombre}</h4>
        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{heladeria.direccion}</span>
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Footprints className="w-3.5 h-3.5" />
          {distanciaMetros} m
        </span>
        <span>{heladeria.visitas} visitas</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {selectedAntojos.map((antojo) => {
          const score = heladeria.scorePorCategoria[antojo];
          return (
            <span
              key={antojo}
              className="text-xs font-mono bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
            >
              {antojo.substring(0, 4)}: {score !== undefined ? score.toFixed(1) : "—"}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default HeladeriaCard;
