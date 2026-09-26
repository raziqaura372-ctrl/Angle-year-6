import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Navigation, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission5({ onComplete }) {
  const [currentTurnAngle, setCurrentTurnAngle] = useState(90);
  const targetTurn = 150;
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleSuccess = () => {
    if (!completed) {
      setCompleted(true);
      completeMission(5, 100, 3);
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-slate-950 font-black shadow-md border border-rose-200">
            <Navigation className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-400/20 text-rose-300 border border-rose-400/40 text-[11px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-rose-300 fill-rose-300" /> MISSION 5 – CARAVAN NAVIGATION
            </div>
            <h2 className="text-2xl font-extrabold text-amber-300 tracking-wide mt-0.5">
              THE LOST DESERT MAP
            </h2>
          </div>
        </div>
        <p className="text-amber-100 text-sm leading-relaxed font-medium">
          🤠 <strong>Luma says:</strong> "A sandstorm is coming! To safely guide our desert camel caravan around the rocky dunes, calculate and set the trajectory turn angle to exactly <strong>{targetTurn}°</strong>!"
        </p>
      </div>

      {/* Dynamic Angle Canvas */}
      <DynamicAngleCanvas
        label="Caravan Waypoint Trajectory Angle"
        targetAngle={targetTurn}
        onAngleChange={(a) => setCurrentTurnAngle(a)}
        showProtractorDefault={true}
        initialAngle={90}
      />

      {/* Formative Feedback */}
      <FormativeFeedback
        currentAngle={currentTurnAngle}
        targetAngle={targetTurn}
        tolerance={2}
        onSuccess={handleSuccess}
      />

      {completed && (
        <div className="p-6 bg-slate-900 rounded-3xl border-2 border-emerald-400/80 oasis-glow text-center space-y-4 shadow-2xl">
          <div className="text-3xl">🐫 Caravan Safely Navigated! 🐫</div>
          <h3 className="font-black text-xl text-emerald-300">
            Badge Unlocked: Desert Navigator
          </h3>
          <p className="text-xs text-amber-100/90 font-medium max-w-md mx-auto">
            You navigated around the sandstorm with turn bearing {targetTurn}°!
          </p>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              PROCEED TO ARCHITECT CHALLENGE <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
