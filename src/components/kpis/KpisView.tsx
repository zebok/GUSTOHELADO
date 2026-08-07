import React, { useMemo, useState } from "react";
import { Heladeria, Ocurrencia, MacroCategoria } from "../../types";
import { Trophy, Star, TrendingUp, Calendar, Repeat, Hash, ChevronDown, RefreshCw } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface KpisViewProps {
  heladerias: Heladeria[];
  ocurrencias: Ocurrencia[];
  selectedHeladeriaFilter: string;
  onHeladeriaFilterChange: (nombre: string) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────

const groupBy = <T,>(arr: T[], key: (item: T) => string) =>
  arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

const avg = (nums: number[]) =>
  nums.length === 0 ? 0 : nums.reduce((a, b) => a + b, 0) / nums.length;

const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const CAT_LABELS: Record<MacroCategoria, string> = {
  CHOCOLATE: "Chocolate",
  "DULCE DE LECHE": "Dulce de Leche",
  CREMA: "Crema",
  FRUTA: "Fruta",
  AUTOR: "De Autor",
  MISC: "Variedades",
};

// ── Sub-componentes ──────────────────────────────────────────────────────

const KpiCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}> = ({ icon, label, value, sub, accent }) => (
  <div className={`panel p-5 space-y-2 ${accent ? "border-slate-300 bg-slate-100/50" : ""}`}>
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {icon}
      {label}
    </div>
    <p className="text-2xl font-bold tracking-tight leading-none text-slate-900">
      {value}
    </p>
    {sub && <p className="text-xs text-slate-400 leading-snug">{sub}</p>}
  </div>
);

