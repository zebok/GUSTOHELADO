import React from "react";
import { ResultadoRankeado, Antojo } from "../../types";
import { MapPin, Footprints } from "lucide-react";

interface HeladeriaCardProps {
  result: ResultadoRankeado;
  rank: number;
  selectedAntojos: Antojo[];
  onVerInsights: (nombre: string) => void;
}

export const HeladeriaCard: React.FC<HeladeriaCardProps> = ({
  result,
  rank,
  selectedAntojos,
  onVerInsights,
}) => {
  const { heladeria, distanciaMetros, scoreFinal } = result;
  const isTop = rank === 1;

  // Cálculo inteligente de badges/tags recomendados
  const getRecommendationTags = () => {
    const tags: string[] = [];

    // 1. Caminar poco
    if (distanciaMetros < 450) {
      tags.push("Caminar poco");
    }

    let sum = 0;
    let count = 0;
    let maxAntojoName = "";
    let maxAntojoScore = 0;

    selectedAntojos.forEach((antojo) => {
      const s = heladeria.scorePorCategoria[antojo];
      if (s !== undefined) {
        sum += s;
        count++;
        if (s > maxAntojoScore) {
          maxAntojoScore = s;
          maxAntojoName = antojo;
        }
      }
    });

    const avgQuality = count > 0 ? sum / count : 0;

    // 2. Calidad Top
    if (avgQuality >= 9.0) {
      tags.push("Calidad Top");
    }

    // 3. Equilibrio perfecto
    if (scoreFinal > 0.75 && distanciaMetros < 900 && avgQuality >= 7.8) {
      tags.push("Equilibrio perfecto");
    }

    // 4. Mejor en gusto específico
    if (maxAntojoScore >= 9.2 && maxAntojoName) {
      const label =
        maxAntojoName === "DULCE DE LECHE"
          ? "DDL"
          : maxAntojoName === "AUTOR"
          ? "Autor"
          : maxAntojoName.toLowerCase();
      tags.push(`Top ${label}`);
    }

    // Devolver un set único para evitar repeticiones, máximo 2 tags
    return Array.from(new Set(tags)).slice(0, 2);
  };

  const tags = getRecommendationTags();

  return (
    <div
      className={`panel p-4 space-y-3 transition-shadow hover:shadow-md ${
        isTop ? "ring-2 ring-slate-800/60" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
            isTop
              ? "bg-slate-800 text-white"
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

      {/* Visualización de tags inteligentes */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Footprints className="w-3.5 h-3.5" />
          {distanciaMetros} m
        </span>
        <button
          onClick={() => onVerInsights(heladeria.nombre)}
          className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors cursor-pointer"
        >
          Ver insights ({heladeria.visitas} visitas)
        </button>
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
