import React, { useMemo } from "react";
import { ResultadoRankeado, Antojo, Ocurrencia } from "../../types";
import { MapPin, Footprints, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

interface HeladeriaCardProps {
  result: ResultadoRankeado;
  rank: number;
  selectedAntojos: Antojo[];
  ocurrencias: Ocurrencia[];
  onVerInsights: (nombre: string) => void;
  onLogAtShop: (heladeriaId: number) => void;
}

export const HeladeriaCard: React.FC<HeladeriaCardProps> = ({
  result,
  rank,
  selectedAntojos,
  ocurrencias,
  onVerInsights,
  onLogAtShop,
}) => {
  const { t } = useLanguage();
  const { heladeria, distanciaMetros, scoreFinal } = result;
  const isTop = rank === 1;

  // Gustos recomendados (y a evitar) según mi propio historial en esta heladería o cadena
  const personalAdvice = useMemo(() => {
    const exact = ocurrencias.filter((o) => o.heladeria_id === heladeria.id);
    const pool =
      exact.length >= 2
        ? exact
        : ocurrencias.filter(
            (o) =>
              o.heladeria_nombre.toLowerCase() === heladeria.nombre.toLowerCase()
          );

    const byFlavor = new Map<
      string,
      { gusto: string; scores: number[]; repeats: number }
    >();

    for (const o of pool) {
      const curr = byFlavor.get(o.gusto) ?? {
        gusto: o.gusto,
        scores: [],
        repeats: 0,
      };
      curr.scores.push(o.puntaje_general);
      if (o.volveria_a_pedir) curr.repeats += 1;
      byFlavor.set(o.gusto, curr);
    }

    const items = Array.from(byFlavor.values()).map((it) => ({
      gusto: it.gusto,
      avg:
        Math.round(
          (it.scores.reduce((a, b) => a + b, 0) / it.scores.length) * 10
        ) / 10,
      repeats: it.repeats,
    }));

    const best = items
      .filter((x) => x.avg >= 7.6 && x.repeats > 0)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);

    const avoid = items
      .filter((x) => x.avg < 6.4 || x.repeats === 0)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 1);

    return { best, avoid };
  }, [heladeria, ocurrencias]);

  const getRecommendationTags = () => {
    const tags: string[] = [];

    if (distanciaMetros < 450) {
      tags.push(t("tag.walk"));
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

    if (avgQuality >= 8.8) {
      tags.push(t("tag.topQuality"));
    }

    if (scoreFinal > 0.75 && distanciaMetros < 900 && avgQuality >= 7.8) {
      tags.push(t("tag.balance"));
    }

    if (maxAntojoScore >= 9.0 && maxAntojoName) {
      const label =
        maxAntojoName === "DULCE DE LECHE"
          ? t("tag.ddl")
          : maxAntojoName === "AUTOR"
          ? t("tag.autor")
          : t(`craving.${maxAntojoName}`);
      tags.push(t("tag.top", { label }));
    }

    return Array.from(new Set(tags)).slice(0, 2);
  };

  const tags = getRecommendationTags();

  return (
    <div
      className={`panel p-4 space-y-3 transition-all hover:shadow-md flex flex-col justify-between ${
        isTop ? "ring-2 ring-stone-900/70 bg-amber-50/20" : ""
      }`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                isTop
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {rank}
            </span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold bg-amber-100/70 text-amber-950 border border-amber-200/60 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="text-sm font-mono font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-lg">
            {(scoreFinal * 10).toFixed(1)}
          </span>
        </div>

        <div>
          <h4 className="font-bold text-stone-900 text-base leading-snug">
            {heladeria.nombre}
          </h4>
          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" />
            <span className="truncate">
              {heladeria.direccion}
              {heladeria.ciudad && heladeria.ciudad !== "Buenos Aires"
                ? ` · ${heladeria.ciudad}`
                : ""}
            </span>
          </p>
        </div>

        {/* Qué pedir acá según mi propio historial */}
        {(personalAdvice.best.length > 0 || personalAdvice.avoid.length > 0) && (
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1.5">
            {personalAdvice.best.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {t("card.whatToOrder")}
                </span>
                <div className="flex flex-wrap gap-1">
                  {personalAdvice.best.map((b) => (
                    <span
                      key={b.gusto}
                      className="text-[11px] bg-white border border-stone-200/90 text-stone-800 px-2 py-0.5 rounded-md font-medium"
                    >
                      {b.gusto}{" "}
                      <strong className="font-mono text-emerald-700">
                        {b.avg.toFixed(1)}
                      </strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {personalAdvice.avoid.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-700 pt-0.5">
                <ThumbsDown className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {t("card.avoid")}{" "}
                  <strong>{personalAdvice.avoid[0].gusto}</strong> (
                  {personalAdvice.avoid[0].avg.toFixed(1)})
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2.5 pt-2">
        <div className="flex flex-wrap gap-1.5">
          {selectedAntojos.map((antojo) => {
            const score = heladeria.scorePorCategoria[antojo];
            return (
              <span
                key={antojo}
                className="text-[11px] font-mono bg-stone-50 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200/70"
              >
                {antojo.substring(0, 4)}:{" "}
                {score !== undefined ? score.toFixed(1) : "—"}
              </span>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span className="flex items-center gap-1 font-mono">
            <Footprints className="w-3.5 h-3.5" />
            {distanciaMetros < 1000
              ? `${distanciaMetros} m`
              : `${(distanciaMetros / 1000).toFixed(1)} km`}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onVerInsights(heladeria.nombre)}
              className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 transition-colors cursor-pointer"
            >
              {t("card.insights", { n: heladeria.visitas })}
            </button>
            <button
              onClick={() => onLogAtShop(heladeria.id)}
              className="inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-1 rounded-lg bg-stone-900 text-white hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              🍦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeladeriaCard;
