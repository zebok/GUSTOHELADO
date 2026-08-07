import React, { useMemo, useState } from "react";
import { Heladeria, Ocurrencia, MacroCategoria } from "../../types";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

interface DatasetViewProps {
  heladerias: Heladeria[];
  ocurrencias: Ocurrencia[];
  generadoEl?: string;
}

type OcurrenciaSortKey =
  | "fecha"
  | "heladeria_nombre"
  | "gusto"
  | "macrocategoria"
  | "fidelidad_gusto"
  | "puntaje_grupo"
  | "disfrutabilidad"
  | "puntaje_general";

type HelSortKey = "nombre" | "visitas" | "CHOCOLATE" | "DULCE DE LECHE" | "CREMA" | "FRUTA" | "AUTOR";
type SortDir = "asc" | "desc";
type ActiveTable = "ocurrencias" | "heladerias";

const CAT_LABEL: Record<MacroCategoria, string> = {
  CHOCOLATE: "Chocolate",
  "DULCE DE LECHE": "DDL",
  CREMA: "Crema",
  FRUTA: "Fruta",
  AUTOR: "Autor",
  MISC: "Misc",
};

const HEL_CATS: HelSortKey[] = ["CHOCOLATE", "DULCE DE LECHE", "CREMA", "FRUTA", "AUTOR"];

