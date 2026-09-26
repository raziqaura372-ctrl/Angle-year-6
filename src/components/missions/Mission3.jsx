import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Key, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission3({ onComplete }) {
  const [angle, setAngle] = useState(30);
  const targetAngle = 110;
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleSuccess = () => {
    if (!completed) {
      setCompleted(true);
      completeMission(3, 100, 3);
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md border border-orange-200">
            <Key className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-400/20 text-orange-300 border border-orange-400/40 text-[11px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-orange-300 fill-orange-300" /> MISSION 3 – DSKP 6.1.2 CONSTRUCT ANGLES
            </div>
            <h2 className="text-2xl font-extrabold text-amber-300 tracking-wide mt-0.5">
              THE ANCIENT GATE
            </h2>
          </div>
        </div>
        <p className="text-amber-100 text-sm leading-relaxed font-medium">
          🤠 <strong>Luma says:</strong> "Explorer Luma has reached the Ancient Gate! The carved stone lintel reads: <em>'The gate only opens when the angle is constructed to exactly {targetAngle}°'</em>. Can you construct the correct angle to release the locking gears?"
        </p>
      </div>

      {/* Dynamic Angle Canvas */}
      <DynamicAngleCanvas
        label="Ancient Gate Mechanical Lock Construct"
        targetAngle={targetAngle}
        onAngleChange={(a) => setAngle(a)}
        showProtractorDefault={false}
        initialAngle={40}
      />

      {/* Formative Feedback */}
      <FormativeFeedback
        currentAngle={angle}
        targetAngle={targetAngle}
        tolerance={1}
        onSuccess={handleSuccess}
      />

      {completed && (
        <div className="p-6 bg-slate-900 rounded-3xl border-2 border-emerald-400/80 oasis-glow text-center space-y-4 shadow-2xl">
          <div className="text-3xl">🏛️ THE ANCIENT GATE IS OPEN! 🏛️</div>
          <h3 className="font-black text-xl text-emerald-300">
            Badge Unlocked: Gate Key Master
          </h3>
          <p className="text-xs text-amber-100/90 font-medium max-w-md mx-auto">
            You successfully constructed an angle of {targetAngle}°! Ancient passage unlocked!
          </p>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              ENTER GEOMETRIC TEMPLE <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
