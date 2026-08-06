import React, { useState } from "react";
import { IceCreamCone } from "lucide-react";

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
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <IceCreamCone className="w-8 h-8 text-slate-700" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Helado Finder CABA
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Encontrá la heladería de calidad más cercana según tu gusto,
            distancia y visitas históricas.
          </p>
        </div>

        <div className="panel p-5 text-left text-sm text-slate-600 space-y-2">
          <p className="font-medium text-slate-700">Cómo funciona</p>
          <p>
            Elegís un gusto, tu ubicación y un radio. El score combina calidad
            (70%) y proximidad (30%).
          </p>
          <p className="font-mono text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded border border-slate-100">
            score = 0.7 × calidad + 0.3 × (1 − dist / radio)
          </p>
        </div>

        <button
          onClick={handleEnter}
          className="w-full py-3 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          Empezar
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
