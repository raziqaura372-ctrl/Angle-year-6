import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import LumaGuide from '../character/LumaGuide';
import { useGame } from '../../context/GameContext';
import { Target, Compass, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission2({ onComplete }) {
  const [angle, setAngle] = useState(75);
  const targetAngle = 135; // Target angle to locate the oasis spring
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleSuccess = () => {
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    setCompleted(true);
    completeMission(2, 100, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      <LumaGuide
        mood={completed ? 'celebrating' : 'happy'}
        title="Stage 2: The Oasis Compass"
        message={`Explorer Luma discovered the ancient Oasis Compass! The spring water source lies along a compass bearing of exactly ${targetAngle}°. Use the virtual protractor tool to measure the precise turn!`}
        hint="Click 'Virtual Protractor' to display the tool, then snap it to Vertex V. Align the baseline with Ray 1 and measure counter-clockwise to 135°."
        whyPrompt="How does placing the protractor center directly over Vertex V help us get an accurate measurement?"
        showCelebration={completed}
      />

      <DynamicAngleCanvas
        label="Oasis Compass Bearing Alignment"
        targetAngle={targetAngle}
        onAngleChange={(a) => setAngle(a)}
        showProtractorDefault={true}
        initialAngle={75}
      />

      <FormativeFeedback
        currentAngle={angle}
        targetAngle={targetAngle}
        tolerance={2}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
