import React, { useMemo } from "react";
import { Heladeria, Ocurrencia, MacroCategoria } from "../../types";
import { Trophy, Star, TrendingUp, Calendar, Repeat, Hash, IceCreamCone } from "lucide-react";

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

const CAT_EMOJI: Partial<Record<MacroCategoria, string>> = {
  CHOCOLATE: "🍫",
  "DULCE DE LECHE": "🍮",
  CREMA: "🍦",
  FRUTA: "🍓",
  AUTOR: "👨‍🍳",
  MISC: "🌀",
};

// ── Sub-componentes de KPI card ───────────────────────────────────────────

const KpiCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}> = ({ icon, label, value, sub, accent }) => (
  <div className={`panel p-5 space-y-2 ${accent ? "border-amber-200 bg-amber-50/30" : ""}`}>
    <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${accent ? "text-amber-700" : "text-slate-500"}`}>
      {icon}
      {label}
    </div>
    <p className={`text-2xl font-bold tracking-tight leading-none ${accent ? "text-amber-900" : "text-slate-900"}`}>
      {value}
    </p>
    {sub && <p className="text-xs text-slate-400 leading-snug">{sub}</p>}
  </div>
);

// ── Mini barra horizontal ─────────────────────────────────────────────────
const MiniBar: React.FC<{ label: string; value: number; max: number; sub?: string; accent?: boolean }> = ({
  label, value, max, sub, accent,
}) => (
  <div className="space-y-1">
    <div className="flex justify-between items-baseline">
      <span className="text-sm text-slate-700 font-medium truncate">{label}</span>
      <span className={`text-sm font-mono font-semibold ml-2 ${accent ? "text-amber-700" : "text-slate-600"}`}>
        {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}
      </span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${accent ? "bg-amber-400" : "bg-slate-400"}`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
    {sub && <p className="text-xs text-slate-400">{sub}</p>}
  </div>
);

// ── Componente principal ──────────────────────────────────────────────────

