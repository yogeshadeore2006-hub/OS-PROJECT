export type ViewMode = 
  | 'dashboard' 
  | 'process-simulator' 
  | 'race-condition' 
  | 'critical-section' 
  | 'algorithms' 
  | 'visualizer' 
  | 'playground' 
  | 'quiz' 
  | 'docs';

export type ProcessState = 'new' | 'ready' | 'running' | 'waiting' | 'terminated';

export interface ProcessItem {
  id: string;
  name: string;
  color: string;
  speed: number; // 1 to 5
  state: ProcessState;
  progress: number; // 0 to 100
  timeInState: number;
}

export interface SimulationLog {
  id: string;
  timestamp: string;
  processId?: string;
  processName?: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
