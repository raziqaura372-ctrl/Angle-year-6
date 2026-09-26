import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import LumaGuide from '../character/LumaGuide';
import { useGame } from '../../context/GameContext';
import { Key, Shield, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission3({ onComplete }) {
  const [angle, setAngle] = useState(40);
  const targetAngle = 110; // Gate unlocking angle as per DSKP 6.1.2
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleSuccess = () => {
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    setCompleted(true);
    completeMission(3, 100, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      <LumaGuide
        mood={completed ? 'celebrating' : 'happy'}
        title="Stage 3: The Ancient Gate (DSKP 6.1.2)"
        message={`Explorer Luma has reached the ancient desert city gates! The inscription reads: 'Membentuk sudut 110° untuk membuka gerbang.' Construct the ray to construct an angle of exactly ${targetAngle}°.`}
        hint="Drag the coral ray handle clockwise to widen the angle arc until the readout reaches 110°."
        whyPrompt="How does constructing an angle based on a given numerical value differ from simply measuring an existing angle?"
        showCelebration={completed}
      />

      <DynamicAngleCanvas
        label="Ancient Gate Mechanical Lock Construct"
        targetAngle={targetAngle}
        onAngleChange={(a) => setAngle(a)}
        showProtractorDefault={false}
        initialAngle={40}
      />

      <FormativeFeedback
        currentAngle={angle}
        targetAngle={targetAngle}
        tolerance={1}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
