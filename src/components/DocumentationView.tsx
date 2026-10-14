import React from 'react';
import { BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
          <span>College Computer Science Project</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Project Documentation & How-To Guide</h2>
        <p className="text-sm text-slate-400 mt-2">
          Comprehensive technical overview, system architecture, working methodology, and step-by-step simulation guide for SyncLab.
        </p>
      </div>

      <div className="space-y-6">
        {/* Abstract */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>Abstract & Problem Statement</span>
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Process synchronization is a foundational pillar of Operating Systems design, ensuring that concurrent processes or threads share resources without memory corruption or race conditions. Abstract textbook definitions often fall short of building rigorous mental models. <strong className="text-white">SyncLab</strong> provides an interactive browser-based simulation suite bridging theory and practice for Computer Science students.
          </p>
        </div>

        {/* Objectives & Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
            <h3 className="text-md font-bold text-white">Project Objectives</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Demystify memory interleaving and race conditions through visual step-by-step execution.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Demonstrate mutual exclusion enforcement across Entry, Critical, Exit, and Remainder sections.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Implement classical synchronization problems including Producer-Consumer, Readers-Writers, and Dining Philosophers.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
            <h3 className="text-md font-bold text-white">Technologies Used</h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {['React 19', 'TypeScript', 'Tailwind CSS', 'Lucide Icons', 'Vite', 'Discrete-Event Engine'].map((tech, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* How to Use Guide */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>How to Use the Simulations</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold font-mono text-blue-400">01. Process Simulator</span>
              <p className="text-xs text-slate-300">Add up to 5 processes, configure speeds, and click Start to watch state transitions in real time.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold font-mono text-amber-400">02. Race Condition Lab</span>
              <p className="text-xs text-slate-300">Compare Unsafe vs Safe modes to observe memory overwrites and mutex protection on shared variables.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold font-mono text-purple-400">03. Code Playground</span>
              <p className="text-xs text-slate-300">Examine production-grade C pthread mutexes and POSIX semaphores with copy-to-clipboard buttons.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
