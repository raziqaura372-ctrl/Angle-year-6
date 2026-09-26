import React, { useState } from 'react';
import DynamicAngleCanvas from '../geometry/DynamicAngleCanvas';
import FormativeFeedback from '../ai/FormativeFeedback';
import { Target, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Step6Measuring({ onNext }) {
  const [practiceAngle, setPracticeAngle] = useState(45);
  const targetPractice = 75;

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 6: Protractor Tutorial & Practice
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">6. MEASURING AN ANGLE WITH A PROTRACTOR</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          Follow these 4 golden rules when measuring an angle with a protractor:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-bold text-center">
        <div className="p-3 bg-slate-900 rounded-xl border border-amber-400/30 text-amber-300">
          1. Align Center to Vertex V
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-amber-400/30 text-amber-300">
          2. Align Baseline to Ray 1
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-amber-400/30 text-amber-300">
          3. Read Correct Inner/Outer Scale
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-amber-400/30 text-amber-300">
          4. Record Degree Value (°)
        </div>
      </div>

      <DynamicAngleCanvas
        label="Interactive Practice: Measure Target Angle 75° using Virtual Protractor"
        targetAngle={targetPractice}
        onAngleChange={(a) => setPracticeAngle(a)}
        showProtractorDefault={true}
        initialAngle={30}
      />

      <FormativeFeedback
        currentAngle={practiceAngle}
        targetAngle={targetPractice}
        tolerance={2}
        onSuccess={onNext}
      />
    </div>
  );
}

export function Step7Constructing({ onNext }) {
  const [angle, setAngle] = useState(20);
  const targetSequence = [30, 45, 60, 90, 120];
  const [targetIdx, setTargetIdx] = useState(0);

  const currentTarget = targetSequence[targetIdx];
  const isTargetMatched = Math.abs(angle - currentTarget) <= 2;

  const handleNextTarget = () => {
    if (targetIdx < targetSequence.length - 1) {
      setTargetIdx(prev => prev + 1);
    } else {
      onNext();
    }
  };

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-2xl border-2 border-amber-400/40">
        <span className="bg-cyan-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
          Step 7: Angle Construction Challenge
        </span>
        <h3 className="font-serif text-2xl font-black text-amber-200 mt-2">7. CONSTRUCTING GIVEN ANGLES</h3>
        <p className="text-sm text-slate-200 leading-relaxed mt-1">
          When given a specific navigation degree, drag the arm until your measurement matches the target goal!
        </p>
      </div>

      <DynamicAngleCanvas
        label={`Construction Target (${targetIdx + 1}/5): Build a ${currentTarget}° Route`}
        targetAngle={currentTarget}
        onAngleChange={(a) => setAngle(a)}
        initialAngle={15}
      />

      {isTargetMatched && (
        <div className="p-4 bg-emerald-950/80 rounded-2xl border-2 border-emerald-400 text-center space-y-3">
          <h4 className="font-serif font-black text-emerald-300 text-lg">
            Constructed {currentTarget}° Angle Route Successfully!
          </h4>
          <button
            onClick={handleNextTarget}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm gold-glow hover:scale-105 transition-transform"
          >
            {targetIdx < targetSequence.length - 1 ? `Next Target: Build ${targetSequence[targetIdx + 1]}°` : 'All 5 Targets Built! Continue to Step 8'}
          </button>
        </div>
      )}
    </div>
  );
}
