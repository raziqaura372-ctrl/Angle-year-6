import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import LumaGuide from '../character/LumaGuide';
import { useGame } from '../../context/GameContext';
import { Mountain, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Mission1({ onComplete }) {
  const [angle, setAngle] = useState(120);
  const [selectedType, setSelectedType] = useState(null);
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
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
      setCompleted(true);
      completeMission(1, 100, 3);
    }
  };

  return (
    <div className="space-y-6">
      <LumaGuide
        mood={completed ? 'celebrating' : selectedType && selectedType !== classifyAngle(angle) ? 'thinking' : 'happy'}
        title="Stage 1: Dune of Angles"
        message="Explorer Luma has reached the giant wind-swept sand dune! Sand dunes form different angle slopes. Can you identify whether this angle is Sudut Tirus (<90°), Sudut Tegak (=90°), Sudut Cakah (>90°), or Sudut Lurus (=180°)?"
        hint="Acute (Tirus) is smaller than 90°. Right (Tegak) is exactly 90°. Obtuse (Cakah) is between 90° and 180°!"
        whyPrompt="What happens to the angle category when you pass 90°?"
        showCelebration={completed}
      />

      <DynamicAngleCanvas
        label="Dune Slope Angle Simulator"
        onAngleChange={(a) => {
          setAngle(a);
          setSelectedType(null);
        }}
        initialAngle={120}
      />

      <div className="glass-panel p-5 rounded-2xl border-2 border-sand-500/40 space-y-4 bg-desertNavy-900/90">
        <h3 className="font-serif text-base md:text-lg font-extrabold text-sand-100 flex items-center justify-between">
          <span>CLASSIFY DUNE SLOPE ANGLE ({angle}°):</span>
          <span className="text-xs text-amber-400 font-mono">DSKP 6.1.1</span>
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
              className={`p-3.5 rounded-xl border-2 text-left transition-all btn-playful ${
                selectedType === item.id
                  ? classifyAngle(angle) === item.id
                    ? 'btn-oasis border-emerald-300'
                    : 'bg-amber-800 text-sand-100 border-amber-400'
                  : 'bg-desertNavy-950 text-sand-200 border-sand-500/30 hover:border-amber-400'
              }`}
            >
              <div className="text-sm font-extrabold">{item.label}</div>
              <div className="text-[11px] opacity-90 font-medium">{item.desc}</div>
            </button>
          ))}
        </div>

        {selectedType && (
          <FormativeFeedback
            customMessage={
              selectedType === classifyAngle(angle)
                ? `Excellent discovery, Explorer! ${angle}° is indeed a ${classifyAngle(angle).toUpperCase()} angle. You earned the Angle Tracker badge!`
                : `Not quite, explorer! Let's investigate: ${angle}° is between 90° and 180°. Try reviewing the angle boundaries!`
            }
          />
        )}
      </div>

      {completed && (
        <div className="p-5 bg-emerald-950/80 rounded-2xl border-2 border-emerald-400 text-center space-y-3 gold-glow">
          <h3 className="font-serif text-xl font-extrabold text-emerald-300">Badge Unlocked: Angle Tracker 🏅</h3>
          {onComplete && (
            <button
              onClick={onComplete}
              className="btn-playful btn-gold px-6 py-2.5 text-sm"
            >
              <span>PROCEED TO OASIS COMPASS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
