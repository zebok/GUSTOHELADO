import React, { useMemo, useState } from "react";
import { Heladeria, Ocurrencia, SubCategoria, Antojo } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import { localeFor } from "../../i18n/translations";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";

interface DatasetViewProps {
  heladerias: Heladeria[];
  ocurrencias: Ocurrencia[];
  generadoEl?: string;
  onOpenQuickLog: (heladeriaId?: number) => void;
}

type OcurrenciaSortKey =
  | "fecha"
  | "heladeria_nombre"
  | "ciudad"
  | "gusto"
  | "macrocategoria"
  | "subcategoria"
  | "disfrutabilidad"
  | "textura_conservacion"
  | "fidelidad_gusto"
  | "experiencia_presentacion"
  | "puntaje_general";

type HelSortKey =
  | "nombre"
  | "ciudad"
  | "visitas"
  | "CHOCOLATE"
  | "DULCE DE LECHE"
  | "CREMA"
  | "FRUTA"
  | "AUTOR";
type SortDir = "asc" | "desc";
type ActiveTable = "ocurrencias" | "heladerias";

const HEL_CATS: Antojo[] = [
  "CHOCOLATE",
  "DULCE DE LECHE",
  "CREMA",
  "FRUTA",
  "AUTOR",
];

const SUBCAT_BADGE: Record<SubCategoria, string> = {
  CLASICO: "bg-stone-100 text-stone-700 border-stone-200",
  SPRINKLES: "bg-amber-50 text-amber-900 border-amber-200/80",
  FUSION: "bg-purple-50 text-purple-900 border-purple-200/80",
  LIGHT: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
};

