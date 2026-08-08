import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Ubicacion, ResultadoRankeado } from "../../types";
import { useMap } from "react-leaflet";
import { useLanguage } from "../../i18n/LanguageContext";

interface MapViewProps {
  results: ResultadoRankeado[];
  userLocation: Ubicacion | null;
}

const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

const createUserIcon = () =>
  L.divIcon({
    className: "custom-user-icon",
    html: `<div class="w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

const createTopIcon = (rank: number) =>
  L.divIcon({
    className: "custom-heladeria-icon",
    html: `<div class="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs border-2 border-white shadow">${rank}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

const createSecondaryIcon = () =>
  L.divIcon({
    className: "custom-heladeria-icon-sec",
    html: `<div class="w-4 h-4 rounded-full bg-slate-400 border-2 border-white shadow"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  });

export const MapView: React.FC<MapViewProps> = ({ results, userLocation }) => {
  const { t } = useLanguage();
  const defaultCenter: [number, number] = [-34.6037389, -58.3815704];
  const mapCenter: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;
  const mapZoom = userLocation ? 14 : 13;

  const top3 = results.slice(0, 3);
  const rest = results.slice(3);

  return (
    <div className="panel w-full h-[360px] md:h-[420px] overflow-hidden">
      <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full">
        <ChangeView center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon()}
          >
            <Popup>
              <p className="text-xs font-medium">{t("map.yourLocation")}</p>
            </Popup>
          </Marker>
        )}

        {top3.map((res, index) => (
          <Marker
            key={`top-${res.heladeria.id}`}
            position={[res.heladeria.lat, res.heladeria.lng]}
            icon={createTopIcon(index + 1)}
          >
            <Popup>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold">{res.heladeria.nombre}</p>
                <p className="text-slate-500">{res.heladeria.direccion}</p>
                <p className="font-mono">
                  {(res.scoreFinal * 10).toFixed(1)} · {res.distanciaMetros}m
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {rest.map((res) => (
          <Marker
            key={`sec-${res.heladeria.id}`}
            position={[res.heladeria.lat, res.heladeria.lng]}
            icon={createSecondaryIcon()}
          >
            <Popup>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold">{res.heladeria.nombre}</p>
                <p className="font-mono text-slate-500">
                  {(res.scoreFinal * 10).toFixed(1)} · {res.distanciaMetros}m
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
