import React, { useState } from "react";
import { IceCreamCone, FlaskConical } from "lucide-react";

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
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        
        {/* Icon & Title */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <IceCreamCone className="w-7 h-7 text-slate-700" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">GustoHelado</h1>
            <p className="text-slate-500 text-xs">by Sebi · CABA</p>
          </div>
        </div>

        {/* La Pregunta/Hipótesis */}
        <div className="panel p-5 text-left space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">La hipótesis científica</span>
          </div>
          <p className="text-slate-800 text-sm font-medium leading-relaxed">
            "¿Cuál es la menor distancia que puedo recorrer, según mi antojo de helado actual y mi propio paladar?"
          </p>
        </div>

        {/* El Modelo Simplificado */}
        <div className="panel p-4 text-left space-y-2 bg-white">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Cálculo en vivo (Blend Score)</p>
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Calidad Histórica (70%)</span>
            <span>+</span>
            <span>Cercanía Geográfica (30%)</span>
          </div>
          <code className="block text-center text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-100 rounded py-1">
            score = 0.7 × Calidad + 0.3 × Proximidad
          </code>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleEnter}
          className="w-full py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          Ver Recomendación
        </button>

      </div>
    </div>
  );
};

export default IntroScreen;