const MiniBar: React.FC<{ label: string; value: number; max: number; sub?: string; accent?: boolean }> = ({
  label, value, max, sub, accent,
}) => (
  <div className="space-y-1">
    <div className="flex justify-between items-baseline">
      <span className="text-sm text-slate-700 font-medium truncate">{label}</span>
      <span className={`text-sm font-mono font-semibold ml-2 ${accent ? "text-slate-900" : "text-slate-600"}`}>
        {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}
      </span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${accent ? "bg-slate-800" : "bg-slate-400"}`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
    {sub && <p className="text-xs text-slate-400">{sub}</p>}
  </div>
);

export const KpisView: React.FC<KpisViewProps> = ({
  ocurrencias = [],
  selectedHeladeriaFilter,
  onHeladeriaFilterChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");

  // Filtro reactivo en el frontend (combina Categoría y Heladería)
  const filteredOcurrencias = useMemo(() => {
    return ocurrencias.filter((o) => {
      const matchCat = selectedCategory === "TODAS" || o.macrocategoria === selectedCategory;
      const matchHel = selectedHeladeriaFilter === "TODAS" || o.heladeria_nombre === selectedHeladeriaFilter;
      return matchCat && matchHel;
    });
  }, [ocurrencias, selectedCategory, selectedHeladeriaFilter]);

  // Lista de categorías únicas para el filtro
  const categoriasFiltro = useMemo(() => {
    const set = new Set(ocurrencias.map((o) => o.macrocategoria).filter(Boolean));
    return Array.from(set).sort();
  }, [ocurrencias]);

  // Lista de heladerías únicas para el filtro
  const heladeriasFiltro = useMemo(() => {
    const set = new Set(ocurrencias.map((o) => o.heladeria_nombre).filter(Boolean));
    return Array.from(set).sort();
  }, [ocurrencias]);

  // Datos curiosos globales (calculados sobre la totalidad de los datos para ser representativos)
  const globalCuriosities = useMemo(() => {
    if (ocurrencias.length === 0) return null;

    const byCat = groupBy(ocurrencias, (o) => o.macrocategoria);
    const catStats = Object.entries(byCat).map(([cat, os]) => ({
      cat: cat as MacroCategoria,
      visitas: os.length,
      avg: avg(os.map((o) => o.puntaje_general)),
    }));

    const catFavorita = [...catStats].sort((a, b) => b.avg - a.avg)[0];
    const catMasPedida = [...catStats].sort((a, b) => b.visitas - a.visitas)[0];

    const byGusto = groupBy(ocurrencias, (o) => o.gusto);
    const gustoEstrella = Object.entries(byGusto)
      .map(([gusto, os]) => ({ gusto, visitas: os.length }))
      .sort((a, b) => b.visitas - a.visitas)[0];

    return {
      catFavorita,
      catMasPedida,
      gustoEstrella,
    };
  }, [ocurrencias]);

  // Estadísticas del subset filtrado
  const stats = useMemo(() => {
    if (filteredOcurrencias.length === 0) return null;

    const total = filteredOcurrencias.length;
    const scoreGlobal = avg(filteredOcurrencias.map((o) => o.puntaje_general));
    const tasaVolveria = filteredOcurrencias.filter((o) => o.volveria_a_pedir).length / total;

    const fechas = filteredOcurrencias.map((o) => o.fecha).filter(Boolean).sort();
    const primeraFecha = fechas[0];
    const ultimaFecha = fechas[fechas.length - 1];

    const byHel = groupBy(filteredOcurrencias, (o) => o.heladeria_nombre);
    
    // Heladerías con visitas y promedio
    const helPorVisitas = Object.entries(byHel)
      .map(([nombre, os]) => ({ nombre, visitas: os.length, avg: avg(os.map((o) => o.puntaje_general)) }))
      .sort((a, b) => b.visitas - a.visitas);
    const masVisitada = helPorVisitas[0];

    // Ordenado por puntuación (mínimo 2 visitas si hay suficientes heladerías)
    const helPorScoreBase = Object.entries(byHel)
      .map(([nombre, os]) => ({ nombre, visitas: os.length, avg: avg(os.map((o) => o.puntaje_general)) }));
    
    const tieneMultiplesVisitas = helPorScoreBase.filter((h) => h.visitas >= 2).length >= 3;
    const helPorScore = helPorScoreBase
      .filter((h) => !tieneMultiplesVisitas || h.visitas >= 2)
      .sort((a, b) => b.avg - a.avg);

    const top5Heladerias = helPorScore.slice(0, 5);
    const maxScoreHel = top5Heladerias[0]?.avg ?? 10;

    // Top 5 gustos específicos
    const byGusto = groupBy(filteredOcurrencias, (o) => o.gusto);
    const top5Gustos = Object.entries(byGusto)
      .map(([gusto, os]) => ({ gusto, visitas: os.length, avg: avg(os.map((o) => o.puntaje_general)) }))
      .sort((a, b) => b.visitas - a.visitas)
      .slice(0, 5);
    const maxVisitasGusto = top5Gustos[0]?.visitas ?? 1;

    // Evolución por mes
    const byMes = groupBy(filteredOcurrencias, (o) => {
      const d = new Date(o.fecha + "T12:00:00");
      return isNaN(d.getTime()) ? "?" : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });
    const evolucion = Object.entries(byMes)
      .filter(([k]) => k !== "?")
      .map(([mes, os]) => ({ mes, visitas: os.length, avg: avg(os.map((o) => o.puntaje_general)) }))
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .slice(-12);

    const maxVisitasMes = Math.max(...evolucion.map((m) => m.visitas), 1);

    return {
      total,
      scoreGlobal,
      tasaVolveria,
      primeraFecha,
      ultimaFecha,
      masVisitada,
      top5Heladerias,
      maxScoreHel,
      top5Gustos,
      maxVisitasGusto,
      evolucion,
      maxVisitasMes,
    };
  }, [filteredOcurrencias]);

  // ── Datos para Gráficos (ChartJS) ──────────────────────────────────────────

  // 1. Gráfico de Evolución de Visitas (Línea)
  const visitasPorMesChartData = useMemo(() => {
    if (!stats || stats.evolucion.length === 0) return null;
    const labels = stats.evolucion.map((m) => {
      const [year, month] = m.mes.split("-");
      return `${MESES[parseInt(month) - 1]} ${year.slice(2)}`;
    });
    const data = stats.evolucion.map((m) => m.visitas);

    return {
      labels,
      datasets: [
        {
          label: "Degustaciones por mes",
          data,
          borderColor: "rgb(30, 41, 59)", // slate-800
          backgroundColor: "rgba(30, 41, 59, 0.04)",
          fill: true,
          tension: 0.25,
          borderWidth: 2,
          pointBackgroundColor: "rgb(30, 41, 59)",
          pointRadius: 4,
        },
      ],
    };
  }, [stats]);

  // 2. Gráfico de Calificaciones por Categoría (Barras)
  const scorePorCategoriaChartData = useMemo(() => {
    const cats: MacroCategoria[] = ["CHOCOLATE", "DULCE DE LECHE", "CREMA", "FRUTA", "AUTOR"];
    const data = cats.map((cat) => {
      const os = filteredOcurrencias.filter((o) => o.macrocategoria === cat);
      return os.length > 0 ? parseFloat(avg(os.map((o) => o.puntaje_general)).toFixed(1)) : 0;
    });

    return {
      labels: cats.map((c) => CAT_LABELS[c]),
      datasets: [
        {
          label: "Calificación Promedio",
          data,
          backgroundColor: "rgba(71, 85, 105, 0.2)", // slate-600
          borderColor: "rgb(71, 85, 105)",
          borderWidth: 1.5,
          borderRadius: 6,
          barPercentage: 0.5,
        },
      ],
    };
  }, [filteredOcurrencias]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Análisis</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Degustaciones registradas e indicadores clave del proyecto.
          </p>
        </div>

        {/* Controles de Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Reset Filtros */}
          {(selectedCategory !== "TODAS" || selectedHeladeriaFilter !== "TODAS") && (
            <button
              onClick={() => {
                setSelectedCategory("TODAS");
                onHeladeriaFilterChange("TODAS");
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Limpiar filtros
            </button>
          )}

          {/* Filtro Heladería */}
          <div className="relative">
            <select
              value={selectedHeladeriaFilter}
              onChange={(e) => onHeladeriaFilterChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer min-w-[160px]"
            >
              <option value="TODAS">Todas las heladerías</option>
              {heladeriasFiltro.map((hel) => (
                <option key={hel} value={hel}>
                  {hel}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Filtro Categoría */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer min-w-[160px]"
            >
              <option value="TODAS">Todas las categorías</option>
              {categoriasFiltro.map((cat) => (
                <option key={cat} value={cat}>
                  {CAT_LABELS[cat] ?? cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {stats ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* KPI cards en 3 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              icon={<Hash className="w-3.5 h-3.5 text-slate-500" />}
              label="Degustaciones"
              value={stats.total}
              sub="registradas en la selección actual"
            />
            <KpiCard
              icon={<Star className="w-3.5 h-3.5 text-slate-500" />}
              label="Puntuación promedio"
              value={stats.scoreGlobal.toFixed(1)}
              sub="sobre 10 puntos históricos"
              accent
            />
            <KpiCard
              icon={<Repeat className="w-3.5 h-3.5 text-slate-500" />}
              label="Tasa de recompra"
              value={`${Math.round(stats.tasaVolveria * 100)}%`}
              sub="volvería a pedir el gusto"
            />
          </div>

          {/* Bloques de Gráficos (ChartJS) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Gráfico 1: Evolución Temporal */}
            <div className="panel p-5 space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" />
                Historial de visitas mensual
              </h3>
              <div className="h-60 relative w-full">
                {visitasPorMesChartData ? (
                  <Line data={visitasPorMesChartData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                    Sin evolución temporal disponible
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico 2: Calificación por Categoría */}
            <div className="panel p-5 space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-slate-600" />
                Calificaciones promedio por categoría
              </h3>
              <div className="h-60 relative w-full">
                <Bar data={scorePorCategoriaChartData} options={barChartOptions} />
              </div>
            </div>

          </div>

          {/* Grillas secundarias de Heladerías y Gustos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Heladerías */}
            <div className="panel p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Puntuación por heladería</h3>
              </div>
              <div className="space-y-3">
                {stats.top5Heladerias.map((h, i) => (
                  <MiniBar
                    key={h.nombre}
                    label={`${i + 1}. ${h.nombre}`}
                    value={h.avg}
                    max={stats.maxScoreHel}
                    sub={`${h.visitas} visita${h.visitas !== 1 ? "s" : ""}`}
                    accent={i === 0}
                  />
                ))}
                {stats.top5Heladerias.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No hay datos suficientes</p>
                )}
              </div>
            </div>

            {/* Gustos más pedidos */}
            <div className="panel p-5 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Gustos más pedidos</h3>
              </div>
              <div className="space-y-3">
                {stats.top5Gustos.map((g, i) => (
                  <MiniBar
                    key={g.gusto}
                    label={`${i + 1}. ${g.gusto}`}
                    value={g.visitas}
                    max={stats.maxVisitasGusto}
                    sub={`score prom. ${g.avg.toFixed(1)}`}
                    accent={i === 0}
                  />
                ))}
                {stats.top5Gustos.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No hay datos suficientes</p>
                )}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="panel p-8 text-center text-slate-500 text-sm">
          No hay degustaciones registradas para el filtro seleccionado.
        </div>
      )}

      {/* Datos Curiosos (Globales) */}
      {globalCuriosities && (
        <div className="panel p-5 space-y-4">
          <h3 className="font-semibold text-slate-900 text-sm">Datos curiosos globales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Categoría favorita</p>
              <p className="text-sm font-semibold text-slate-800">
                {globalCuriosities.catFavorita ? CAT_LABELS[globalCuriosities.catFavorita.cat] : "—"}
              </p>
              <p className="text-xs text-slate-500">
                Promedio de {globalCuriosities.catFavorita?.avg.toFixed(1)} puntos
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Categoría más pedida</p>
              <p className="text-sm font-semibold text-slate-800">
                {globalCuriosities.catMasPedida ? CAT_LABELS[globalCuriosities.catMasPedida.cat] : "—"}
              </p>
              <p className="text-xs text-slate-500">
                {globalCuriosities.catMasPedida?.visitas} degustaciones
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Gusto estrella</p>
              <p className="text-sm font-semibold text-slate-800">
                {globalCuriosities.gustoEstrella?.gusto ?? "—"}
              </p>
              <p className="text-xs text-slate-500">
                {globalCuriosities.gustoEstrella?.visitas} elecciones
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KpisView;
