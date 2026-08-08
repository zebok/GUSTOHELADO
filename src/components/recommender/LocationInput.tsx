import React, { useState } from "react";
import { MapPin, Navigation, Search, CheckCircle } from "lucide-react";
import { Ubicacion } from "../../types";
import { geocodeDireccion } from "../../lib/geo";
import { useLanguage } from "../../i18n/LanguageContext";

interface LocationInputProps {
  onLocationChange: (location: Ubicacion | null) => void;
  currentLocation: Ubicacion | null;
}

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
          setAddress(t("location.coords", { lat: result.lat.toFixed(5), lng: result.lng.toFixed(5) }));
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

  return (
    <div className="panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="panel-label">{t("location.title")}</h3>
        {currentLocation && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            {t("location.located")}
          </span>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("location.placeholder")}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 bg-white"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            title={t("location.search")}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleGPSClick}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-40 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            GPS
          </button>
        </div>
      </form>

      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default LocationInput;
