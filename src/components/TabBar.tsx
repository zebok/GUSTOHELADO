import React from "react";
import { Map, Table2, BarChart3, Info } from "lucide-react";
import { Tab } from "../App";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";

interface TabBarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onShowIntro: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab, onShowIntro }) => {
  const { t } = useLanguage();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: t("tabs.finder"), icon: <Map className="w-4 h-4" /> },
    { id: "bbdd", label: t("tabs.bitacora"), icon: <Table2 className="w-4 h-4" /> },
    { id: "kpis", label: t("tabs.analisis"), icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🍦</span>
          <h1 className="text-sm font-semibold text-slate-900">GustoHelado</h1>
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
          <button
            onClick={onShowIntro}
            title={t("common.about")}
            aria-label={t("common.about")}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default TabBar;
