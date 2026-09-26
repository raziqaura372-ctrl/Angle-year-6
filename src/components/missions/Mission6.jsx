import React, { useState } from 'react';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Sun, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission6({ onComplete }) {
  const [polygonData, setPolygonData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleCompleteArchitect = () => {
    if (!completed) {
      setCompleted(true);
      completeMission(6, 100, 3);
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-300 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md border border-amber-200">
            <Sun className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> MISSION 6 – ARCHITECT CHALLENGE
            </div>
            <h2 className="text-2xl font-extrabold text-amber-300 tracking-wide mt-0.5">
              THE SOLAR COLLECTOR ARCHITECTURE
            </h2>
          </div>
        </div>
        <p className="text-amber-100 text-sm leading-relaxed font-medium">
          🤠 <strong>Luma says:</strong> "The desert outpost needs clean solar power! Design a 6-sided (Hexagon) solar collector panel array. Drag the grid handles to position the solar panel vertices!"
        </p>
      </div>

      {/* Polygon Grid Canvas */}
      <PolygonGridCanvas
        onPolygonChange={(data) => setPolygonData(data)}
        initialSides={6}
      />

      <FormativeFeedback
        customMessage="Open-ended architectural challenge active. Drag vertices on the grid lines to configure your 6-sided solar frame array."
      />

      {/* Submit Card */}
      <div className="desert-card p-5 rounded-3xl border-2 border-amber-400/60 text-center shadow-xl">
        <button
          onClick={handleCompleteArchitect}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl"
        >
          SUBMIT SOLAR ARCHITECTURE DESIGN ☀️
        </button>
      </div>

      {completed && (
        <div className="p-6 bg-slate-900 rounded-3xl border-2 border-emerald-400/80 oasis-glow text-center space-y-4 shadow-2xl">
          <div className="text-3xl">☀️ Solar Collectors Active! ☀️</div>
          <h3 className="font-black text-xl text-emerald-300">
            Badge Unlocked: Solar Architect
          </h3>
          <p className="text-xs text-amber-100/90 font-medium max-w-md mx-auto">
            You successfully designed the solar array! The Hidden Oasis Final Boss is now unlocked!
          </p>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              FINAL BOSS CHALLENGE <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
