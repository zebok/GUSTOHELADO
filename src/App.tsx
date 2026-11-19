import React, { useState, useEffect, useMemo } from "react";
import { BaseDeDatos, Ocurrencia, MacroCategoria } from "./types";
import { fetchHeladerias } from "./lib/data";
import { TabBar } from "./components/TabBar";
import { RecommenderView } from "./components/recommender/RecommenderView";
import { DatasetView } from "./components/dataset/DatasetView";
import { KpisView } from "./components/kpis/KpisView";
import { IntroScreen } from "./components/IntroScreen";
import { QuickLogModal } from "./components/logger/QuickLogModal";
import { useLanguage } from "./i18n/LanguageContext";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export type Tab = "home" | "bbdd" | "kpis";

const LOCAL_OCC_KEY = "gustohelado.local_ocurrencias";

export const App: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [db, setDb] = useState<BaseDeDatos | null>(null);
  const [localOcurrencias, setLocalOcurrencias] = useState<Ocurrencia[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_OCC_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedHeladeriaFilter, setSelectedHeladeriaFilter] =
    useState<string>("TODAS");
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [quickLogShopId, setQuickLogShopId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchHeladerias();
      setDb(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(t("common.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("hasSeenIntro");
    if (hasSeen === "true") setShowIntro(false);
    loadData();
  }, []);

  const handleCloseIntro = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  const handleOpenQuickLog = (heladeriaId?: number) => {
    setQuickLogShopId(heladeriaId ?? null);
    setQuickLogOpen(true);
  };

  const handleAddOcurrencia = (nueva: Ocurrencia) => {
    setLocalOcurrencias((prev) => {
      const next = [nueva, ...prev];
      try {
        localStorage.setItem(LOCAL_OCC_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota
      }
      return next;
    });
  };

  // Combinar base histórica con tomadas recientes cargadas desde el celular
  const allOcurrencias = useMemo(() => {
    if (!db) return localOcurrencias;
    return [...localOcurrencias, ...db.ocurrencias];
  }, [db, localOcurrencias]);

  const enrichedHeladerias = useMemo(() => {
    if (!db) return [];
    if (localOcurrencias.length === 0) return db.heladerias;

    return db.heladerias.map((h) => {
      const extras = localOcurrencias.filter((o) => o.heladeria_id === h.id);
      if (extras.length === 0) return h;

      const updatedScores = { ...h.scorePorCategoria };
      const byCat = new Map<MacroCategoria, number[]>();
      for (const o of allOcurrencias) {
        if (o.heladeria_id === h.id) {
          const list = byCat.get(o.macrocategoria) ?? [];
          list.push(o.puntaje_general);
          byCat.set(o.macrocategoria, list);
        }
      }
      byCat.forEach((vals, cat) => {
        updatedScores[cat] =
          Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
      });

      return {
        ...h,
        visitas: h.visitas + extras.length,
        scorePorCategoria: updatedScores,
      };
    });
  }, [db, localOcurrencias, allOcurrencias]);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-800">
      {showIntro && (
        <IntroScreen
          onClose={handleCloseIntro}
          totalShops={enrichedHeladerias.length || 560}
          totalOccurrences={allOcurrencias.length || 2528}
        />
      )}

      {!showIntro && (
        <TabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onShowIntro={() => setShowIntro(true)}
          onOpenQuickLog={() => handleOpenQuickLog()}
        />
      )}

      {!showIntro && (
        <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-6">
          {loading ? (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
              <p className="text-sm text-stone-400">{t("common.loading")}</p>
            </div>
          ) : errorMsg ? (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-4 text-center max-w-sm mx-auto">
              <AlertCircle className="w-8 h-8 text-stone-300" />
              <p className="text-sm text-stone-500">{errorMsg}</p>
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 text-sm font-medium text-stone-700 border border-stone-200 px-4 py-2 rounded-xl hover:bg-white cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t("common.retry")}
              </button>
            </div>
          ) : db ? (
            <div className="animate-fade-in">
              {activeTab === "home" && (
                <RecommenderView
                  heladerias={enrichedHeladerias}
                  ocurrencias={allOcurrencias}
                  onVerInsights={(nombre) => {
                    setSelectedHeladeriaFilter(nombre);
                    setActiveTab("kpis");
                  }}
                  onOpenQuickLog={(id) => handleOpenQuickLog(id)}
                />
              )}
              {activeTab === "bbdd" && (
                <DatasetView
                  heladerias={enrichedHeladerias}
                  ocurrencias={allOcurrencias}
                  generadoEl={db.generadoEl}
                  onOpenQuickLog={(id) => handleOpenQuickLog(id)}
                />
              )}
              {activeTab === "kpis" && (
                <KpisView
                  heladerias={enrichedHeladerias}
                  ocurrencias={allOcurrencias}
                  selectedHeladeriaFilter={selectedHeladeriaFilter}
                  onHeladeriaFilterChange={setSelectedHeladeriaFilter}
                />
              )}
            </div>
          ) : null}
        </main>
      )}

      {db && (
        <QuickLogModal
          isOpen={quickLogOpen}
          onClose={() => setQuickLogOpen(false)}
          heladerias={enrichedHeladerias}
          ocurrencias={allOcurrencias}
          initialHeladeriaId={quickLogShopId}
          onAddOcurrencia={handleAddOcurrencia}
        />
      )}
    </div>
  );
};

export default App;
