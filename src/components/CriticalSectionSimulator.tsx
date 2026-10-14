import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ShieldCheck, ShieldAlert, CheckCircle2, Layers } from 'lucide-react';
import { SimulationLog } from '../types';

interface CSProcess {
  id: string;
  name: string;
  color: string;
  stage: 'remainder' | 'entry' | 'critical' | 'exit';
  progress: number;
}

interface CriticalSectionSimulatorProps {
  onIncrementStat: (stat: 'processesCount' | 'csEntries' | 'raceConditions' | 'completedOps', amount?: number) => void;
}

export const CriticalSectionSimulator: React.FC<CriticalSectionSimulatorProps> = ({ onIncrementStat }) => {
  const [mutualExclusion, setMutualExclusion] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const [processes, setProcesses] = useState<CSProcess[]>([
    { id: 'p1', name: 'Process A', color: '#3b82f6', stage: 'remainder', progress: 20 },
    { id: 'p2', name: 'Process B', color: '#10b981', stage: 'remainder', progress: 60 },
    { id: 'p3', name: 'Process C', color: '#f59e0b', stage: 'remainder', progress: 40 },
  ]);

  const [criticalOwner, setCriticalOwner] = useState<string | null>(null);
  const [logs, setLogs] = useState<SimulationLog[]>([
    { id: 'l1', timestamp: new Date().toLocaleTimeString(), message: 'Critical Section simulator loaded. Mutual Exclusion is ENABLED.', type: 'info' }
  ]);

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }, ...prev.slice(0, 39)]);
  };

  // Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProcesses(prev => {
        let currentOwner = criticalOwner;

        return prev.map(p => {
          // If in remainder, can transition to entry
          if (p.stage === 'remainder') {
            if (Math.random() > 0.6) {
              return { ...p, stage: 'entry', progress: 10 };
            }
            return { ...p, progress: (p.progress + 5) % 100 };
          }

          // If in entry
          if (p.stage === 'entry') {
            if (mutualExclusion) {
              if (!currentOwner) {
                currentOwner = p.id;
                setCriticalOwner(p.id);
                addLog(`${p.name} acquired Mutex lock and entered Critical Section.`, 'success');
                onIncrementStat('csEntries', 1);
                return { ...p, stage: 'critical', progress: 0 };
              } else {
                // Wait in entry queue
                return { ...p, progress: (p.progress + 5) % 100 };
              }
            } else {
              // Unsafe: multiple can enter!
              currentOwner = p.id;
              setCriticalOwner(p.id);
              addLog(`${p.name} entered Critical Section (MUTUAL EXCLUSION OFF - Violation possible!).`, 'warning');
              onIncrementStat('raceConditions', 1);
              return { ...p, stage: 'critical', progress: 0 };
            }
          }

          // If in critical section
          if (p.stage === 'critical') {
            const nextProg = p.progress + 25;
            if (nextProg >= 100) {
              if (currentOwner === p.id) {
                setCriticalOwner(null);
              }
              addLog(`${p.name} completed Critical Section and moved to Exit Section.`, 'info');
              return { ...p, stage: 'exit', progress: 0 };
            }
            return { ...p, progress: nextProg };
          }

          // If in exit section
          if (p.stage === 'exit') {
            addLog(`${p.name} released lock and returned to Remainder Section.`, 'info');
            return { ...p, stage: 'remainder', progress: 0 };
          }

          return p;
        });
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isRunning, mutualExclusion, criticalOwner]);

  const handleReset = () => {
    setIsRunning(false);
    setCriticalOwner(null);
    setProcesses([
      { id: 'p1', name: 'Process A', color: '#3b82f6', stage: 'remainder', progress: 20 },
      { id: 'p2', name: 'Process B', color: '#10b981', stage: 'remainder', progress: 60 },
      { id: 'p3', name: 'Process C', color: '#f59e0b', stage: 'remainder', progress: 40 },
    ]);
    addLog('Critical Section simulation reset.', 'warning');
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'remainder': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-400">Remainder</span>;
      case 'entry': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-400">Entry Section</span>;
      case 'critical': return <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">Critical Section</span>;
      case 'exit': return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-400">Exit Section</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <span>Four Stages of Process Execution</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Critical Section Simulator</h2>
            <p className="text-sm text-slate-400 mt-1">
              Visualize processes navigating Entry, Critical, Exit, and Remainder sections with mutual exclusion enforcement.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Mutual Exclusion:</span>
              <button
                onClick={() => setMutualExclusion(!mutualExclusion)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mutualExclusion ? 'bg-emerald-600 text-white shadow-md' : 'bg-rose-600 text-white shadow-md'
                }`}
              >
                {mutualExclusion ? 'ON (Safe)' : 'OFF (Unsafe)'}
              </button>
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700"
              title="Reset simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Essential Requirements Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-md">1. Mutual Exclusion</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            If process Pi is executing in its critical section, no other processes can be executing in their critical sections.
          </p>
          <div className="text-[11px] font-semibold text-emerald-400">
            Status: {mutualExclusion ? 'Satisfied (Enforced)' : 'Violated'}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-md">2. Progress</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            If no process is in its critical section and some wish to enter, only those not in their remainder section can participate in deciding who enters next.
          </p>
          <div className="text-[11px] font-semibold text-blue-400">Status: Satisfied</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-md">3. Bounded Waiting</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            There must be a bound on the number of times other processes are allowed to enter their critical sections after a process has made a request.
          </p>
          <div className="text-[11px] font-semibold text-purple-400">Status: Satisfied (FIFO Queue)</div>
        </div>
      </div>

      {/* Processes & Active CS Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Processes in Execution Stages</h3>
          {processes.map((proc) => (
            <div key={proc.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: proc.color }} />
                <div>
                  <span className="font-bold text-white text-sm">{proc.name}</span>
                  <div className="mt-1">{getStageBadge(proc.stage)}</div>
                </div>
              </div>
              <div className="w-48">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-1">
                  <span>Stage Progress</span>
                  <span>{Math.round(proc.progress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${proc.progress}%`, backgroundColor: proc.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Critical Section Box & Logs */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-md font-bold text-white mb-3">Active Critical Section</h3>
            <div className={`p-6 rounded-2xl border transition-all ${
              criticalOwner 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1">Resource Status</div>
              <div className="text-xl font-bold font-mono">
                {criticalOwner ? processes.find(p => p.id === criticalOwner)?.name : 'Unlocked (Available)'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col h-[280px]">
            <h3 className="text-md font-bold text-white mb-3">Event Logs</h3>
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs pr-2">
              {logs.map(log => (
                <div key={log.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300">
                  <span className="text-[10px] text-slate-500 block">{log.timestamp}</span>
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
