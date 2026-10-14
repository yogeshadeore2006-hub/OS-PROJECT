import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Zap, 
  Layers, 
  CpuIcon as Microchip, 
  Eye, 
  Code, 
  HelpCircle, 
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'process-simulator', label: 'Process Simulator', icon: Cpu },
    { id: 'race-condition', label: 'Race Condition Lab', icon: Zap },
    { id: 'critical-section', label: 'Critical Section', icon: Layers },
    { id: 'algorithms', label: 'Synchronization & Problems', icon: Microchip },
    { id: 'visualizer', label: 'Algorithm Visualizer', icon: Eye },
    { id: 'playground', label: 'Code Playground', icon: Code },
    { id: 'quiz', label: 'Theory & Quiz', icon: HelpCircle },
    { id: 'docs', label: 'Project Documentation', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-72 bg-slate-950 border-r border-slate-800/80 text-slate-200
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-18 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
              SL
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">SyncLab</span>
              <span className="block text-[11px] text-slate-400 font-medium">OS Process Simulator</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Modules & Simulations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id as ViewMode);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200 text-left group
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'}
                `}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/60">
            <div className="text-xs font-medium text-slate-300">College OS Project</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Interactive Process Synchronization</div>
          </div>
        </div>
      </aside>
    </>
  );
};
