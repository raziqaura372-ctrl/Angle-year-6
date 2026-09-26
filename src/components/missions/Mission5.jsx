import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { MapPin, Navigation } from 'lucide-react';

export default function Mission5({ onComplete }) {
  const [currentTurnAngle, setCurrentTurnAngle] = useState(45);
  const targetTurn = 150; // Turning angle to bypass sandstorm ridge
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleSuccess = () => {
    setCompleted(true);
    completeMission(5, 100, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center text-sand-500">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-sand-100">MISSION 5 – THE LOST DESERT MAP</h2>
            <p className="text-sand-300 text-xs">Caravan Navigation with Course Turn Angles</p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          A severe sandstorm approaches from the north! To guide the desert caravan safely around the shifting dunes toward the northern ridge, calculate and adjust the caravan trajectory turn angle to exactly <strong>{targetTurn}°</strong>.
        </p>
      </div>

      <DynamicAngleCanvas
        label="Caravan Waypoint Trajectory Angle"
        targetAngle={targetTurn}
        onAngleChange={(a) => setCurrentTurnAngle(a)}
        showProtractorDefault={true}
        initialAngle={90}
      />

      <FormativeFeedback
        currentAngle={currentTurnAngle}
        targetAngle={targetTurn}
        tolerance={2}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
