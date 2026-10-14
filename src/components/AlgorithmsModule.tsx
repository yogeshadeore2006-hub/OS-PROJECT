import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Users, 
  Utensils, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface AlgorithmsModuleProps {
  onIncrementStat: (stat: 'processesCount' | 'csEntries' | 'raceConditions' | 'completedOps', amount?: number) => void;
}

export const AlgorithmsModule: React.FC<AlgorithmsModuleProps> = ({ onIncrementStat }) => {
  const [activeTab, setActiveTab] = useState<'mutex' | 'semaphore' | 'producer-consumer' | 'readers-writers' | 'dining-philosophers'>('mutex');

  // Mutex state
  const [mutexLocked, setMutexLocked] = useState<boolean>(false);
  const [mutexOwner, setMutexOwner] = useState<string | null>(null);

  // Semaphore state
  const [semValue, setSemValue] = useState<number>(2);
  const [semQueue, setSemQueue] = useState<number>(1);

  // Producer-Consumer state
  const [bufferSize, setBufferSize] = useState<number>(3);
  const [bufferItems, setBufferItems] = useState<number[]>([]);
  const [pcRunning, setPcRunning] = useState<boolean>(false);

  // Readers-Writers state
  const [activeReaders, setActiveReaders] = useState<number>(0);
  const [writerActive, setWriterActive] = useState<boolean>(false);

  // Dining Philosophers state
  const [philosophers, setPhilosophers] = useState<Array<{ id: number; state: 'thinking' | 'hungry' | 'eating'; forks: [boolean, boolean] }>>([
    { id: 1, state: 'thinking', forks: [false, false] },
    { id: 2, state: 'thinking', forks: [false, false] },
    { id: 3, state: 'thinking', forks: [false, false] },
    { id: 4, state: 'thinking', forks: [false, false] },
    { id: 5, state: 'thinking', forks: [false, false] },
  ]);
  const [preventionMode, setPreventionMode] = useState<boolean>(true);

  // Producer-Consumer simulation loop
  useEffect(() => {
    if (!pcRunning || activeTab !== 'producer-consumer') return;
    const interval = setInterval(() => {
      setBufferItems(prev => {
        const isProducing = Math.random() > 0.5;
        if (isProducing && prev.length < bufferSize) {
          onIncrementStat('completedOps', 1);
          return [...prev, Math.floor(Math.random() * 100)];
        } else if (!isProducing && prev.length > 0) {
          onIncrementStat('completedOps', 1);
          return prev.slice(1);
        }
        return prev;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [pcRunning, activeTab, bufferSize]);

  return (
    <div className="space-y-8 pb-12">
      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
        {[
          { id: 'mutex', label: 'Mutex Lock', icon: Lock },
          { id: 'semaphore', label: 'Semaphore', icon: Layers },
          { id: 'producer-consumer', label: 'Producer-Consumer', icon: Cpu },
          { id: 'readers-writers', label: 'Readers-Writers', icon: Users },
          { id: 'dining-philosophers', label: 'Dining Philosophers', icon: Utensils },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE A: MUTEX LOCK */}
      {activeTab === 'mutex' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                <span>Mutual Exclusion Primitive</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Mutex Lock Simulation</h2>
              <p className="text-sm text-slate-400 mt-1">
                A mutex lock is a synchronization mechanism used to enforce limit on access to a resource in an environment where there are many threads of execution.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-6">
              <div className={`inline-flex p-5 rounded-2xl border ${
                mutexLocked ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}>
                {mutexLocked ? <Lock className="w-10 h-10" /> : <Unlock className="w-10 h-10" />}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lock State</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {mutexLocked ? `Locked by ${mutexOwner}` : 'Unlocked (Available)'}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    if (!mutexLocked) {
                      setMutexLocked(true);
                      setMutexOwner('Process P1');
                      onIncrementStat('csEntries', 1);
                    }
                  }}
                  disabled={mutexLocked}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Acquire Lock (acquire())
                </button>
                <button
                  onClick={() => {
                    if (mutexLocked) {
                      setMutexLocked(false);
                      setMutexOwner(null);
                      onIncrementStat('completedOps', 1);
                    }
                  }}
                  disabled={!mutexLocked}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  Release Lock (release())
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-md">Mutex Characteristics</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>Enforces strict binary ownership (only the thread that locked can unlock).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>Prevents concurrent race conditions on shared data structures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>Busy waiting (spinlocks) vs blocking mutexes (OS kernel sleep queue).</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* MODULE B: SEMAPHORE */}
      {activeTab === 'semaphore' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
                <span>Counting & Binary Semaphores</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Semaphore Simulation (wait & signal)</h2>
              <p className="text-sm text-slate-400 mt-1">
                Semaphores are integer variables accessed through two atomic operations: wait() (P) and signal() (V).
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-6">
              <div className="inline-flex px-6 py-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-4xl font-mono font-extrabold">
                S = {semValue}
              </div>
              <div className="text-xs text-slate-400">Available resource counter</div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setSemValue(v => v + 1);
                    onIncrementStat('completedOps', 1);
                  }}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  Signal (V) / Increment
                </button>
                <button
                  onClick={() => {
                    if (semValue > 0) {
                      setSemValue(v => v - 1);
                      onIncrementStat('csEntries', 1);
                    } else {
                      setSemQueue(q => q + 1);
                    }
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  Wait (P) / Decrement
                </button>
              </div>

              <div className="text-xs text-slate-500 font-mono pt-2">
                Processes waiting in queue: {semQueue}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-md">Semaphore Operations</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-purple-400 block mb-1">wait(S) / P():</strong>
                <code>{`while S <= 0; // no-op\nS--;`}</code>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-purple-400 block mb-1">signal(S) / V():</strong>
                <code>{`S++;`}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE C: PRODUCER-CONSUMER */}
      {activeTab === 'producer-consumer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                  <span>Bounded Buffer Problem</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Producer-Consumer Simulation</h2>
              </div>
              <button
                onClick={() => setPcRunning(!pcRunning)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs ${
                  pcRunning ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {pcRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{pcRunning ? 'Pause Buffer' : 'Start Buffer'}</span>
              </button>
            </div>

            {/* Buffer slots visualization */}
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Buffer Capacity: {bufferSize}</span>
                <span>Occupied Slots: {bufferItems.length} / {bufferSize}</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: bufferSize }).map((_, i) => {
                  const item = bufferItems[i];
                  const hasItem = item !== undefined;
                  return (
                    <div 
                      key={i} 
                      className={`h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        hasItem 
                          ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-md' 
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-600'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-mono text-slate-500">Slot {i}</span>
                      <span className="text-sm font-bold font-mono mt-1">{hasItem ? item : 'Empty'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-md">Buffer Controls</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <label className="block text-slate-400">Buffer Capacity (1 - 5):</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={bufferSize} 
                onChange={(e) => setBufferSize(Number(e.target.value))} 
                className="w-full accent-blue-500"
              />
              <div className="text-center font-mono font-bold text-white">{bufferSize} Slots</div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE D: READERS-WRITERS */}
      {activeTab === 'readers-writers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <span>Shared Database Access</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Readers-Writers Problem</h2>
              <p className="text-sm text-slate-400 mt-1">
                Multiple readers can read concurrently, but writers require exclusive access to prevent data corruption.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Readers</div>
                <div className="text-4xl font-bold font-mono text-blue-400">{activeReaders}</div>
                <button
                  onClick={() => setActiveReaders(r => r + 1)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                >
                  Add Reader
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Writer Status</div>
                <div className={`text-xl font-bold font-mono ${writerActive ? 'text-rose-400' : 'text-slate-500'}`}>
                  {writerActive ? 'Writing (Exclusive)' : 'Idle'}
                </div>
                <button
                  onClick={() => {
                    setWriterActive(!writerActive);
                    if (!writerActive) setActiveReaders(0);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    writerActive ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {writerActive ? 'Stop Writer' : 'Start Writer'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-md">Fairness & Starvation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If reader priority is absolute, writers can experience indefinite starvation. Solution variants include writer-priority semaphores.
            </p>
          </div>
        </div>
      )}

      {/* MODULE E: DINING PHILOSOPHERS */}
      {activeTab === 'dining-philosophers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
                <span>Deadlock & Circular Wait</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Dining Philosophers Problem</h2>
              <p className="text-sm text-slate-400 mt-1">
                Five philosophers share a circular table with five forks. Each needs two forks to eat, risking deadlock if all pick up their left fork simultaneously.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {philosophers.map((phil) => (
                <div key={phil.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs">
                      P{phil.id}
                    </div>
                    <span className="text-sm font-bold text-white">Philosopher {phil.id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      phil.state === 'eating' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      phil.state === 'hungry' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {phil.state.toUpperCase()}
                    </span>
                    <button
                      onClick={() => {
                        setPhilosophers(prev => prev.map(p => p.id === phil.id ? { ...p, state: p.state === 'eating' ? 'thinking' : 'eating' } : p));
                        onIncrementStat('csEntries', 1);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg border border-slate-700"
                    >
                      Toggle Eat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-md">Deadlock Prevention</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={preventionMode} 
                  onChange={() => setPreventionMode(!preventionMode)} 
                  className="accent-blue-500"
                />
                <span className="font-semibold text-white">Asymmetric Fork Pickup (Prevent Circular Wait)</span>
              </label>
              <p className="text-slate-400 leading-relaxed">
                Allow an odd philosopher to pick up left fork first, and even philosopher to pick up right fork first, preventing circular wait deadlock.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
