import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Cpu, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { ProcessItem, ProcessState, SimulationLog } from '../types';

interface ProcessSimulatorProps {
  onIncrementStat: (stat: 'processesCount' | 'csEntries' | 'raceConditions' | 'completedOps', amount?: number) => void;
}

export const ProcessSimulator: React.FC<ProcessSimulatorProps> = ({ onIncrementStat }) => {
  const [processes, setProcesses] = useState<ProcessItem[]>([
    { id: 'p1', name: 'Process P1', color: '#3b82f6', speed: 2, state: 'ready', progress: 0, timeInState: 0 },
    { id: 'p2', name: 'Process P2', color: '#10b981', speed: 3, state: 'ready', progress: 0, timeInState: 0 },
    { id: 'p3', name: 'Process P3', color: '#f59e0b', speed: 1, state: 'new', progress: 0, timeInState: 0 },
  ]);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null);
  const [logs, setLogs] = useState<SimulationLog[]>([
    { id: 'l1', timestamp: new Date().toLocaleTimeString(), message: 'Process simulator initialized with 3 processes.', type: 'info' }
  ]);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  const addProcess = () => {
    if (processes.length >= 5) return;
    const newId = `p${processes.length + 1}`;
    const newProc: ProcessItem = {
      id: newId,
      name: `Process P${processes.length + 1}`,
      color: colors[processes.length % colors.length],
      speed: 2,
      state: 'new',
      progress: 0,
      timeInState: 0
    };
    setProcesses([...processes, newProc]);
    onIncrementStat('processesCount', 1);
    addLog(`Created ${newProc.name} in NEW state.`, 'info');
  };

  const removeProcess = (id: string) => {
    if (processes.length <= 2) return;
    setProcesses(processes.filter(p => p.id !== id));
    if (activeProcessId === id) setActiveProcessId(null);
    addLog(`Removed process ${id}.`, 'warning');
  };

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error', processId?: string) => {
    const newLog: SimulationLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      processId
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // Simulation tick loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProcesses(prev => {
        // If there's an active running process, update its progress
        let currentActive = activeProcessId;
        const updated = prev.map(p => {
          if (p.state === 'terminated') return p;

          // If process is running
          if (p.id === currentActive) {
            const nextProg = p.progress + (p.speed * 4);
            if (nextProg >= 100) {
              // Terminated
              addLog(`${p.name} completed execution and terminated.`, 'success', p.id);
              onIncrementStat('completedOps', 1);
              currentActive = null;
              return { ...p, progress: 100, state: 'terminated' as ProcessState, timeInState: 0 };
            }
            return { ...p, progress: nextProg, timeInState: p.timeInState + 1 };
          }

          // State transitions for other processes
          if (p.state === 'new') {
            return { ...p, state: 'ready' as ProcessState, timeInState: 0 };
          }

          // Ready processes can transition to running if no process is running
          if (!currentActive && p.state === 'ready' && Math.random() > 0.3) {
            currentActive = p.id;
            addLog(`${p.name} acquired CPU and entered RUNNING state (Critical Section access).`, 'info', p.id);
            onIncrementStat('csEntries', 1);
            return { ...p, state: 'running' as ProcessState, timeInState: 0 };
          }

          // Randomly transition some ready to waiting
          if (p.state === 'ready' && Math.random() > 0.8) {
            addLog(`${p.name} moved to WAITING state (I/O burst).`, 'warning', p.id);
            return { ...p, state: 'waiting' as ProcessState, timeInState: 0 };
          }

          // Waiting back to ready
          if (p.state === 'waiting' && Math.random() > 0.5) {
            addLog(`${p.name} I/O completed, returned to READY state.`, 'info', p.id);
            return { ...p, state: 'ready' as ProcessState, timeInState: 0 };
          }

          return p;
        });

        setActiveProcessId(currentActive);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, activeProcessId]);

  const handleReset = () => {
    setIsRunning(false);
    setActiveProcessId(null);
    setProcesses([
      { id: 'p1', name: 'Process P1', color: '#3b82f6', speed: 2, state: 'ready', progress: 0, timeInState: 0 },
      { id: 'p2', name: 'Process P2', color: '#10b981', speed: 3, state: 'ready', progress: 0, timeInState: 0 },
      { id: 'p3', name: 'Process P3', color: '#f59e0b', speed: 1, state: 'new', progress: 0, timeInState: 0 },
    ]);
    addLog('Simulation reset to initial state.', 'warning');
  };

  const getStateBadge = (state: ProcessState) => {
    switch (state) {
      case 'new': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">New</span>;
      case 'ready': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">Ready</span>;
      case 'running': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">Running (CS)</span>;
      case 'waiting': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Waiting</span>;
      case 'terminated': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-500">Terminated</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Intro Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <span>Process Execution & States</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Interactive Process Scheduler & Simulator</h2>
            <p className="text-sm text-slate-400 mt-1">
              Observe process life cycles as they transition through New, Ready, Running (Critical Section), Waiting, and Terminated states.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                isRunning 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Pause Simulation' : 'Start Simulation'}</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Process Management & Active Shared Resource */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Processes List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">Active Processes ({processes.length}/5)</h3>
            <button
              onClick={addProcess}
              disabled={processes.length >= 5 || isRunning}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-xl border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Process</span>
            </button>
          </div>

          <div className="space-y-4">
            {processes.map((proc) => (
              <div 
                key={proc.id} 
                className={`bg-slate-900/80 border rounded-2xl p-5 transition-all ${
                  proc.id === activeProcessId 
                    ? 'border-blue-500/80 shadow-lg shadow-blue-500/10 bg-slate-900' 
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: proc.color }} />
                    <span className="font-bold text-white">{proc.name}</span>
                    {getStateBadge(proc.state)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-400 font-mono">Speed: {proc.speed}x</div>
                    {processes.length > 2 && !isRunning && (
                      <button
                        onClick={() => removeProcess(proc.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Remove process"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Execution Progress</span>
                    <span>{Math.round(proc.progress)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full transition-all duration-300 rounded-full" 
                      style={{ width: `${proc.progress}%`, backgroundColor: proc.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Shared Resource Monitor & Live Logs */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span>Shared Resource Status</span>
            </h3>
            <div className={`p-4 rounded-xl border text-center transition-all ${
              activeProcessId 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1">Critical Section Owner</div>
              <div className="text-lg font-bold font-mono">
                {activeProcessId ? processes.find(p => p.id === activeProcessId)?.name : 'None (Idle)'}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col h-[340px]">
            <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>Real-Time Execution Log</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 font-mono text-xs">
              {logs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{log.timestamp}</span>
                    <span className={`uppercase font-bold ${
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'warning' ? 'text-amber-400' :
                      log.type === 'error' ? 'text-rose-400' : 'text-blue-400'
                    }`}>{log.type}</span>
                  </div>
                  <div className="text-slate-300">{log.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