export const KpisView: React.FC<KpisViewProps> = ({ ocurrencias }) => {
  const stats = useMemo(() => {
    if (ocurrencias.length === 0) return null;

    // Total y score global
    const total = ocurrencias.length;
    const scoreGlobal = avg(ocurrencias.map((o) => o.puntaje_general));
    const tasaVolveria = ocurrencias.filter((o) => o.volveria_a_pedir).length / total;

    // Fechas extremas
    const fechas = ocurrencias.map((o) => o.fecha).filter(Boolean).sort();
    const primeraFecha = fechas[0];
    const ultimaFecha = fechas[fechas.length - 1];

    // Heladería más visitada
    const byHel = groupBy(ocurrencias, (o) => o.heladeria_nombre);
    const helPorVisitas = Object.entries(byHel)
      .map(([nombre, os]) => ({ nombre, visitas: os.length, avg: avg(os.map((o) => o.puntaje_general)) }))
      .sort((a, b) => b.visitas - a.visitas);
    const masVisitada = helPorVisitas[0];

    // Heladería mejor puntuada (mín. 2 visitas para ser representativa)
    const helPorScore = Object.entries(byHel)
      .map(([nombre, os]) => ({ nombre, visitas: os.length, avg: avg(os.map((o) => o.puntaje_general)) }))
      .filter((h) => h.visitas >= 2)
      .sort((a, b) => b.avg - a.avg);
    const mejorPuntuada = helPorScore[0];

    // Top 5 heladerías por score (mín 2 visitas)
    const top5Heladerias = helPorScore.slice(0, 5);
    const maxScoreHel = top5Heladerias[0]?.avg ?? 10;

    // Categoría favorita (más pedida)
    const byCat = groupBy(ocurrencias, (o) => o.macrocategoria);
    const catPorVisitas = Object.entries(byCat)
      .map(([cat, os]) => ({ cat, visitas: os.length, avg: avg(os.map((o) => o.puntaje_general)) }))
      .sort((a, b) => b.visitas - a.visitas);
    const catFavorita = catPorVisitas[0];

    // Categoría mejor puntuada
    const catMejorPuntuada = [...catPorVisitas].sort((a, b) => b.avg - a.avg)[0];
    const maxVisitasCat = catPorVisitas[0]?.visitas ?? 1;

    // Top 5 gustos
    const byGusto = groupBy(ocurrencias, (o) => o.gusto);
    const top5Gustos = Object.entries(byGusto)
      .map(([gusto, os]) => ({ gusto, visitas: os.length, avg: avg(os.map((o) => o.puntaje_general)) }))
      .sort((a, b) => b.visitas - a.visitas)
      .slice(0, 5);
    const maxVisitasGusto = top5Gustos[0]?.visitas ?? 1;

    // Evolución por mes
    const byMes = groupBy(ocurrencias, (o) => {
      const d = new Date(o.fecha + "T12:00:00");
      return isNaN(d.getTime()) ? "?" : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });
    const evolucion = Object.entries(byMes)
      .filter(([k]) => k !== "?")
      .map(([mes, os]) => ({ mes, visitas: os.length, avg: avg(os.map((o) => o.puntaje_general)) }))
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .slice(-12); // últimos 12 meses

    // Mejor mes (por score promedio, mín 2 visitas)
    const mejorMes = evolucion
      .filter((m) => m.visitas >= 2)
      .sort((a, b) => b.avg - a.avg)[0];
    const mejorMesLabel = mejorMes
      ? `${MESES[parseInt(mejorMes.mes.split("-")[1]) - 1]} ${mejorMes.mes.split("-")[0]}`
      : "—";

    const maxVisitasMes = Math.max(...evolucion.map((m) => m.visitas), 1);

    return {
      total, scoreGlobal, tasaVolveria, primeraFecha, ultimaFecha,
      masVisitada, mejorPuntuada, top5Heladerias, maxScoreHel,
      catFavorita, catMejorPuntuada, catPorVisitas, maxVisitasCat,
      top5Gustos, maxVisitasGusto,
      evolucion, mejorMes, mejorMesLabel, maxVisitasMes,
    };
  }, [ocurrencias]);

  if (!stats || ocurrencias.length === 0) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-3 text-center">
        <IceCreamCone className="w-10 h-10 text-slate-200" />
        <p className="text-slate-400 text-sm">Todavía no hay datos suficientes para calcular análisis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Análisis</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {stats.total} degustaciones registradas · desde{" "}
          {new Date(stats.primeraFecha + "T12:00:00").toLocaleDateString("es-AR")} hasta{" "}
          {new Date(stats.ultimaFecha + "T12:00:00").toLocaleDateString("es-AR")}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          icon={<Hash className="w-3.5 h-3.5" />}
          label="Total de catas"
          value={stats.total}
          sub="ocurrencias registradas"
        />
        <KpiCard
          icon={<Star className="w-3.5 h-3.5" />}
          label="Score promedio"
          value={stats.scoreGlobal.toFixed(1)}
          sub="sobre 10 puntos"
          accent
        />
        <KpiCard
          icon={<Repeat className="w-3.5 h-3.5" />}
          label="Volvería a pedir"
          value={`${Math.round(stats.tasaVolveria * 100)}%`}
          sub="de las degustaciones"
        />
        <KpiCard
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="Mejor mes"
          value={stats.mejorMesLabel}
          sub={stats.mejorMes ? `${stats.mejorMes.avg.toFixed(1)} de promedio` : ""}
        />
      </div>

      {/* Heladerías y Categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top heladerías por score */}
        <div className="panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-slate-900 text-sm">Top heladerías</h3>
            <span className="text-xs text-slate-400 ml-1">(≥2 visitas · por score)</span>
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
          </div>
        </div>

        {/* Categorías */}
        <div className="panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <IceCreamCone className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-slate-900 text-sm">Categorías</h3>
            <span className="text-xs text-slate-400 ml-1">(por cantidad de pedidos)</span>
          </div>
          <div className="space-y-3">
            {stats.catPorVisitas.map((c, i) => (
              <MiniBar
                key={c.cat}
                label={`${CAT_EMOJI[c.cat as MacroCategoria] ?? ""} ${c.cat}`}
                value={c.visitas}
                max={stats.maxVisitasCat}
                sub={`score prom. ${c.avg.toFixed(1)}`}
                accent={i === 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gustos y Evolución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top gustos */}
        <div className="panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
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
          </div>
        </div>

        {/* Evolución mensual */}
        <div className="panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-slate-900 text-sm">Visitas por mes</h3>
            <span className="text-xs text-slate-400">(últimos 12 meses)</span>
          </div>
          <div className="space-y-2">
            {stats.evolucion.map((m) => {
              const [year, month] = m.mes.split("-");
              const label = `${MESES[parseInt(month) - 1]} ${year.slice(2)}`;
              return (
                <MiniBar
                  key={m.mes}
                  label={label}
                  value={m.visitas}
                  max={stats.maxVisitasMes}
                  sub={`score ${m.avg.toFixed(1)}`}
                />
              );
            })}
            {stats.evolucion.length === 0 && (
              <p className="text-sm text-slate-400">Sin datos de fechas</p>
            )}
          </div>
        </div>

      </div>

      {/* Datos curiosos */}
      <div className="panel p-5 space-y-3">
        <h3 className="font-semibold text-slate-900 text-sm">Datos curiosos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-0.5">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Heladería más visitada</p>
            <p className="font-medium text-slate-800">{stats.masVisitada?.nombre ?? "—"}</p>
            <p className="text-xs text-slate-400">{stats.masVisitada?.visitas} visitas</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Categoría favorita</p>
            <p className="font-medium text-slate-800">
              {CAT_EMOJI[stats.catFavorita?.cat as MacroCategoria]} {stats.catFavorita?.cat ?? "—"}
            </p>
            <p className="text-xs text-slate-400">{stats.catFavorita?.visitas} degustaciones</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Cat. mejor puntuada</p>
            <p className="font-medium text-slate-800">
              {CAT_EMOJI[stats.catMejorPuntuada?.cat as MacroCategoria]} {stats.catMejorPuntuada?.cat ?? "—"}
            </p>
            <p className="text-xs text-slate-400">score prom. {stats.catMejorPuntuada?.avg.toFixed(1)}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default KpisView;
