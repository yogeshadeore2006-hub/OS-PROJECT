import React from 'react';
import { Menu, RotateCcw, ShieldCheck, Zap } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onOpenSidebar: () => void;
  onResetAll: () => void;
  stats: {
    processesCount: number;
    csEntries: number;
    raceConditions: number;
    completedOps: number;
  };
}

export const Header: React.FC<HeaderProps> = ({ currentView, onOpenSidebar, onResetAll, stats }) => {
  const getViewTitle = (view: ViewMode) => {
    switch (view) {
      case 'dashboard': return 'Dashboard Overview';
      case 'process-simulator': return 'Process Execution Simulator';
      case 'race-condition': return 'Race Condition Demonstration';
      case 'critical-section': return 'Critical Section Simulator';
      case 'algorithms': return 'Synchronization Algorithms & Problems';
      case 'visualizer': return 'Algorithm Visualizer';
      case 'playground': return 'Code Learning Playground';
      case 'quiz': return 'Theory & Assessment Quiz';
      case 'docs': return 'Project Documentation & Guide';
    }
  };

  return (
    <header className="h-18 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Zone 1: Mobile Menu & Current Module Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {getViewTitle(currentView)}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Operating Systems Process Synchronization Interactive Lab
          </p>
        </div>
      </div>

      {/* Zone 2: Quick Metrics Counters (hidden on very small screens) */}
      <div className="hidden md:flex items-center gap-4 bg-slate-950/60 px-4 py-1.5 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Proc: <strong className="text-white">{stats.processesCount}</strong></span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>CS Entries: <strong className="text-white">{stats.csEntries}</strong></span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Races: <strong className="text-white">{stats.raceConditions}</strong></span>
        </div>
      </div>

      {/* Zone 3: Primary Action (Reset Experiments) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onResetAll}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm active:scale-95"
          title="Reset all simulation states and counters"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reset Lab</span>
        </button>
      </div>
    </header>
  );
};
