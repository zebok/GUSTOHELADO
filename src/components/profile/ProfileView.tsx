import React, { useMemo } from "react";
import { Heladeria, MacroCategoria } from "../../types";
import { ClasicosVsAutorChart } from "./ClasicosVsAutorChart";
import { BarrioRankingChart } from "./BarrioRankingChart";
import { MapPin, Award, Heart, ShieldCheck } from "lucide-react";

interface ProfileViewProps {
  heladerias: Heladeria[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ heladerias }) => {
  // 1. Calcular KPIs consolidados
  const stats = useMemo(() => {
    let totalVisits = 0;
    let favoriteHeladeria: Heladeria | null = null;
    let maxHeladeriaVisits = -1;

    const barrioMap: Record<string, number> = {};
    const categoryScores: Record<MacroCategoria, { total: number; count: number }> = {
      CHOCOLATE: { total: 0, count: 0 },
      "DULCE DE LECHE": { total: 0, count: 0 },
      CREMA: { total: 0, count: 0 },
      FRUTA: { total: 0, count: 0 },
      AUTOR: { total: 0, count: 0 },
      MISC: { total: 0, count: 0 },
    };

    heladerias.forEach((h) => {
      totalVisits += h.visitas;

      // Heladería favorita (más visitada)
      if (h.visitas > maxHeladeriaVisits) {
        maxHeladeriaVisits = h.visitas;
        favoriteHeladeria = h;
      }

      // Visitas por zona (barrio ya no existe, agrupamos todo en CABA)
      const barrio = "CABA";
      barrioMap[barrio] = (barrioMap[barrio] || 0) + h.visitas;

      // Agregado de puntuaciones por categoría
      Object.entries(h.scorePorCategoria).forEach(([cat, score]) => {
        const key = cat as MacroCategoria;
        if (score !== undefined) {
          categoryScores[key].total += score;
          categoryScores[key].count += 1;
        }
      });
    });

    // Barrio favorito (más visitado)
    let favoriteBarrio = "Ninguno";
    let maxBarrioVisits = -1;
    Object.entries(barrioMap).forEach(([barrio, visits]) => {
      if (visits > maxBarrioVisits) {
        maxBarrioVisits = visits;
        favoriteBarrio = barrio;
      }
    });

    // Categoría mejor puntuada
    let bestCategory: MacroCategoria | "Ninguna" = "Ninguna";
    let maxAvgScore = -1;
    Object.entries(categoryScores).forEach(([cat, data]) => {
      if (data.count > 0) {
        const avg = data.total / data.count;
        if (avg > maxAvgScore) {
          maxAvgScore = avg;
          bestCategory = cat as MacroCategoria;
        }
      }
    });

    return {
      totalVisits,
      favoriteHeladeria,
      favoriteBarrio,
      bestCategory,
      bestCategoryScore: maxAvgScore > 0 ? maxAvgScore.toFixed(1) : "N/A",
    };
  }, [heladerias]);

  const favHeladeria = stats.favoriteHeladeria as Heladeria | null;

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida */}
      <div className="clean-panel p-6 rounded-xl bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 font-hand">
            Bitácora de Catador (Sebi's Analytics)
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl font-body-hand">
            Agregación en vivo de mis degustaciones directas desde Google Sheets. Un análisis empírico para entender y perfeccionar mis propios hábitos de consumo de helado.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border border-slate-300 bg-slate-100 px-3.5 py-1.5 rounded tracking-wider self-start md:self-auto font-mono">
            <ShieldCheck className="w-4 h-4 text-slate-900" />
            <span>Datos Conectados a Sebi's Form</span>
          </div>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Visitas Totales */}
        <div className="clean-panel p-6 rounded-xl space-y-3">
          <p className="text-xs text-slate-600 font-bold font-hand uppercase tracking-wider">
            Mis Degustaciones
          </p>
          <div className="flex items-baseline gap-1.5 font-mono text-slate-900">
            <span className="text-4xl font-bold">[ {stats.totalVisits} ]</span>
          </div>
          <p className="text-xs text-slate-600 font-body-hand">
            Sumatoria del historial de catas.
          </p>
        </div>

        {/* KPI 2: Heladería Frecuente */}
        <div className="clean-panel p-6 rounded-xl space-y-3">
          <p className="text-xs text-slate-600 font-bold font-hand uppercase tracking-wider">
            Mi Local Frecuente
          </p>
          <div className="truncate">
            <span className="text-lg font-bold text-slate-900 flex items-center gap-1.5 truncate font-hand">
              <Heart className="w-4.5 h-4.5 text-slate-500 flex-shrink-0" />
              {favHeladeria ? favHeladeria.nombre : "Ninguna"}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-mono">
            {favHeladeria
              ? `[ Evaluado ${favHeladeria.visitas} veces ]`
              : "[ Sin registros ]"}
          </p>
        </div>

        {/* KPI 3: Barrio Predilecto */}
        <div className="clean-panel p-6 rounded-xl space-y-3">
          <p className="text-xs text-slate-600 font-bold font-hand uppercase tracking-wider">
            Mi Zonificación Favorita
          </p>
          <div>
            <span className="text-lg font-bold text-slate-900 flex items-center gap-1.5 truncate font-hand">
              <MapPin className="w-4.5 h-4.5 text-slate-500 flex-shrink-0" />
              {stats.favoriteBarrio}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-body-hand">
            Zonificación preferida de visitas.
          </p>
        </div>

        {/* KPI 4: Tipo de Antojo Top */}
        <div className="clean-panel p-6 rounded-xl space-y-3">
          <p className="text-xs text-slate-600 font-bold font-hand uppercase tracking-wider">
            Mi Especialidad Top
          </p>
          <div>
            <span className="text-lg font-bold text-slate-900 flex items-center gap-1.5 truncate font-hand">
              <Award className="w-4.5 h-4.5 text-slate-500 flex-shrink-0" />
              {stats.bestCategory}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-mono">
            [ Score Promedio: <strong className="text-slate-900">{stats.bestCategoryScore}</strong> ]
          </p>
        </div>
      </div>

      {/* Grid de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Clásicos vs Autor */}
        <div className="clean-panel p-6 rounded-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-slate-500 font-hand uppercase">
              Proporción Sabores Tradicionales vs Autor
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-body-hand">
              Análisis comparativo de mis elecciones de sabor históricas.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <ClasicosVsAutorChart heladerias={heladerias} />
          </div>
        </div>

        {/* Gráfico 2: Ranking por Barrio */}
        <div className="clean-panel p-6 rounded-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-slate-500 font-hand uppercase">
              Registros Consolidados por Barrio
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-body-hand">
              Conteo total de helados tomados según la comuna geográfica de CABA.
            </p>
          </div>
          <div>
            <BarrioRankingChart heladerias={heladerias} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileView;