// ──────────────────────────────────────────────
// Sub-componente: tabla de OCURRENCIAS
// ──────────────────────────────────────────────
const TablaOcurrencias: React.FC<{ ocurrencias: Ocurrencia[] }> = ({ ocurrencias }) => {
  const [search, setSearch]         = useState("");
  const [minScore, setMinScore]     = useState<number>(0);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [volveria, setVolveria]     = useState<"todos" | "si" | "no">("todos");
  const [sortKey, setSortKey]       = useState<OcurrenciaSortKey>("fecha");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ocurrencias.filter((o) => {
      if (minScore > 0 && o.puntaje_general < minScore) return false;
      if (fechaDesde && o.fecha < fechaDesde) return false;
      if (fechaHasta && o.fecha > fechaHasta) return false;
      if (volveria === "si" && !o.volveria_a_pedir) return false;
      if (volveria === "no" && o.volveria_a_pedir) return false;
      if (!q) return true;
      return (
        o.heladeria_nombre.toLowerCase().includes(q) ||
        o.gusto.toLowerCase().includes(q) ||
        o.macrocategoria.toLowerCase().includes(q)
      );
    });
  }, [ocurrencias, search, minScore, fechaDesde, fechaHasta, volveria]);

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
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const thClass =
    "px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700 whitespace-nowrap";

  const scoreColor = (score: number) => {
    if (score >= 9) return "text-emerald-700 bg-emerald-50";
    if (score >= 7.5) return "text-blue-700 bg-blue-50";
    if (score >= 6) return "text-slate-700 bg-slate-100";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="panel p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por heladería, gusto o categoría..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap">
            <span className="font-medium">Score ≥</span>
            <input
              type="number"
              min={0}
              max={10}
              step={0.5}
              value={minScore || ""}
              onChange={(e) => setMinScore(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-16 border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
            />
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap">
            <span className="font-medium">Desde</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
            />
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap">
            <span className="font-medium">Hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
            />
          </label>

          <select
            value={volveria}
            onChange={(e) => setVolveria(e.target.value as "todos" | "si" | "no")}
            className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
          >
            <option value="todos">Volvería: todos</option>
            <option value="si">Volvería: sí</option>
            <option value="no">Volvería: no</option>
          </select>

          {(search || minScore > 0 || fechaDesde || fechaHasta || volveria !== "todos") && (
            <button
              onClick={() => { setSearch(""); setMinScore(0); setFechaDesde(""); setFechaHasta(""); setVolveria("todos"); }}
              className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}

          <span className="ml-auto text-xs text-slate-400 whitespace-nowrap">
            {filtered.length} de {ocurrencias.length} registros
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={thClass} onClick={() => toggleSort("fecha")}>
                  <span className="inline-flex items-center gap-1">Fecha <SortIcon col="fecha" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort("heladeria_nombre")}>
                  <span className="inline-flex items-center gap-1">Heladería <SortIcon col="heladeria_nombre" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort("gusto")}>
                  <span className="inline-flex items-center gap-1">Gusto <SortIcon col="gusto" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort("macrocategoria")}>
                  <span className="inline-flex items-center gap-1">Cat. <SortIcon col="macrocategoria" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort("fidelidad_gusto")}>
                  <span className="inline-flex items-center gap-1">Fid. <SortIcon col="fidelidad_gusto" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort("puntaje_grupo")}>
                  <span className="inline-flex items-center gap-1">Grp. <SortIcon col="puntaje_grupo" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort("disfrutabilidad")}>
                  <span className="inline-flex items-center gap-1">Disf. <SortIcon col="disfrutabilidad" /></span>
                </th>
                <th className={thClass} onClick={() => toggleSort("puntaje_general")}>
                  <span className="inline-flex items-center gap-1">Score <SortIcon col="puntaje_general" /></span>
                </th>
                <th className="px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Volvería</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No hay registros con esos filtros
                  </td>
                </tr>
              ) : (
                sorted.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-mono text-xs text-slate-500 whitespace-nowrap">
                      {o.fecha ? new Date(o.fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—"}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap max-w-[180px] truncate">
                      {o.heladeria_nombre}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 max-w-[160px] truncate">{o.gusto}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {CAT_LABEL[o.macrocategoria] ?? o.macrocategoria}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-center text-slate-500 text-xs">
                      {o.fidelidad_gusto != null ? o.fidelidad_gusto.toFixed(1) : "—"}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-center text-slate-500 text-xs">
                      {o.puntaje_grupo != null ? o.puntaje_grupo.toFixed(1) : "—"}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-center text-slate-500 text-xs">
                      {o.disfrutabilidad != null ? o.disfrutabilidad.toFixed(1) : "—"}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${scoreColor(o.puntaje_general)}`}>
                        {o.puntaje_general.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-400 text-sm">
                      {o.volveria_a_pedir ? "✓" : "✗"}
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
// Sub-componente: tabla de HELADERÍAS
// ──────────────────────────────────────────────
const TablaHeladerias: React.FC<{ heladerias: Heladeria[] }> = ({ heladerias }) => {
  const [soloActivas, setSoloActivas] = useState(true);
  const [search, setSearch]           = useState("");
  const [sortKey, setSortKey]         = useState<HelSortKey>("nombre");
  const [sortDir, setSortDir]         = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return heladerias.filter((h) => {
      if (soloActivas && !h.activa) return false;
      if (!q) return true;
      return h.nombre.toLowerCase().includes(q) || h.direccion.toLowerCase().includes(q);
    });
  }, [heladerias, search, soloActivas]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nombre") {
        cmp = a.nombre.localeCompare(b.nombre, "es");
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
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir(key === "nombre" ? "asc" : "desc"); }
  };

  const SortIcon = ({ col }: { col: HelSortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const thClass = "px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700 whitespace-nowrap";

  return (
    <div className="space-y-4">
      <div className="panel p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o dirección..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer whitespace-nowrap px-1">
          <input
            type="checkbox"
            checked={soloActivas}
            onChange={(e) => setSoloActivas(e.target.checked)}
            className="rounded border-slate-300"
          />
          Solo activas
        </label>
        <span className="text-xs text-slate-400 self-center whitespace-nowrap">{filtered.length} heladerías</span>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={thClass} onClick={() => toggleSort("nombre")}>
                  <span className="inline-flex items-center gap-1">Nombre <SortIcon col="nombre" /></span>
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Dirección</th>
                <th className={thClass} onClick={() => toggleSort("visitas")}>
                  <span className="inline-flex items-center gap-1">Visitas <SortIcon col="visitas" /></span>
                </th>
                {HEL_CATS.map((cat) => (
                  <th key={cat} className={thClass} onClick={() => toggleSort(cat)}>
                    <span className="inline-flex items-center gap-1">
                      {CAT_LABEL[cat as MacroCategoria]} <SortIcon col={cat} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={3 + HEL_CATS.length} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No hay resultados
                  </td>
                </tr>
              ) : (
                sorted.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                      {h.nombre}
                      {!h.activa && <span className="ml-1.5 text-[10px] text-slate-400">(inactiva)</span>}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 max-w-[200px] truncate">{h.direccion}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-700 text-center">{h.visitas}</td>
                    {HEL_CATS.map((cat) => {
                      const score = h.scorePorCategoria[cat as MacroCategoria];
                      return (
                        <td key={cat} className="px-3 py-2.5 font-mono text-slate-600 text-center text-xs">
                          {score !== undefined ? score.toFixed(1) : "—"}
                        </td>
                      );
                    })}
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
}) => {
  const [activeTable, setActiveTable] = useState<ActiveTable>("ocurrencias");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bitácora</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Los datos reales del Google Sheets, directamente.
            {generadoEl && (
              <span className="text-slate-400">
                {" "}· actualizado {new Date(generadoEl).toLocaleDateString("es-AR")}
              </span>
            )}
          </p>
        </div>
        <a
          href="https://forms.gle/sqGfbGcy4PYt1JvSA"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
        >
          Agregar registro <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Toggle de tabla */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {(["ocurrencias", "heladerias"] as ActiveTable[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTable(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTable === t
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "ocurrencias"
              ? `Ocurrencias (${ocurrencias.length})`
              : `Heladerías (${heladerias.length})`}
          </button>
        ))}
      </div>

      {activeTable === "ocurrencias" ? (
        <TablaOcurrencias ocurrencias={ocurrencias} />
      ) : (
        <TablaHeladerias heladerias={heladerias} />
      )}
    </div>
  );
};

export default DatasetView;
