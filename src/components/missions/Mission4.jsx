import React, { useState } from 'react';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import LumaGuide from '../character/LumaGuide';
import { useGame } from '../../context/GameContext';
import { Hexagon, Layers, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission4({ onComplete }) {
  const [polygonData, setPolygonData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleVerifyPolygon = () => {
    if (!polygonData) return;
    if (polygonData.totalInteriorSum === polygonData.expectedSum) {
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
      setCompleted(true);
      completeMission(4, 100, 3);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <LumaGuide
        mood={completed ? 'celebrating' : 'happy'}
        title="Stage 4: The Geometric Temple (DSKP 6.1.1)"
        message="Explorer Luma is reconstructing sanctuary polygon wall tiles! Select any polygon from 3 to 8 sides (Triangle to Octagon), drag the vertices on grid lines, and verify the interior angle sum formula: (n - 2) × 180°!"
        hint="Try changing between Grid Segi Empat and Grid Segi Tiga to see how vertices snap to different grid shapes!"
        whyPrompt="Why does adding one extra side to a polygon add 180° to the total interior angle sum?"
        showCelebration={completed}
      />

      <PolygonGridCanvas
        onPolygonChange={(data) => setPolygonData(data)}
        initialSides={5}
      />

      {polygonData && (
        <FormativeFeedback
          customMessage={`Constructed Polygon with ${polygonData.sides} sides. Measured Interior Angle Sum: ${polygonData.totalInteriorSum}°. Target Formula Value: ${polygonData.expectedSum}°.`}
        />
      )}

      <div className="p-4 bg-desertNavy-800/90 rounded-2xl border-2 border-sand-500/40 text-center">
        <button
          onClick={handleVerifyPolygon}
          className="btn-playful btn-gold px-8 py-3 text-sm"
        >
          <span>VERIFY POLYGON TILE & LOCK SANCTUARY</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
