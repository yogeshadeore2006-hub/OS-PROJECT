import React, { useState } from 'react';
import { ViewMode } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProcessSimulator } from './components/ProcessSimulator';
import { RaceConditionLab } from './components/RaceConditionLab';
import { CriticalSectionSimulator } from './components/CriticalSectionSimulator';
import { AlgorithmsModule } from './components/AlgorithmsModule';
import { AlgorithmVisualizer } from './components/AlgorithmVisualizer';
import { CodePlayground } from './components/CodePlayground';
import { TheoryQuiz } from './components/TheoryQuiz';
import { DocumentationView } from './components/DocumentationView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Global simulation stats
  const [stats, setStats] = useState({
    processesCount: 3,
    csEntries: 12,
    raceConditions: 3,
    completedOps: 24,
  });

  const incrementStat = (key: keyof typeof stats, amount: number = 1) => {
    setStats(prev => ({ ...prev, [key]: prev[key] + amount }));
  };

  const handleResetAll = () => {
    setStats({
      processesCount: 3,
      csEntries: 0,
      raceConditions: 0,
      completedOps: 0,
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onSelectView={setCurrentView} onResetAll={handleResetAll} stats={stats} />;
      case 'process-simulator':
        return <ProcessSimulator onIncrementStat={incrementStat} />;
      case 'race-condition':
        return <RaceConditionLab onIncrementStat={incrementStat} />;
      case 'critical-section':
        return <CriticalSectionSimulator onIncrementStat={incrementStat} />;
      case 'algorithms':
        return <AlgorithmsModule onIncrementStat={incrementStat} />;
      case 'visualizer':
        return <AlgorithmVisualizer />;
      case 'playground':
        return <CodePlayground />;
      case 'quiz':
        return <TheoryQuiz />;
      case 'docs':
        return <DocumentationView />;
      default:
        return <Dashboard onSelectView={setCurrentView} onResetAll={handleResetAll} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onSelectView={setCurrentView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          currentView={currentView} 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          onResetAll={handleResetAll} 
          stats={stats} 
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}
