import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Target, Compass } from 'lucide-react';

export default function Mission2({ onComplete }) {
  const [angle, setAngle] = useState(45);
  const targetAngle = 135; // Target angle to locate the oasis spring
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleSuccess = () => {
    setCompleted(true);
    completeMission(2, 100, 3);
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
            <h2 className="font-serif text-2xl font-bold text-sand-100">MISSION 2 – THE OASIS COMPASS</h2>
            <p className="text-sand-300 text-xs">Precision Angle Measurement with Virtual Protractor</p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          An ancient desert compass directs travelers toward hidden water springs. The compass bearing requires measuring an angle of exactly <strong>{targetAngle}°</strong> using the virtual protractor overlay. Toggle and snap the protractor to verify your alignment!
        </p>
      </div>

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
