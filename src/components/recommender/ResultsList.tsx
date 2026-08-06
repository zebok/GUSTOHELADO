import React from "react";
import { ResultadoRankeado, Antojo } from "../../types";
import { HeladeriaCard } from "./HeladeriaCard";
import { Compass } from "lucide-react";

interface ResultsListProps {
  results: ResultadoRankeado[];
  selectedAntojos: Antojo[];
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  selectedAntojos,
}) => {
  const top3 = results.slice(0, 3);

  if (results.length === 0) {
    return (
      <div className="panel p-8 text-center space-y-2">
        <Compass className="w-8 h-8 text-slate-300 mx-auto" />
        <h4 className="text-slate-700 font-medium">Sin resultados</h4>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          No hay heladerías con notas en{" "}
          <strong className="text-slate-600">{selectedAntojos.join(", ")}</strong>{" "}
          dentro del radio seleccionado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          Top recomendaciones
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          {results.length} en rango
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {top3.map((res, index) => (
          <HeladeriaCard
            key={res.heladeria.id}
            result={res}
            rank={index + 1}
            selectedAntojos={selectedAntojos}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
