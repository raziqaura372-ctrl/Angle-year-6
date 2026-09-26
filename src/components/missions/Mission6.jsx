import React, { useState } from 'react';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Sun, Award } from 'lucide-react';

export default function Mission6({ onComplete }) {
  const [polygonData, setPolygonData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleCompleteArchitect = () => {
    setCompleted(true);
    completeMission(6, 100, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center text-sand-500">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-sand-100">MISSION 6 – THE ARCHITECT'S CHALLENGE</h2>
            <p className="text-sand-300 text-xs">Open-Ended Construction: Desert Solar Collector Array & Wind Shelter</p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          The outpost relies on clean solar energy. Design an optimal 6-sided hexagonal solar array structure. Ensure all interior angles are measured and aligned to maximize sunlight absorption during the desert day.
        </p>
      </div>

      <PolygonGridCanvas
        onPolygonChange={(data) => setPolygonData(data)}
        initialSides={6}
      />

      <FormativeFeedback
        customMessage="Open-ended architectural challenge active. Drag vertices on the grid lines to configure your 6-sided solar frame array."
      />

      <div className="p-4 bg-desertNavy-800/90 rounded-xl border border-sand-500/30 text-center">
        <button
          onClick={handleCompleteArchitect}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-sand-500 to-terracotta-500 text-desertNavy-950 font-bold text-sm gold-glow hover:scale-105 transition-transform"
        >
          Submit Solar Architecture Design & Unlock Oasis Architect Badge
        </button>
      </div>
    </div>
  );
}
