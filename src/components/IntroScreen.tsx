import React, { useState } from "react";
import { IceCreamCone, FlaskConical, GitBranch, ExternalLink } from "lucide-react";

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
      className={`fixed inset-0 z-50 overflow-y-auto bg-slate-50 px-6 py-12 transition-opacity duration-300 ${
        closing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="max-w-lg mx-auto space-y-8 animate-fade-in">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <IceCreamCone className="w-8 h-8 text-slate-700" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">GustoHelado</h1>
            <p className="text-slate-500 mt-1 text-sm">by Sebi · CABA</p>
          </div>
        </div>

        {/* La pregunta */}
        <div className="panel p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-500">
            <FlaskConical className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">La hipótesis</span>
          </div>
          <blockquote className="text-slate-800 text-lg font-medium leading-snug border-l-2 border-slate-300 pl-4">
            "Estando en cualquier punto de Buenos Aires, ¿a qué heladería conviene ir para minimizar
            la caminata pero maximizar la calidad según mi antojo del día?"
          </blockquote>
        </div>

        {/* De dónde sale */}
        <div className="panel p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-500">
            <GitBranch className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Por qué lo hice</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Me gusta el helado y me gusta tomar decisiones con datos. Cada vez que salgo a buscar uno
            enfrento el mismo dilema: ¿voy a la más cercana o vale la pena caminar un poco más?
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            La respuesta depende de qué antojo tengo y de cuán buena es cada heladería para
            <em> ese</em> tipo de helado específicamente, según <strong>mi propio paladar</strong> —
            no el de Google Maps.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Entonces empecé a anotar cada helado que como. Cada visita alimenta una base de datos
            propia, y esta app calcula en tiempo real la respuesta.
          </p>
        </div>

        {/* Cómo funciona */}
        <div className="panel p-6 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cómo funciona el score</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 space-y-1">
              <p className="text-xs text-slate-500">Calidad histórica</p>
              <p className="font-mono text-slate-800 font-semibold">70%</p>
              <p className="text-xs text-slate-400">promedio de mis propias calificaciones por categoría</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 space-y-1">
              <p className="text-xs text-slate-500">Proximidad</p>
              <p className="font-mono text-slate-800 font-semibold">30%</p>
              <p className="text-xs text-slate-400">distancia Haversine normalizada al radio elegido</p>
            </div>
          </div>
          <code className="block text-xs font-mono text-slate-500 bg-slate-100 rounded px-3 py-2">
            score = 0.7 × calidad + 0.3 × (1 − dist / radio)
          </code>
        </div>

        {/* Link al form */}
        <div className="panel p-4 flex items-start gap-3">
          <span className="text-xl">📝</span>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-slate-700">¿Tomaste helado?</p>
            <p className="text-xs text-slate-500">Cargá tu degustación en el formulario para que alimente la base de datos.</p>
            <a
              href="https://forms.gle/sqGfbGcy4PYt1JvSA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-slate-600 font-medium hover:text-slate-900 underline underline-offset-2 transition-colors"
            >
              Abrir formulario <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleEnter}
          className="w-full py-3.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          Empezar →
        </button>

      </div>
    </div>
  );
};

export default IntroScreen;
