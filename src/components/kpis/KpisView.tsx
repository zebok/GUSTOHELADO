import React, { useMemo, useState } from "react";
import {
  Heladeria,
  Ocurrencia,
  MacroCategoria,
  SubCategoria,
} from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  Repeat,
  Hash,
  ChevronDown,
  RefreshCw,
  Sliders,
  Layers,
} from "lucide-react";
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

const groupBy = <T,>(arr: T[], key: (item: T) => string) =>
  arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

const avg = (nums: number[]) =>
  nums.length === 0 ? 0 : nums.reduce((a, b) => a + b, 0) / nums.length;

const KpiCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}> = ({ icon, label, value, sub, accent }) => (
  <div
    className={`panel p-5 space-y-2 ${
      accent ? "border-amber-300/80 bg-amber-50/40" : ""
    }`}
  >
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
      {icon}
      {label}
    </div>
    <p className="text-2xl font-bold tracking-tight leading-none text-stone-900 font-mono">
      {value}
    </p>
    {sub && <p className="text-xs text-stone-500 leading-snug">{sub}</p>}
  </div>
);

const MiniBar: React.FC<{
  label: string;
  value: number;
  max: number;
  sub?: string;
  accent?: boolean;
}> = ({ label, value, max, sub, accent }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-baseline">
      <span className="text-sm text-stone-700 font-medium truncate">
        {label}
      </span>
      <span
        className={`text-sm font-mono font-semibold ml-2 ${
          accent ? "text-stone-900" : "text-stone-600"
        }`}
      >
        {typeof value === "number" && value % 1 !== 0
          ? value.toFixed(1)
          : value}
      </span>
    </div>
    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${
          accent ? "bg-stone-900" : "bg-stone-400"
        }`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
    {sub && <p className="text-xs text-stone-400">{sub}</p>}
  </div>
);

export const KpisView: React.FC<KpisViewProps> = ({
  ocurrencias = [],
  selectedHeladeriaFilter,
  onHeladeriaFilterChange,
}) => {
  const { t, plural, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
  const [selectedSubcat, setSelectedSubcat] = useState<string>("TODAS");
  const [selectedCountry, setSelectedCountry] = useState<string>("TODOS");

  const catLabel = (cat: MacroCategoria) => t(`cat.${cat}`);
  const subcatLabel = (sc: SubCategoria) => t(`subcat.${sc}`);

  const filteredOcurrencias = useMemo(() => {
    return ocurrencias.filter((o) => {
      const matchCat =
        selectedCategory === "TODAS" || o.macrocategoria === selectedCategory;
      const matchSub =
        selectedSubcat === "TODAS" ||
        (o.subcategoria || "CLASICO") === selectedSubcat;
      const matchCountry =
        selectedCountry === "TODOS" ||
        (o.pais || "Argentina") === selectedCountry;
      const matchHel =
        selectedHeladeriaFilter === "TODAS" ||
        o.heladeria_nombre === selectedHeladeriaFilter;
      return matchCat && matchSub && matchCountry && matchHel;
    });
  }, [
    ocurrencias,
    selectedCategory,
    selectedSubcat,
    selectedCountry,
    selectedHeladeriaFilter,
  ]);

  const categoriasFiltro = useMemo(() => {
    const set = new Set(ocurrencias.map((o) => o.macrocategoria).filter(Boolean));
    return Array.from(set).sort();
  }, [ocurrencias]);

  const paisesFiltro = useMemo(() => {
    const set = new Set(ocurrencias.map((o) => o.pais || "Argentina"));
    return Array.from(set).sort();
  }, [ocurrencias]);

  const heladeriasFiltro = useMemo(() => {
    const pool =
      selectedCountry === "TODOS"
        ? ocurrencias
        : ocurrencias.filter((o) => (o.pais || "Argentina") === selectedCountry);
    const set = new Set(pool.map((o) => o.heladeria_nombre).filter(Boolean));
    return Array.from(set).sort();
  }, [ocurrencias, selectedCountry]);

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

  const stats = useMemo(() => {
    if (filteredOcurrencias.length === 0) return null;

    const total = filteredOcurrencias.length;
    const scoreGlobal = avg(filteredOcurrencias.map((o) => o.puntaje_general));
    const tasaVolveria =
      filteredOcurrencias.filter((o) => o.volveria_a_pedir).length / total;

    // Promedio de las 4 métricas individuales
    const avgDisf = avg(
      filteredOcurrencias
        .map((o) => o.disfrutabilidad)
        .filter((v): v is number => v != null)
    );
    const avgText = avg(
      filteredOcurrencias
        .map((o) => o.textura_conservacion ?? o.puntaje_grupo)
        .filter((v): v is number => v != null)
    );
    const avgFid = avg(
      filteredOcurrencias
        .map((o) => o.fidelidad_gusto)
        .filter((v): v is number => v != null)
    );
    const avgExp = avg(
      filteredOcurrencias
        .map((o) => o.experiencia_presentacion)
        .filter((v): v is number => v != null)
    );

    // Desglose por Subcategoría
    const subcatStats = (
      ["FUSION", "SPRINKLES", "CLASICO", "LIGHT"] as SubCategoria[]
    ).map((sc) => {
      const os = filteredOcurrencias.filter(
        (o) => (o.subcategoria || "CLASICO") === sc
      );
      return {
        sc,
        count: os.length,
        avg: os.length > 0 ? avg(os.map((o) => o.puntaje_general)) : 0,
      };
    });

    const byHel = groupBy(filteredOcurrencias, (o) => o.heladeria_nombre);
    const helPorScoreBase = Object.entries(byHel).map(([nombre, os]) => ({
      nombre,
      visitas: os.length,
      avg: avg(os.map((o) => o.puntaje_general)),
    }));

    const tieneMultiplesVisitas =
      helPorScoreBase.filter((h) => h.visitas >= 3).length >= 5;
    const helPorScore = helPorScoreBase
      .filter((h) => !tieneMultiplesVisitas || h.visitas >= 3)
      .sort((a, b) => b.avg - a.avg);

    const top5Heladerias = helPorScore.slice(0, 6);
    const maxScoreHel = top5Heladerias[0]?.avg ?? 10;

    // Top gustos más pedidos
    const byGusto = groupBy(filteredOcurrencias, (o) => o.gusto);
    const top5Gustos = Object.entries(byGusto)
      .map(([gusto, os]) => ({
        gusto,
        visitas: os.length,
        avg: avg(os.map((o) => o.puntaje_general)),
      }))
      .sort((a, b) => b.visitas - a.visitas)
      .slice(0, 6);
    const maxVisitasGusto = top5Gustos[0]?.visitas ?? 1;

    // Evolución anual (2010–2026)
    const byYear = groupBy(filteredOcurrencias, (o) =>
      o.fecha ? o.fecha.slice(0, 4) : "?"
    );
    const evolucionAnual = Object.entries(byYear)
      .filter(([k]) => k !== "?" && k.length === 4)
      .map(([year, os]) => ({
        year,
        visitas: os.length,
        avg: avg(os.map((o) => o.puntaje_general)),
      }))
      .sort((a, b) => a.year.localeCompare(b.year));

    return {
      total,
      scoreGlobal,
      tasaVolveria,
      avgDisf,
      avgText,
      avgFid,
      avgExp,
      subcatStats,
      top5Heladerias,
      maxScoreHel,
      top5Gustos,
      maxVisitasGusto,
      evolucionAnual,
    };
  }, [filteredOcurrencias]);

  // Gráfico 1: Evolución Histórica por Año (2010–2026)
  const visitasPorAnioChartData = useMemo(() => {
    if (!stats || stats.evolucionAnual.length === 0) return null;
    const labels = stats.evolucionAnual.map((y) => y.year);
    const data = stats.evolucionAnual.map((y) => y.visitas);

    return {
      labels,
      datasets: [
        {
          label: t("kpis.chart.tastingsPerMonth"),
          data,
          borderColor: "rgb(28, 25, 23)",
          backgroundColor: "rgba(217, 119, 6, 0.10)",
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: "rgb(28, 25, 23)",
          pointRadius: 3.5,
        },
      ],
    };
  }, [stats, t]);

  // Gráfico 2: Calificaciones por Categoría
  const scorePorCategoriaChartData = useMemo(() => {
    const cats: MacroCategoria[] = [
      "CHOCOLATE",
      "DULCE DE LECHE",
      "CREMA",
      "FRUTA",
      "AUTOR",
    ];
    const data = cats.map((cat) => {
      const os = filteredOcurrencias.filter((o) => o.macrocategoria === cat);
      return os.length > 0
        ? parseFloat(avg(os.map((o) => o.puntaje_general)).toFixed(1))
        : 0;
    });

    return {
      labels: cats.map((c) => catLabel(c)),
      datasets: [
        {
          label: t("kpis.chart.avgRating"),
          data,
          backgroundColor: "rgba(120, 113, 108, 0.22)",
          borderColor: "rgb(41, 37, 36)",
          borderWidth: 1.5,
          borderRadius: 8,
          barPercentage: 0.55,
        },
      ],
    };
  }, [filteredOcurrencias, t]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: { stepSize: 2 },
      },
    },
  };

  const hasFilters =
    selectedCategory !== "TODAS" ||
    selectedSubcat !== "TODAS" ||
    selectedCountry !== "TODOS" ||
    selectedHeladeriaFilter !== "TODAS";

  return (
    <div className="space-y-6">
      {/* Header & Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">{t("kpis.title")}</h2>
          <p className="text-sm text-stone-500 mt-0.5">{t("kpis.subtitle")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {hasFilters && (
            <button
              onClick={() => {
                setSelectedCategory("TODAS");
                setSelectedSubcat("TODAS");
                setSelectedCountry("TODOS");
                onHeladeriaFilterChange("TODAS");
              }}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t("kpis.clearFilters")}
            </button>
          )}

          {/* Filtro País */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                onHeladeriaFilterChange("TODAS");
              }}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium border border-stone-200 rounded-xl bg-white focus:outline-none cursor-pointer"
            >
              <option value="TODOS">{t("kpis.allCountries")}</option>
              {paisesFiltro.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>

          {/* Filtro Heladería */}
          <div className="relative">
            <select
              value={selectedHeladeriaFilter}
              onChange={(e) => onHeladeriaFilterChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium border border-stone-200 rounded-xl bg-white focus:outline-none cursor-pointer max-w-[200px]"
            >
              <option value="TODAS">{t("kpis.allShops")}</option>
              {heladeriasFiltro.map((hel) => (
                <option key={hel} value={hel}>
                  {hel}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>

          {/* Filtro Categoría */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium border border-stone-200 rounded-xl bg-white focus:outline-none cursor-pointer"
            >
              <option value="TODAS">{t("kpis.allCategories")}</option>
              {categoriasFiltro.map((cat) => (
                <option key={cat} value={cat}>
                  {catLabel(cat as MacroCategoria) ?? cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>

          {/* Filtro Subcategoría */}
          <div className="relative">
            <select
              value={selectedSubcat}
              onChange={(e) => setSelectedSubcat(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium border border-stone-200 rounded-xl bg-white focus:outline-none cursor-pointer"
            >
              <option value="TODAS">{t("kpis.allSubcategories")}</option>
              {(["CLASICO", "SPRINKLES", "FUSION", "LIGHT"] as SubCategoria[]).map(
                (sc) => (
                  <option key={sc} value={sc}>
                    {subcatLabel(sc)}
                  </option>
                )
              )}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {stats ? (
        <div className="space-y-6 animate-fade-in">
          {/* 3 KPIs Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiCard
              icon={<Hash className="w-3.5 h-3.5 text-stone-500" />}
              label={t("kpis.tastings")}
              value={stats.total}
              sub={t("kpis.tastingsSub")}
            />
            <KpiCard
              icon={<Star className="w-3.5 h-3.5 text-amber-700" />}
              label={t("kpis.avgScore")}
              value={stats.scoreGlobal.toFixed(1)}
              sub={t("kpis.avgScoreSub")}
              accent
            />
            <KpiCard
              icon={<Repeat className="w-3.5 h-3.5 text-stone-500" />}
              label={t("kpis.repurchase")}
              value={`${Math.round(stats.tasaVolveria * 100)}%`}
              sub={t("kpis.repurchaseSub")}
            />
          </div>

          {/* Desglose de las 4 Métricas + Subcategorías */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="panel p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-stone-600" />
                  {t("kpis.metricsBreakdown")}
                </h3>
                <span className="text-[11px] font-mono text-stone-400">
                  0.0 – 10.0
                </span>
              </div>
              <div className="space-y-3">
                <MiniBar
                  label={
                    lang === "es"
                      ? "Disfrutabilidad (Peso 40%)"
                      : "Enjoyability (Weight 40%)"
                  }
                  value={stats.avgDisf}
                  max={10}
                  sub={
                    lang === "es"
                      ? "Qué tanto me gustó subjetivamente"
                      : "Pure subjective enjoyment"
                  }
                  accent
                />
                <MiniBar
                  label={
                    lang === "es"
                      ? "Textura / Anticongelante (Peso 25%)"
                      : "Texture / Thermal Preservation (Weight 25%)"
                  }
                  value={stats.avgText}
                  max={10}
                  sub={
                    lang === "es"
                      ? "Cremosidad, reactividad al derretirse y ausencia de escarcha"
                      : "Creaminess, melt reactivity & zero ice crystals"
                  }
                />
                <MiniBar
                  label={
                    lang === "es"
                      ? "Fidelidad al Gusto (Peso 20%)"
                      : "Flavor Fidelity (Weight 20%)"
                  }
                  value={stats.avgFid}
                  max={10}
                  sub={
                    lang === "es"
                      ? "Qué tanto sabe realmente a lo que dice el nombre"
                      : "How true it tastes to what it promises"
                  }
                />
                <MiniBar
                  label={
                    lang === "es"
                      ? "Experiencia y Presentación (Peso 15%)"
                      : "Experience & Presentation (Weight 15%)"
                  }
                  value={stats.avgExp}
                  max={10}
                  sub={
                    lang === "es"
                      ? "Cucurucho, vasito, pote térmico vs. telgopor y exhibición"
                      : "Cone quality, cup scoops, thermal tub & display"
                  }
                />
              </div>
            </div>

            <div className="panel p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-stone-600" />
                  {t("kpis.subcatBreakdown")}
                </h3>
                <span className="text-[11px] font-mono text-stone-400">
                  {stats.total} total
                </span>
              </div>
              <div className="space-y-3">
                {stats.subcatStats.map((item, idx) => (
                  <MiniBar
                    key={item.sc}
                    label={`${subcatLabel(item.sc)} (${Math.round(
                      (item.count / Math.max(stats.total, 1)) * 100
                    )}%)`}
                    value={item.count}
                    max={Math.max(...stats.subcatStats.map((x) => x.count), 1)}
                    sub={`${t("kpis.avgScoreShort", {
                      n: item.avg.toFixed(1),
                    })} pts`}
                    accent={idx === 0}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Gráficos de Evolución y Categorías */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="panel p-5 space-y-3">
              <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-stone-600" />
                {t("kpis.monthlyHistory")} (2010–2026)
              </h3>
              <div className="h-60 relative w-full">
                {visitasPorAnioChartData ? (
                  <Line data={visitasPorAnioChartData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-stone-400 text-xs">
                    {t("kpis.noTemporal")}
                  </div>
                )}
              </div>
            </div>

            <div className="panel p-5 space-y-3">
              <h3 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-stone-600" />
                {t("kpis.avgByCategory")}
              </h3>
              <div className="h-60 relative w-full">
                <Bar
                  data={scorePorCategoriaChartData}
                  options={barChartOptions}
                />
              </div>
            </div>
          </div>

          {/* Top Heladerías y Top Gustos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="panel p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-stone-600" />
                <h3 className="font-semibold text-stone-900 text-sm">
                  {t("kpis.scoreByShop")}
                </h3>
              </div>
              <div className="space-y-3">
                {stats.top5Heladerias.map((h, i) => (
                  <MiniBar
                    key={h.nombre}
                    label={`${i + 1}. ${h.nombre}`}
                    value={h.avg}
                    max={stats.maxScoreHel}
                    sub={plural("kpis.visits", h.visitas)}
                    accent={i === 0}
                  />
                ))}
                {stats.top5Heladerias.length === 0 && (
                  <p className="text-sm text-stone-400 text-center py-4">
                    {t("kpis.noData")}
                  </p>
                )}
              </div>
            </div>

            <div className="panel p-5 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-stone-600" />
                <h3 className="font-semibold text-stone-900 text-sm">
                  {t("kpis.mostOrdered")}
                </h3>
              </div>
              <div className="space-y-3">
                {stats.top5Gustos.map((g, i) => (
                  <MiniBar
                    key={g.gusto}
                    label={`${i + 1}. ${g.gusto}`}
                    value={g.visitas}
                    max={stats.maxVisitasGusto}
                    sub={t("kpis.avgScoreShort", { n: g.avg.toFixed(1) })}
                    accent={i === 0}
                  />
                ))}
                {stats.top5Gustos.length === 0 && (
                  <p className="text-sm text-stone-400 text-center py-4">
                    {t("kpis.noData")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel p-8 text-center text-stone-500 text-sm">
          {t("kpis.noTastings")}
        </div>
      )}

      {/* ADN de mi paladar (Global) */}
      {globalCuriosities && (
        <div className="panel p-5 space-y-4">
          <h3 className="font-semibold text-stone-900 text-sm">
            {t("kpis.curiosities")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-stone-400 uppercase tracking-wide font-semibold">
                {t("kpis.favCategory")}
              </p>
              <p className="text-sm font-semibold text-stone-800">
                {globalCuriosities.catFavorita
                  ? catLabel(globalCuriosities.catFavorita.cat)
                  : "—"}
              </p>
              <p className="text-xs text-stone-500">
                {t("kpis.favCategorySub", {
                  n: globalCuriosities.catFavorita?.avg.toFixed(1),
                })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-stone-400 uppercase tracking-wide font-semibold">
                {t("kpis.mostOrderedCat")}
              </p>
              <p className="text-sm font-semibold text-stone-800">
                {globalCuriosities.catMasPedida
                  ? catLabel(globalCuriosities.catMasPedida.cat)
                  : "—"}
              </p>
              <p className="text-xs text-stone-500">
                {plural(
                  "kpis.degustaciones",
                  globalCuriosities.catMasPedida?.visitas ?? 0
                )}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-stone-400 uppercase tracking-wide font-semibold">
                {t("kpis.starFlavor")}
              </p>
              <p className="text-sm font-semibold text-stone-800">
                {globalCuriosities.gustoEstrella?.gusto ?? "—"}
              </p>
              <p className="text-xs text-stone-500">
                {plural(
                  "kpis.elecciones",
                  globalCuriosities.gustoEstrella?.visitas ?? 0
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KpisView;
