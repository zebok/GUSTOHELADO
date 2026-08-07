import React, { useMemo, useState } from "react";
import { Heladeria, Ocurrencia, MacroCategoria } from "../../types";
import { Trophy, Star, TrendingUp, Calendar, Repeat, Hash, ChevronDown } from "lucide-react";

interface KpisViewProps {
  heladerias: Heladeria[];
  ocurrencias: Ocurrencia[];
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

export const KpisView: React.FC<KpisViewProps> = ({ ocurrencias = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");

  // Filtro reactivo en el frontend
  const filteredOcurrencias = useMemo(() => {
    if (selectedCategory === "TODAS") return ocurrencias;
    return ocurrencias.filter((o) => o.macrocategoria === selectedCategory);
  }, [ocurrencias, selectedCategory]);

  // Lista de categorías únicas para el filtro
  const categoriasFiltro = useMemo(() => {
    const set = new Set(ocurrencias.map((o) => o.macrocategoria).filter(Boolean));
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

  return (
    <div className="space-y-6">
      
      {/* Header & Filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Análisis</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Degustaciones registradas e indicadores clave del proyecto.
          </p>
        </div>

        {/* Dropdown Filtro Reactivo */}
        <div className="relative shrink-0">
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

      {stats ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* KPI cards en 3 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              icon={<Hash className="w-3.5 h-3.5 text-slate-500" />}
              label="Degustaciones"
              value={stats.total}
              sub="registradas en esta categoría"
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

          {/* Evolución Mensual */}
          <div className="panel p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-900 text-sm">Degustaciones por mes</h3>
            </div>
            <div className="space-y-3">
              {stats.evolucion.map((m) => {
                const [year, month] = m.mes.split("-");
                const label = `${MESES[parseInt(month) - 1]} ${year.slice(2)}`;
                return (
                  <MiniBar
                    key={m.mes}
                    label={label}
                    value={m.visitas}
                    max={stats.maxVisitasMes}
                    sub={`promedio mensual: ${m.avg.toFixed(1)}`}
                  />
                );
              })}
              {stats.evolucion.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Sin registros de fechas</p>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="panel p-8 text-center text-slate-500 text-sm">
          No hay degustaciones registradas bajo esta categoría.
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
