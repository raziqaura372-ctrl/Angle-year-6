import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Shield, Key } from 'lucide-react';

export default function Mission3({ onComplete }) {
  const [angle, setAngle] = useState(30);
  const targetAngle = 110; // Gate unlocking angle as per DSKP 6.1.2
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const handleSuccess = () => {
    setCompleted(true);
    completeMission(3, 100, 3);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center text-sand-500">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-sand-100">MISSION 3 – THE ANCIENT GATE</h2>
            <p className="text-sand-300 text-xs">DSKP 6.1.2: Membentuk Sudut Berdasarkan Nilai Sudut yang Diberi</p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          You stand before the grand stone archway of the ancient desert city. To release the locking mechanism, you must construct an angle of <strong>{targetAngle}°</strong> based on the given value inscription carved on the lintel.
        </p>
      </div>

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
