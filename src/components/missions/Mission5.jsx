import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import LumaGuide from '../character/LumaGuide';
import { useGame } from '../../context/GameContext';
import { Navigation, MapPin, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission5({ onComplete }) {
  const [currentTurnAngle, setCurrentTurnAngle] = useState(90);
  const targetTurn = 150; // Turning angle to bypass sandstorm ridge
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleSuccess = () => {
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    setCompleted(true);
    completeMission(5, 100, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      <LumaGuide
        mood={completed ? 'celebrating' : 'happy'}
        title="Stage 5: The Lost Desert Map"
        message={`A desert sandstorm is brewing from the north! Explorer Luma must guide the caravan along a turn course angle of exactly ${targetTurn}° to safely bypass the shifting sand dunes.`}
        hint="Rotate the coral trajectory ray until the degree readout matches 150°."
        whyPrompt="How does changing a navigation turn angle affect the final waypoint location on a map?"
        showCelebration={completed}
      />

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
