import React, { useState, useMemo, useEffect } from "react";
import {
  Heladeria,
  Ocurrencia,
  MacroCategoria,
  SubCategoria,
  calcularPuntajeGeneral,
} from "../../types";
import { haversineMetros } from "../../lib/geo";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  X,
  Navigation,
  Check,
  Plus,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Webhook,
  ExternalLink,
  Search,
} from "lucide-react";

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  heladerias: Heladeria[];
  ocurrencias: Ocurrencia[];
  initialHeladeriaId?: number | null;
  onAddOcurrencia: (nueva: Ocurrencia) => void;
}

const MACROS: MacroCategoria[] = [
  "DULCE DE LECHE",
  "CHOCOLATE",
  "CREMA",
  "FRUTA",
  "AUTOR",
  "MISC",
];

const SUBCATS: SubCategoria[] = ["CLASICO", "SPRINKLES", "FUSION", "LIGHT"];

const QUICK_FLAVORS: {
  gusto: string;
  macro: MacroCategoria;
  subcat: SubCategoria;
}[] = [
  { gusto: "Dulce de Leche Granizado", macro: "DULCE DE LECHE", subcat: "SPRINKLES" },
  { gusto: "Chocolate con Almendras", macro: "CHOCOLATE", subcat: "SPRINKLES" },
  { gusto: "Tramontana", macro: "CREMA", subcat: "SPRINKLES" },
  { gusto: "Banana Split", macro: "CREMA", subcat: "FUSION" },
  { gusto: "Pistacho", macro: "CREMA", subcat: "CLASICO" },
  { gusto: "Gianduia", macro: "CHOCOLATE", subcat: "FUSION" },
  { gusto: "Lemon Pie", macro: "CREMA", subcat: "FUSION" },
  { gusto: "Chocotorta", macro: "CREMA", subcat: "FUSION" },
  { gusto: "Tiramisú", macro: "CREMA", subcat: "FUSION" },
  { gusto: "Cheesecake con Frutos Rojos", macro: "CREMA", subcat: "FUSION" },
  { gusto: "Chocolate Nevado", macro: "CHOCOLATE", subcat: "SPRINKLES" },
  { gusto: "Chocolate con Naranja", macro: "CHOCOLATE", subcat: "FUSION" },
  { gusto: "Sambayón", macro: "CREMA", subcat: "CLASICO" },
  { gusto: "Frutos del Bosque", macro: "FRUTA", subcat: "CLASICO" },
  { gusto: "Frambuesa", macro: "FRUTA", subcat: "CLASICO" },
];

function inferClassification(gusto: string): {
  macro: MacroCategoria;
  subcat: SubCategoria;
} | null {
  const g = gusto.toLowerCase().trim();
  if (!g) return null;

  let macro: MacroCategoria = "CREMA";
  if (g.includes("dulce de leche") || g.includes("ddl")) {
    macro = "DULCE DE LECHE";
  } else if (g.includes("choco") || g.includes("gianduia") || g.includes("cacao")) {
    macro = "CHOCOLATE";
  } else if (
    g.includes("frut") ||
    g.includes("limón") ||
    g.includes("limon") ||
    g.includes("frambuesa") ||
    g.includes("melón") ||
    g.includes("melon") ||
    g.includes("ciruela") ||
    g.includes("kiwi") ||
    g.includes("ananá") ||
    g.includes("papaya") ||
    g.includes("maracuyá") ||
    g.includes("manga")
  ) {
    macro = "FRUTA";
  } else if (g.includes("kinder") || g.includes("ferrero") || g.includes("cookie") || g.includes("pretzel")) {
    macro = "MISC";
  }

  let subcat: SubCategoria = "CLASICO";
  if (g.includes("sin azúcar") || g.includes("light") || g.includes("0%") || g.includes("vegano") || g.includes("celíaco")) {
    subcat = "LIGHT";
  } else if (
    g.includes("granizado") ||
    g.includes("almendra") ||
    g.includes("nuez") ||
    g.includes("nueces") ||
    g.includes("tramontana") ||
    g.includes("nevado") ||
    g.includes("chips") ||
    g.includes("mantecol") ||
    g.includes("avellana")
  ) {
    subcat = "SPRINKLES";
  } else if (
    g.includes("pie") ||
    g.includes("torta") ||
    g.includes("cheesecake") ||
    g.includes("tiramisú") ||
    g.includes("tiramisu") ||
    g.includes("split") ||
    g.includes("gianduia") ||
    g.includes("red velvet") ||
    g.includes("crumble") ||
    g.includes("manzana") ||
    g.includes("naranja") ||
    g.includes("kiwi") ||
    g.includes("super") ||
    g.includes("bombón") ||
    g.includes("marroc")
  ) {
    subcat = "FUSION";
  }

  return { macro, subcat };
}

