import React, { useState } from 'react';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Hexagon, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission4({ onComplete }) {
  const [polygonData, setPolygonData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleVerifyPolygon = () => {
    if (!polygonData) return;
    if (polygonData.totalInteriorSum === polygonData.expectedSum && !completed) {
      setCompleted(true);
      completeMission(4, 100, 3);
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-400 to-indigo-500 flex items-center justify-center text-slate-950 font-black shadow-md border border-purple-200">
            <Hexagon className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-400/20 text-purple-300 border border-purple-400/40 text-[11px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-purple-300 fill-purple-300" /> MISSION 4 – DSKP 6.1.1 POLYGON GRID
            </div>
            <h2 className="text-2xl font-extrabold text-amber-300 tracking-wide mt-0.5">
              THE GEOMETRIC TEMPLE
            </h2>
          </div>
        </div>
        <p className="text-amber-100 text-sm leading-relaxed font-medium">
          🤠 <strong>Luma says:</strong> "Inside the Geometric Temple, ancient wall tiles are shaped into polygons with 3 to 8 sides! Drag the vertices along the grid and explore how interior angles sum to <strong>(n - 2) × 180°</strong>!"
        </p>
      </div>

      {/* Polygon Grid Canvas */}
      <PolygonGridCanvas
        onPolygonChange={(data) => setPolygonData(data)}
        initialSides={5}
      />

      {polygonData && (
        <FormativeFeedback
          customMessage={`Constructed Polygon with ${polygonData.sides} sides. Measured Interior Sum: ${polygonData.totalInteriorSum}°. Expected Formula Target: ${polygonData.expectedSum}°.`}
        />
      )}

      {/* Verification Button */}
      <div className="desert-card p-5 rounded-3xl border-2 border-amber-400/60 text-center shadow-xl">
        <button
          onClick={handleVerifyPolygon}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-400 via-indigo-400 to-amber-400 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl"
        >
          VERIFY POLYGON & LOCK TEMPLE TILE 🏛️
        </button>
      </div>

      {completed && (
        <div className="p-6 bg-slate-900 rounded-3xl border-2 border-emerald-400/80 oasis-glow text-center space-y-4 shadow-2xl">
          <div className="text-3xl">🏛️ Temple Tile Locked! 🏛️</div>
          <h3 className="font-black text-xl text-emerald-300">
            Badge Unlocked: Temple Builder
          </h3>
          <p className="text-xs text-amber-100/90 font-medium max-w-md mx-auto">
            You successfully verified the interior angle sum formula for polygons!
          </p>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-slate-950 font-black text-sm playful-btn hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2"
            >
              PROCEED TO NAVIGATION CAMP <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
