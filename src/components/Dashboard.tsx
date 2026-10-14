import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  CpuIcon, 
  Eye, 
  Code, 
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { ViewMode } from '../types';

interface DashboardProps {
  onSelectView: (view: ViewMode) => void;
  onResetAll: () => void;
  stats: {
    processesCount: number;
    csEntries: number;
    raceConditions: number;
    completedOps: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectView, onResetAll, stats }) => {
  const quickCards = [
    {
      id: 'process-simulator',
      title: 'Process Execution Simulator',
      description: 'Create 2-5 processes, assign speeds, and observe real-time state transitions from New to Terminated.',
      icon: Cpu,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'race-condition',
      title: 'Race Condition Lab',
      description: 'Demonstrate memory interleaving on a shared variable. Compare unsafe concurrent execution vs safe synchronization.',
      icon: Zap,
      color: 'from-amber-500/25 to-orange-500/25 text-amber-400 border-amber-500/30'
    },
    {
      id: 'critical-section',
      title: 'Critical Section Simulator',
      description: 'Visualize Entry, Critical, Exit, and Remainder sections with mutual exclusion enforcement and 3 requirements.',
      icon: Layers,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'algorithms',
      title: 'Synchronization Algorithms',
      description: 'Master Mutex Locks, Semaphores, Producer-Consumer, Readers-Writers, and Dining Philosophers.',
      icon: CpuIcon,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
    },
    {
      id: 'visualizer',
      title: 'Algorithm Visualizer',
      description: 'Explore step-by-step logic for Peterson\'s Algorithm and Test-and-Set hardware primitives.',
      icon: Eye,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      id: 'playground',
      title: 'Code Playground',
      description: 'Examine production-grade C pthread mutexes, POSIX semaphores, and pseudocode with copy buttons.',
      icon: Code,
      color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <span>Operating Systems Practical Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            SyncLab – Interactive Process Synchronization Simulator
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Master process synchronization concepts through interactive simulations, real-time memory interleaving, mutual exclusion enforcement, classical OS problems, and quizzes. Built for college-level Computer Science education.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectView('process-simulator')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Simulation</span>
            </button>
            <button
              onClick={onResetAll}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Experiments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Processes Created</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{stats.processesCount}</h3>
            <p className="text-xs text-blue-400 mt-1">Active execution instances</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Critical Section Entries</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{stats.csEntries}</h3>
            <p className="text-xs text-emerald-400 mt-1">Protected resource accesses</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Race Conditions</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{stats.raceConditions}</h3>
            <p className="text-xs text-amber-400 mt-1">Unsafe memory overwrites</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Sync Operations</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{stats.completedOps}</h3>
            <p className="text-xs text-purple-400 mt-1">Completed lock/semaphore calls</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Access Simulation Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Interactive Simulation Modules</h2>
          <span className="text-xs text-slate-400">Select any module to begin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onSelectView(card.id as ViewMode)}
                className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-xl"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 bg-gradient-to-br ${card.color} transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Launch Simulation</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Ready to test your OS knowledge?</h3>
          <p className="text-sm text-slate-400">Take our 10-question multiple-choice assessment covering race conditions, semaphores, and deadlock.</p>
        </div>
        <button
          onClick={() => onSelectView('quiz')}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 transition-colors shrink-0"
        >
          Take Theory Quiz
        </button>
      </div>
    </div>
  );
};