const WEBHOOK_STORAGE_KEY = "gustohelado.webhook_url";

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  heladerias,
  ocurrencias,
  initialHeladeriaId,
  onAddOcurrencia,
}) => {
  const { t, lang } = useLanguage();

  const todayIso = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState(todayIso);
  const [shopSearch, setShopSearch] = useState("");
  const [selectedShopId, setSelectedShopId] = useState<number>(
    initialHeladeriaId ?? heladerias[0]?.id ?? 1
  );
  const [nearbyShops, setNearbyShops] = useState<
    { shop: Heladeria; dist: number }[]
  >([]);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [gusto, setGusto] = useState("");
  const [macro, setMacro] = useState<MacroCategoria>("DULCE DE LECHE");
  const [subcat, setSubcat] = useState<SubCategoria>("SPRINKLES");

  // 4 métricas del 0.0 al 10.0
  const [disfrutabilidad, setDisfrutabilidad] = useState<number>(8.5);
  const [textura, setTextura] = useState<number>(8.5);
  const [fidelidad, setFidelidad] = useState<number>(8.5);
  const [experiencia, setExperiencia] = useState<number>(8.2);
  const [volveria, setVolveria] = useState<boolean>(true);

  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>(
    () => localStorage.getItem(WEBHOOK_STORAGE_KEY) || ""
  );

  useEffect(() => {
    if (initialHeladeriaId) {
      setSelectedShopId(initialHeladeriaId);
    }
  }, [initialHeladeriaId]);

  const selectedShop = useMemo(
    () => heladerias.find((h) => h.id === selectedShopId) ?? heladerias[0],
    [heladerias, selectedShopId]
  );

  const filteredShops = useMemo(() => {
    const q = shopSearch.trim().toLowerCase();
    if (!q) return heladerias.slice(0, 60);
    return heladerias
      .filter(
        (h) =>
          h.nombre.toLowerCase().includes(q) ||
          h.direccion.toLowerCase().includes(q) ||
          (h.ciudad && h.ciudad.toLowerCase().includes(q)) ||
          (h.pais && h.pais.toLowerCase().includes(q))
      )
      .slice(0, 40);
  }, [heladerias, shopSearch]);

  // Historial personal en esta heladería o cadena ("¿Qué pido acá?")
  const shopHistory = useMemo(() => {
    if (!selectedShop) return { best: [], avoid: [], total: 0 };
    const matches = ocurrencias.filter(
      (o) =>
        o.heladeria_id === selectedShop.id ||
        o.heladeria_nombre.toLowerCase() === selectedShop.nombre.toLowerCase()
    );

    const byFlavor = new Map<
      string,
      {
        gusto: string;
        macro: MacroCategoria;
        subcat: SubCategoria;
        scores: number[];
        repeats: number;
      }
    >();

    for (const o of matches) {
      const curr = byFlavor.get(o.gusto) ?? {
        gusto: o.gusto,
        macro: o.macrocategoria,
        subcat: o.subcategoria ?? "CLASICO",
        scores: [],
        repeats: 0,
      };
      curr.scores.push(o.puntaje_general);
      if (o.volveria_a_pedir) curr.repeats += 1;
      byFlavor.set(o.gusto, curr);
    }

    const list = Array.from(byFlavor.values()).map((item) => ({
      ...item,
      avg:
        Math.round(
          (item.scores.reduce((a, b) => a + b, 0) / item.scores.length) * 10
        ) / 10,
      count: item.scores.length,
    }));

    const best = list
      .filter((x) => x.avg >= 7.8 && x.repeats > 0)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 4);

    const avoid = list
      .filter((x) => x.avg < 6.5 || x.repeats === 0)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 2);

    return { best, avoid, total: matches.length };
  }, [selectedShop, ocurrencias]);

  const puntajeGeneral = useMemo(
    () => calcularPuntajeGeneral(disfrutabilidad, textura, fidelidad, experiencia),
    [disfrutabilidad, textura, fidelidad, experiencia]
  );

  const handleDetectGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const ranked = heladerias
          .map((shop) => ({
            shop,
            dist: Math.round(
              haversineMetros(latitude, longitude, shop.lat, shop.lng)
            ),
          }))
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 4);
        setNearbyShops(ranked);
        if (ranked[0]) {
          setSelectedShopId(ranked[0].shop.id);
        }
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFlavorChange = (val: string) => {
    setGusto(val);
    const inferred = inferClassification(val);
    if (inferred) {
      setMacro(inferred.macro);
      setSubcat(inferred.subcat);
    }
  };

  const handleSave = async (keepOpenForNextScoop: boolean) => {
    if (!selectedShop || !gusto.trim()) return;

    const nueva: Ocurrencia = {
      id: Date.now(),
      fecha,
      heladeria_id: selectedShop.id,
      heladeria_nombre: selectedShop.nombre,
      ciudad: selectedShop.ciudad ?? "Buenos Aires",
      pais: selectedShop.pais ?? "Argentina",
      gusto: gusto.trim(),
      macrocategoria: macro,
      subcategoria: subcat,
      disfrutabilidad,
      textura_conservacion: textura,
      fidelidad_gusto: fidelidad,
      experiencia_presentacion: experiencia,
      volveria_a_pedir: volveria,
      puntaje_general: puntajeGeneral,
    };

    onAddOcurrencia(nueva);

    // Si hay un Webhook configurado (Apps Script / Telegram / N8N), enviarlo en background
    if (webhookUrl.trim()) {
      try {
        fetch(webhookUrl.trim(), {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nueva),
        });
      } catch {
        // Silencioso en modo local-first
      }
    }

    if (keepOpenForNextScoop) {
      setSavedNotice(
        lang === "es"
          ? `¡Guardado "${nueva.gusto}" (${nueva.puntaje_general})! Cargá el siguiente gusto de esta visita.`
          : `Saved "${nueva.gusto}" (${nueva.puntaje_general})! Log your next scoop from this visit.`
      );
      setGusto("");
      setTimeout(() => setSavedNotice(null), 4000);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/50 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#faf8f5] border border-stone-200 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>🍦</span>
              {lang === "es" ? "Cargar Tomada de Helado" : "Log Ice Cream Tasting"}
            </h3>
            <p className="text-xs text-stone-500">
              {lang === "es"
                ? "1 gusto = 1 ocurrencia · Guarda al instante en tu bitácora"
                : "1 flavor = 1 occurrence · Instant save to your log"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {savedNotice && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{savedNotice}</span>
            </div>
          )}

          {/* 1. Heladería & Fecha */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                1. {lang === "es" ? "Heladería y Fecha" : "Gelateria & Date"}
              </label>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-900 text-white hover:bg-stone-700 cursor-pointer disabled:opacity-50"
              >
                <Navigation className="w-3 h-3" />
                {gpsLoading
                  ? lang === "es"
                    ? "Buscando..."
                    : "Locating..."
                  : lang === "es"
                  ? "Detectar por GPS"
                  : "GPS Detect"}
              </button>
            </div>

            {nearbyShops.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {nearbyShops.map(({ shop, dist }) => (
                  <button
                    key={shop.id}
                    type="button"
                    onClick={() => setSelectedShopId(shop.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      selectedShopId === shop.id
                        ? "bg-amber-100 border-amber-300 text-amber-950 font-semibold"
                        : "bg-stone-50 border-stone-200 text-stone-600"
                    }`}
                  >
                    📍 {shop.nombre} ({dist < 1000 ? `${dist}m` : `${(dist / 1000).toFixed(1)}km`})
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2 space-y-1.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    placeholder={
                      lang === "es"
                        ? "Filtrar heladería o ciudad..."
                        : "Filter shop or city..."
                    }
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:outline-none focus:bg-white"
                  />
                </div>
                <select
                  value={selectedShopId}
                  onChange={(e) => setSelectedShopId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-medium border border-stone-200 rounded-xl bg-white focus:outline-none"
                >
                  {filteredShops.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nombre} — {h.direccion} ({h.ciudad ?? "CABA"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full h-full px-3 py-2 text-xs font-mono border border-stone-200 rounded-xl bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Machete personal de esta heladería ("¿Qué pido acá?") */}
            {shopHistory.total > 0 && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-1.5">
                <p className="text-[11px] font-semibold text-amber-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  {lang === "es"
                    ? `Tu historial en ${selectedShop?.nombre} (${shopHistory.total} tomadas):`
                    : `Your history at ${selectedShop?.nombre} (${shopHistory.total} tastings):`}
                </p>
                {shopHistory.best.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-emerald-800 inline-flex items-center gap-0.5">
                      <ThumbsUp className="w-3 h-3" /> {t("card.whatToOrder")}
                    </span>
                    {shopHistory.best.map((b) => (
                      <button
                        key={b.gusto}
                        type="button"
                        onClick={() => {
                          setGusto(b.gusto);
                          setMacro(b.macro);
                          setSubcat(b.subcat);
                        }}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-stone-800 hover:bg-emerald-50 cursor-pointer"
                      >
                        {b.gusto} <span className="font-mono font-bold text-emerald-700">{b.avg}</span>
                      </button>
                    ))}
                  </div>
                )}
                {shopHistory.avoid.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-rose-700 inline-flex items-center gap-0.5">
                      <ThumbsDown className="w-3 h-3" /> {t("card.avoid")}
                    </span>
                    {shopHistory.avoid.map((a) => (
                      <span
                        key={a.gusto}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50/80 border border-rose-200/70 text-rose-800"
                      >
                        {a.gusto} ({a.avg})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Gusto & Clasificación (Categoría × Subcategoría) */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              2. {lang === "es" ? "Gusto y Clasificación" : "Flavor & Taxonomy"}
            </label>

            <input
              type="text"
              value={gusto}
              onChange={(e) => handleFlavorChange(e.target.value)}
              placeholder={
                lang === "es"
                  ? "Ej. Banana Split, Gianduia, Lemon Pie, Chocolate con Almendras..."
                  : "E.g. Banana Split, Gianduia, Lemon Pie..."
              }
              className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-300"
            />

            {/* Chips de gustos frecuentes */}
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-0.5">
              {QUICK_FLAVORS.map((qf) => (
                <button
                  key={qf.gusto}
                  type="button"
                  onClick={() => {
                    setGusto(qf.gusto);
                    setMacro(qf.macro);
                    setSubcat(qf.subcat);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                    gusto === qf.gusto
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {qf.gusto}
                </button>
              ))}
            </div>

            {/* Selector de Macrocategoría */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                {lang === "es" ? "Gran Categoría" : "Main Category"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MACROS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMacro(m)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium border cursor-pointer ${
                      macro === m
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-600 border-stone-200"
                    }`}
                  >
                    {t(`cat.${m}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Subcategoría */}
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                {lang === "es" ? "Subcategoría" : "Subcategory"}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {SUBCATS.map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setSubcat(sc)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border text-center cursor-pointer ${
                      subcat === sc
                        ? "bg-amber-900 text-white border-amber-900"
                        : "bg-stone-50 text-stone-600 border-stone-200"
                    }`}
                  >
                    {t(`subcatShort.${sc}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Calificación (Las 4 métricas del 0.0 al 10.0 + Booleano) */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                3. {lang === "es" ? "Calificación (0.0 a 10)" : "Rating (0.0 to 10)"}
              </label>
              <div className="flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1 rounded-full">
                <span className="text-[10px] uppercase tracking-wider opacity-75">
                  Score
                </span>
                <span className="text-sm font-mono font-bold">
                  {puntajeGeneral.toFixed(1)}
                </span>
              </div>
            </div>

            {[
              {
                label:
                  lang === "es"
                    ? "Disfrutabilidad (40%) · Qué tanto me gustó"
                    : "Enjoyability (40%) · Subjective pleasure",
                val: disfrutabilidad,
                setter: setDisfrutabilidad,
              },
              {
                label:
                  lang === "es"
                    ? "Textura / Anticongelante (25%) · Cero escarcha"
                    : "Texture / Cold (25%) · Zero ice crystals",
                val: textura,
                setter: setTextura,
              },
              {
                label:
                  lang === "es"
                    ? "Fidelidad al Gusto (20%) · Sabor real vs. artificial"
                    : "Flavor Fidelity (20%) · Real vs. artificial",
                val: fidelidad,
                setter: setFidelidad,
              },
              {
                label:
                  lang === "es"
                    ? "Experiencia y Presentación (15%) · Formato y local"
                    : "Experience & Presentation (15%) · Format & vibe",
                val: experiencia,
                setter: setExperiencia,
              },
            ].map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700">{m.label}</span>
                  <span className="font-mono font-bold text-stone-900">
                    {m.val.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.1}
                  value={m.val}
                  onChange={(e) => m.setter(parseFloat(e.target.value))}
                />
              </div>
            ))}

            {/* Booleano: ¿Volvería a pedir? */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800">
                {lang === "es"
                  ? "¿Volvería a pedir este gusto en esta heladería?"
                  : "Would I order this flavor at this shop again?"}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setVolveria(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    volveria
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {lang === "es" ? "SÍ" : "YES"}
                </button>
                <button
                  type="button"
                  onClick={() => setVolveria(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    !volveria
                      ? "bg-rose-600 text-white"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  NO
                </button>
              </div>
            </div>
          </div>

          {/* Sync / Webhook Config (Opcional) */}
          <div className="text-xs text-stone-500">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowWebhookConfig((v) => !v)}
                className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-800 underline underline-offset-2 cursor-pointer"
              >
                <Webhook className="w-3.5 h-3.5" />
                {lang === "es"
                  ? "Configurar Webhook (Sheets / Telegram)"
                  : "Configure Webhook (Sheets / Telegram)"}
              </button>
              <a
                href="https://forms.gle/sqGfbGcy4PYt1JvSA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700"
              >
                Google Form <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {showWebhookConfig && (
              <div className="mt-2 p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
                <p className="text-[11px] text-stone-500">
                  {lang === "es"
                    ? "Si pegás acá la URL de tu Google Apps Script o Bot de Telegram, cada tomada se envía por POST además de guardarse en el navegador:"
                    : "Paste an Apps Script or Telegram webhook URL to POST every logged tasting automatically:"}
                </p>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => {
                    setWebhookUrl(e.target.value);
                    localStorage.setItem(WEBHOOK_STORAGE_KEY, e.target.value);
                  }}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-2.5 py-1.5 text-xs font-mono border border-stone-200 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 bg-white border-t border-stone-200 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            disabled={!gusto.trim()}
            onClick={() => handleSave(true)}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {lang === "es"
              ? "Guardar y sumar otro gusto"
              : "Save & add another scoop"}
          </button>
          <button
            type="button"
            disabled={!gusto.trim()}
            onClick={() => handleSave(false)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            {lang === "es" ? "Guardar tomada" : "Save tasting"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickLogModal;
