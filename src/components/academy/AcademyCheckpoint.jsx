import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, ArrowRight, Crown, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Step10Checkpoint({ onComplete, onReview }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 'q1',
      text: '1. What is the common starting point where two rays meet to form an angle?',
      options: ['Baseline', 'Vertex (Titik Sudut)', 'Arc', 'Protractor'],
      correct: 'Vertex (Titik Sudut)'
    },
    {
      id: 'q2',
      text: '2. Which type of angle measures LESS than 90°?',
      options: ['Sudut Tegak', 'Sudut Cakah', 'Sudut Tirus (Acute Angle)', 'Sudut Lurus'],
      correct: 'Sudut Tirus (Acute Angle)'
    },
    {
      id: 'q3',
      text: '3. What symbol is used to represent angle degree measurements?',
      options: ['%', '°', 'cm', 'kg'],
      correct: '°'
    },
    {
      id: 'q4',
      text: '4. An angle that forms an exact square corner of 90° is called a:',
      options: ['Sudut Tegak (Right Angle)', 'Sudut Lurus', 'Sudut Tirus', 'Sudut Cakah'],
      correct: 'Sudut Tegak (Right Angle)'
    },
    {
      id: 'q5',
      text: '5. How many interior angles does a 5-sided Pentagon shape have?',
      options: ['3 Interior Angles', '4 Interior Angles', '5 Interior Angles', '8 Interior Angles'],
      correct: '5 Interior Angles'
    }
  ];

  const handleSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const score = questions.reduce((acc, q) => answers[q.id] === q.correct ? acc + 1 : acc, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (score === 5) {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
    }
  };

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 10: Concept Checkpoint Quiz
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">10. QUICK ACADEMY CHECKPOINT</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          Answer all 5 questions to verify your relational understanding before unlocking Mission 1!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((q) => {
          const userAns = answers[q.id];
          const isCorrect = userAns === q.correct;

          return (
            <div key={q.id} className="glass-panel p-4 rounded-xl border border-amber-400/30 space-y-2">
              <div className="font-bold text-slate-100 text-sm">{q.text}</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelect(q.id, opt)}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                      userAns === opt
                        ? submitted
                          ? isCorrect
                            ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black'
                            : 'bg-rose-500 text-white border-rose-400 font-black'
                          : 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {!submitted && (
          <button
            type="submit"
            disabled={Object.keys(answers).length < 5}
            className={`w-full py-3 rounded-xl font-black text-sm transition-all ${
              Object.keys(answers).length === 5
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 gold-glow hover:scale-[1.02] cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {Object.keys(answers).length === 5 ? 'Submit Checkpoint Answers' : `Answer All 5 Questions (${Object.keys(answers).length}/5)`}
          </button>
        )}
      </form>

      {submitted && (
        <div className={`p-6 rounded-2xl border-2 text-center space-y-3 ${
          score >= 4 ? 'bg-emerald-950/80 border-emerald-400' : 'bg-rose-950/80 border-rose-400'
        }`}>
          <h4 className="font-serif font-black text-xl text-amber-200">
            Checkpoint Results: {score} / 5 Correct!
          </h4>

          {score >= 4 ? (
            <div className="space-y-3">
              <p className="text-xs text-emerald-300 font-bold">
                Mastery Confirmed! You have earned entry into the Desert Geometry Expedition.
              </p>
              <button
                onClick={onComplete}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 text-slate-950 font-black text-base gold-glow hover:scale-105 transition-transform"
              >
                Proceed to Step 11: Unlock Mission 1!
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-rose-300 font-bold">
                You need at least 4/5 to pass. Review the concept steps and try again!
              </p>
              <button
                onClick={onReview}
                className="px-6 py-2.5 rounded-xl bg-slate-900 border border-amber-400 text-amber-300 font-bold text-xs inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Review Concept Lessons
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Step11Unlock({ onStartExpedition }) {
  return (
    <div className="glass-panel p-8 rounded-2xl border-2 border-emerald-400 oasis-glow text-center space-y-5 bg-gradient-to-b from-slate-950 to-purple-950">
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 flex items-center justify-center mx-auto text-3xl font-black shadow-2xl">
        <Crown className="w-10 h-10 animate-bounce" />
      </div>

      <span className="bg-emerald-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
        Desert Geometry Academy Complete
      </span>

      <h2 className="font-serif text-3xl md:text-4xl font-black text-amber-200 tracking-wide">
        DESERT GEOMETRY EXPEDITION UNLOCKED!
      </h2>

      <p className="text-sm text-slate-200 max-w-lg mx-auto leading-relaxed">
        Congratulations! You have mastered the conceptual foundations of angles. You are now fully prepared to lead the expedition across ancient desert gates, oasis compasses, and pyramid sanctuaries!
      </p>

      <button
        onClick={onStartExpedition}
        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 text-slate-950 font-black text-lg gold-glow hover:scale-105 transition-transform"
      >
        Launch Mission 1: The Dune of Angles
      </button>
    </div>
  );
}
