import React, { useState } from "react";
import { MapPin, Navigation, Search, CheckCircle, Compass } from "lucide-react";
import { Ubicacion } from "../../types";
import { geocodeDireccion } from "../../lib/geo";
import { useLanguage } from "../../i18n/LanguageContext";

interface LocationInputProps {
  onLocationChange: (location: Ubicacion | null) => void;
  currentLocation: Ubicacion | null;
}

const QUICK_JUMPS: { label: string; lat: number; lng: number }[] = [
  { label: "Belgrano / Monroe", lat: -34.5585, lng: -58.4575 },
  { label: "Palermo", lat: -34.5875, lng: -58.4285 },
  { label: "Centro / Corrientes", lat: -34.6038, lng: -58.3915 },
  { label: "Berlín", lat: 52.5268, lng: 13.4125 },
  { label: "Aarhus", lat: 56.1588, lng: 10.2086 },
  { label: "Ámsterdam", lat: 52.3725, lng: 4.8865 },
  { label: "Bariloche", lat: -41.1336, lng: -71.3065 },
  { label: "Montevideo", lat: -34.9092, lng: -56.1486 },
  { label: "Ubatuba", lat: -23.4395, lng: -45.0645 },
];

export const LocationInput: React.FC<LocationInputProps> = ({
  onLocationChange,
  currentLocation,
}) => {
  const { t } = useLanguage();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGPSClick = () => {
    if (!navigator.geolocation) {
      setErrorMsg(t("location.error.noGeolocation"));
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          origen: "gps",
          label: "GPS",
        });
        setAddress(t("location.gps"));
        setLoading(false);
      },
      () => {
        setErrorMsg(t("location.error.gps"));
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await geocodeDireccion(address);
      if (result) {
        onLocationChange(result);
        if (result.origen === "coords") {
          setAddress(
            t("location.coords", {
              lat: result.lat.toFixed(5),
              lng: result.lng.toFixed(5),
            })
          );
        }
      } else {
        setErrorMsg(t("location.error.notFound"));
      }
    } catch {
      setErrorMsg(t("location.error.search"));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickJump = (jump: { label: string; lat: number; lng: number }) => {
    setErrorMsg(null);
    setAddress(jump.label);
    onLocationChange({
      lat: jump.lat,
      lng: jump.lng,
      origen: "coords",
      label: jump.label,
    });
  };

  return (
    <div className="panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="panel-label">{t("location.title")}</h3>
        {currentLocation && (
          <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            {currentLocation.label ?? t("location.located")}
          </span>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("location.placeholder")}
            className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 bg-white"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="px-3 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
            title={t("location.search")}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleGPSClick}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl disabled:opacity-40 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            GPS
          </button>
        </div>
      </form>

      {/* Saltos rápidos por barrios y ciudades de la bitácora */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-400 mr-1">
          <Compass className="w-3 h-3" />
          {t("finder.presets.label")}
        </span>
        {QUICK_JUMPS.map((j) => {
          const isCurrent =
            currentLocation &&
            Math.abs(currentLocation.lat - j.lat) < 0.002 &&
            Math.abs(currentLocation.lng - j.lng) < 0.002;
          return (
            <button
              key={j.label}
              type="button"
              onClick={() => handleQuickJump(j)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                isCurrent
                  ? "bg-stone-900 text-white border-stone-900 font-semibold"
                  : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-white"
              }`}
            >
              {j.label}
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default LocationInput;
