import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Compass, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission0({ onComplete }) {
  const [angle, setAngle] = useState(45);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleFinish = () => {
    if (!completed) {
      setCompleted(true);
      completeMission(0, 100, 3);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback if confetti unavailable
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Playful Banner */}
      <div className="desert-card p-6 rounded-3xl border-2 border-amber-400/60 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md border border-amber-200">
            <Compass className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> MISSION 0 – TUTORIAL
            </div>
            <h2 className="text-2xl font-extrabold text-amber-300 tracking-wide mt-0.5">
              DESERT ARRIVAL & RAY EXPLORATION
            </h2>
          </div>
        </div>
        <p className="text-amber-100 text-sm leading-relaxed font-medium">
          🤠 <strong>Luma says:</strong> "Welcome, Explorer! Before we travel across ancient sand dunes, let's learn how angles work! An angle has a <strong>Vertex (Titik Sudut)</strong> where two colorful <strong>Rays (Lengan Sudut)</strong> meet. Drag the golden handle to change the angle!"
        </p>
      </div>

      {/* Dynamic Canvas */}
      <DynamicAngleCanvas
        label="Dynamic Ray Controls & Protractor Practice"
        onAngleChange={(a) => setAngle(a)}
        showProtractorDefault={true}
      />

      {/* Formative Feedback */}
      <FormativeFeedback
        currentAngle={angle}
        targetAngle={60}
        customMessage={`Try dragging the handle! Current angle is ${angle}°. Calibrate Luma's compass by setting the angle close to 60°!`}
        onSuccess={handleFinish}
      />

      {/* Success Box */}
      {angle >= 57 && angle <= 63 && (
        <div className="p-6 bg-slate-900 rounded-3xl border-2 border-emerald-400/80 oasis-glow text-center space-y-4 shadow-2xl">
          <div className="text-3xl">🌟 Compass Calibrated! 🌟</div>
          <h3 className="font-black text-xl text-emerald-300">
            Great exploration! You found 60°!
          </h3>
          <p className="text-xs text-amber-100/90 font-medium max-w-md mx-auto">
            You are ready to enter the Dune of Angles and classify acute, right, and obtuse angles!
          </p>
          <button
            onClick={() => {
              handleFinish();
              if (onComplete) onComplete();
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
          >
            START EXPEDITION <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
}
