import React, { useMemo, useState } from "react";
import { Heladeria, MacroCategoria } from "../../types";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from "lucide-react";

interface DatasetViewProps {
  heladerias: Heladeria[];
  generadoEl?: string;
}

type SortKey =
  | "nombre"
  | "barrio"
  | "visitas"
  | "CHOCOLATE"
  | "DULCE DE LECHE"
  | "CREMA"
  | "FRUTA"
  | "AUTOR";

type SortDir = "asc" | "desc";

const CATEGORIAS = [
  "CHOCOLATE",
  "DULCE DE LECHE",
  "CREMA",
  "FRUTA",
  "AUTOR",
] as const satisfies readonly SortKey[];

const CAT_LABEL: Record<MacroCategoria, string> = {
  CHOCOLATE: "Choc.",
  "DULCE DE LECHE": "DDL",
  CREMA: "Crema",
  FRUTA: "Fruta",
  AUTOR: "Autor",
  MISC: "Misc",
};

export const DatasetView: React.FC<DatasetViewProps> = ({
  heladerias,
  generadoEl,
}) => {
  const [search, setSearch] = useState("");
  const [barrio, setBarrio] = useState("");
  const [soloActivas, setSoloActivas] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("nombre");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const barrios = useMemo(() => {
    const set = new Set(heladerias.map((h) => h.barrio).filter(Boolean));
    return Array.from(set).sort();
  }, [heladerias]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return heladerias.filter((h) => {
      if (soloActivas && !h.activa) return false;
      if (barrio && h.barrio !== barrio) return false;
      if (!q) return true;
      return (
        h.nombre.toLowerCase().includes(q) ||
        h.direccion.toLowerCase().includes(q) ||
        h.barrio.toLowerCase().includes(q)
      );
    });
  }, [heladerias, search, barrio, soloActivas]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nombre") {
        cmp = a.nombre.localeCompare(b.nombre, "es");
      } else if (sortKey === "barrio") {
        cmp = a.barrio.localeCompare(b.barrio, "es");
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

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "nombre" || key === "barrio" ? "asc" : "desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  const thClass =
    "px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700 whitespace-nowrap";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Dataset</h2>
          <p className="text-sm text-slate-500">
            {sorted.length} de {heladerias.length} heladerías
            {generadoEl && (
              <span className="text-slate-400">
                {" "}
                · actualizado{" "}
                {new Date(generadoEl).toLocaleDateString("es-AR")}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="panel p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, dirección o barrio..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
          />
        </div>

        <div className="relative">
          <select
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer min-w-[140px]"
          >
            <option value="">Todos los barrios</option>
            {barrios.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
      </div>

      {/* Tabla */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={thClass} onClick={() => toggleSort("nombre")}>
                  <span className="inline-flex items-center gap-1">
                    Nombre <SortIcon col="nombre" />
                  </span>
                </th>
                <th className={thClass} onClick={() => toggleSort("barrio")}>
                  <span className="inline-flex items-center gap-1">
                    Barrio <SortIcon col="barrio" />
                  </span>
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Dirección
                </th>
                <th className={thClass} onClick={() => toggleSort("visitas")}>
                  <span className="inline-flex items-center gap-1">
                    Visitas <SortIcon col="visitas" />
                  </span>
                </th>
                {CATEGORIAS.map((cat) => (
                  <th
                    key={cat}
                    className={thClass}
                    onClick={() => toggleSort(cat)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {CAT_LABEL[cat]} <SortIcon col={cat} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={4 + CATEGORIAS.length}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No hay resultados con esos filtros
                  </td>
                </tr>
              ) : (
                sorted.map((h) => (
                  <tr
                    key={h.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                      {h.nombre}
                      {!h.activa && (
                        <span className="ml-1.5 text-[10px] text-slate-400 font-normal">
                          (inactiva)
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                      {h.barrio}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 max-w-[200px] truncate">
                      {h.direccion}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-700">
                      {h.visitas}
                    </td>
                    {CATEGORIAS.map((cat) => {
                      const score = h.scorePorCategoria[cat];
                      return (
                        <td
                          key={cat}
                          className="px-3 py-2.5 font-mono text-slate-600 text-center"
                        >
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

export default DatasetView;
