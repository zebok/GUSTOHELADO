import React, { useState, useMemo } from "react";
import { Heladeria, Ocurrencia, Ubicacion, Antojo } from "../../types";
import { rankearHeladerias } from "../../lib/scoring";
import { LocationInput } from "./LocationInput";
import { CravingFilter } from "./CravingFilter";
import { DistanceSlider } from "./DistanceSlider";
import { MapView } from "./MapView";
import { ResultsList } from "./ResultsList";
import { useLanguage } from "../../i18n/LanguageContext";
import { Compass, Plus } from "lucide-react";

interface RecommenderViewProps {
  heladerias: Heladeria[];
  ocurrencias: Ocurrencia[];
  onVerInsights: (nombre: string) => void;
  onOpenQuickLog: (heladeriaId?: number) => void;
}

export const RecommenderView: React.FC<RecommenderViewProps> = ({
  heladerias,
  ocurrencias,
  onVerInsights,
  onOpenQuickLog,
}) => {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<Ubicacion | null>({
    lat: -34.5585,
    lng: -58.4575,
    origen: "coords",
    label: "Belgrano / Monroe",
  });
  const [maxDistanceMeters, setMaxDistanceMeters] = useState<number>(2200);
  const [selectedAntojos, setSelectedAntojos] = useState<Antojo[]>([
    "CHOCOLATE",
    "DULCE DE LECHE",
    "CREMA",
  ]);

  const rankedResults = useMemo(() => {
    return rankearHeladerias(
      heladerias,
      userLocation,
      selectedAntojos,
      maxDistanceMeters
    );
  }, [heladerias, userLocation, selectedAntojos, maxDistanceMeters]);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-stone-900">{t("finder.title")}</h2>
          <p className="text-sm text-stone-500 mt-0.5">{t("finder.subtitle")}</p>
        </div>
        <button
          onClick={() => onOpenQuickLog()}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          {t("finder.logTasting")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-4 space-y-4">
          <CravingFilter
            selectedAntojos={selectedAntojos}
            onAntojosChange={setSelectedAntojos}
          />
          <DistanceSlider
            maxDistanceMeters={maxDistanceMeters}
            onDistanceChange={setMaxDistanceMeters}
          />
        </div>

        <div className="lg:col-span-8 space-y-4">
          <LocationInput
            currentLocation={userLocation}
            onLocationChange={setUserLocation}
          />
          {!userLocation ? (
            <div className="panel w-full h-[360px] md:h-[420px] flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-stone-700 font-medium">
                  {t("finder.empty.title")}
                </h4>
                <p className="text-sm text-stone-400 max-w-xs">
                  {t("finder.empty.subtitle")}
                </p>
              </div>
            </div>
          ) : (
            <MapView results={rankedResults} userLocation={userLocation} />
          )}
        </div>
      </div>

      {userLocation && (
        <ResultsList
          results={rankedResults}
          selectedAntojos={selectedAntojos}
          ocurrencias={ocurrencias}
          onVerInsights={onVerInsights}
          onLogAtShop={(id) => onOpenQuickLog(id)}
        />
      )}
    </div>
  );
};

export default RecommenderView;
