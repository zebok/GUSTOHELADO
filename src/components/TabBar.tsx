import React from "react";
import { Map, Table2, BarChart3, BookOpen, Plus } from "lucide-react";
import { Tab } from "../App";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";

interface TabBarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onShowIntro: () => void;
  onOpenQuickLog: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  setActiveTab,
  onShowIntro,
  onOpenQuickLog,
}) => {
  const { t } = useLanguage();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: t("tabs.finder"), icon: <Map className="w-4 h-4" /> },
    { id: "bbdd", label: t("tabs.bitacora"), icon: <Table2 className="w-4 h-4" /> },
    { id: "kpis", label: t("tabs.analisis"), icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <button
          onClick={onShowIntro}
          className="flex items-center gap-2 text-left hover:opacity-80 transition-opacity cursor-pointer"
          title={t("common.about")}
        >
          <span className="text-lg">🍦</span>
          <div>
            <h1 className="text-sm font-bold text-stone-900 leading-none">
              GustoHelado
            </h1>
            <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">
              2010–2026
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <nav className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={onOpenQuickLog}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-colors cursor-pointer"
            title={t("common.quickLog")}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t("finder.logTasting")}</span>
            <span className="md:hidden">🍦</span>
          </button>

          <button
            onClick={onShowIntro}
            title={t("common.about")}
            aria-label={t("common.about")}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default TabBar;
