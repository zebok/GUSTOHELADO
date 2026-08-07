import React, { useState } from "react";
import { IceCreamCone, Compass } from "lucide-react";

interface IntroScreenProps {
  onClose: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onClose }) => {
  const [closing, setClosing] = useState(false);

  const handleEnter = () => {
    setClosing(true);
    setTimeout(onClose, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-50 px-6 transition-opacity duration-300 ${
        closing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="max-w-md w-full space-y-6 text-center animate-fade-in">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <IceCreamCone className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">GustoHelado</h1>
            <p className="text-slate-500 text-xs font-medium">Bitácora Personal · CABA</p>
          </div>
        </div>

        {/* Propósito */}
        <div className="panel p-5 text-left space-y-2 bg-white">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">El Propósito</p>
          <p className="text-slate-700 text-sm leading-relaxed">
            Buenos Aires destaca por su inmensa oferta de heladerías. Como apasionado del helado y con un criterio exigente, creé este recomendador científico para responder:
          </p>
          <p className="text-slate-900 text-sm font-semibold italic border-l-2 border-slate-300 pl-3 py-0.5">
            "¿Cuál es la menor distancia que puedo recorrer, según mi antojo actual y mis calificaciones históricas?"
          </p>
        </div>

        {/* Modelo de scoring */}
        <div className="panel p-4 text-left space-y-2 bg-white">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Compass className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Lógica del Blend Score</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Calidad de mi Paladar (70%)</span>
            <span>+</span>
            <span>Cercanía Geográfica (30%)</span>
          </div>
          <code className="block text-center text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-100 rounded py-1">
            score = 0.7 × Calidad + 0.3 × Proximidad
          </code>
        </div>

        {/* Button */}
        <button
          onClick={handleEnter}
          className="w-full py-3.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          VER PROYECTO
        </button>

      </div>
    </div>
  );
};

export default IntroScreen;
