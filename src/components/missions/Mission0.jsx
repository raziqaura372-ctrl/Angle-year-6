import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import LumaGuide from '../character/LumaGuide';
import { useGame } from '../../context/GameContext';
import { Compass, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission0({ onComplete }) {
  const [angle, setAngle] = useState(45);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleFinish = () => {
    setCompleted(true);
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
    completeMission(0, 100, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Luma Character Welcome */}
      <LumaGuide
        mood={completed ? 'celebrating' : 'happy'}
        title="Stage 0: Dune Valley Arrival"
        message="Welcome to Dune Valley, Explorer! I'm LUMA! Before we travel deep into the desert, let's learn how angles work! An angle has a vertex (titik sudut V) and two rays/arms."
        hint="Drag the coral ray handle clockwise or counter-clockwise to adjust the angle arc. Watch how the numerical degree measurement updates dynamically!"
        whyPrompt="Why does rotating Ray 2 change the degree measurement while Vertex V stays in place?"
        showCelebration={completed}
      />

      <DynamicAngleCanvas
        label="Expedition Compass Calibrator"
        onAngleChange={(a) => setAngle(a)}
        showProtractorDefault={true}
        initialAngle={45}
      />

      <FormativeFeedback
        currentAngle={angle}
        targetAngle={60}
        customMessage={`Experiment with dragging the coral ray handle! Current Angle: ${angle}°. Calibrate your expedition compass by setting the angle to approximately 60°.`}
        onSuccess={handleFinish}
      />

      {angle >= 57 && angle <= 63 && !completed && (
        <div className="p-5 bg-emerald-950/80 rounded-2xl border-2 border-emerald-400 text-center space-y-3 gold-glow">
          <h3 className="font-serif text-xl font-extrabold text-emerald-300">Compass Calibrated Successfully!</h3>
          <p className="text-xs text-emerald-100">You mastered the basic controls of the dynamic ray manipulator.</p>
          <button
            onClick={handleFinish}
            className="btn-playful btn-gold px-6 py-2.5 text-sm"
          >
            <span>CONTINUE JOURNEY TO DUNE OF ANGLES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
