import React, { useState, useEffect } from "react";
import { BaseDeDatos } from "./types";
import { fetchHeladerias } from "./lib/data";
import { TabBar } from "./components/TabBar";
import { RecommenderView } from "./components/recommender/RecommenderView";
import { DatasetView } from "./components/dataset/DatasetView";
import { IntroScreen } from "./components/IntroScreen";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

type Tab = "home" | "dataset";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [db, setDb] = useState<BaseDeDatos | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchHeladerias();
      setDb(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "No se pudo cargar el dataset. Ejecutá el pipeline de Python para generar los datos."
      );
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {showIntro && <IntroScreen onClose={handleCloseIntro} />}

      {!showIntro && (
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      {!showIntro && (
        <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-6">
          {loading ? (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              <p className="text-sm text-slate-400">Cargando datos...</p>
            </div>
          ) : errorMsg ? (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-4 text-center max-w-sm mx-auto">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <p className="text-sm text-slate-500">{errorMsg}</p>
              <button
                onClick={loadData}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-white cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reintentar
              </button>
            </div>
          ) : db ? (
            <div className="animate-fade-in">
              {activeTab === "home" ? (
                <RecommenderView heladerias={db.heladerias} />
              ) : (
                <DatasetView
                  heladerias={db.heladerias}
                  generadoEl={db.generadoEl}
                />
              )}
            </div>
          ) : null}
        </main>
      )}
    </div>
  );
};

export default App;
