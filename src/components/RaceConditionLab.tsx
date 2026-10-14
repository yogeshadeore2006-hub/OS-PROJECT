import React, { useState } from 'react';
import { Zap, ShieldCheck, Play, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

interface RaceConditionLabProps {
  onIncrementStat: (stat: 'processesCount' | 'csEntries' | 'raceConditions' | 'completedOps', amount?: number) => void;
}

export const RaceConditionLab: React.FC<RaceConditionLabProps> = ({ onIncrementStat }) => {
  const [mode, setMode] = useState<'unsafe' | 'safe'>('unsafe');
  const [sharedVar, setSharedVar] = useState<number>(0);
  const [p1Step, setP1Step] = useState<number>(0); // 0: Idle, 1: Read, 2: Compute, 3: Write, 4: Done
  const [p2Step, setP2Step] = useState<number>(0); // 0: Idle, 1: Read, 2: Compute, 3: Write, 4: Done
  const [p1Local, setP1Local] = useState<number | null>(null);
  const [p2Local, setP2Local] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationFinished, setSimulationFinished] = useState<boolean>(false);
  const [explanationLog, setExplanationLog] = useState<string[]>([]);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationFinished(false);
    setSharedVar(0);
    setP1Step(0);
    setP2Step(0);
    setP1Local(null);
    setP2Local(null);
    setExplanationLog(['Starting deterministic simulation...']);

    if (mode === 'unsafe') {
      // Unsafe interleaving sequence
      setTimeout(() => {
        setP1Step(1); // P1 reads
        setP1Local(0);
        setExplanationLog(prev => [...prev, 'Process P1 reads shared variable (value = 0).']);
      }, 600);

      setTimeout(() => {
        setP2Step(1); // P2 reads before P1 writes
        setP2Local(0);
        setExplanationLog(prev => [...prev, 'Process P2 reads shared variable (value = 0) before P1 writes! RACE CONDITION!']);
      }, 1400);

      setTimeout(() => {
        setP1Step(2); // P1 computes locally (0 + 1 = 1)
        setP1Local(1);
        setExplanationLog(prev => [...prev, 'Process P1 computes local result (0 + 1 = 1).']);
      }, 2200);

      setTimeout(() => {
        setP2Step(2); // P2 computes locally (0 + 1 = 1)
        setP2Local(1);
        setExplanationLog(prev => [...prev, 'Process P2 computes local result (0 + 1 = 1).']);
      }, 3000);

      setTimeout(() => {
        setP1Step(3); // P1 writes back 1
        setSharedVar(1);
        setExplanationLog(prev => [...prev, 'Process P1 writes back value 1 to shared variable.']);
      }, 3800);

      setTimeout(() => {
        setP2Step(3); // P2 writes back 1, overwriting P1
        setSharedVar(1);
        setExplanationLog(prev => [...prev, 'Process P2 writes back value 1, OVERWRITING P1\'s result! Final value is 1 instead of 2.']);
        setP1Step(4);
        setP2Step(4);
        setIsSimulating(false);
        setSimulationFinished(true);
        onIncrementStat('raceConditions', 1);
      }, 4600);

    } else {
      // Safe synchronized sequence (Mutual Exclusion)
      setTimeout(() => {
        setP1Step(1); // P1 acquires lock, reads, computes, writes
        setP1Local(0);
        setExplanationLog(prev => [...prev, '[Safe Mode] Process P1 acquires Mutex lock.']);
      }, 600);

      setTimeout(() => {
        setP1Step(2);
        setP1Local(1);
        setExplanationLog(prev => [...prev, 'Process P1 reads (0) and computes local result (1).']);
      }, 1400);

      setTimeout(() => {
        setP1Step(3);
        setSharedVar(1);
        setExplanationLog(prev => [...prev, 'Process P1 writes back 1 and releases Mutex lock.']);
        setP1Step(4);
      }, 2200);

      setTimeout(() => {
        setP2Step(1); // P2 acquires lock
        setP2Local(1);
        setExplanationLog(prev => [...prev, 'Process P2 acquires Mutex lock (wait queue cleared).']);
      }, 3000);

      setTimeout(() => {
        setP2Step(2);
        setP2Local(2);
        setExplanationLog(prev => [...prev, 'Process P2 reads (1) and computes local result (2).']);
      }, 3800);

      setTimeout(() => {
        setP2Step(3);
        setSharedVar(2);
        setExplanationLog(prev => [...prev, 'Process P2 writes back 2 and releases Mutex lock. Final value is correct: 2!']);
        setP2Step(4);
        setIsSimulating(false);
        setSimulationFinished(true);
        onIncrementStat('csEntries', 2);
      }, 4600);
    }
  };

  const handleReset = () => {
    setIsSimulating(false);
    setSimulationFinished(false);
    setSharedVar(0);
    setP1Step(0);
    setP2Step(0);
    setP1Local(null);
    setP2Local(null);
    setExplanationLog([]);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <span>Memory Interleaving & Atomicity</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Race Condition Demonstration</h2>
            <p className="text-sm text-slate-400 mt-1">
              Observe how unprotected concurrent increments of a shared variable (starting at 0) can result in a corrupted value of 1 instead of 2.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => { setMode('unsafe'); handleReset(); }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'unsafe' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Unsafe Mode
              </button>
              <button
                onClick={() => { setMode('safe'); handleReset(); }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === 'safe' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Safe Mode (Mutex)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control & Shared Variable Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Simulation Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shared Variable (Counter)</span>
                <div className="text-4xl font-extrabold text-white font-mono mt-1 flex items-center gap-3">
                  <span>{sharedVar}</span>
                  <span className="text-xs font-normal text-slate-500">(Expected: {mode === 'safe' ? '2' : simulationFinished && sharedVar === 1 ? '2 (Failed)' : '2'})</span>
                </div>
              </div>
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isSimulating ? 'Running Simulation...' : 'Run Experiment'}</span>
              </button>
            </div>

            {/* Three Step Breakdown Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-400 mb-1">Step 1: Read</div>
                <p className="text-xs text-slate-400">Process reads current value of shared variable into local register.</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-purple-400 mb-1">Step 2: Add 1</div>
                <p className="text-xs text-slate-400">Process increments its local register copy by 1.</p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-emerald-400 mb-1">Step 3: Write</div>
                <p className="text-xs text-slate-400">Process writes local result back to shared memory location.</p>
              </div>
            </div>

            {/* Process P1 & P2 Execution Tracks */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              {/* Process P1 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />
                  <span className="font-bold text-white text-sm">Process P1</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span>Local: {p1Local !== null ? p1Local : '-'}</span>
                  <span className={`px-2.5 py-1 rounded-md ${
                    p1Step === 0 ? 'bg-slate-800 text-slate-400' :
                    p1Step === 4 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {p1Step === 0 ? 'Idle' : p1Step === 1 ? 'Reading (v=0)' : p1Step === 2 ? 'Adding 1' : p1Step === 3 ? 'Writing back' : 'Completed'}
                  </span>
                </div>
              </div>

              {/* Process P2 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-white text-sm">Process P2</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span>Local: {p2Local !== null ? p2Local : '-'}</span>
                  <span className={`px-2.5 py-1 rounded-md ${
                    p2Step === 0 ? 'bg-slate-800 text-slate-400' :
                    p2Step === 4 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {p2Step === 0 ? 'Idle' : p2Step === 1 ? 'Reading (v=0)' : p2Step === 2 ? 'Adding 1' : p2Step === 3 ? 'Writing back' : 'Completed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Analysis & Explanation Log */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
              {mode === 'unsafe' ? <AlertTriangle className="w-5 h-5 text-amber-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
              <span>{mode === 'unsafe' ? 'Unsafe Analysis' : 'Synchronized Analysis'}</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {mode === 'unsafe' 
                ? 'Without mutual exclusion, P1 and P2 read the initial value 0 simultaneously. Both compute 0 + 1 = 1 and write back 1. The first increment is lost.'
                : 'With a Mutex lock, P2 must wait until P1 completes its entire Read-Compute-Write cycle. P2 reads 1, computes 1 + 1 = 2, resulting in the correct final value.'}
            </p>

            <div className="space-y-2 font-mono text-[11px] max-h-64 overflow-y-auto">
              {explanationLog.map((log, index) => (
                <div key={index} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