// ──────────────────────────────────────────────
// Sub-componente: tabla de OCURRENCIAS
// ──────────────────────────────────────────────
const TablaOcurrencias: React.FC<{ ocurrencias: Ocurrencia[] }> = ({
  ocurrencias,
}) => {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [paisFilter, setPaisFilter] = useState("TODOS");
  const [subcatFilter, setSubcatFilter] = useState("TODAS");
  const [minScore, setMinScore] = useState<number>(0);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [volveria, setVolveria] = useState<"todos" | "si" | "no">("todos");
  const [sortKey, setSortKey] = useState<OcurrenciaSortKey>("fecha");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const paises = useMemo(() => {
    const s = new Set(ocurrencias.map((o) => o.pais || "Argentina"));
    return Array.from(s).sort();
  }, [ocurrencias]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ocurrencias.filter((o) => {
      if (paisFilter !== "TODOS" && (o.pais || "Argentina") !== paisFilter)
        return false;
      if (
        subcatFilter !== "TODAS" &&
        (o.subcategoria || "CLASICO") !== subcatFilter
      )
        return false;
      if (minScore > 0 && o.puntaje_general < minScore) return false;
      if (fechaDesde && o.fecha < fechaDesde) return false;
      if (fechaHasta && o.fecha > fechaHasta) return false;
      if (volveria === "si" && !o.volveria_a_pedir) return false;
      if (volveria === "no" && o.volveria_a_pedir) return false;
      if (!q) return true;
      return (
        o.heladeria_nombre.toLowerCase().includes(q) ||
        o.gusto.toLowerCase().includes(q) ||
        o.macrocategoria.toLowerCase().includes(q) ||
        (o.ciudad && o.ciudad.toLowerCase().includes(q)) ||
        (o.pais && o.pais.toLowerCase().includes(q))
      );
    });
  }, [
    ocurrencias,
    search,
    paisFilter,
    subcatFilter,
    minScore,
    fechaDesde,
    fechaHasta,
    volveria,
  ]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === "string" && typeof vb === "string") {
        cmp = va.localeCompare(vb, "es");
      } else if (typeof va === "number" && typeof vb === "number") {
        cmp = va - vb;
      } else if (va == null) cmp = -1;
      else if (vb == null) cmp = 1;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: OcurrenciaSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "fecha" ? "desc" : "asc");
    }
  };

  const SortIcon = ({ col }: { col: OcurrenciaSortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  const thClass =
    "px-3 py-2.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide cursor-pointer select-none hover:text-stone-800 whitespace-nowrap";

  const scoreColor = (score: number) => {
    if (score >= 8.8) return "text-emerald-800 bg-emerald-50 border border-emerald-200/60";
    if (score >= 7.5) return "text-sky-800 bg-sky-50 border border-sky-200/60";
    if (score >= 6.0) return "text-stone-700 bg-stone-100";
    return "text-rose-700 bg-rose-50 border border-rose-200/60";
  };

  const hasFilters =
    search ||
    paisFilter !== "TODOS" ||
    subcatFilter !== "TODAS" ||
    minScore > 0 ||
    fechaDesde ||
    fechaHasta ||
    volveria !== "todos";

  return (
    <div className="space-y-3">
      {/* Filtros */}
      <div className="panel p-3.5 space-y-2.5">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("table.search")}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 bg-white"
            />
          </div>

          <select
            value={paisFilter}
            onChange={(e) => setPaisFilter(e.target.value)}
            className="text-xs border border-stone-200 rounded-xl px-2.5 py-1.5 bg-white text-stone-700 font-medium"
          >
            <option value="TODOS">{t("kpis.allCountries")}</option>
            {paises.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={subcatFilter}
            onChange={(e) => setSubcatFilter(e.target.value)}
            className="text-xs border border-stone-200 rounded-xl px-2.5 py-1.5 bg-white text-stone-700 font-medium"
          >
            <option value="TODAS">{t("kpis.allSubcategories")}</option>
            {(["CLASICO", "SPRINKLES", "FUSION", "LIGHT"] as SubCategoria[]).map(
              (sc) => (
                <option key={sc} value={sc}>
                  {t(`subcat.${sc}`)}
                </option>
              )
            )}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span>{t("table.scoreMin")}</span>
            <input
              type="number"
              min={0}
              max={10}
              step={0.5}
              value={minScore}
              onChange={(e) => setMinScore(parseFloat(e.target.value) || 0)}
              className="w-14 px-2 py-1 text-xs border border-stone-200 rounded-xl text-center font-mono bg-white"
            />
          </div>

          <select
            value={volveria}
            onChange={(e) =>
              setVolveria(e.target.value as "todos" | "si" | "no")
            }
            className="text-xs border border-stone-200 rounded-xl px-2.5 py-1.5 bg-white text-stone-700"
          >
            <option value="todos">{t("table.repeatAll")}</option>
            <option value="si">{t("table.repeatYes")}</option>
            <option value="no">{t("table.repeatNo")}</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
            <span>{t("table.from")}</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="px-2 py-1 text-xs border border-stone-200 rounded-lg font-mono bg-white"
            />
            <span>{t("table.to")}</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="px-2 py-1 text-xs border border-stone-200 rounded-lg font-mono bg-white"
            />
            {hasFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setPaisFilter("TODOS");
                  setSubcatFilter("TODAS");
                  setMinScore(0);
                  setFechaDesde("");
                  setFechaHasta("");
                  setVolveria("todos");
                }}
                className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer ml-1"
              >
                {t("table.clearFilters")}
              </button>
            )}
          </div>

          <span className="text-xs text-stone-400 font-mono">
            {t("table.count", { n: sorted.length, m: ocurrencias.length })}
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto max-h-[68vh] overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-stone-50/95 border-b border-stone-200 sticky top-0 z-10">
              <tr>
                <th className={thClass} onClick={() => toggleSort("fecha")}>
                  <span className="inline-flex items-center gap-1">
                    {t("table.date")} <SortIcon col="fecha" />
                  </span>
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleSort("heladeria_nombre")}
                >
                  <span className="inline-flex items-center gap-1">
                    {t("table.shop")} <SortIcon col="heladeria_nombre" />
                  </span>
                </th>
                <th className={thClass} onClick={() => toggleSort("ciudad")}>
                  <span className="inline-flex items-center gap-1">
                    {t("table.city")} <SortIcon col="ciudad" />
                  </span>
                </th>
                <th className={thClass} onClick={() => toggleSort("gusto")}>
                  <span className="inline-flex items-center gap-1">
                    {t("table.flavor")} <SortIcon col="gusto" />
                  </span>
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleSort("macrocategoria")}
                >
                  <span className="inline-flex items-center gap-1">
                    {t("table.cat")} <SortIcon col="macrocategoria" />
                  </span>
                </th>
                <th
                  className={thClass}
                  onClick={() => toggleSort("subcategoria")}
                >
                  <span className="inline-flex items-center gap-1">
                    {t("table.subcat")} <SortIcon col="subcategoria" />
                  </span>
                </th>
                <th
                  className={`${thClass} text-right`}
                  onClick={() => toggleSort("disfrutabilidad")}
                >
                  <span className="inline-flex items-center gap-1">
                    {t("table.enjoy")} <SortIcon col="disfrutabilidad" />
                  </span>
                </th>
                <th
                  className={`${thClass} text-right`}
                  onClick={() => toggleSort("textura_conservacion")}
                >
                  <span className="inline-flex items-center gap-1">
                    {t("table.texture")} <SortIcon col="textura_conservacion" />
                  </span>
                </th>
                <th
                  className={`${thClass} text-right`}
                  onClick={() => toggleSort("fidelidad_gusto")}
                >
                  <span className="inline-flex items-center gap-1">
                    {t("table.fidelity")} <SortIcon col="fidelidad_gusto" />
                  </span>
                </th>
                <th
                  className={`${thClass} text-right`}
                  onClick={() => toggleSort("experiencia_presentacion")}
                >
                  <span className="inline-flex items-center gap-1">
                    {t("table.experience")}{" "}
                    <SortIcon col="experiencia_presentacion" />
                  </span>
                </th>
                <th
                  className={`${thClass} text-right`}
                  onClick={() => toggleSort("puntaje_general")}
                >
                  <span className="inline-flex items-center gap-1">
                    {t("table.score")} <SortIcon col="puntaje_general" />
                  </span>
                </th>
                <th className={`${thClass} text-center`}>
                  {t("table.repeat")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-10 text-center text-stone-400 text-sm"
                  >
                    {t("table.noRecords")}
                  </td>
                </tr>
              ) : (
                sorted.map((o) => {
                  const sc = (o.subcategoria || "CLASICO") as SubCategoria;
                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-stone-50/70 transition-colors"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-stone-500 whitespace-nowrap">
                        {o.fecha
                          ? new Date(o.fecha + "T00:00:00").toLocaleDateString(
                              localeFor(lang),
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              }
                            )
                          : "—"}
                      </td>
                      <td className="px-3 py-2 font-semibold text-stone-800 whitespace-nowrap">
                        {o.heladeria_nombre}
                      </td>
                      <td className="px-3 py-2 text-xs text-stone-500 whitespace-nowrap">
                        {o.ciudad || "Buenos Aires"}
                        {o.pais && o.pais !== "Argentina" ? ` (${o.pais})` : ""}
                      </td>
                      <td className="px-3 py-2 text-stone-700 font-medium">
                        {o.gusto}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          {t(`catShort.${o.macrocategoria}`) ??
                            o.macrocategoria}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            SUBCAT_BADGE[sc] || SUBCAT_BADGE.CLASICO
                          }`}
                        >
                          {t(`subcatShort.${sc}`)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-stone-700">
                        {o.disfrutabilidad != null
                          ? o.disfrutabilidad.toFixed(1)
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-stone-600">
                        {o.textura_conservacion != null
                          ? o.textura_conservacion.toFixed(1)
                          : o.puntaje_grupo != null
                          ? o.puntaje_grupo.toFixed(1)
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-stone-600">
                        {o.fidelidad_gusto != null
                          ? o.fidelidad_gusto.toFixed(1)
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-stone-600">
                        {o.experiencia_presentacion != null
                          ? o.experiencia_presentacion.toFixed(1)
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <span
                          className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded-md ${scoreColor(
                            o.puntaje_general
                          )}`}
                        >
                          {o.puntaje_general.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-xs">
                        {o.volveria_a_pedir ? (
                          <span className="text-emerald-700 font-bold">✓</span>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Sub-componente: tabla de HELADERÍAS
// ──────────────────────────────────────────────
const TablaHeladerias: React.FC<{
  heladerias: Heladeria[];
  onOpenQuickLog: (heladeriaId: number) => void;
}> = ({ heladerias, onOpenQuickLog }) => {
  const { t, plural } = useLanguage();
  const [search, setSearch] = useState("");
  const [paisFilter, setPaisFilter] = useState("TODOS");
  const [soloActivas, setSoloActivas] = useState(true);
  const [sortKey, setSortKey] = useState<HelSortKey>("visitas");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const paises = useMemo(() => {
    const s = new Set(heladerias.map((h) => h.pais || "Argentina"));
    return Array.from(s).sort();
  }, [heladerias]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return heladerias.filter((h) => {
      if (soloActivas && !h.activa) return false;
      if (paisFilter !== "TODOS" && (h.pais || "Argentina") !== paisFilter)
        return false;
      if (!q) return true;
      return (
        h.nombre.toLowerCase().includes(q) ||
        h.direccion.toLowerCase().includes(q) ||
        (h.ciudad && h.ciudad.toLowerCase().includes(q)) ||
        (h.pais && h.pais.toLowerCase().includes(q))
      );
    });
  }, [heladerias, search, paisFilter, soloActivas]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nombre") {
        cmp = a.nombre.localeCompare(b.nombre, "es");
      } else if (sortKey === "ciudad") {
        cmp = (a.ciudad || "").localeCompare(b.ciudad || "", "es");
      } else if (sortKey === "visitas") {
        cmp = a.visitas - b.visitas;
      } else {
        const sa = a.scorePorCategoria[sortKey] ?? -1;
        const sb = b.scorePorCategoria[sortKey] ?? -1;
        cmp = sa - sb;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: HelSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "nombre" || key === "ciudad" ? "asc" : "desc");
    }
  };

  const SortIcon = ({ col }: { col: HelSortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  const thClass =
    "px-3 py-2.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide cursor-pointer select-none hover:text-stone-800 whitespace-nowrap";

  return (
    <div className="space-y-3">
      <div className="panel p-3.5 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("table.searchShop")}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 bg-white"
          />
        </div>

        <select
          value={paisFilter}
          onChange={(e) => setPaisFilter(e.target.value)}
          className="text-xs border border-stone-200 rounded-xl px-2.5 py-1.5 bg-white text-stone-700 font-medium"
        >
          <option value="TODOS">{t("kpis.allCountries")}</option>
          {paises.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={soloActivas}
            onChange={(e) => setSoloActivas(e.target.checked)}
            className="rounded border-stone-300"
          />
          {t("table.activeOnly")}
        </label>

        <span className="ml-auto text-xs text-stone-400 font-mono">
          {plural("table.shopCount", sorted.length)}
        </span>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto max-h-[68vh] overflow-y-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-stone-50 border-b border-stone-200 sticky top-0 z-10">
              <tr>
                <th className={thClass} onClick={() => toggleSort("nombre")}>
                  <span className="inline-flex items-center gap-1">
                    {t("table.name")} <SortIcon col="nombre" />
                  </span>
                </th>
                <th className={thClass} onClick={() => toggleSort("ciudad")}>
                  <span className="inline-flex items-center gap-1">
                    {t("table.city")} <SortIcon col="ciudad" />
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  {t("table.address")}
                </th>
                <th
                  className={`${thClass} text-right`}
                  onClick={() => toggleSort("visitas")}
                >
                  <span className="inline-flex items-center gap-1">
                    {t("table.visits")} <SortIcon col="visitas" />
                  </span>
                </th>
                {HEL_CATS.map((cat) => (
                  <th
                    key={cat}
                    className={`${thClass} text-right`}
                    onClick={() => toggleSort(cat)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {t(`catShort.${cat}`)} <SortIcon col={cat} />
                    </span>
                  </th>
                ))}
                <th className="px-3 py-2.5 text-right text-xs font-semibold text-stone-500 uppercase">
                  +
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-stone-400 text-sm"
                  >
                    {t("table.noResults")}
                  </td>
                </tr>
              ) : (
                sorted.map((h) => (
                  <tr
                    key={h.id}
                    className="hover:bg-stone-50/70 transition-colors"
                  >
                    <td className="px-3 py-2 font-semibold text-stone-800">
                      {h.nombre}
                      {!h.activa && (
                        <span className="ml-1.5 text-[10px] text-stone-400 font-normal">
                          {t("table.inactive")}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-stone-600 whitespace-nowrap">
                      {h.ciudad || "Buenos Aires"}
                      {h.pais && h.pais !== "Argentina" ? ` · ${h.pais}` : ""}
                    </td>
                    <td className="px-3 py-2 text-stone-500 text-xs">
                      {h.direccion}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-xs font-semibold text-stone-700">
                      {h.visitas}
                    </td>
                    {HEL_CATS.map((cat) => {
                      const s = h.scorePorCategoria[cat];
                      return (
                        <td
                          key={cat}
                          className="px-3 py-2 text-right font-mono text-xs"
                        >
                          {s !== undefined ? (
                            <span className="text-stone-800 font-medium">
                              {s.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-stone-300">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => onOpenQuickLog(h.id)}
                        className="text-xs px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 transition-colors cursor-pointer"
                        title={t("dataset.addRecord")}
                      >
                        +🍦
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Componente principal: DatasetView
// ──────────────────────────────────────────────
export const DatasetView: React.FC<DatasetViewProps> = ({
  heladerias,
  ocurrencias = [],
  generadoEl,
  onOpenQuickLog,
}) => {
  const { t, lang } = useLanguage();
  const [activeTable, setActiveTable] = useState<ActiveTable>("ocurrencias");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            {t("dataset.title")}
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">
            {t("dataset.subtitle")}
            {generadoEl && (
              <span className="text-stone-400">
                {" "}
                ·{" "}
                {t("dataset.updated", {
                  fecha: new Date(generadoEl).toLocaleDateString(
                    localeFor(lang)
                  ),
                })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => onOpenQuickLog()}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("dataset.addRecord")}
        </button>
      </div>

      {/* Toggle de tabla */}
      <div className="flex gap-1 p-1 bg-stone-200/70 rounded-xl w-fit">
        {(["ocurrencias", "heladerias"] as ActiveTable[]).map((tableId) => (
          <button
            key={tableId}
            onClick={() => setActiveTable(tableId)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTable === tableId
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {tableId === "ocurrencias"
              ? t("dataset.occurrences", { n: ocurrencias.length })
              : t("dataset.shops", { n: heladerias.length })}
          </button>
        ))}
      </div>

      {activeTable === "ocurrencias" ? (
        <TablaOcurrencias ocurrencias={ocurrencias} />
      ) : (
        <TablaHeladerias
          heladerias={heladerias}
          onOpenQuickLog={(id) => onOpenQuickLog(id)}
        />
      )}
    </div>
  );
};

export default DatasetView;
