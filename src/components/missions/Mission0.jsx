import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Compass, Sparkles, CheckCircle } from 'lucide-react';

export default function Mission0({ onComplete }) {
  const [angle, setAngle] = useState(45);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleFinish = () => {
    setCompleted(true);
    completeMission(0, 100, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center text-sand-500">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-sand-100">MISSION 0 – DESERT ARRIVAL</h2>
            <p className="text-sand-300 text-xs">Tutorial & Exploration of Interactive Angle Tools</p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          Welcome to the Desert Expedition! Before navigating through ancient gates and dune pathways, you must master the fundamental components of an angle: the <strong>vertex (titik sudut)</strong> and the two <strong>rays/arms (lengan sudut)</strong>.
        </p>
      </div>

      <DynamicAngleCanvas
        label="Explore the Ray Controls & Protractor Tool"
        onAngleChange={(a) => setAngle(a)}
        showProtractorDefault={true}
      />

      <FormativeFeedback
        currentAngle={angle}
        targetAngle={60}
        customMessage={`Experiment with dragging the golden handle! You are currently at ${angle}°. Set the angle to approximately 60° to calibrate your expedition compass.`}
        onSuccess={handleFinish}
      />

      {angle >= 57 && angle <= 63 && !completed && (
        <div className="p-4 bg-oasis-900/60 rounded-xl border border-oasis-500 text-center space-y-3">
          <h3 className="font-serif text-lg font-bold text-oasis-300">Compass Calibrated Successfully!</h3>
          <button
            onClick={handleFinish}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-sand-500 to-terracotta-500 text-desertNavy-950 font-bold text-sm gold-glow hover:scale-105 transition-transform"
          >
            Complete Mission 0 & Unlock Dune of Angles
          </button>
        </div>
      )}
    </div>
  );
}
