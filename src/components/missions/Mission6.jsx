import React, { useState } from 'react';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import LumaGuide from '../character/LumaGuide';
import { useGame } from '../../context/GameContext';
import { Sun, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission6({ onComplete }) {
  const [polygonData, setPolygonData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleCompleteArchitect = () => {
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    setCompleted(true);
    completeMission(6, 100, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      <LumaGuide
        mood={completed ? 'celebrating' : 'happy'}
        title="Stage 6: The Architect's Challenge"
        message="Explorer Luma is building a solar collector array to generate power for the desert camp! Configure a 6-sided hexagonal frame on the grid so that all interior angles absorb solar rays!"
        hint="Select 6 Sisi (Heksagon) in the dropdown menu and drag the red vertex points to form a balanced solar frame structure."
        whyPrompt="Why are hexagonal shapes often used in desert structures and nature like honeycombs?"
        showCelebration={completed}
      />

      <PolygonGridCanvas
        onPolygonChange={(data) => setPolygonData(data)}
        initialSides={6}
      />

      <FormativeFeedback
        customMessage="Open-ended architectural challenge active. Drag vertices on the grid lines to configure your 6-sided solar frame array."
      />

      <div className="p-4 bg-desertNavy-800/90 rounded-2xl border-2 border-sand-500/40 text-center">
        <button
          onClick={handleCompleteArchitect}
          className="btn-playful btn-gold px-8 py-3 text-sm"
        >
          <span>SUBMIT SOLAR ARCHITECTURE & UNLOCK OASIS BADGE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
