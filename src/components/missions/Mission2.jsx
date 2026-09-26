import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Target, Compass, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission2({ onComplete }) {
  const [angle, setAngle] = useState(75);
  const targetAngle = 135;
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleSuccess = () => {
    if (!completed) {
      setCompleted(true);
      completeMission(2, 100, 3);
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="desert-card p-6 rounded-3xl border-2 border-amber-400/60 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-slate-950 font-black shadow-md border border-sky-200">
            <Target className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-400/20 text-sky-300 border border-sky-400/40 text-[11px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-sky-300 fill-sky-300" /> MISSION 2 – PROTRACTOR MEASUREMENT
            </div>
            <h2 className="text-2xl font-extrabold text-amber-300 tracking-wide mt-0.5">
              THE OASIS COMPASS
            </h2>
          </div>
        </div>
        <p className="text-amber-100 text-sm leading-relaxed font-medium">
          🤠 <strong>Luma says:</strong> "An ancient oasis compass points toward a crystal spring! We need to measure an exact angle bearing of <strong>{targetAngle}°</strong> using our virtual protractor overlay. Align the protractor base and adjust the ray!"
        </p>
      </div>

      {/* Dynamic Protractor Canvas */}
      <DynamicAngleCanvas
        label="Oasis Compass Bearing Alignment"
        targetAngle={targetAngle}
        onAngleChange={(a) => setAngle(a)}
        showProtractorDefault={true}
        initialAngle={75}
      />

      {/* Formative Feedback */}
      <FormativeFeedback
        currentAngle={angle}
        targetAngle={targetAngle}
        tolerance={2}
        onSuccess={handleSuccess}
      />

      {completed && (
        <div className="p-6 bg-slate-900 rounded-3xl border-2 border-emerald-400/80 oasis-glow text-center space-y-4 shadow-2xl">
          <div className="text-3xl">🌴 Oasis Water Discovered! 🌴</div>
          <h3 className="font-black text-xl text-emerald-300">
            Badge Unlocked: Precision Measurer
          </h3>
          <p className="text-xs text-amber-100/90 font-medium max-w-md mx-auto">
            You successfully measured {targetAngle}°! The Ancient Gate lies ahead!
          </p>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              UNLOCK ANCIENT GATE <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
