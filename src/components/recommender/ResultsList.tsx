import React from "react";
import { ResultadoRankeado, Antojo, Ocurrencia } from "../../types";
import { HeladeriaCard } from "./HeladeriaCard";
import { useLanguage } from "../../i18n/LanguageContext";
import { Compass } from "lucide-react";

interface ResultsListProps {
  results: ResultadoRankeado[];
  selectedAntojos: Antojo[];
  ocurrencias: Ocurrencia[];
  onVerInsights: (nombre: string) => void;
  onLogAtShop: (heladeriaId: number) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  selectedAntojos,
  ocurrencias,
  onVerInsights,
  onLogAtShop,
}) => {
  const { t, plural } = useLanguage();

  if (results.length === 0) {
    const cats =
      selectedAntojos.length > 0
        ? selectedAntojos.map((a) => t(`craving.${a}`)).join(", ")
        : t("results.empty.noCategories");
    return (
      <div className="panel p-8 text-center space-y-2">
        <Compass className="w-8 h-8 text-stone-300 mx-auto" />
        <h4 className="text-stone-700 font-medium">{t("results.empty.title")}</h4>
        <p className="text-sm text-stone-400 max-w-sm mx-auto">
          {t("results.empty.subtitle.part1")}{" "}
          <strong className="text-stone-600">{cats}</strong>{" "}
          {t("results.empty.subtitle.part2")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-700">{t("results.title")}</h3>
        <span className="text-xs text-stone-400 font-mono">
          {plural("results.count", results.length)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {results.map((res, index) => (
          <HeladeriaCard
            key={res.heladeria.id}
            result={res}
            rank={index + 1}
            selectedAntojos={selectedAntojos}
            ocurrencias={ocurrencias}
            onVerInsights={onVerInsights}
            onLogAtShop={onLogAtShop}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
