import React, { useState, useMemo } from "react";
import { Heladeria, Ubicacion, Antojo } from "../../types";
import { rankearHeladerias } from "../../lib/scoring";
import { LocationInput } from "./LocationInput";
import { CravingFilter } from "./CravingFilter";
import { DistanceSlider } from "./DistanceSlider";
import { MapView } from "./MapView";
import { ResultsList } from "./ResultsList";
import { Compass } from "lucide-react";

interface RecommenderViewProps {
  heladerias: Heladeria[];
  onVerInsights: (nombre: string) => void;
}

export const RecommenderView: React.FC<RecommenderViewProps> = ({
  heladerias,
  onVerInsights,
}) => {
  const [userLocation, setUserLocation] = useState<Ubicacion | null>(null);
  const [maxDistanceMeters, setMaxDistanceMeters] = useState<number>(1500);
  const [selectedAntojos, setSelectedAntojos] = useState<Antojo[]>(["CHOCOLATE"]);

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
          <h2 className="text-xl font-bold text-slate-900">Encontrar heladería</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Elegí tu antojo, indicá tu ubicación y el radio. El sistema rankea las heladerías
            según mis propias calificaciones históricas y la distancia.
          </p>
        </div>
        <a
          href="https://forms.gle/sqGfbGcy4PYt1JvSA"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors whitespace-nowrap"
        >
          📝 Cargar degustación
        </a>
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
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-slate-700 font-medium">
                  Indicá tu ubicación
                </h4>
                <p className="text-sm text-slate-400 max-w-xs">
                  Escribí una dirección de CABA o usá GPS para ver el mapa y las recomendaciones.
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
          onVerInsights={onVerInsights}
        />
      )}
    </div>
  );
};

export default RecommenderView;
