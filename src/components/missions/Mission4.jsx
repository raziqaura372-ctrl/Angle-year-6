import React, { useState } from 'react';
import PolygonGridCanvas from '../geometry/PolygonGridCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Hexagon, Layers } from 'lucide-react';

export default function Mission4({ onComplete }) {
  const [polygonData, setPolygonData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleVerifyPolygon = () => {
    if (!polygonData) return;
    if (polygonData.totalInteriorSum === polygonData.expectedSum) {
      setCompleted(true);
      completeMission(4, 100, 3);
      if (onComplete) onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center text-sand-500">
            <Hexagon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-sand-100">MISSION 4 – THE GEOMETRIC TEMPLE</h2>
            <p className="text-sand-300 text-xs">DSKP 6.1.1: Melukis Poligon (3–8 Sisi) pada Grid & Mengukur Sudut Pedalaman</p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          The sanctuary walls are composed of intricate geometric stone tiles up to 8 sides (Oktagon). Select a polygon type, drag the vertices along the grid lines, and observe how the interior angles adjust while maintaining the mathematical interior angle sum formula: <strong>(n - 2) × 180°</strong>.
        </p>
      </div>

      <PolygonGridCanvas
        onPolygonChange={(data) => setPolygonData(data)}
        initialSides={5}
      />

      {polygonData && (
        <FormativeFeedback
          customMessage={`Constructed Polygon with ${polygonData.sides} sides. Measured Interior Sum: ${polygonData.totalInteriorSum}°. Expected Formula Target: ${polygonData.expectedSum}°.`}
        />
      )}

      <div className="p-4 bg-desertNavy-800/90 rounded-xl border border-sand-500/30 text-center">
        <button
          onClick={handleVerifyPolygon}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-sand-500 to-terracotta-500 text-desertNavy-950 font-bold text-sm gold-glow hover:scale-105 transition-transform"
        >
          Verify Polygon Interior Angles & Lock Sanctuary Tile
        </button>
      </div>
    </div>
  );
}
