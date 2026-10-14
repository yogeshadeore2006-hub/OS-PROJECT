import React, { useState } from 'react';
import { Eye, Code, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const AlgorithmVisualizer: React.FC = () => {
  const [activeAlg, setActiveAlg] = useState<'peterson' | 'testandset'>('peterson');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
            <span>Classical Software & Hardware Solutions</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Algorithm Visualizer & Analysis</h2>
          <p className="text-sm text-slate-400 mt-1">
            Explore Peterson's Algorithm and Test-and-Set hardware primitives with pseudocode, step-by-step logic, and trade-offs.
          </p>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveAlg('peterson')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeAlg === 'peterson' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Peterson's Algorithm
          </button>
          <button
            onClick={() => setActiveAlg('testandset')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeAlg === 'testandset' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Test-and-Set (TSL)
          </button>
        </div>
      </div>

      {activeAlg === 'peterson' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Explanation & Properties */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white">Peterson's Algorithm (Two Processes)</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Peterson's algorithm is a concurrent programming algorithm for mutual exclusion that allows two processes to share a single-use resource without conflict, using only shared memory for communication.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Shared Variables</h4>
                <p className="text-xs text-slate-300"><code>boolean flag[2];</code> and <code>int turn;</code></p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Modern Multiprocessor Warning</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Peterson's Algorithm assumes atomic memory operations and sequential memory ordering. On modern CPUs with out-of-order execution and memory reordering, explicit memory barriers are required.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Pseudocode */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Peterson's Pseudocode (Process i)</span>
              </h3>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`int i = process_id;
int j = 1 - i; // other process

do {
    flag[i] = true;
    turn = j;
    while (flag[j] && turn == j); // busy wait

    // --- CRITICAL SECTION ---

    flag[i] = false; // reminder section

    // --- REMAINDER SECTION ---
} while (true);`}
            </pre>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: TSL Explanation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white">Test-and-Set Instruction (Hardware Primitive)</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Many modern computer architectures provide special atomic hardware instructions like <code>TestAndSet()</code> or <code>CompareAndSwap()</code> that allow reading and modifying memory word contents in a single uninterruptible instruction.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Atomicity Guarantee</h4>
                <p className="text-xs text-slate-300">Executed by hardware memory bus lock, preventing interleaving across CPU cores.</p>
              </div>
            </div>
          </div>

          {/* Right: TSL Pseudocode */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Test-and-Set Mutex Lock</span>
              </h3>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`boolean lock = false; // global shared

void TestAndSet(boolean *target) {
    boolean rv = *target;
    *target = true;
    return rv;
}

void acquire_lock() {
    while (TestAndSet(&lock))
        do_nothing(); // spinlock busy wait
}

void release_lock() {
    lock = false;
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
