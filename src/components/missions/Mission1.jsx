import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { useGame } from '../../context/GameContext';
import { Mountain, CheckCircle, HelpCircle } from 'lucide-react';

export default function Mission1({ onComplete }) {
  const [angle, setAngle] = useState(30);
  const [selectedType, setSelectedType] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { completeMission } = useGame();

  const classifyAngle = (deg) => {
    if (deg < 90) return 'acute';
    if (deg === 90) return 'right';
    if (deg < 180) return 'obtuse';
    return 'straight';
  };

  const handleCheckClassification = (type) => {
    setSelectedType(type);
    const actual = classifyAngle(angle);
    if (type === actual) {
      setScore(100);
      setCompleted(true);
      completeMission(1, 100, 3);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl border border-sand-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-sand-500/20 flex items-center justify-center text-sand-500">
            <Mountain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-sand-100">MISSION 1 – THE DUNE OF ANGLES</h2>
            <p className="text-sand-300 text-xs">Discover & Classify Angle Types in Sand Dune Formations</p>
          </div>
        </div>
        <p className="text-sand-200 text-sm leading-relaxed mt-2">
          As winds shift across the dunes, sand slopes form distinct angles. Adjust the angle below and classify it according to Malay / English DSKP terminology: <strong>Sudut Tirus (&lt;90°)</strong>, <strong>Sudut Tegak (=90°)</strong>, <strong>Sudut Cakah (&gt;90°)</strong>, or <strong>Sudut Lurus (=180°)</strong>.
        </p>
      </div>

      <DynamicAngleCanvas
        label="Dune Slope Simulator"
        onAngleChange={(a) => {
          setAngle(a);
          setSelectedType(null);
        }}
        initialAngle={120}
      />

      <div className="glass-panel p-5 rounded-xl border border-sand-500/30 space-y-4">
        <h3 className="font-serif text-base font-bold text-sand-200">
          Classify Current Dune Angle ({angle}°):
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'acute', label: 'Sudut Tirus', desc: 'Acute (< 90°)' },
            { id: 'right', label: 'Sudut Tegak', desc: 'Right (= 90°)' },
            { id: 'obtuse', label: 'Sudut Cakah', desc: 'Obtuse (> 90°)' },
            { id: 'straight', label: 'Sudut Lurus', desc: 'Straight (= 180°)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleCheckClassification(item.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedType === item.id
                  ? classifyAngle(angle) === item.id
                    ? 'bg-oasis-500 text-desertNavy-950 border-oasis-400 font-bold'
                    : 'bg-terracotta-500 text-white border-terracotta-400'
                  : 'bg-desertNavy-800 text-sand-200 border-sand-500/30 hover:border-sand-500'
              }`}
            >
              <div className="text-sm font-bold">{item.label}</div>
              <div className="text-[11px] opacity-80">{item.desc}</div>
            </button>
          ))}
        </div>

        {selectedType && (
          <FormativeFeedback
            customMessage={
              selectedType === classifyAngle(angle)
                ? `Correct! ${angle}° is indeed a ${classifyAngle(angle).toUpperCase()} angle. DSKP 6.1 mastery confirmed!`
                : `Not quite. ${angle}° does not belong to ${selectedType.toUpperCase()}. Check the angle boundaries!`
            }
          />
        )}
      </div>

      {completed && (
        <div className="p-4 bg-oasis-900/60 rounded-xl border border-oasis-500 text-center space-y-3">
          <h3 className="font-serif text-lg font-bold text-oasis-300">Mission 1 Completed! Badge Unlocked: Angle Tracker</h3>
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-sand-500 to-terracotta-500 text-desertNavy-950 font-bold text-sm gold-glow hover:scale-105 transition-transform"
            >
              Proceed to Mission 2: The Oasis Compass
            </button>
          )}
        </div>
      )}
    </div>
  );
}
