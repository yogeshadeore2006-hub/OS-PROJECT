import React, { useState } from 'react';
import { Code, Copy, Check, Terminal } from 'lucide-react';
import { CODE_SAMPLES } from '../data/syncData';

export const CodePlayground: React.FC = () => {
  const [activeSnippet, setActiveSnippet] = useState<'c_mutex' | 'c_semaphore' | 'producer_consumer_pseudocode'>('c_mutex');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeContent = () => {
    switch (activeSnippet) {
      case 'c_mutex': return CODE_SAMPLES.c_mutex;
      case 'c_semaphore': return CODE_SAMPLES.c_semaphore;
      case 'producer_consumer_pseudocode': return CODE_SAMPLES.producer_consumer_pseudocode;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
            <span>POSIX Threads & C Pthread Library</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Code Learning Playground</h2>
          <p className="text-sm text-slate-400 mt-1">
            Examine production-grade C pthread mutexes and POSIX semaphores. Code is educational and simulated interactively.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'c_mutex', label: 'C Pthread Mutex' },
            { id: 'c_semaphore', label: 'POSIX Semaphore' },
            { id: 'producer_consumer_pseudocode', label: 'Producer-Consumer' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSnippet(item.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSnippet === item.id ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Window */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-14 bg-slate-950 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Terminal className="w-4 h-4 text-rose-400" />
            <span>{activeSnippet === 'producer_consumer_pseudocode' ? 'producer_consumer.pcode' : 'sync_experiment.c'}</span>
          </div>
          <button
            onClick={() => handleCopy(getCodeContent())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
            {getCodeContent()}
          </pre>
        </div>
      </div>
    </div>
  );
};
