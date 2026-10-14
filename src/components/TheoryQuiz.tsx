import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, BookOpen, Award } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/syncData';

export const TheoryQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const question = QUIZ_QUESTIONS[currentQuestionIndex];
  const selectedOption = selectedAnswers[question.id];
  const isAnswered = selectedOption !== undefined;

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return; // Can't change once selected
    setSelectedAnswers({ ...selectedAnswers, [question.id]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <span>Operating Systems Assessment</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Theory Notes & 10-Question Quiz</h2>
          <p className="text-sm text-slate-400 mt-1">
            Test your comprehension of race conditions, critical sections, semaphores, and deadlock.
          </p>
        </div>
      </div>

      {!showResults ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-slate-400">Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
            <div className="w-32 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-6">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correctAnswer;

                let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-500/20 border-rose-500/40 text-rose-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span className="text-sm">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-fadeIn">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Explanation</div>
              <p className="text-xs text-slate-300 leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {isAnswered && (
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Final Results'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-3xl flex items-center justify-center mx-auto">
            <Award className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
            <p className="text-slate-400 text-sm">You scored <strong className="text-white font-mono">{calculateScore()}</strong> out of <strong className="text-white font-mono">{QUIZ_QUESTIONS.length}</strong></p>
          </div>
          <button
            onClick={handleRestartQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs mx-auto shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
